from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Accountmanage import infoEntity
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE
from Notification.msgEntity import Message
import re
import time
import datetime

class Restful(WebRequestHandler):
	@operator_except
	def get(self):
		s=infoEntity.Accountmanage_info(self.db)
		hospital_code = self.get_argument('hospital_code',default='')
		action = self.get_argument('action',default='')
		cur=self.db.getCursor()
		rowdata={}
		#下拉菜单权限组
		if action=='1':
			cur.execute("select id,name from system.menu_authority_group "
						"where hospital_code='%s' "%(hospital_code))
			rows = cur.fetchall()
			rowdata['struct']="menusAut_id,menusAut_name"
			rowdata['rows']= rows
			self.response(rowdata)
		#下拉数据权限组
		else:
			cur.execute("select id,name from system.data_authority_group "
						"where hospital_code='%s' "%(hospital_code))
			rows = cur.fetchall()
			rowdata['struct']="dataAut_id,dataAut_name"
			rowdata['rows']= rows
			self.response(rowdata)
	
	@operator_except
	def post(self):	
		#通过id获取单个
		alldata = self.getRequestData()
		cur=self.db.getCursor()
		rowdata={}	
		sql="select a.id,a.user_name,a.name,d.title,d.post,d.dept_id,d.introduce,d.phone from "
		sql+="public.account a left join public.doctor d on a.id=d.account_id where a.id=%s"
		sql=sql%(alldata['id'])
		cur.execute(sql);
		rows = cur.fetchall()
		rowdata['struct']="id,user_name,name,title,post,dept_id,introduce,phone"
		rowdata['rows']= rows
		self.response(rowdata)		



	@operator_except
	def put(self):

		# 取POST Form提交的数据
		alldata = self.getRequestData()
		name=self.objUserInfo['name']
		s=infoEntity.Accountmanage_info(self.db)
		eid = alldata['name']
		
		
		update_id=alldata['update_id']
			
		lsData={
			
			'name'	:	eid,
			'update_id'	:	update_id,
			'update_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
		}
		data=s.save(lsData,alldata['id'],table='public.account',key='id')
		lsData={
		
			'name'	:	eid,
		        'dept_id':alldata['dept_id'],
		        'title':alldata['title'],
		        'post':alldata['post'],
		        'phone':alldata['phone'],
		        'introduce':alldata['introduce'],
			'update_id'	:	update_id,
			'update_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
		}
		data=s.save(lsData,alldata['id'],table='public.doctor',key='account_id')
		#operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'account_manage',"账户"+alldata['user_name']+"姓名修改",alldata['id'])
		#msg=Message(self.db)
		#msg.addMsg(hospital_code, hospital_code,name+"修改账户"+alldata['user_name']+"姓名")
		self.response(data)