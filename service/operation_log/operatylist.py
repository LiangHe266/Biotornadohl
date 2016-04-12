#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from operation_log import entity
import time


class Restful(WebRequestHandler):
	# 查询His病人基础数据

	@operator_except
	def get(self):
		id=self.get_argument('id', default='')

		cur=self.db.getCursor()
		sql=""
		rowdata={}
		sql="select b.id,a.menu_code,a.operation_context,a.operation_no,a.create_time,b.name as operatname,c.name as menuname from  public.OPERATION_LOG a "
		sql+="left join public.ACCOUNT b on a.hospital_code=b.hospital_code and a.operator_id=b.id "
		sql+="left join system.MENU c on a.menu_code=c.code "
		sql+="where b.id='%s'" % (id)
		#sql=sql% 

		cur.execute(sql)
		rows = cur.fetchall()
		rowdata={}
		rowdata['rows']=rows;
		rowdata['struct']='id,menu_code,operation_context,operation_no,create_time,operatname,menuname';
		
		self.response(rowdata)
