var fs = require("fs");

fs.readFile("finalData.txt", 'utf8', function (err, data) {
  if(err) console.log(err);
  dataset = JSON.parse(data);

  parse( dataset );
});

function compare(a,b) {
  if (a.c < b.c)
     return -1;
  if (a.c > b.c)
    return 1;
  return 0;
}

function compareRev(b,a) {
  if (a.c < b.c)
     return -1;
  if (a.c > b.c)
    return 1;
  return 0;
}

function parse(dataset){
	var wordlist = {};

	for(key in dataset){
		if( !dataset.hasOwnProperty(key) ){
			continue;
		}
		var artist = key;
		var songArray = dataset[key];
		for(var i = 0; i < songArray.length; i++){
			var song = songArray[i].lyrics;
			var EXPLOSIONS = song.toLowerCase().split(" ");
			for(var k = 0; k < EXPLOSIONS.length; k++){
				var _word = "_" + EXPLOSIONS[k].replace(/[^a-z]+/g, "");
				if( !wordlist.hasOwnProperty( _word ) ){
					wordlist[ _word ] = 0;
				}
				wordlist[ _word ]++;
			}
		}
	}

	var wordArray = [];

	for(word in wordlist){
		if( wordlist.hasOwnProperty(word) ){
			wordArray.push({w: word.substring(1), c: wordlist[word]});
		}
	}

	wordArray.sort(compare);

	for(var i = 0; i < wordArray.length; i++){
		console.log(wordArray[i].w + ": " + wordArray[i].c);
	}

}

