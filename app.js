'use strict'

var Koa = require('koa');
var config = require('./config');
var weixin = require('./weixin');
var generator = require('./wechat/generator');

var app = new Koa();

app.use(generator(config.wechat, weixin.reply)); //handler

app.use(weixin.setMenu);

app.listen(8080);

console.log('Listening 8080...')