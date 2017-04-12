/*
 * 配置自定义菜单
 */
'use strict'


module.exports = {
	'button':[
	{
		'name':'最新',
		'type':'click',
		'key':'menu_click'
	},
	{
		'name':'类别',
		'sub_button':[
			{
				'name':'科幻',
				'type':'view',
				'url':'music.163.com'
			},
			{
				'name':'悬疑',
				'type':'scancode_push',
				'key':'qr_scan'
			},
			{
				'name':'爱情',
				'type':'scancode_waitmsg',
				'key':'qr_scan_wait'
			},
			{
				'name':'教育',
				'type':'pic_photo_or_album',
				'key':'pic_photo_album'
			}
		]
	},
	{
		'name':'地域',
		'sub_button':[
			{
				'name':'大陆',
				'type':'pic_weixin',
				'key':'pic_weixin'
			},
			{
				'name':'欧美',
				'type':'location_select',
				'key':'location_select'
			}
		]
	}]
}