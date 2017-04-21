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
				reject('failed to get the ftp');
			}
		});
	});
}

function getTodayLatest(){
	return new Promise(function(resolve,reject){
		request.get(URL,function(err,res,body){
			var $ = cheerio.load(body);
			var _movieList = [];
			var movieList = $('#iml1').children("ul").first().find('li');
			movieList.each(function(item){
				var time = $(this).find('span font').html() ? $(this).find('span font').html() : $(this).find('span').html();
				if((new Date() - new Date(time)) < 259200000){
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
					_movieList.push(movie);		
				};
			});
			resolve(_movieList);
		});
	});
}

function getListByEventKey(eventKey){
	return new Promise(function(resolve,reject){
		request(typeLink[eventKey],function(err,res,body){
			if(!err && res.statusCode == 200){
				var $ = cheerio.load(body);
				var dlList = $('#list dl');
				var movieList = [];
				dlList.each(function(index){
					//选其5
					if(index < 5){
						var link = $(this).find('dt a').attr('href');
						var img = $(this).find('dt a img').attr('src');
						var name = $(this).find('dt a img').attr('alt').substr(25).replace('</font></b>','');
						if(name == '') name = $(this).find('dt a img').attr('alt').substr(3).replace('</b>','');
						var movie = {
							name:name,
							img:img,
							link:link
						}
						movieList.push(movie);
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

exports.getMovieList = function* () {
	
};