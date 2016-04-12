#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Case_learn import centerEntity
import re,os,sys,os.path,shutil
import time
import datetime
class Restful(WebRequestHandler):
	@operator_except
	def get(self):
		s=centerEntity.Case_learn_center(self.db)
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='10'))
		offset=(offset-1)*rowcount
		search_msg = self.get_argument('search_msg', default='')
		cur=self.db.getCursor()
		rowdata={}
		#查询
		if search_msg!='':
			cur.execute(" select a.id,a.name,a.related_case as desease,b.name as creator,a.create_time as ctime,a.detail,c.name as updater_name,a.update_time,a.author_company hospital_name,avg(av.value) as average,a.author,cv.id as fovorite from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.HOSPITAL_CODE=d.code "
						"left join public.case_learn_value av on a.id=av.case_id "
						"left join public.case_learn_favorite cv on cv.case_id=a.id "
						
						"where a.status='0' and (a.name like '%%%s%%' or b.name like '%%%s%%') and a.apply_status='2' "
						"group by a.id,b.name,c.create_time,c.name,a.author_company,a.author,cv.id "
						"order by a.id desc "
						"limit %s offset %s " % (search_msg, search_msg,rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="id,name,desease,creator,ctime,detail,updater_name,update_time,hospital_name,average,author,fovorite"
			rowdata['rows']= rows
			cur.execute("select count(*) from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.HOSPITAL_CODE=d.code "

						"where a.status='0' and a.apply_status='2'and (a.name like '%%%s%%' or b.name like '%%%s%%')"%(search_msg, search_msg))
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)
		else:
			cur.execute(" select a.id,a.name,a.related_case as desease,b.name as creator,a.create_time as ctime,a.detail,c.name as updater_name,a.update_time,a.author_company hospital_name,avg(av.value) as average,a.author,cv.id as fovorite from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.HOSPITAL_CODE=d.code "
						"left join public.case_learn_value av on a.id=av.case_id "
						"left join public.case_learn_favorite cv on cv.case_id=a.id "

						"where a.status='0' and a.apply_status='2' "
						"group by a.id,b.name,c.create_time,c.name,a.author_company,cv.id "
						"order by a.id desc "
						"limit %s offset %s " % (rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="id,name,desease,creator,ctime,detail,updater_name,update_time,hospital_name,average,author,fovorite"
			rowdata['rows']= rows
			cur.execute("select count(*) from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.hospital_code=d.code "

						"where a.status='0' and a.apply_status='2' ")
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)
	@operator_except
	def post(self):
		alldata = self.getRequestData()
		user = self.objUserInfo
		caseID = alldata['caseID']
		s=centerEntity.Case_learn_center(self.db)
		if caseID!='':
			cur=self.db.getCursor()
			cur.execute("select b.path from public.case_learn_file a left join public.file b on a.file_id=b.id "
					"where a.case_id=%s "%(alldata['caseID']))
			filepath = cur.fetchall()
			oofilepath='/workspace/mdt/mdt/mdtproject/trunk/app/'+filepath[0][0]
			cur.execute("select a.id as key,b.id as file from public.case_learn_key a left join case_learn_file b on a.case_id=b.case_id  "
					"where a.case_id=%s "%(alldata['caseID']))
			rows = cur.fetchall()
			lsData={
				"update_time"	:	time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
				"create_id"		:	user['id'],
				"name"			:	alldata['name'],
				"abstract"	:	alldata['descp'],
				"author"		:	alldata['author'],
				"author_company"		:	alldata['authorcompany'],
				"apply_status"	:	'1'

			
			}
		
			id = s.save(lsData,alldata['caseID'],table='public.case_learn')

			for q in [x for x,y in rows]:
				r=s.remove(q,table="public.case_learn_key",delete=True)
			keydata=re.split(',|，',alldata['key'])
			for k in keydata[:3]:
				
				key={
					
					"create_time"	:	time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
					"create_id"		:	user['id'],
					"key"			:	k,
					"case_id"		:	alldata['caseID'],
				}
		
				eid = s.save(key,table='public.case_learn_key')
			print('新建成功')
			self.response(id)
			#保存上传文件
			print('上传文件')
			for file in alldata['files']:
				lsData={
					'create_id':user['id'],
					'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
					'file_id':file['file_id'],
					'file_name':file['file_name'],
					'size':file['size'],
					'remark':file['remark'],
				}
				fid=s.save(lsData,rows[0][1],table='public.case_learn_file')
			if fid:
				p,f=os.path.split(oofilepath)
				if os.path.exists(p):
					shutil.rmtree(p)
			cur=self.db.getCursor()
			cur.execute("select b.path from public.case_learn_file a left join public.file b on a.file_id=b.id "
					"where a.case_id=%s "%(alldata['caseID']))
			row = cur.fetchall()
			filepath='/workspace/mdt/mdt/mdtproject/trunk/app/'+row[0][0]
			cmd='/opt/openoffice4/program/./soffice -headless -accept="socket,host=127.0.0.1,port=2002;urp;" -nofirststartwizard &'
			os.popen(cmd)
			if os.path.splitext(filepath)[1]=='.doc' or os.path.splitext(filepath)[1]=='.ppt':
				newpath=filepath[:-4]+'.pdf'
				filepath=filepath.replace(' ','\ ')
				newpath=newpath.replace(' ','\ ')
				os.popen("python2.7 /opt/openoffice4/program/DocumentConverter.py %s %s" % (filepath,newpath))

			elif os.path.splitext(filepath)[1]=='.docx' or os.path.splitext(filepath)[1]=='.pptx':
				newpath=filepath[:-5]+'.pdf'
				filepath=filepath.replace(' ','\ ')
				newpath=newpath.replace(' ','\ ')
				os.popen("python2.7 /opt/openoffice4/program/DocumentConverter.py %s %s" % (filepath,newpath))
			else:

				pass
		else:

			lsData={
				"create_time"	:	time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
				"create_id"		:	user['id'],
				"hospital_code"	:	user['hospital_code'],
				"name"			:	alldata['name'],
				"abstract"	:	alldata['descp'],
				"author"		:	alldata['author'],
				"author_company"		:	alldata['authorcompany'],
				"apply_status"	:	'1'

			
			}
		
			id = s.save(lsData,table='public.case_learn')
			keydata=re.split(',|，',alldata['key'])
			for k in keydata[:3]:
				key={
					"create_time"	:	time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
					"create_id"		:	user['id'],
					"key"			:	k,
					"case_id"	:	id,

			
				}
		
				eid = s.save(key,table='public.case_learn_key')
				print('新建成功')
			self.response(id)
			#保存上传文件
			print('上传文件')
			for file in alldata['files']:
				lsData={
					'create_id':user['id'],
					'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
					'case_id'	:	id,
					'file_id':file['file_id'],
					'file_name':file['file_name'],
					'size':file['size'],
					'remark':file['remark'],

				}
				s.save(lsData,table='public.case_learn_file')
			
			cur=self.db.getCursor()
			cur.execute("select b.path from public.case_learn_file a left join public.file b on a.file_id=b.id "
					"where a.case_id=%s "%(id))
			row = cur.fetchall()
			filepath='/workspace/mdt/mdt/mdtproject/trunk/app/'+row[0][0]
			cmd='/opt/openoffice4/program/./soffice -headless -accept="socket,host=127.0.0.1,port=2002;urp;" -nofirststartwizard &'
			os.popen(cmd)
			if os.path.splitext(filepath)[1]=='.doc' or os.path.splitext(filepath)[1]=='.ppt':
				newpath=filepath[:-4]+'.pdf'
				filepath=filepath.replace(' ','\ ')
				newpath=newpath.replace(' ','\ ')
				os.popen("python2.7 /opt/openoffice4/program/DocumentConverter.py %s %s" % (filepath,newpath))

			elif os.path.splitext(filepath)[1]=='.docx' or os.path.splitext(filepath)[1]=='.pptx':
				newpath=filepath[:-5]+'.pdf'
				filepath=filepath.replace(' ','\ ')
				newpath=newpath.replace(' ','\ ')
				os.popen("python2.7 /opt/openoffice4/program/DocumentConverter.py %s %s" % (filepath,newpath))
			else:
				pass
			for file in alldata['files']:
				lsData={
					'create_id':user['id'],
					'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
					'pdf_id'	:	id,
					'doc_id':file['file_id'],
				}
				s.save(lsData,table='public.pdf_file')

		
	@operator_except
	def put(self):
		alldata = self.getRequestData()
		s=centerEntity.Case_learn_center(self.db)
		lsData={
			"update_time"	:	"update_time",
			"update_id"		:	"update_id",
			"hospital_code"	:	"hospital_code",
			"name"			:	"name",
			"related_case"	:	"related_case",
			"detail"		:	"detail",
			"apply_status "		:	'1'
		}
		data={}
		for (k, v) in lsData.items():
			try:
				
				if k=="update_time":
					try:
						data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
					except Exception as ex:
						print(ex)
				elif k in ['update_id','hospital_code','name','related_case','detail']:
					if alldata[v]=="" or alldata[v] is None:
						pass
					else:
						data[k] = alldata[v] 
				else :
					data[k] = alldata[v]
			except:
				pass
		if data is None or data == {}:
			raise BaseError(801)  #参数错误
		id = s.save(data, alldata['id'],table='public.case_learn',key='id')
	@operator_except
	def delete(self):
		alldata = self.getRequestData()
		s=centerEntity.Case_learn_center(self.db)
		cur=self.db.getCursor()
		status=''
		cur.execute("select status from public.case_learn "
					"where id=%s "%(alldata['id']))
		rows = cur.fetchone()
		if rows[0]!='1':
			status=1
		lsData={
			"status"	:	status
		}
		id=s.save(lsData,alldata['id'],table='public.case_learn',key='id')
		self.response(id)
	@operator_except
	def patch(self):
		#获取文件信息
		alldata = self.getRequestData()
		cur=self.db.getCursor()
		rowdata={}
		cur.execute("select a.id,a.file_id,a.file_name,a.size,a.remark,b.path from public.case_learn_file a "
					"left join public.file b on a.file_id=b.id "
					"where a.case_id=%s "%(alldata['case_id']))
		rows = cur.fetchall()
		rowdata['struct']="id,file_id,file_name,size,remark,path"
		rowdata['rows']=rows
		self.response(rowdata)






