#coding:utf-8
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
		flag = self.get_argument('type', default='')
		urid = self.get_argument('id', default='')
		case_id = self.get_argument('case_id', default='')
		search_msg = self.get_argument('search_msg', default='')
		cur=self.db.getCursor()
		rowdata={}
		sql1=""
		if search_msg!='':
			sql1+=" and b.name like '%"+search_msg+"%' or b.author like '%"+search_msg+"%' "
		#查询

			
		if  urid!='' and case_id=='':
			
			if flag=='':
				cur.execute("select count(*) from public.CASE_LEARN_FAVORITE a "
						"where a.create_id=%s " %(urid))
				rows = cur.fetchone()
				rowdata['count3']=rows[0]
				cur.execute("select count(*) from public.CASE_LEARN_DOWNLOAD a "
						"where a.create_id=%s " %(urid))
				rows = cur.fetchone()
				rowdata['count2']=rows[0]
				cur.execute("select count(*) from public.CASE_LEARN_file a "
						"where a.create_id=%s " %(urid))
				rows = cur.fetchone()
				rowdata['count1']=rows[0]
				self.response(rowdata)
			elif flag=='0':
				cur.execute("select a.case_id,b.name as case_name,b.AUTHOR,b.author_company as HOSPITAL_name, a.create_time as vtime,b.create_time as ctime,avg(d.VALUE) as count0,b.is_recommend,f.path from public.CASE_LEARN_view a "
						"left join public.Case_learn b on b.id=a.case_id "						
						"left join public.HOSPITAL_INFO c on b.HOSPITAL_CODE=c.CODE "						
						"left join public.CASE_LEARN_value  d on d.case_id=a.case_id "						
						"left join public.file f on b.image_id=f.id "
						"where a.create_id=%s "
						"group by a.case_id,b.name,b.AUTHOR,b.author_company,a.create_time,a.id,b.create_time,b.is_recommend,f.path "
						"order by a.id desc  "
						"limit %s offset %s " % (urid,rowcount, offset))

						
				rows = cur.fetchall()
				rowdata['struct']="case_id,case_name,author,hospital_name,ctime,vtime,count0,recommend,image_id"
				rowdata['rows']= rows
				cur.execute("select count(*) from public.CASE_LEARN_view a "
						"left join public.Case_learn b on b.id=a.case_id "						
						"where a.create_id=%s %s "% (urid,sql1))
				rows = cur.fetchone()
				rowdata['count4']=rows[0]
				self.response(rowdata)
			elif flag=='1':

				cur.execute("select a.case_id , b.name as case_name,b.AUTHOR,b.author_company as HOSPITAL_name,a.create_time as ctime,avg(d.VALUE) as count0,b.apply_status from public.CASE_LEARN_file a  "
						"left join public.Case_learn b on b.id=a.case_id "						
						"left join public.HOSPITAL_INFO c on b.HOSPITAL_CODE=c.CODE "						
						"left join public.CASE_LEARN_value  d on d.case_id=a.case_id "						
						
						"where a.create_id=%s %s"
						"group by a.case_id,b.name,b.AUTHOR,b.author_company ,a.create_time,a.id,b.apply_status "
						"order by a.id desc  "
						"limit %s offset %s " % (urid,sql1,rowcount, offset))
				rows = cur.fetchall()
				rowdata['struct']="case_id,case_name,author,hospital_name,ctime,count0,apply_status"
				rowdata['rows']= rows
				cur.execute("select count(*)  from public.CASE_LEARN_file a "
						"left join public.Case_learn b on b.id=a.case_id "						
						"left join public.HOSPITAL_INFO c on b.HOSPITAL_CODE=c.CODE "						
						
						"where a.create_id=%s %s " %(urid,sql1))
				rows = cur.fetchone()
				rowdata['count1']=rows[0]


				self.response(rowdata)


			elif flag=='2':
				cur.execute("select a.case_id , b.name as case_name,b.AUTHOR,b.author_company as HOSPITAL_name,a.create_time as ctime,avg(d.VALUE) as count0  from public.CASE_LEARN_favorite a  "
						"left join public.Case_learn b on b.id=a.case_id "						
						"left join public.HOSPITAL_INFO c on b.HOSPITAL_CODE=c.CODE "						
						"left join public.CASE_LEARN_value  d on d.case_id=a.case_id "						
						
						"where a.create_id=%s %s "
						"group by a.case_id,b.name,b.AUTHOR,b.author_company ,a.create_time,a.id "
						"order by a.id desc  "
						"limit %s offset %s " % (urid,sql1,rowcount, offset))

				rows = cur.fetchall()
				rowdata['struct']="case_id,case_name,author,hospital_name,ctime,count0"
				rowdata['rows']= rows
				cur.execute("select count(*)  from public.CASE_LEARN_FAVORITE a "
						"left join public.Case_learn b on b.id=a.case_id "						
						"left join public.HOSPITAL_INFO c on b.HOSPITAL_CODE=c.CODE "						
						
						"where a.create_id=%s %s " %(urid,sql1))
				rows = cur.fetchone()
				rowdata['count2']=rows[0]
				self.response(rowdata)

			elif flag=='3':
				cur.execute("select a.case_id , b.name as case_name,b.AUTHOR,b.author_company as HOSPITAL_name,a.create_time as ctime,avg(d.VALUE) as count0  from public.CASE_LEARN_DOWNLOAD a  "
						"left join public.Case_learn b on b.id=a.case_id "						
						"left join public.HOSPITAL_INFO c on b.HOSPITAL_CODE=c.CODE "						
						"left join public.CASE_LEARN_value  d on d.case_id=a.case_id "						
						
						"where a.create_id=%s %s "
						"group by a.case_id,b.name,b.AUTHOR,b.author_company ,a.create_time,a.id "
						"order by a.id desc  "

						
						"limit %s offset %s " % (urid,sql1,rowcount, offset))
				rows = cur.fetchall()

				#for row in rows: #add the avg
				#	cur.execute("select avg(a.VALUE) as count0  from public.CASE_LEARN_COMMENT a "
				#		"where a.case_id=%s " % (row[0]))
				#	crow = cur.fetchone()
				#	row.append(crow[0])
				#	count0 =0
				rowdata['struct']="case_id,case_name,author,hospital_name,ctime,count0"
				rowdata['rows']= rows

				cur.execute("select count(*)  from public.CASE_LEARN_DOWNLOAD a "
						"left join public.Case_learn b on b.id=a.case_id "						
						"left join public.HOSPITAL_INFO c on b.HOSPITAL_CODE=c.CODE "						
						
						"where a.create_id=%s %s" %(urid,sql1))
				rows = cur.fetchone()
				rowdata['count3']=rows[0]
				self.response(rowdata)
		elif case_id!=''and urid!='':
			create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
			cur=self.db.getCursor()
        
			sqlAccount="insert into public.case_learn_view "
			sqlAccount+="(CREATE_ID,case_id,create_time) "
			sqlAccount+="values('%s','%s','%s') "
			sqlAccount+="RETURNING id"
			sqlAccount=sqlAccount%(urid,case_id,create_time)
			cur.execute(sqlAccount)

			
			id = cur.fetchone()
			self.response(id)

	@operator_except      
	def post(self):
        
		objdata = self.getRequestData()
		s=centerEntity.Study_case_center(self.db)
		lstData = {
           
			"create_id" : "id",
			"case_id":"case_id",
		}
		data = {}
		for (k, v) in lstData.items():
			try:

				data[k] = objdata[v]
			except:
				pass   
			data['create_time']=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		id = s.save(data,table='public.case_learn_view')   
		if id <= 0:
			raise BaseError(703)  #参数错误        
		self.response(id)


           



