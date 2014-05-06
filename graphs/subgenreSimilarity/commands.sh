#!/bin/zsh
# you must have the 'moreutils' package installed first

mainFile="readlibraryout.txt"

#filename="$1.txt"
filename="SoftPopRock.txt"

subgenre="$1"

grep -A 8 "BEGINNING ENCODING FOR: SOFT POP/ROCK" $mainFile > "$filename"

sed 1d "$filename" | sponge "$filename"

sed s/"SOFT POP/ROCK"/""/ "$filename"| sponge "$filename"

sed s/"Compression of "/""/ "$filename"| sponge "$filename"   

sed s/" using encoding from"/""/ "$filename"| sponge "$filename"

sed s/" : "/";"/ "$filename" | sponge "$filename"

sort -t";" -k2 "$filename" | sponge "$filename"

sed 1s/" "/""/ "$filename" | sponge "$filename"

sed 1s/": "/";"/ "$filename" | sponge "$filename"

