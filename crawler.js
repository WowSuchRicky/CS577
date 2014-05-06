var jsdom = require("jsdom");
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");

var data = {
	songUrls: [],
	lyricsResults: [], 	// artist: ArtistName,
						// songs: {songName: lyricString}
};

var save = 775;
var songsCrawled = 0;

var minCrawlDelay = 2000;

function crawlDelay(){
	var time = minCrawlDelay + Math.round( Math.random() * ( minCrawlDelay * 2/3 ) );
	return time;
}

var artistList = 
	[
	/*"http://www.azlyrics.com/a/amaranthe.html",
	"http://www.azlyrics.com/d/dio.html",
	"http://www.azlyrics.com/d/dragonforce.html",
	"http://www.azlyrics.com/e/epica.html",
	"http://www.azlyrics.com/k/kamelot.html",
	"http://www.azlyrics.com/j/judaspriest.html",
	"http://www.azlyrics.com/s/sabaton.html",
	"http://www.azlyrics.com/s/sonataarctica.html",
	"http://www.azlyrics.com/w/who.html",
	"http://www.azlyrics.com/r/rollingstones.html",
	"http://www.azlyrics.com/l/ledzeppelin.html",
	"http://www.azlyrics.com/b/boston.html",
	"http://www.azlyrics.com/d/defleppard.html",
	"http://www.azlyrics.com/a/aerosmith.html",
	"http://www.azlyrics.com/v/vanhalen.html",
	"http://www.azlyrics.com/q/queen.html",
	"http://www.azlyrics.com/s/styx.html",
	"http://www.azlyrics.com/k/kiss.html",
	"http://www.azlyrics.com/b/blacksabbath.html",
	"http://www.azlyrics.com/u/u2.html",
	"http://www.azlyrics.com/r/rem.html",
	"http://www.azlyrics.com/p/pearljam.html",
	"http://www.azlyrics.com/s/soundgarden.html",
	"http://www.azlyrics.com/n/nine.html",
	"http://www.azlyrics.com/b/beastie.html",
	"http://www.azlyrics.com/w/whitestripes.html",
	"http://www.azlyrics.com/a/aliceinchains.html",
	"http://www.azlyrics.com/m/muse.html",
	"http://www.azlyrics.com/f/franzferdinand.html",
	"http://www.azlyrics.com/g/greenday.html",
	"http://www.azlyrics.com/b/blink.html",
	"http://www.azlyrics.com/r/riseagainst.html",
	"http://www.azlyrics.com/s/sexpistols.html",
	"http://www.azlyrics.com/m/misfits.html",
	"http://www.azlyrics.com/n/nirvana.html",
	"http://www.azlyrics.com/d/deadk.html",
	"http://www.azlyrics.com/r/ramones.html",
	"http://www.azlyrics.com/c/clash.html",
	"http://www.azlyrics.com/b/blackflag.html",
	"http://www.azlyrics.com/a/abba.html",
	"http://www.azlyrics.com/a/atomickitten.html",
	"http://www.azlyrics.com/a/aqua.html",
	"http://www.azlyrics.com/w/wanted.html",
	"http://www.azlyrics.com/r/roxette.html",
	"http://www.azlyrics.com/a/alphabeat.html",
	"http://www.azlyrics.com/a/aceofbase.html",
	"http://www.azlyrics.com/r/robyn.html",
	"http://www.azlyrics.com/j/johngrant.html",
	"http://www.azlyrics.com/s/skyferreira.html",
	"http://www.azlyrics.com/c/chvrches.html",
	"http://www.azlyrics.com/d/duran.html",
	"http://www.azlyrics.com/d/depeche.html",
	"http://www.azlyrics.com/e/erasure.html",
	"http://www.azlyrics.com/p/petshop.html",
	"http://www.azlyrics.com/i/iamx.html",
	"http://www.azlyrics.com/k/knife.html",
	"http://www.azlyrics.com/a/america.html", */
	"http://www.azlyrics.com/b/bonnietyler.html",
	"http://www.azlyrics.com/a/adams.html",
	"http://www.azlyrics.com/c/catstevens.html",
	"http://www.azlyrics.com/e/eagles.html",
	"http://www.azlyrics.com/f/foreigner.html",
	"http://www.azlyrics.com/g/genesis.html",
	"http://www.azlyrics.com/k/kansas.html",
	"http://www.azlyrics.com/j/journey.html",
	"http://www.azlyrics.com/f/franksinatra.html",
	"http://www.azlyrics.com/l/louisarmstrong.html",
	"http://www.azlyrics.com/b/bingcrosby.html",
	"http://www.azlyrics.com/a/andywilliams.html",
	"http://www.azlyrics.com/b/barrymanilow.html",
	"http://www.azlyrics.com/d/deanmartin.html",
	"http://www.azlyrics.com/b/billieholiday.html",
	"http://www.azlyrics.com/p/peggylee.html"
];

