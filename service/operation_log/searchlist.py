#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from operation_log import searchentity
import time


class Restful(WebRequestHandler):
	# 查询His病人基础数据

	@operator_except
	def get(self):
		
		hospital_code=self.get_argument('hospital_code', default='')
		cur=self.db.getCursor()
		sql=""
		rowdata={}
		sql="select b.id,b.name as operatname from  ACCOUNT b "
		
		sql+="where b.hospital_code='%s' " % (hospital_code)
		#sql=sql% 
		cur.execute(sql)
		rows = cur.fetchall()
		rowdata={}
		rowdata['rows']=rows;
		rowdata['struct']='id,operatname';
		alldata={}
		alldata['operat']=rowdata


		cur=self.db.getCursor()
		sql=""
		rowdata={}
		sql="select c.code as menu_code,c.name as menuname from  system.MENU c "	
		sql+="where c.tier=1 " 
		#sql=sql% 
		cur.execute(sql)
		rows = cur.fetchall()
		rowdata={}
		rowdata['rows']=rows;
		rowdata['struct']='menu_code,menuname';
		alldata['menu']=rowdata

		self.response(alldata)
