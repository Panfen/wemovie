/*
 * 处理weixin的业务逻辑
 * replay、支付、错误信息的通知等
 */
'use strict'

exports.reply = function* (next){
	var message = this.weixin;

	if(message.magType === 'event'){
		if(message.Event === 'subscribe'){
			if(message.EventKey) console.log('扫描二维码关注：'+message.EventKey+' '+message.ticket);
			this.body = '终于等到你，还好我没放弃';
		}else if(message.Event === 'unsubscribe'){
			console.log(message.FromUserName +' 悄悄地走了...');
		}
	}else{
		//
	}

	yield next;
}