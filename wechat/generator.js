/*
 * 中间件
 * 对请求类型进行判断，实现逻辑分离
 */
'use strict'


var sha1 = require('sha1');
var rawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');

module.exports = function(opts,handler){
	var wechat = new Wechat(opts);
	return function *(next){
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
			
			this.weixin = message;  //挂载消息

			yield handler.call(this,next);   //转到外层逻辑

			wechat.replay.call(this);  //真正回复
		}
	};
}