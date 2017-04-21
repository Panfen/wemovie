/*
 * 配置自定义菜单
 */
'use strict'


module.exports = {
	
 	'button':[
 	{	
    'type':'click',
    'name':'最新',
    'key':'V1001_TODAY_LATEST'
  },
  {
    'name':'类别',
    'sub_button':[
    {	
     	'type':'click',
      'name':'科幻',
      'key':'V1001_TYPE_KEHUAN'
    },
    {
      'type':'click',
      'name':'悬疑',
      'key':'V1001_TYPE_XUANYI'
    },
    {
      'type':'click',
      'name':'爱情',
      'key':'V1001_TYPE_AIQING'
    },
    {
      'type':'click',
      'name':'文艺',
      'key':'V1001_TYPE_WENYI'
    }]
 	},
 	{
    'name':'地域',
    'sub_button':[
    {	
     	'type':'click',
      'name':'大陆',
      'key':'V1001_AREA_DALU'
    },
    { 
      'type':'click',
      'name':'港台',
      'key':'V1001_AREA_GANGTAI'
    },
    {
      'type':'click',
      'name':'欧美',
      'key':'V1001_AREA_OUMEI'
    },
    {
      'type':'click',
      'name':'韩印',
      'key':'V1001_AREA_HANGUO'
    }]
 	}]
}