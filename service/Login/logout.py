#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from mysql.connector import errors,errorcode
from Login import entity
from User import user

from BioTornado.Base  import WebRequestHandler,BaseError
from mysql.connector import errors,errorcode
import config
#from easyOAuth.userinfo import Token

import base64,time
from Crypto.Cipher import AES
from hashlib import md5

class Handle(WebRequestHandler):

	@operator_except
	def get(self):

		token = self.request.headers.get('Authorization')
		u = user.user();
		u.delete(token);

		res = ':)';

		self.response(res)
