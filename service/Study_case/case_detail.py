#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Study_case import centerEntity,detailEntity
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
		value = self.get_argument('value', default='')

		case_id = self.get_argument('case_id', default='')
		cur=self.db.getCursor()
		rowdata={}

		if case_id!=''and flag=='4' :

			create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
				
			sqlAccount="insert into public.CASE_LEARN_VIEW "
			sqlAccount+="(CREATE_ID,case_id,create_time) "
			sqlAccount+="values('%s','%s','%s') "
			sqlAccount+="RETURNING id"
			sqlAccount=sqlAccount%(urid,case_id,create_time)
			cur.execute(sqlAccount)


			cur.execute("select a.id as case_id, a.name as case_name,a.AUTHOR,a.AUTHOR_COMPANY as company,array_to_string(array(SELECT bb.key  FROM   public.case_learn_key  bb  WHERE bb.case_id=a.id), ',') as key,c.name as upname,a.CREATE_TIME as ctime,a.ABSTRACT,a.DETAIL,avg(d.VALUE) as avgcount,a.apply_status from public.CASE_LEARN a  "
						"left join public.CASE_LEARN_KEY b on b.case_id=a.id "
						"left join public.account c on c.id=a.create_id "
						"left join public.CASE_LEARN_VALUE d  on d.case_id=a.id "
						"where a.id=%s "
						"group by a.id,a.name,a.AUTHOR,a.AUTHOR_COMPANY,key,c.name,a.CREATE_TIME,a.ABSTRACT,a.DETAIL "
						"order by a.id desc  "
						"limit %s offset %s " % (case_id,rowcount, offset))

			rows = cur.fetchall()
			rowdata['struct']="case_id,case_name,author,company,key,upname,ctime,abstract,detial,,avgcount,apply_status"
			rowdata['rows']= rows

			cur.execute("select count(*)  from public.CASE_LEARN a "
						"left join public.CASE_LEARN_KEY b on b.case_id=a.id "
						"left join public.account c on c.id=a.create_id "


						
						"where a.id=%s "% (case_id))
			rows = cur.fetchone()


			rowdata['count']=rows[0]

			cur.execute("select count(a.value)  from public.CASE_LEARN_value a "

						" where a.case_id=%s and a.value is not null "%(case_id))
			rows = cur.fetchone()
			rowdata['count71']=rows[0]

			cur.execute("select count(a.case_id)  from public.CASE_LEARN_COMMENT a "

						" where a.case_id=%s "%(case_id))
			rows = cur.fetchone()
			rowdata['count72']=rows[0]

			cur.execute("select count(a.id)  from public.CASE_LEARN_DOWNLOAD a "

						" where a.case_id=%s "%(case_id))
			rows = cur.fetchone()
			rowdata['count73']=rows[0]
			cur.execute("select count(a.id)  from public.CASE_LEARN_view a "

						" where a.case_id=%s "%(case_id))
			rows = cur.fetchone()
			rowdata['count74']=rows[0]

			self.response(rowdata)
		if case_id!=''and flag=='5':#相关文档
			cur.execute("select b.key from public.CASE_LEARN a  "
						"left join public.CASE_LEARN_KEY b on b.case_id=a.id "
						"where a.id=%s "
						"limit %s offset %s " % (case_id,rowcount, offset))

			rows =cur.fetchall()
			print(rows)
			key_num=len(rows)
			sql1=""
			if key_num >= 1:
				sql1="  b.key like '%"+rows[0][0]+"%' "
				if key_num >= 2:
					sql1+=" or b.key like '%"+rows[1][0]+"%' "
					if key_num >= 3:
						sql1+=" or b.key like '%"+rows[2][0]+"%' "
						
					else:
						pass
				else:
					pass
			else:
				pass
			cur.execute("select a.id as case_id, a.name as case_name,avg(c.VALUE) as avgcount from public.CASE_LEARN a  "
					"left join public.CASE_LEARN_KEY b on b.case_id=a.id "
					"left join public.CASE_LEARN_value c on c.case_id=a.id "
					"where a.id!=%s and ( %s ) and c.value!=0 "
					"group by a.id,a.name "
					"order by avgcount desc  "
					"limit %s offset %s " % (case_id,sql1,rowcount, offset))
			rows1 = cur.fetchall()
			print(rows1)
			rowdata['struct']="case_id,case_name,avgcount"
			rowdata['rows']= rows1
			print(rows1)
			cur.execute("select count(*)  from public.CASE_LEARN a "
					"left join public.CASE_LEARN_KEY b on b.case_id=a.id "
					"where b.key like '%%"+rows[0][0]+"%%'   and a.id!=%s  " %(case_id))
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)

		if case_id!=''and flag=='6':#yonghupingjia
			cur.execute("select a.id,c.name cname,a.CREATE_TIME,a.COMMENT from public.CASE_LEARN_COMMENT a  "
						"left join public.account c on c.id=a.create_id "
						"where a.case_id=%s "
						"order by a.id desc  "% (case_id))
						#"limit %s offset %s " % (case_id,rowcount, offset))

			rows = cur.fetchall()
			rowdata['struct']="id,cname,create_time,comment"
			rowdata['rows']= rows

			cur.execute("select count(*)  from public.CASE_LEARN_COMMENT a "

						" where a.case_id=%s "%(case_id))
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)

		if case_id!=''and flag=='7':# remark

			cur.execute("select count(a.id)  from public.CASE_LEARN_REMARK a  "
				
						"where a.CASE_ID=%s and a.CREATE_ID=%s "
						 % (case_id,urid))
			rows1 = cur.fetchone()

			if rows1[0]==1:

				cur.execute("select a.id as re_id, a.REMARK,a.create_time as rtime from public.CASE_LEARN_REMARK a  "
				
						"where a.CASE_ID=%s and a.CREATE_ID=%s "
						"order by a.id desc  "
						"limit %s offset %s " % (case_id,urid,rowcount, offset))
				rows = cur.fetchall()
				rowdata['rows']= rows
				rowdata['struct']="re_id,remark,rtime"
				self.response(rowdata)
			elif rows1[0]==0:

				create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
				
				sqlAccount="insert into public.CASE_LEARN_REMARK "
				sqlAccount+="(CREATE_ID,case_id,remark,create_time) "
				sqlAccount+="values('%s','%s','','%s') "
				sqlAccount+="RETURNING id"
				sqlAccount=sqlAccount%(urid,case_id,create_time)
				cur.execute(sqlAccount)
				re_id = cur.fetchone()
				rows=''
				rowdata['rows']= rows

				rowdata['struct']="re_id,remark,rtime"
				self.response(rowdata)


		if case_id!=''and flag=='8':# value

			cur.execute("select a.value from public.CASE_LEARN_value a  "
				
						"where a.CASE_ID=%s and a.CREATE_ID=%s "
						"order by a.id desc  "
						"limit %s offset %s " % (case_id,urid,rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="value"
			rowdata['rows']= rows
			cur.execute("select count(*)  from public.CASE_LEARN_value a "
						"where a.CASE_ID=%s and a.CREATE_ID=%s "% (case_id,urid))
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)
		if case_id!=''and flag=='9':# tongji xiazai 
			create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
				
			sqlAccount="insert into public.CASE_LEARN_DOWNLOAD "
			sqlAccount+="(CREATE_ID,case_id,create_time) "
			sqlAccount+="values('%s','%s','%s') "
			sqlAccount+="RETURNING id"
			sqlAccount=sqlAccount%(urid,case_id,create_time)
			cur.execute(sqlAccount)
			did = cur.fetchone()
			self.response(did)
		if  flag=='10':# shoucang naxie

			cur.execute("select a.case_id,b.name,a.id as fid from public.CASE_LEARN_FAVORITE a  "
						"left join public.CASE_LEARN b on b.id=a.case_id "
						"where a.CREATE_ID=%s "
						"order by a.id desc  "
						"limit %s offset %s " % (urid,rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="case_id,name,fid"
			rowdata['rows']= rows
			cur.execute("select count(*)  from public.CASE_LEARN_FAVORITE a "
						"left join public.CASE_LEARN b on b.id=a.case_id "
						"where a.CREATE_ID=%s "% (urid))
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)


		if  flag=='11':# tongji shoucang
			create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
				
			sqlAccount="insert into public.CASE_LEARN_FAVORITE "
			sqlAccount+="(CREATE_ID,case_id,create_time) "
			sqlAccount+="values('%s','%s','%s') "
			sqlAccount+="RETURNING id"
			sqlAccount=sqlAccount%(urid,case_id,create_time)
			cur.execute(sqlAccount)
			tid = cur.fetchone()
			self.response(tid)


		if case_id!=''and value!='':# vlue insert
			create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
			cur=self.db.getCursor()
        
			sqlAccount="insert into public.CASE_LEARN_VALUE "
			sqlAccount+="(CREATE_ID,case_id,value,create_time) "
			sqlAccount+="values('%s','%s','%s','%s') "
			sqlAccount+="RETURNING id"
			sqlAccount=sqlAccount%(urid,case_id,value,create_time)
			cur.execute(sqlAccount)
			id = cur.fetchone()
			if id != '':
				self.response(1)#right
			else:
				self.response(0)
	@operator_except      
	def post(self):
        # 插入评论
		objdata = self.getRequestData()
		user = self.objUserInfo
		create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		s=centerEntity.Study_case_center(self.db)
		lstData = {
			"create_id":"id",
			"case_id":"case_id",			
			"comment":"comment",
			}
		data = {}
		for (k, v) in lstData.items():
			try:
				data[k] = objdata[v]
			except:
				pass
		data['create_time']=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		id = s.save(data,table='public.case_learn_comment')   
		#id = s.save(data,objdata['id'], table='CASE_LEARN_COMMENT')
		if id <= 0:
			raise BaseError(703)  #参数错误
		self.response(id)

	@operator_except      
	def put(self):
        # 插入评论
		objdata = self.getRequestData()
		s=centerEntity.Study_case_center(self.db)
		lstData = {
			"update_id":"update_id",
			"remark":"remark",

			}
		data = {}
		for (k, v) in lstData.items():
			try:
				data[k] = objdata[v]
			except:
				pass 
		data['update_time']=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())) 
		#print(objdata['id'])
		#id=1
		rid = s.save(data,objdata['id'],table='public.case_learn_remark')   
		#id = s.save(data,objdata['id'], table='CASE_LEARN_COMMENT')
		if rid <= 0:
			raise BaseError(703)  #参数错误
		self.response(rid)
	@operator_except
	def delete(self):
		alldata = self.getRequestData()
		s=detailEntity.Study_case_favorite(self.db)
		r=s.remove(alldata['fid'],delete=True)
		self.response(r) 
