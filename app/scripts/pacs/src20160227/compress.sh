#!/bin/sh

rm *.min.js

java -jar /workspace/yui248.jar -o '.js$:.min.js' *.js

mv *.min.js ../