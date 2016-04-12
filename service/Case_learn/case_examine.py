#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Case_learn import centerEntity
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
		if search_msg!='':
			cur.execute(" select a.id,a.name,a.related_case as desease,b.name as creator,a.create_time as ctime,a.detail,c.name as updater_name,a.update_time,a.author_company hospital_name,avg(av.value) as average,a.author from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.HOSPITAL_CODE=d.code "
						"left join public.case_learn_value av on a.id=av.case_id "
						
						"where a.status='0' and (a.name like '%%%s%%' or b.name like '%%%s%%') and a.apply_status='1' "
						"group by a.id,b.name,c.create_time,c.name,a.author_company "
						"order by a.id desc "
						"limit %s offset %s " % (search_msg, search_msg,rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="id,name,desease,creator,ctime,detail,updater_name,update_time,hospital_name,average,author"
			rowdata['rows']= rows
			cur.execute("select count(*) from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.HOSPITAL_CODE=d.code "

						"where a.status='0' and a.apply_status='1' and (a.name like '%%%s%%' or b.name like '%%%s%%')"%(search_msg, search_msg))
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)
		else:
			cur.execute(" select a.id,a.name,a.related_case as desease,b.name as creator,a.create_time as ctime,a.detail,c.name as updater_name,a.update_time,a.author_company hospital_name,avg(av.value) as average,a.author from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.HOSPITAL_CODE=d.code "
						"left join public.case_learn_value av on a.id=av.case_id "

						"where a.status='0' and a.apply_status='1'and a.apply_status='1' "
						"group by a.id,b.name,c.create_time,c.name,a.author_company,a.author "
						"order by a.id desc "
						"limit %s offset %s " % (rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="id,name,desease,creator,ctime,detail,updater_name,update_time,hospital_name,average,author"
			rowdata['rows']= rows
			cur.execute("select count(*) from public.case_learn a "
						"left join public.account b on a.create_id=b.id "
						"left join public.account c on a.update_id=c.id "
						"left join public.HOSPITAL_INFO d on a.hospital_code=d.code "

						"where a.status='0' and a.apply_status='1' ")
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			print(rowdata)
			self.response(rowdata)
	@operator_except
	def post(self):
		alldata = self.getRequestData()
		user = self.objUserInfo
		s=centerEntity.Case_learn_center(self.db)
		if (alldata['caseID']!=''):
			caseID=alldata['caseID']
			lsData={
				'is_recommend'	:	'1',
				'apply_status'	:	'2',
				}
			id=s.save(lsData,alldata['caseID'],table='public.case_learn')
			for file in alldata['files']:
				lsData={

					'image_id':file['file_id'],

				}
				s.save(lsData,alldata['caseID'],table='public.case_learn')
			self.response(id)
		else:
			pass
	@operator_except
	def put(self):
		objdata = self.getRequestData()
		user=self.objUserInfo['id']
		s=centerEntity.Case_learn_center(self.db)
		status=objdata['applyStatus']
		create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		cur=self.db.getCursor()
		cur.execute("select id from public.case_learn where id='%s'"% (objdata['caseID']))
		if status==0:
			lstData = {
				'update_id':user,
				'update_time':create_time,
				'reject_reason':objdata['info'],
				'apply_status':'3'

			}
			print ('11')

		elif status==1:
			lstData = {
				'update_id':user,
				'update_time':create_time,
				'apply_status':'2'
			}
			print ('12')
		elif status!=1 and status!=0:
			lstData={}
			print (status)
		
		if lstData is None or lstData == {}:
			raise BaseError(801)  #参数错误
		id = s.save(lstData,objdata['caseID'],table='public.case_learn')
		self.response(id)
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