var proxyList = ["http://213.30.51.46:3128", "http://5.153.4.90:3128", "http://77.91.174.220:3128", "http://192.99.11.98:3128", "http://23.253.75.229:3128"];
var proxy = 0;

function processArtistPage(){
	url = artistList.pop();
	request({
		uri: url,
		proxy: proxyList[proxy],
		timeout: 5000,
	}, function(error, response, body) {
			proxy++;
			if(proxy >= proxyList.length) proxy = 0;
			if ( ! error ){

				var $ = cheerio.load(body);
				var artistName = $('title').text().replace(" lyrics", "").trim();

				$('body').find('a[href*="../lyrics"]').each(function(){
					var newUrl = "http://www.azlyrics.com/" + $(this).attr('href');
					data.songUrls.push(newUrl);
				});

				console.log('[Success] got song urls for ' + artistName);
			} else {
				console.log("[Error] failed to fetch for url" + url);
				console.log(error);
				console.log("Putting url back on the front...");
				artistList.unshift(url);

			}

			if(artistList.length > 0){
				setTimeout(processArtistPage, crawlDelay() );
			} else {
				console.log("\t=== Last artist page scanned...");
				setTimeout(finishArtistPage, crawlDelay() );
			}
	});

}

function finishArtistPage(){
	console.log("Finishing crawling artist pages, transitioning to lyric pages....");
	if(data.songUrls.length > 0){
		processLyricPage();
	}
}

function processLyricPage(){
	var originalUrl = data.songUrls.pop();
	url = originalUrl.replace("../", "");

	request({
		uri: url,
		proxy: proxyList[proxy],
		timeout: 5000,
	}, function(error, response, body) {
		
		proxy++;
		if(proxy >= proxyList.length) proxy = 0;

			if ( ! error ){

				console.log("\t crawling " + url);

				var $ = cheerio.load(body);

				var songLyrics = $('#main > div:nth-child(7)').text().trim();
				var title = $('title').text();

				console.log("\tTITLE: " + title);

				var temp = title.split('-');

				temp[0] = temp[0].replace(" lyrics", "").trim();
				temp[1] = temp[1].trim();

				var artistName = temp[0];
				var songName = temp[1];

				data.lyricsResults.push({
					artist: artistName,
					song: songName,
					lyrics: songLyrics
				});

				songsCrawled++;

				console.log('[Success] got lyrics for song ' + songName);

			} else {

				writeToFile();
				console.log("[Error] failed to fetch for url" + url);
				console.log("Putting url back on the front...");
				data.songUrls.unshift(originalUrl);
				console.log(error);

			}

			if(data.songUrls.length > 0){

				if(songsCrawled % 10 == 0){
					writeToFile();
				}
				
				setTimeout(processLyricPage, crawlDelay() );
			} else {
				finishLyricPage();
			}
	});
}

function writeToFile(){
	save++;
	var saveData = data.lyricsResults;
	fs.appendFile('data.txt', "\n\nvar data" + save + " = " + JSON.stringify(saveData), function (err) {
	  if (err) throw err;
	  console.log("[Save successful.] --- Chewed through " + songsCrawled + " songs.");
	});

	data.lyricsResults.length = 0; // save to file, clear memory
}

