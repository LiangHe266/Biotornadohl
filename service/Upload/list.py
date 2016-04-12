
import os,decimal,datetime,random
import json,ujson

from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Upload import entity
import time


class Restful(WebRequestHandler):

	def getSaveFileName(self, fpath, fname):
		#strdate=time.strftime('%Y-%m-%d',time.localtime(time.time()))
		rpath = str(random.randint(10000, 90000)) + '/' + fname;
		count = 100;

		while count >= 0 :
			filePath = os.path.join(fpath, rpath)
			if not os.path.exists(filePath) :
				os.makedirs(os.path.dirname(filePath), exist_ok=True);
				return rpath

			count -= 1

			rpath = str(random.randint(10000, 90000)) + '/' + fname;

		return None

	@operator_except
	def post(self):

		user = self.objUserInfo

		uid = "1"
		if user :
			uid = user["id"]

		module = self.get_argument("module", default="common")
		modulePath=os.path.join(os.path.dirname(__file__),"../../app/uploads/" + module)
		os.makedirs(modulePath, exist_ok=True);

		file_metas=self.request.files["file"]
		for meta in file_metas:
			fname = meta["filename"]
			ftype = meta["content_type"]

			saveName = self.getSaveFileName(modulePath, fname)
			filePath = os.path.join(modulePath, saveName)
			fileUrl = "uploads/" + module + "/" + saveName

			#print("upload_path : " + modulePath)
			#print("fileUrl : " + fileUrl)
			#print("filePath : " + filePath)

			with open(filePath,"wb") as up:
				up.write(meta["body"])

			s = entity.Upload(self.db)
			data = {
				"file_name" : fname,
				"create_time"  : self.now_time(),
				"update_time" : self.now_time(),
				"path" : fileUrl,
				"create_id" : uid,
				"update_id" : uid,
			}
			fid = s.add(data)
			data["id"] = fid;
			self.response(data)

	@operator_except
	def put(self):
		self.response({})

	@operator_except
	def get(self):

		s = entity.Upload(self.db)

		cond2 ={
			"select" : "id,upload_filename,upload_filePath",
			 "where"  : "id>0",
		 }

		result = s.find(cond2)
		self.response(result)
	@operator_except
	def delete(self):
		objdata = self.getRequestData()
		inst = entity.Upload(self.db)

		lstData = {
			"id" : "id"
		}
		data = {}
		eid=inst.remove(data["id"],table="medrec.upload",key="id",delete=True)
		self.response(eid)

