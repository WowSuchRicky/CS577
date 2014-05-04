var fs = require("fs");
var HuffmanEncoding = require("./HuffmanEncoding.js");

var library;
var wordlist;

var genres = {};
var subgenres = {};
var artists = {};

var genreCompressedWithArtistEncoding = {};
var subgenreCompressedWithArtistEncoding = {};

var encodings = {};


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


function sortByBestCompression(fieldName) {
    return function(first, second) {
        return first[fieldName] > second[fieldName];
    }
}



function wordCount(s){
	var list = {};
	var count = 0;
	s = s.toLowerCase().split(" ");
	for(var i = 0; i < s.length; i++){
        if( s[i] )
		  count++;
	}
	return count;
}

function encodingWithoutList(s){
	var newHuff = new HuffmanEncoding.HuffmanEncoding(s, null, null);
	return newHuff.getEncoding();
}

function encodingWithList(s, wordlist){
	var newHuff = new HuffmanEncoding.HuffmanEncoding(s, null, wordlist);
	return newHuff.getEncoding();
}

function encodeTextWithPreviousEncoding(s, encoding){
	var newHuff = new HuffmanEncoding.HuffmanEncoding(s, encoding, null);
	return newHuff.encoded_string;
}

function compressionForString(s, newEncoding){
	var theEncoding;
	if(newEncoding){
		theEncoding = newEncoding;
	} else {
		theEncoding = encodingWithList(s, wordlist);
	}
	
	var encodedString = encodeTextWithPreviousEncoding(s, theEncoding);
	var originalLength = s.length * 8;
							// 1 char = 8 bits
	var blockCodeLength = Math.ceil( Math.log( wordlist.length ) / Math.log(2) ) * wordCount(s);
							// compressed as block code
	var encodedLength = encodedString.length; 
							// 1 char = 1 bit
	return { eight: encodedLength / originalLength,
			 block: encodedLength / blockCodeLength,
			 encoding: theEncoding };
}








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




	for(var i = 0; i < library.length; i++){ 			// loop over the two genres

		var genreObj = library[i]; 						// genre object
		var genreName = genreObj.genre; 				// name of the genre in STRING format
		var subgenresArray = genreObj.subgenres; 		// ARRAY of subgenres for this genre
		console.log("Genre: " + genreName);
		var genreString = "";
		for(var k = 0; k < subgenresArray.length; k++){ 		// loop over each genre's 4 subgenres

			var subgenreObj = subgenresArray[k]; 				// subgenre object
			var subgenreName = subgenreObj.subgenre; 			// name of the subgenre in STRING format
			var subgenreArtistArray = subgenreObj.artists; 		// ARRAY of artists for this subgenre
			console.log("subgenre: " + subgenreName);
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
				artists[artistName] = artistString; // example of saving it away in stupidObject
                encodings[artistName] = compressionForString(artists[artistName]);

			}
			// AT THIS POINT, the subgenre string containing all lyrics for a subgenre is built, 
			// USE IT NOW, it will be overwritten next time around
            subgenres[subgenreName] = subgenreString;
            encodings[subgenreName] = compressionForString(subgenres[subgenreName]);
		}
		// AT THIS POINT, the genre string containing all lyrics for a genre is built, 
		// USE IT NOW, it will be overwritten next time around
        genres[genreName] = genreString;
        encodings[genreName] = compressionForString(genres[genreName]);
	}



    /* Print Lyrical Diversity */
    printLyricalDiversity();

    /* Subgenre Similarity */
    printSubgenreSimilarity();

    /* Most representative artists */
    printMostRepresentativeArtists();

}

