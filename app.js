'use strict'

var Koa = require('koa');
var config = require('./config');
var weixin = require('./weixin');
var wechat = require('./wechat/generator');

var app = new Koa();

app.use(wechat(config.wechat,weixin.reply)); //handler

app.use(weixin.sendMsg);

app.use(weixin.setMenu)

app.listen(8080);

console.log('Listening 8080...')