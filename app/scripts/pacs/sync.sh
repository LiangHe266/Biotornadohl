#!/bin/sh

cd src20160227
./compress.sh

cd ../..

cp -fr pacs ../../../svn32/mdt/mdtproject/trunk/app/scripts/

cp -fr ../../service/DcmGw ../../../svn32/mdt/mdtproject/trunk/service/

cp -f ../pacs.html ../../../svn32/mdt/mdtproject/trunk/app/

echo DONE!!!!!!!!!!!!!!