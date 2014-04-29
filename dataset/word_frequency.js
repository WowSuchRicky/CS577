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

	// var commonWords = ["christmas", "feel", "antique", "tit", "shit"];
	// var customWords = ["christmas", "jerusalem"];
	// var swearWords = ["shit", "fuck", "damn", "bitch", "crap", "piss", "dick", "cock", "pussy", "asshole", "fag", "bastard", "slut", "douche"];

	// var endings = ["", "s", "er", "ing", "y", "ty", "ly", "ily", "en", "ful", "less", "est", "ed", "ed", "or", "al", "ion", "tion", "ation", "ition", "ible", "able", "ness"];

	// var wordsOfInterest = customWords;
	


	// for(var i = 0 ; i < wordsOfInterest.length; i++){
	// 	var count = 0;
	// 	var wordOfInterest = wordsOfInterest[i];
	// 	for(var k = 0; k < wordArray.length; k++){
	// 		var currentWord = wordArray[k];
	// 		for(var j = 0; j < endings.length; j++){
	// 			if( currentWord.w  == wordOfInterest + endings[j] ){
	// 				count += currentWord.c;
	// 			}
	// 		}
	// 	}
	// 	console.log(wordOfInterest + ": " + count);
	// }
	
}

