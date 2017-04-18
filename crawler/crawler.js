'use strict'

var co = require('co');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var URL = 'http://www.piaohua.com/';

function getftpLink(link){
	return new Promise(function(resolve,reject){
		
	});
}

function getPageByUrl(){
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

exports.getMovieList = function() {
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
			}
			resolve(movieList);
		});
	});
};