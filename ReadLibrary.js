var fs = require("fs");
var HuffmanEncoding = require("./HuffmanEncoding.js");

var library;
var wordlist;

fs.readFile("LyricLibrary.txt", 'utf8', function (err, data) {
	if(err) console.log(err);
	library = JSON.parse(data);	// parse the file as a JSON object :D


	fs.readFile("wordlist.txt", 'utf8', function (err, data) {
		if(err) console.log(err);
		wordlist = JSON.parse(data);	// parse the file as a JSON object :D
		mainFunc( library );
	});
							// once read in, call the mainFunc with this object.
							// this is done because this function is asynchronous, it would
							// go past this and continue executing code BEFORE finishing file read
							// this function will get called when file read is DONE
});


function mainFunc(){
	// library holds EVERYTHING right now
	// it's structured like this
	// library is an array of genre objects
	// each genre object has a .genre property (genre name, string) and a .subgenres property (array)
			// each subgenres property is an array of subgenre objects
			// each subgenre object has a .subgenre property (name of subgenre, string) and an artists property (array)
					// each artists property is an array of artists objects
					// each artist object has a .artist property (name of artist, string) and a songs property (array)
							// each songs property is an array of song objects
							// each song object has a song property (name of song, string) and a lyrics property (string of lyrics)

	// lets traverse the whole thing once for no reason!

	console.log("Beginning library traversal");

	var count = 0;

	var stupidObject = {};

	for(var i = 0; i < library.length; i++){ 			// loop over the two genres

		var genreObj = library[i]; 						// genre object
		var genreName = genreObj.genre; 				// name of the genre in STRING format
		var subgenresArray = genreObj.subgenres; 		// ARRAY of subgenres for this genre

		var genreString = "";
		for(var k = 0; k < subgenresArray.length; k++){ 		// loop over each genre's 4 subgenres

			var subgenreObj = subgenresArray[k]; 				// subgenre object
			var subgenreName = subgenreObj.subgenre; 			// name of the subgenre in STRING format
			var subgenreArtistArray = subgenreObj.artists; 		// ARRAY of artists for this subgenre

			var subgenreString = "";
			for(var j = 0; j < subgenreArtistArray.length; j++){ 		// loop over each subgenre's 8-12 artists

				var artistObj = subgenreArtistArray[j]; 				// artist object
				var artistName = artistObj.artist; 						// name of the artist in STRING format
				var artistSongsArray = artistObj.songs; 				// ARRAY of songs for this artist

				var artistString = "";
				for(var m = 0; m < artistSongsArray.length; m++){				// loop over each artist's songs
					
					var songObj = artistSongsArray[m]; 							// song object
					var songName = songObj.song; 								// name of the song in STRING format
					var lyrics = songObj.lyrics; 	

					genreString += " " + lyrics;							// lyrics of the song in STRING format
					subgenreString += " " + lyrics;
					artistString += " " + lyrics;
				}
				// AT THIS POINT, the artist string containing all lyrics for an artist is built, 
				// USE IT NOW, it will be overwritten next time around
				stupidObject[artistName] = artistString; // example of saving it away in stupidObject
			}
			// AT THIS POINT, the subgenre string containing all lyrics for a subgenre is built, 
			// USE IT NOW, it will be overwritten next time around
		}
		// AT THIS POINT, the genre string containing all lyrics for a genre is built, 
		// USE IT NOW, it will be overwritten next time around
	}

	// iterate over that stupidObject!
	for( key in stupidObject ){
		if( ! stupidObject.hasOwnProperty(key) ) continue;
		console.log(key); // <-- prints out each artists' name
		// console.log(stupidObject[key]); <-- would print out the entire lyrics of that artist, HUGE
		// from here, all the ones are yours
		// key IS the artist name console.log(key) prints artist name
		// stupidObject[key] is the set of ALL LYRICS for that duduemiester
	}

}