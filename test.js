var fs = require("fs");
var HuffmanEncoding = require("./HuffmanEncoding.js");

var s = "How would it end If the truth was re-writable Break with past Whatever dreams you long for I've seen what the future has in mind for me Throwing the spear into the heart of the void Counting the odds Like I am out of control It's like a fight against the gravity Breaking the code's Like a mission impossible Letters that falls I'm only partly mechanical My strength is my weakness Please unfasten me Infinity, for a moment in time Will memories be revived I turn the page in the chapters of life Infinity keeps me alive Stuck in a wheel I'm alive it's a miracle What should I do about the pain is this critical You know that the future looks the same for me Watching my life Leaving everything inside of me While the sun Devours our history This time there's no turning back I leave it be! Infinity, for a moment in time Will memories be revived I turn the page in the chapters of life Infinity keeps me alive";

var wordlist;

fs.readFile("wordlist.txt", 'utf8', function (err, data) {
	if(err) console.log(err);
	wordlist = JSON.parse(data);	// parse the file as a JSON object :D
	mainFunc( );
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
	var newHuff = new HuffmanEncoding.HuffmanEncoding(s);
	return newHuff.getEncoding();
}

function encodingWithList(s, wordlist){
	var newHuff = new HuffmanEncoding.HuffmanEncoding(s, null, wordlist);
	return newHuff.getEncoding();
}

function encodeTextWithPreviousEncoding(s, encoding){
	var newHuff = new HuffmanEncoding.HuffmanEncoding(s, encoding);
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
	// var wordlist = (lower case array of every word)
	// s = plain old lyrics we're testing, 1 song, all songs, who cares
	var s = "How would it end If the truth was re-writable Break with past Whatever dreams you long for I've seen what the future has in mind for me Throwing the spear into the heart of the void Counting the odds Like I am out of control It's like a fight against the gravity Breaking the code's Like a mission impossible Letters that falls I'm only partly mechanical My strength is my weakness Please unfasten me Infinity, for a moment in time Will memories be revived I turn the page in the chapters of life Infinity keeps me alive Stuck in a wheel I'm alive it's a miracle What should I do about the pain is this critical You know that the future looks the same for me Watching my life Leaving everything inside of me While the sun Devours our history This time there's no turning back I leave it be! Infinity, for a moment in time Will memories be revived I turn the page in the chapters of life Infinity keeps me alive";
	
	var result = compressionForString(s);
	// result has the properties eight (compression ratio vs eight-bits-per-char)
		// block (compression ratio vs block encoding)
		// and encoding (the encoding object generated, or the one you specified)

	var encoding = result.encoding;
	console.log(result.eight);

	result = compressionForString(s, encoding);
	console.log(result.eight);

}