function finishLyricPage(){
	writeToFile();
	console.log("==========[Crawl Finished]==========");
}

function begin(){
	console.log("\tThere are " + artistList.length + " artist pages to crawl.");
	if(artistList.length > 0){
		processArtistPage();
	}
}


begin();





/*
http://www.azlyrics.com/a/amaranthe.html
http://www.azlyrics.com/d/dio.html
http://www.azlyrics.com/d/dragonforce.html
http://www.azlyrics.com/e/epica.html
http://www.azlyrics.com/k/kamelot.html
http://www.azlyrics.com/j/judaspriest.html
http://www.azlyrics.com/s/sabaton.html
http://www.azlyrics.com/s/sonataarctica.html


http://www.azlyrics.com/w/who.html
http://www.azlyrics.com/r/rollingstones.html
http://www.azlyrics.com/l/ledzeppelin.html
http://www.azlyrics.com/b/boston.html
http://www.azlyrics.com/d/defleppard.html
http://www.azlyrics.com/a/aerosmith.html
http://www.azlyrics.com/v/vanhalen.html
http://www.azlyrics.com/q/queen.html
http://www.azlyrics.com/s/styx.html
http://www.azlyrics.com/k/kiss.html
http://www.azlyrics.com/b/blacksabbath.html
 

http://www.azlyrics.com/u/u2.html
http://www.azlyrics.com/r/rem.html
http://www.azlyrics.com/p/pearljam.html
http://www.azlyrics.com/s/soundgarden.html
http://www.azlyrics.com/n/nine.html
http://www.azlyrics.com/b/beastie.html
http://www.azlyrics.com/w/whitestripes.html
http://www.azlyrics.com/a/aliceinchains.html
http://www.azlyrics.com/m/muse.html
http://www.azlyrics.com/f/franzferdinand.html

http://www.azlyrics.com/g/greenday.html
http://www.azlyrics.com/b/blink.html
http://www.azlyrics.com/r/riseagainst.html
http://www.azlyrics.com/s/sexpistols.html
http://www.azlyrics.com/m/misfits.html
http://www.azlyrics.com/n/nirvana.html
http://www.azlyrics.com/d/deadk.html
http://www.azlyrics.com/r/ramones.html
http://www.azlyrics.com/c/clash.html
http://www.azlyrics.com/b/blackflag.html



http://www.azlyrics.com/a/abba.html
http://www.azlyrics.com/a/atomickitten.html
http://www.azlyrics.com/a/aqua.html
http://www.azlyrics.com/w/wanted.html
http://www.azlyrics.com/r/roxette.html
http://www.azlyrics.com/a/alphabeat.html
http://www.azlyrics.com/a/aceofbase.html
http://www.azlyrics.com/r/robyn.html

http://www.azlyrics.com/j/johngrant.html
http://www.azlyrics.com/s/skyferreira.html
http://www.azlyrics.com/c/chvrches.html
http://www.azlyrics.com/d/duran.html
http://www.azlyrics.com/d/depeche.html
http://www.azlyrics.com/e/erasure.html
http://www.azlyrics.com/p/petshop.html
http://www.azlyrics.com/i/iamx.html
http://www.azlyrics.com/k/knife.html

http://www.azlyrics.com/a/america.html
http://www.azlyrics.com/b/bonnietyler.html
http://www.azlyrics.com/a/adams.html
http://www.azlyrics.com/c/catstevens.html
http://www.azlyrics.com/e/eagles.html
http://www.azlyrics.com/f/foreigner.html
http://www.azlyrics.com/g/genesis.html
http://www.azlyrics.com/k/kansas.html
http://www.azlyrics.com/j/journey.html

http://www.azlyrics.com/f/franksinatra.html
http://www.azlyrics.com/l/louisarmstrong.html
http://www.azlyrics.com/b/bingcrosby.html
http://www.azlyrics.com/a/andywilliams.html
http://www.azlyrics.com/b/barrymanilow.html
http://www.azlyrics.com/d/deanmartin.html
http://www.azlyrics.com/b/billieholiday.html
http://www.azlyrics.com/p/peggylee.html
*/

