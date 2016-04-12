from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Accountmanage import passEntity
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE
from Notification.msgEntity import Message
import re
import time
import datetime

class Restful(WebRequestHandler):
		# 查询His病人基础数据
	@operator_except
	def put(self):
		# 取POST Form提交的数据
		alldata = self.getRequestData()
		name=self.objUserInfo['name']
		hospital_code=alldata['hospital_code']
		s=passEntity.Accountmanage_pass(self.db)
		eid = alldata['pass']
		
		update_id=alldata['update_id']
		# if user_name!='':
		# 	cond={
		# 		'select'	:	"user_name,pass",
		# 		'where'		:	"user_name='%s'" %(user_name,),
		# 	}
		# 	rowdata=s.find(cond,table='public.hospital_account')
			
		lsData={
			
			'pass'	:	eid,
			'update_id'	:	update_id,
			'update_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
		}
		data=s.save(lsData,alldata['id'],table='public.account',key='id')
		#operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'account_manage',"账户"+alldata['user_name']+"密码修改",alldata['id'])
		#msg=Message(self.db)
		#msg.addMsg(hospital_code, hospital_code,name+"修改账户"+alldata['user_name']+"密码")
		self.response(data)
	# @operator_except
	# def post(self):
	# 	# 取POST Form提交的数据
	# 	alldata = self.getRequestData()
	# 	s=passEntity.Accountmanage_pass(self.db)
	# 	eid = alldata['name']
	# 	user_name=alldata['username']
	# 	# if user_name!='':
	# 	# 	cond={
	# 	# 		'select'	:	"user_name,pass",
	# 	# 		'where'		:	"user_name='%s'" %(user_name,),
	# 	# 	}
	# 	# 	rowdata=s.find(cond,table='public.hospital_account')
			
	# 	lsData={
			
	# 		'name'	:	eid,
	# 		'user_name'	:	user_name,
	# 		'update_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
	# 	}
	# 	data1=s.save(lsData,user_name,table='public.hospital_account',key='user_name')
	# 	self.response(data1)


