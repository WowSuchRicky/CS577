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




function wordCount(s){
	var list = {};
	var count = 0;
	s = s.toLowerCase().split(" ");
	for(var i = 0; i < s.length; i++){
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
	var encoding;
	if(newEncoding){
		encoding = newEncoding;
	} else {
		encoding = encodingWithList(s, wordlist);
	}
	
	var encodedString = encodeTextWithPreviousEncoding(s, encoding);
	var originalLength = s.length * 8;	
							// 1 char = 8 bits
	var blockCodeLength = Math.ceil( Math.log( wordlist.length ) / Math.log(2) ) * wordCount(s);
							// compressed as block code
	var encodedLength = encodedString.length; 
							// 1 char = 1 bit
	return { eight: encodedLength / originalLength,
			 block: encodedLength / blockCodeLength,
			 encoding: encoding };
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
                //console.log(artistName);
				//console.log("Saved " + artistName + " 's songs+encoding:");
                //console.log(encodings[artistName].encoding);

			}
			// AT THIS POINT, the subgenre string containing all lyrics for a subgenre is built, 
			// USE IT NOW, it will be overwritten next time around
            subgenres[subgenreName] = subgenreString;
            encodings[subgenreName] = compressionForString(subgenres[subgenreName]);
            //console.log("----------------------------------------" + subgenreName);
            //console.log(subgenres[subgenreName]);
		}
		// AT THIS POINT, the genre string containing all lyrics for a genre is built, 
		// USE IT NOW, it will be overwritten next time around
        genres[genreName] = genreString;
        encodings[genreName] = compressionForString(subgenres[subgenreName]);
	}


    /* Print Lyrical Diversity */
    //printLyricalDiversity();

    /* Subgenre Similarity */
    //printSubgenreSimilarity();

    /* Most representative artists */
    printMostRepresentativeArtists();





	// example of huffman encoding a thing
	var s = "How would it end If the truth was re-writable Break with past Whatever dreams you long for I've seen what the future has in mind for me Throwing the spear into the heart of the void Counting the odds Like I am out of control It's like a fight against the gravity Breaking the code's Like a mission impossible Letters that falls I'm only partly mechanical My strength is my weakness Please unfasten me Infinity, for a moment in time Will memories be revived I turn the page in the chapters of life Infinity keeps me alive Stuck in a wheel I'm alive it's a miracle What should I do about the pain is this critical You know that the future looks the same for me Watching my life Leaving everything inside of me While the sun Devours our history This time there's no turning back I leave it be! Infinity, for a moment in time Will memories be revived I turn the page in the chapters of life Infinity keeps me alive";

    var result = compressionForString(s);

    //console.log(result.encoding.antique, result.encoding.the);


	// result has the properties eight (compression ratio vs eight-bits-per-char)
		// block (compression ratio vs block encoding)
		// and encoding (the encoding object generated, or the one you specified)

 //    console.log(result.encoding);
	// var encoding = result.encoding;  // EXAMPLE OF SAVING ONE ENCODING TO USE IT WITH NEXT HUFFMAN
	// console.log(result.eight);	// these console.logs should be the same, it means my code works

	// result = compressionForString(s, encoding);
	// console.log(result.eight);	// these console.logs should be the same, it means my code works

}

function printMostRepresentativeArtists(){
    var max, max2, max3;

    for(key in subgenres){
        if( ! subgenres.hasOwnProperty(key) ) continue;

        for(artistKey in subgenres.artists){
            var artistEncoding = compressionForString(artists[artistKey]).encoding;
            var compression = compressionForString(subgenres[key], artistEncoding);
            console.log("Compression for " + key + " using the code from " + artistKey + ": " + compression.eight);
        }


    }



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
                    genreCompressedWithArtistEncoding[genreName][artistName] = compressionForString(genres[genreName], encodings[artistName]);
                }

                if( !subgenreCompressedWithArtistEncoding.hasOwnProperty(artistName) ){
                    subgenreCompressedWithArtistEncoding[subgenreName][artistName] = compressionForString(subgenres[subgenreName], encodings[artistName]);
                }

            }
        }
    }

    for(key in genreCompressedWithArtistEncoding){
        if( !genreCompressedWithArtistEncoding.hasOwnProperty(key) ){
            continue;
        }

        for(key2 in genreCompressedWithArtistEncoding[key]){
            if( !genreCompressedWithArtistEncoding[key].hasOwnProperty(key2) ) continue;
            console.log("Key: " + key + " Key2: " + key2 + " Compression: " + genreCompressedWithArtistEncoding[key][key2].eight);
        }
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