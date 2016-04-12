#coding:utf-8

import os, sys
import codecs
import time
import random

__utilsTempDir = "/run/mdt/"
__curDir = os.path.dirname(__file__)
__utilsCacheDir = os.path.join(__curDir, "../cache/")

try :
	os.makedirs(__utilsTempDir)
except Exception as e:
	pass

try :
	os.makedirs(__utilsCacheDir)
except Exception as e:
	pass

def cachePath() :
	return __utilsCacheDir

def tempFile(parent = None) :
	if not parent:
		parent = __utilsTempDir
	return parent + str(time.time()) + str(random.randint(1, 100000000))

def closeFile(fp) :
	try :
		if fp:
			fp.close()
		return True
	except Exception as e:
		return False

def deleteFile(file) :
	try :
		os.remove(file)
		return True
	except Exception as e:
		return False

def deleteDir(dir) :
	try :
		for root, dirs, files in os.walk(top, topdown=False):
			for name in files:
				print ("rmDir f : " + name)
				if not os.remove(os.path.join(root, name)) :
					return False

	except Exception as e:
		return False

	os.removedirs(dir)
	return True


def firstFile(dir) :
	for parent,dirnames,filenames in os.walk(dir):
		#for dirname in  dirnames:
		for filename in filenames:
			return os.path.join(parent, filename)
	return None

def bigFile(dir) :
	maxSize = 0
	maxSizeFile = None
	for parent,dirnames,filenames in os.walk(dir):
		for filename in filenames:
			filename = os.path.join(parent, filename)
			if not maxSizeFile :
				maxSizeFile = filename
				maxSize = os.path.getsize(filename)
			elif os.path.getsize(filename) > maxSize :
				maxSizeFile = filename
				maxSize = os.path.getsize(filename)
	return maxSizeFile

def D(msg) :
	#print("\033[32m[DEBUG %s]\033[0m : %s" % (time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()), msg))
	print("\033[32m[DEBUG]\033[0m : %s" % (msg))

def E(msg) :
	print("\033[31m[ERROR]\033[0m : %s" % (msg))

def readFile(file, codes = "utf-8") :

	fp = None
	rlines = None

	try :
		fp = codecs.open(file, "r", codes)
		rlines = fp.readlines()
		#print(rlines)
	except (Exception, UnicodeDecodeError) as e:
		E("readFile failed : ========>%s %s " % (file, codes))
		pass

	if fp:
		closeFile(fp)
	return rlines

def tryReadFile(file) :

	rlines = readFile(file, "gbk")

	if not rlines :
		rlines = readFile(file, "utf-8")

	return rlines
