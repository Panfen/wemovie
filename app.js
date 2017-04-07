'use strict'

var Koa = require('koa');
var sha1 = require('sha1');

var config = {
	wechat:{
		appID:'wx33eb6a0510f98a3f',
		appSecret:'d4624c36b6795d1d99dcf0547af5443d',
		token:'wemovie'
	}
};

var app = new Koa();

app.use(function *(next){
	console.log(this.query);
	var token = config.wechat.token;
	var signature = this.query.signature;
	var nonce = this.query.nonce;
	var timestamp = this.query.timestamp;
	var echostr = this.query.echostr;

	var str = [token,timestamp,nonce].sort().join('');

	var sha = sha1(str);

	if(sha === signature){
		this.body = echostr + '';
	}else{
		this.body = 'failed';
	}

});

app.listen(8080);

console.log('Listening 8080...')