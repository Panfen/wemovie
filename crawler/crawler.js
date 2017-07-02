'use strict'

var co = require('co');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var URL = 'http://www.piaohua.com/';

var typeLink = {
	V1001_TODAY_LATEST:'http://www.piaohua.com/',
	V1001_TYPE_KEHUAN:'http://www.piaohua.com/html/kehuan/index.html',
	V1001_TYPE_XUANYI:'http://www.piaohua.com/html/xuannian/index.html',
	V1001_TYPE_AIQING:'http://www.piaohua.com/html/aiqing/index.html',
	V1001_TYPE_WENYI:'http://www.piaohua.com/html/wenyi/index.html',
	V1001_AREA_DALU:'http://www.piaohua.com/html/zhanzheng/index.html',
	V1001_AREA_GANGTAI:'http://www.piaohua.com/html/kongbu/index.html',
	V1001_AREA_OUMEI:'http://www.piaohua.com/html/lianxuju/index.html',
	V1001_AREA_HANGUO:'http://www.piaohua.com/html/zongyijiemu/index.html'
}

function getftpLink(link){
	return new Promise(function(resolve,reject){
		request.get(link,function(err,res,body){
			if(!err && res.statusCode == 200){
				var $ = cheerio.load(body);
				var ftp = $('#showinfo').find('table tbody tr td a').html();
				resolve(ftp);
			}else{
				reject('failed to get the ftp！');
			}
		});
	});
}

function getTodayLatest(){
	return new Promise(function(resolve,reject){
		request.get(URL,function(err,res,body){
			if(err){
				console.log('failed to crawl the piaohua.com!')
				resolve();
			}else{
				var $ = cheerio.load(body);
				var movieLists = [];
				var _movieList = $('#iml1').children("ul").first().find('li');
				_movieList.each(function(item){
					var time = $(this).find('span font').html() ? $(this).find('span font').html() : $(this).find('span').html();
					if((new Date() - new Date(time)) < 259200000){  // 3 days
						var dom = $(this).find('a').first();
						var link = URL + $(dom).attr('href');
						var img = $(dom).find('img').attr('src');
						var name = $(dom).find('img').attr('alt').substr(22).replace('</font>','');
						var movie = {
							name:name,
							img:img,
							link:link,
							time:time,
						}
						movieLists.push(movie);		
					};
				});
				resolve(movieLists);
			}
		});
	});
}

function getListByEventKey(eventKey){
	return new Promise(function(resolve,reject){
		getPageByUrl().then(function(movieList){
			for(var i=0;i<movieList.length;i++){
				request.get(movieList[i].link,function(err,res,body){
					if(!err && res.statusCode == 200){
						var $ = cheerio.load(body);
						var ftp = $('#showinfo').find('table tbody tr td a').html();
						movieList[i].ftp = unescape(ftp.replace(/;/g,'').replace(/&#x/g, "%u"));
					}else{
						reject('failed to get the ftp!');
					}
				});
				resolve(movieList);
			}
		});
	});
}

exports.getCrawlMovieList = function* (eventKey){
	var movieList;
	if(eventKey === 'V1001_TODAY_LATEST'){
		movieList = yield getTodayLatest();
	}else{
		movieList = yield getListByEventKey(eventKey);
	}
	for(var i = 0; i < movieList.length; i ++){
		var ftp = yield getftpLink(movieList[i].link);
		movieList[i].ftp = unescape(ftp.replace(/;/g,'').replace(/&#x/g, "%u"));
	}
	return movieList;
}