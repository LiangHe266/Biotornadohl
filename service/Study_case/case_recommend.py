from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Study_case import centerEntity
import time


import datetime
class Restful(WebRequestHandler):
	@operator_except
	def get(self):  #
		s=centerEntity.Study_case_center(self.db)
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='10'))
		offset=(offset-1)*rowcount
		flag = self.get_argument('casePush', default='')
		cur=self.db.getCursor()
		rowdata={}
		#查询

			
		if flag=='1':
			cur.execute("select a.id,a.name as case_name,a.AUTHOR,a.author_company as company_name,a.create_time as ctime,avg(d.VALUE) as count0,a.is_recommend,f.path,f.update_time as recommend_time from public.CASE_LEARN a "
					"left join public.HOSPITAL_INFO c on a.HOSPITAL_CODE=c.CODE "						
					"left join public.CASE_LEARN_value  d on d.case_id=a.id  "						
					"left join public.file f on a.image_id=f.id  "	
					"      where   f.update_time =(select max(update_time) from public.file where a.image_id = id) and a.is_recommend='1' "
					"group by a.id,a.name,a.AUTHOR,a.author_company,a.create_time,a.is_recommend,f.path ,f.update_time  "
					"order by a.id desc limit 1  ")

						
			rows = cur.fetchall()
			rowdata['struct']="id,case_name,author,company,ctime,count0,recommend,image_path,recommend_time"
			rowdata['rows']= rows
			
			self.response(rowdata)
		else:
			pass

