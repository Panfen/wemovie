'use strict'

var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var URL = 'http://www.piaohua.com/';

function getftpLink(link){
	request.get(link,function(err,res,body){
		if(!err && res.statusCode == 200){
			var $ = cheerio.load(body);
			var ftp = $('#showinfo').find('table tbody tr td a').html();
			return ftp;
		}else{
			return 'failed to get the ftp!';
		}
	});
}

exports.getMovieList = function(){
	return new Promise(function(resolve,reject){
		request.get(URL,function(err,res,body){
			if(!err && res.statusCode == 200){
				var $ = cheerio.load(body);
				var movieList = $('#iml1').children("ul").first().find('li');
				var myMovieList = [];

				movieList.each(function(item){
					var time = $(this).find('span font').html() ? $(this).find('span font').html() : $(this).find('span').html();
					if((new Date() - new Date(time)) < 259200000){
						var dom = $(this).find('a').first();
						var link = URL + $(dom).attr('href');
						var img = $(dom).find('img').attr('src');
						var name = $(dom).find('img').attr('alt').substr(22).replace('</font>','');
						var ftp = getftpLink(link);
						var movie = {
							name:name,
							img:img,
							link:link,
							time:time,
							ftp:unescape(ftp.replace(/;/g,'').replace(/&#x/g, "%u"))
						}
						myMovieList.push(movie);			
					};
				});
				resolve(myMovieList);
			}else{
				reject('failed to crawl the web!');
			}
		});
	});
}