/*
 * 处理access_token以及和微信交互的逻辑
 */
'use strict'

var fs = require('fs');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('./util');

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
	accessToken:prefix+'token?grant_type=client_credential',
	uploadTempMaterial:prefix+'media/upload?',  //access_token=ACCESS_TOKEN&type=TYPE  上传临时素材
	getTempMaterial:prefix+'media/get?',        //access_token=ACCESS_TOKEN&media_id=MEDIA_ID 获取临时素材，GET请求
	uploadPermNews:prefix+'material/add_news?',   //access_token=ACCESS_TOKEN  上传永久图文
	uploadPermPics:prefix+'media/uploadimg?',   //access_token=ACCESS_TOKEN  上传永久图片
	uploadPermOther:prefix+'material/add_material?',   //access_token=ACCESS_TOKEN  上传永久其他素材
	getPermMaterial:prefix+'material/get_material?',   //access_token=ACCESS_TOKEN 获取永久素材，POST请求
	delPermMaterial:prefix+'material/del_material?',   //access_token=ACCESS_TOKEN 删除永久素材，POST请求
}

function Wechat(opts){     //构造函数
	var that = this;
	this.appID = opts.appID;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;
	this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function(){
	var that = this;

	if(this.access_token && this.expires_in){
		if(this.isvalidAccessToken(this)){
			return Promise.resolve(this);
		}
	}

	this.getAccessToken().then(function(data){
		try{
			data = JSON.parse(data);
		}catch(e){
			return that.updateAccessToken();
		}
		if(that.isvalidAccessToken(data)){
			return Promise.resolve(data);
		}else{
			return that.updateAccessToken();
		}
	}).then(function(data){
		that.access_token = data.access_token;
		that.expires_in = data.expires_in;
		that.saveAccessToken(JSON.stringify(data));
		return Promise.resolve(data);
	});
}

Wechat.prototype.isvalidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in) return false;
	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = new Date().getTime();
	return (now < expires_in) ? true : false;
}

Wechat.prototype.updateAccessToken = function(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	var url = api.accessToken + '&appid='+ appID +'&secret='+ appSecret;

	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){
			var data = response.body;
			var now = new Date().getTime();
			var expires_in = now + (data.expires_in - 20) * 1000;   //考虑到网络延迟、服务器计算时间,故提前20秒发起请求
			data.expires_in = expires_in;
			resolve(data);
		});
	});
}

Wechat.prototype.uploadTempMaterial = function(type,filepath){
	var that = this;
	var form = {  //构造表单
		media:fs.createReadStream(filepath)
	}
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = api.uploadTempMaterial + 'access_token=' + data.access_token + '&type=' + type;
			request({url:url,method:'POST',formData:form,json:true}).then(function(response){
				var _data = response.body;
				if(_data){
					resolve(_data)
				}else{
					throw new Error('upload temporary material failed!');
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

Wechat.prototype.uploadPermMaterial = function(type,material){
	var that = this;
	var form = {}
	var uploadUrl = '';
	if(type === 'pic') uploadUrl = api.uploadPermPics;
	if(type === 'other') uploadUrl = api.uploadPermOther;
	if(type === 'news'){
		uploadUrl = api.uploadPermNews;
		form = material
	}else{
		form.media = fs.createReadStream(material);
	}
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = uploadUrl + 'access_token=' + data.access_token;
			var opts = {
				method:'POST',
				url:url,
				json:true
			}
			(type == 'news') ? (opts.body = form) : (opts.formData = form);
			request(opts).then(function(response){
				var _data = response.body;
				if(_data){
					resolve(_data)
				}else{
					throw new Error('upload permanent material failed!');
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

Wechat.prototype.getMaterial = function(mediaId,permanent){
	var that = this;
	var getUrl = permanent ? api.getPermMaterial : api.getTempMaterial;
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = getUrl + 'access_token=' + data.access_token;
			if(!permanent) url += '&media_id=' + mediaId;
			resolve(url)
		});
	});
}

Wechat.prototype.delMaterial = function(mediaId){
	var that = this;
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = api.delPermMaterial + 'access_token=' + data.access_token;
			var form = {media_id:mediaId}
			request({url:url,method:'POST',formData:form,json:true}).then(function(response){
				var _data = response.body;
				if(_data.errcode === '0'){
					resolve();
				}else{
					throw new Error('delete permanent material failed!');
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}
Wechat.prototype.replay = function(){
	var content = this.body;
	var message = this.weixin;

	var xml = util.tpl(content,message);

	this.status = 200;
	this.type = 'application/xml';
	this.body = xml;
}

module.exports = Wechat;