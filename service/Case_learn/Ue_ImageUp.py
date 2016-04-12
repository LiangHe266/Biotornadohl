import os,decimal,datetime,random
import json,ujson

from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Upload import entity
import time
class Restful(WebRequestHandler):
	
	def getSaveFileName(self, fpath, fname):
		#strdate=time.strftime('%Y-%m-%d',time.localtime(time.time()))
		rpath = fname;
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
	def get(self):
		s = entity.Upload(self.db)
		action = self.get_argument("action", default="")
		if action=='config':
			data={
				#上传图片配置项
				"imageActionName": "uploadimage",
				"imageFieldName": "upfile",
				"imageMaxSize": 2048000,
				"imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
				"imageCompressEnable": True,
				"imageCompressBorder": 1600,
				"imageInsertAlign": "none",
				"imageUrlPrefix": "",
				"imagePathFormat": "../../app/uploads/{yyyy}{mm}{dd}/{time}{rand:6}",

				#涂鸦图片上传配置项
				"scrawlActionName": "uploadscrawl", 
				"scrawlFieldName": "upfile", 
				"scrawlPathFormat": "../../app/uploads/{yyyy}{mm}{dd}/{time}{rand:6}", 
				"scrawlMaxSize": 2048000, 
				"scrawlUrlPrefix": "", 
				"scrawlInsertAlign": "none",

				#/* 截图工具上传 */
				"snapscreenActionName": "uploadimage", 
				"snapscreenPathFormat": "../../app/uploads/{yyyy}{mm}{dd}/{time}{rand:6}", 
				"snapscreenUrlPrefix": "", 
				"snapscreenInsertAlign": "none", 

				#/* 抓取远程图片配置 */
				"catcherLocalDomain": ["127.0.0.1", "localhost", "img.baidu.com"],
				"catcherActionName": "catchimage", 
				"catcherFieldName": "source", 
				"catcherPathFormat": "../../app/uploads/{yyyy}{mm}{dd}/{time}{rand:6}", 
				"catcherUrlPrefix": "", 
				"catcherMaxSize": 2048000,
				"catcherAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], 

				#/* 上传视频配置 */
				"videoActionName": "uploadvideo",
				"videoFieldName": "upfile", 
				"videoPathFormat": "../../app/uploads/{yyyy}{mm}{dd}/{time}{rand:6}", 
				"videoUrlPrefix": "", 
				"videoMaxSize": 102400000,
				"videoAllowFiles": [
					".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
					".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"], 

				#/* 上传文件配置 */
				"fileActionName": "uploadfile", 
				"fileFieldName": "upfile", 
				"filePathFormat": "../../app/uploads/{yyyy}{mm}{dd}/{time}{rand:6}", 
				"fileUrlPrefix": "", 
				"fileMaxSize": 51200000, 
				"fileAllowFiles": [
					".png", ".jpg", ".jpeg", ".gif", ".bmp",
					".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
					".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
					".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
					".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
				], 

				#/* 列出指定目录下的图片 */
				"imageManagerActionName": "listimage", 
				"imageManagerListPath": "../../app/uploads/", 
				"imageManagerListSize": 20, 
				"imageManagerUrlPrefix": "", 
				"imageManagerInsertAlign": "none", 
				"imageManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], 

				#/* 列出指定目录下的文件 */
				"fileManagerActionName": "listfile", 
				"fileManagerListPath": "../../app/uploads/", 
				"fileManagerUrlPrefix": "",
				"fileManagerListSize": 20, 
				"fileManagerAllowFiles": [
					".png", ".jpg", ".jpeg", ".gif", ".bmp",
					".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
					".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
					".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
					".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
				] 

			}
			
			self.response(data)


	@operator_except
	def post(self):


		user = self.objUserInfo

		uid = "1"
		if user :
			uid = user["id"]

		module = self.get_argument("module", default="tm")
		modulePath=os.path.join(os.path.dirname(__file__),"../../app/uploads/" + module)
		os.makedirs(modulePath, exist_ok=True);

		file_metas=self.request.files["upfile"]
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
			#self.response(data)
			#return "{'url':'" + ueconfig_url + '/' + newFileName + "','title':'" + picTitle + "','original':'" + fileName + "','state':'" + "SUCCESS" + "'}"
			#return "{'url':'" + fileUrl + '/' + saveName + "','title':'" + saveName + "','original':'" + fname + "','state':'" + "SUCCESS" + "'}"
			lsData={
				'url'	:	fileUrl,
				'title'	:	saveName,
				'original'	:	fname,
				'state'	:	'SUCCESS'


			}
			self.response(lsData)
	#打印案例
	@operator_except
	def patch(self):
		#通过id获取详细信息
		s = entity.Upload(self.db)
		alldata = self.getRequestData()
		cur=self.db.getCursor()
		data={}
		#获取案例学习信息
		cur.execute("select a.id,a.name,b.name as creater_name,a.create_time,a.related_case,a.detail from public.case_learn a "
					"left join public.account b on a.create_id=b.id "
					"where a.id=%s"%(alldata['case_id']))
		rows=cur.fetchall()
		rowdata={}
		rowdata['struct']="id,name,creater_name,create_time,related_case,detail"
		rowdata['rows']=rows
		data['medcase']=rowdata
		#获取文件信息
		rowdata={}
		cur.execute("select a.id,a.file_id,a.file_name,a.size,a.remark,b.path from public.case_learn_file a "
					"left join public.file b on a.file_id=b.id "
					"where a.case_id=%s "%(alldata['case_id']))
		rows = cur.fetchall()
		rowdata['struct']="id,file_id,file_name,size,remark,path"
		rowdata['rows']=rows
		data['files']=rowdata
		self.response(data)

			
