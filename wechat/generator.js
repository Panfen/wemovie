/*
 * 中间件
 * 对请求类型进行判断，实现逻辑分离
 */
'use strict'


var sha1 = require('sha1');
var rawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');

module.exports = function(opts){
	var wechat = new Wechat(opts);
	return function *(next){
		var that = this;
		var token = opts.token;
		var signature = this.query.signature;
		var nonce = this.query.nonce;
		var timestamp = this.query.timestamp;
		var echostr = this.query.echostr;
		var str = [token,timestamp,nonce].sort().join('');
		var sha = sha1(str);

		if(this.method === 'GET') this.body = (sha === signature) ? echostr + '' : 'failed';
		else if(this.method === 'POST'){
			if(sha !== signature){
				this.body = 'failed';
				return false;
			}
			var data = yield rawBody(this.req,{length:this.length,limit:'1mb',encoding:this.charset});

			var content = yield util.parseXMLAsync(data);   //xml数据解析成xml对象

			var message = util.formatMessage(content.xml);
			
			if(message.MsgType === 'event'){
				if(message.Event === 'subscribe'){
					var createTime = new Date().getTime();
					that.status = 200;
					that.type = 'application/xml';
					that.body = '<xml>'+
											'<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>'+
											'<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>'+
											'<CreateTime>'+createTime+'</CreateTime>'+
											'<MsgType><![CDATA[text]]></MsgType>'+
											'<Content><![CDATA[终于等到你，还好我没放弃]]></Content>'+
											'</xml>'
					return;
				}
			}

		}
	};
}