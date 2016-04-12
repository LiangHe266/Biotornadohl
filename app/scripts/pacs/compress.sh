#!/bin/sh

SRC_DIR=`pwd`

rm -f *.min.js 2>/dev/null

echo "compress pacs js script"

cd src20160227 || exit

rm -f *.min.js 2>/dev/null

java -jar /workspace/yui248.jar -o '.js$:.min.js' *.js

cat *.min.js > pacs.all.min.js

chmod a+rw *.min.js
chown wells:wells *.min.js			#for me only

mv -f pacs.all.min.js ../

rm -f *.min.js 2>/dev/null

cd ..

echo "compress three js script"
cd three || exit

rm -f *.min.js 2>/dev/null

java -jar /workspace/yui248.jar -o math.all.min.js math.all.js

chmod a+rw math.all.min.js
chown wells:wells math.all.min.js	#for me only

echo "DONE!!!"

cd ..
