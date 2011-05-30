#!/bin/sh

VERSION="$1"
dest="pkg/jquery.s2e.$VERSION.js"

cp src/build/jquery.js $dest

files="$(ls src/*.js)"
for file in $files
do
    echo "Processing $file"
    
    include_line="$(grep -n INCLUDE_SOURCE "$dest" | cut -f1 -d':')"
    total_lines="$(wc -l "$dest" | awk '{ print $1 }')"

    head -n $(expr $include_line - 1) $dest > $dest.tmp
    cat "$file" >> $dest.tmp
    echo "" >> $dest.tmp
    
    echo "INCLUDE_SOURCE" >> $dest.tmp
    echo "" >> $dest.tmp

    tail -n $(expr $total_lines - $include_line) $dest >> $dest.tmp
    echo "" >> $dest.tmp

    mv $dest.tmp $dest
done

sed -i'.tmp' -e 's/INCLUDE_SOURCE//' $dest
rm $dest.tmp