function printMostRepresentativeArtists(){


    for(var i = 0; i < library.length; i++){ 			// loop over the two genres

        var genreObj = library[i]; 						// genre object
        var genreName = genreObj.genre; 				// name of the genre in STRING format
        var subgenresArray = genreObj.subgenres; 		// ARRAY of subgenres for this genre

        for(var k = 0; k < subgenresArray.length; k++){ 		// loop over each genre's 4 subgenres
            var genrePrinted = false;

            var subgenreObj = subgenresArray[k]; 				// subgenre object
            var subgenreName = subgenreObj.subgenre; 			// name of the subgenre in STRING format
            var subgenreArtistArray = subgenreObj.artists; 		// ARRAY of artists for this subgenre

            for(var j = 0; j < subgenreArtistArray.length; j++){ 		// loop over each subgenre's 8-12 artists

                if( !genreCompressedWithArtistEncoding.hasOwnProperty(genreName) ){
                    genreCompressedWithArtistEncoding[genreName] = {};
                }

                if( !subgenreCompressedWithArtistEncoding.hasOwnProperty(subgenreName) ){
                    subgenreCompressedWithArtistEncoding[subgenreName] = {};
                }

                var artistObj = subgenreArtistArray[j]; 				// artist object
                var artistName = artistObj.artist;

                if( !genreCompressedWithArtistEncoding.hasOwnProperty(artistName) ){
                    genreCompressedWithArtistEncoding[genreName][artistName] = compressionForString(genres[genreName], encodings[artistName].encoding);
                    console.log("Compressed GENRE " + genreName + " with " + artistName);
                }

                if( !subgenreCompressedWithArtistEncoding.hasOwnProperty(artistName) ){
                    subgenreCompressedWithArtistEncoding[subgenreName][artistName] = compressionForString(subgenres[subgenreName], encodings[artistName].encoding);
                    console.log("Compressed SUBGENRE " + subgenreName + " with " + artistName);
                }

            }
        }
    }



    // FINALLY GO THROUGH AND PRINT OUT THE TOP COMPRESSIONS!
    

    for(key in genreCompressedWithArtistEncoding){
        if( !genreCompressedWithArtistEncoding.hasOwnProperty(key) ) continue;

        var compressions = [];

        for(key2 in genreCompressedWithArtistEncoding[key]){
            if( !genreCompressedWithArtistEncoding[key].hasOwnProperty(key2) ) continue;
            compressions.push( {genre: genreCompressedWithArtistEncoding[key][key2], artist:key2} );
        }

        compressions.sort(function(a, b){return a.genre.block-b.genre.block});
        console.log("#1 for GENRE " + key + " --- " + compressions[0].genre.block, compressions[0].artist, key);
        console.log("#2 for GENRE " + key + " --- " + compressions[1].genre.block, compressions[1].artist, key);
        console.log("#3 for GENRE " + key + " --- " + compressions[2].genre.block, compressions[2].artist, key);
        console.log("Worst for GENRE " + key + " --- " + compressions[compressions.length-1].genre.block, compressions[compressions.length-1].artist, key);

    }


    
    // loop over the subgenres compressed with artists, we need to find the best 3 for each

    for(key in subgenreCompressedWithArtistEncoding){
        if( !subgenreCompressedWithArtistEncoding.hasOwnProperty(key) ) continue;

        var compressions = [];

        for(key2 in subgenreCompressedWithArtistEncoding[key]){
            if( !subgenreCompressedWithArtistEncoding[key].hasOwnProperty(key2) ) continue;
            compressions.push( {subgenre: subgenreCompressedWithArtistEncoding[key][key2], artist: key2});

        }

        compressions.sort(function(a, b){return a.subgenre.block-b.subgenre.block});
        console.log("#1 for SUBGENRE " + key + " --- " + compressions[0].subgenre.block, compressions[0].artist);
        console.log("#2 for SUBGENRE " + key + " --- " + compressions[1].subgenre.block, compressions[1].artist);
        console.log("#3 for SUBGENRE " + key + " --- " + compressions[2].subgenre.block, compressions[2].artist);
        console.log("Worst for SUBGENRE " + key + " --- " + compressions[compressions.length-1].subgenre.block, compressions[compressions.length-1].artist, key);


    }

}


function printSubgenreSimilarity(){

    //Traverse all subgenres
    for( key in subgenres ){
        if( ! subgenres.hasOwnProperty(key) ) continue;
        //console.log(key); // <-- prints out each subgenre's name
        // console.log(subgenres[key]); <-- would print out the entire lyrics of that subgenre, HUGE
        // from here, all the ones are yours
        // key IS the artist name console.log(key) prints artist name
        // subgenres[key] is the set of ALL LYRICS for that duduemiester

        var subgenreEncoding = compressionForString(subgenres[key]).encoding;

        var newCompression;
        console.log("--------------BEGINNING ENCODING FOR: " + key );
        for(key2 in subgenres){
            if( ! subgenres.hasOwnProperty(key2) ) continue;
            newCompression = compressionForString(subgenres[key2], subgenreEncoding);
            console.log("Compression of " + key2 + " using encoding from " + key + ": " + newCompression.eight);
        }


    }
}


function printLyricalDiversity(){
    var genreCompression;
    //Traverse all genres
    for( key in genres ){
        if( ! genres.hasOwnProperty(key) ) continue;
        //console.log(key); // <-- prints out each genre's name
        // console.log(stupidObject[key]); <-- would print out the entire lyrics of that artist, HUGE
        // from here, all the ones are yours
        // key IS the artist name console.log(key) prints artist name
        // genres[key] is the set of ALL LYRICS for that duduemiester

        genreCompression = encodings[key];
        console.log("Compression ratio (huffman vs. uncompressed) for " + key + ": " + genreCompression.eight);
        console.log("Compression ratio (huffman vs. block) for " + key + ": " + genreCompression.block + "\n");
    }

    var subgenreCompression;
    //Traverse all subgenres
    for( key in subgenres ){
        if( ! subgenres.hasOwnProperty(key) ) continue;
        //console.log(key); // <-- prints out each subgenre's name
        // console.log(subgenres[key]); <-- would print out the entire lyrics of that subgenre, HUGE
        // from here, all the ones are yours
        // key IS the artist name console.log(key) prints artist name
        // subgenres[key] is the set of ALL LYRICS for that duduemiester
        subgenreCompression = encodings[key];
        console.log("Compression ratio (huffman vs. uncompressed) for " + key + ": " + subgenreCompression.eight);
        console.log("Compression ratio (huffman vs. block) for " + key + ": " + subgenreCompression.block + "\n");


    }


    // Traverse all artists
    for( key in artists ){
        if( ! artists.hasOwnProperty(key) ) continue;
        //console.log(key); // <-- prints out each artists' name
        // console.log(stupidObject[key]); <-- would print out the entire lyrics of that artist, HUGE
        // from here, all the ones are yours
        // key IS the artist name console.log(key) prints artist name
        // artists[key] is the set of ALL LYRICS for that duduemiester
    }
}