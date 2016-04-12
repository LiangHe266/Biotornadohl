#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from operation_log import entity
import time
import datetime
import string 

class Restful(WebRequestHandler):
	# 查询His病人基础数据

	@operator_except
	def get(self):

		offset   = int(self.get_argument('o',default='0'))
		rowcount = int(self.get_argument('r',default='100'))
		id=self.get_argument('id', default='')
		menu_code=self.get_argument('menu_code', default='')
		#create_time=self.get_argument('create_time', default='')
		start_time=self.get_argument('start_time', default='')
		end_time=self.get_argument('end_time', default='')
		#d1=datetime.datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S").date()
		#d2=d1.strftime("%Y-%m-%d") 
		#end_time1=d1+ datetime.timedelta(days=1)
		#end_time2=d1.strftime("%Y-%m-%d %H:%M:%S")
		
		hospital_code=self.get_argument('hospital_code', default='')
		#offset=(offset-1)*rowcount
			
			
		cur=self.db.getCursor()
		sql=""
		rowdata={}
		sqlwhere=""
		if id and menu_code and start_time and end_time:
			sqlwhere+=" and (b.id=%s and menu_code='%s' and ((to_timestamp('%s','YYYY-MM-DD HH24:MI:SS')<=a.create_time and a.create_time<=(to_timestamp('%s','YYYY-MM-DD HH24:MI:SS'))))) "%(id,menu_code,start_time+" 00-00-00",end_time+" 23-59-59")
		elif id and start_time and end_time:
			sqlwhere+=" and (b.id=%s  and ((to_timestamp('%s','YYYY-MM-DD HH24:MI:SS')<=a.create_time and a.create_time<=(to_timestamp('%s','YYYY-MM-DD HH24:MI:SS'))))) "%(id,start_time+" 00-00-00",end_time+" 23-59-59")
		elif menu_code and start_time and end_time:
			sqlwhere+=" and (menu_code='%s' and ((to_timestamp('%s','YYYY-MM-DD HH24:MI:SS')<=a.create_time and a.create_time<=(to_timestamp('%s','YYYY-MM-DD HH24:MI:SS'))))) "%(menu_code,start_time+" 00-00-00",end_time+" 23-59-59")
		elif id and menu_code:
			sqlwhere+=" and (b.id=%s and menu_code='%s') "%(id,menu_code)
		elif id:
			sqlwhere+=" and (b.id=%s) "%(id)
		elif menu_code:
			sqlwhere+=" and (menu_code='%s') "%(menu_code)
		elif start_time and end_time:
			sqlwhere+=" and ((to_timestamp('%s','YYYY-MM-DD HH24:MI:SS')<=a.create_time and a.create_time<=(to_timestamp('%s','YYYY-MM-DD HH24:MI:SS')))) "%(start_time+" 00-00-00",end_time+" 23-59-59")
		elif start_time:
			sqlwhere+=" and (to_timestamp('%s','YYYY-MM-DD HH24:MI:SS')<=a.create_time) "%(start_time+" 00-00-00")
		elif end_time:
			sqlwhere+=" and (a.create_time<=to_timestamp('%s','YYYY-MM-DD HH24:MI:SS')) "%(end_time+" 23-59-59")
		else:
			sqlwhere+="  "


		if id and menu_code and start_time and end_time:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)

		elif id and start_time and end_time:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)

		elif menu_code and start_time and end_time:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)


		elif id and menu_code:


			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)
			#sql=sql% (rowcount,offset)
			
		elif id:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)
		elif menu_code:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)
		elif start_time and end_time:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)
		elif start_time:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)
		elif end_time:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)


		else:

			sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "

			sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
			sql+="left join system.MENU c on a.menu_code=c.code "
			sql+="where a.hospital_code='%s' %s order by a.id desc LIMIT %s OFFSET %s "% (hospital_code,sqlwhere,rowcount,offset)
			#sql=sql% (rowcount,offset)
		

		cur.execute(sql) 
		rows = cur.fetchall()
		rowdata={}
		rowdata['rows']=rows

		rowdata['struct']='id,menu_code,operation_context,operation_no,create_time,operatname,menuname'

		sql="select count(*) from public.OPERATION_LOG a "
		sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
		sql+="left join system.MENU c on a.menu_code=c.code "
		sql+="where a.hospital_code='%s' %s "% (hospital_code,sqlwhere)
		cur.execute(sql)
		row = cur.fetchone()
		rowdata['count']=row[0]
		self.response(rowdata)

