var fs = require("fs");

var library;

fs.readFile("LyricLibrary.txt", 'utf8', function (err, data) {
	if(err) console.log(err);
	library = JSON.parse(data);	// parse the file as a JSON object :D

	mainFunc( library );	// once read in, call the mainFunc with this object.
							// this is done because this function is asynchronous, it would
							// go past this and continue executing code BEFORE finishing file read
							// this function will get called when file read is DONE
});

function mainFunc( library ){
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

	for(var i = 0; i < library.length; i++){ 			// loop over the two genres

		var genreObj = library[i]; 						// genre object
		var genreName = genreObj.genre; 				// name of the genre in STRING format
		var subgenresArray = genreObj.subgenres; 		// ARRAY of subgenres for this genre

		console.log("\tGenre: " + genreName);

		for(var k = 0; k < subgenresArray.length; k++){ 		// loop over each genre's 4 subgenres

			var subgenreObj = subgenresArray[k]; 				// subgenre object
			var subgenreName = subgenreObj.subgenre; 			// name of the subgenre in STRING format
			var subgenreArtistArray = subgenreObj.artists; 		// ARRAY of artists for this subgenre

			console.log("\t\tSubgenre: " + subgenreName);

			for(var j = 0; j < subgenreArtistArray.length; j++){ 		// loop over each subgenre's 8-12 artists

				var artistObj = subgenreArtistArray[j]; 				// artist object
				var artistName = artistObj.artist; 						// name of the artist in STRING format
				var artistSongsArray = artistObj.songs; 				// ARRAY of songs for this artist

				console.log("\t\t\tArtist name: " + artistName);

				for(var m = 0; m < artistSongsArray.length; m++){				// loop over each artist's songs
					
					var songObj = artistSongsArray[m]; 							// song object
					var songName = songObj.song; 								// name of the song in STRING format
					var lyrics = songObj.lyrics; 								// lyrics of the song in STRING format


					count++;		////////////////////////////////////////////////////////////////////////
					if(count > 5){  // WARNING RICK-SAMA!!!
						count = 0;  // THIS IS TEMPORARY SO YOU CAN CONSOLE.LOG AND SEE THE ENTIRE STRUCTURE
						break;      // THIS LIMITS THE PRINT-OUT TO 5 SONGS EACH, REMOVE THIS WHEN YOU START
					} 				////////////////////////////////////////////////////////////////////////

					console.log("\t\t\t\tSong name: " + songName);		// I skyped logging lyrics for an obvious reason.

				}

			}

		}

	}
}