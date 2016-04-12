#!/bin/sh

#sed -e 's/\t/,\t/g' -e 's/$/\],/g' -e 's/^/\[/g'

N=1

#IFS=$(echo -en "\n\b")
#for file in `ls`; do echo $file; name="$(echo $file | sed 's/ //g')"; -mv $file $name 2>/dev/null; done;

for file in `ls *.txt` ;
do
	filename=`echo "$file" | sed -e 's/.txt//g' -e 's/\s//g'`
	out=${filename}.lut
	echo "==>${out}"
	echo "var Lut${filename} = {" > $out
	echo "\tname:\"$filename\"," >>$out
	echo "\tbytes:[" >>$out
	sed -e 's/\t/,\t/g' -e 's/$/\],/g' -e 's/^/\t\t\[/g' $file >> $out
	echo "]};" >> $out
	
	sed -i 's/$/\r/g' $out
done
