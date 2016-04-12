from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Accountmanage import entity
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE
from Notification.msgEntity import Message
import re
import time
import datetime

class Restful(WebRequestHandler):
	# 查询His病人基础数据
	@operator_except
	def get(self):
		#获取主账户的目录
		s=entity.Accountmanage(self.db)
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='10'))
		offset=(offset-1)*rowcount
		name = self.get_argument('name',default='')
		hospital_code = self.get_argument('hospital_code',default='')
		create_id=self.get_argument('create_id',default='')
		cur=self.db.getCursor()
		rowdata={}
		rows=[]
		if name!=''and hospital_code!='':
			cur.execute("select a.id,a.user_name,a.name,b.name as accounttypename,d.name as statusname,g.name as create_name,a.create_time,a.pass from public.ACCOUNT a  "
			"left join system.CODE_VALUE b on a.type=b.code   "
			"inner join system.CODE_TYPE c on b.type_id=c.id and c.code='ACCOUNT_TYPE' and c.status='1' "
			"left join system.CODE_VALUE d on a.status=d.code "
			"inner join system.CODE_TYPE e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1' "
			"left join public.ACCOUNT g on g.id=a.create_id  "
			"where a.name like '%%"+name+"%%' and a.hospital_code='%s'  "
			"order by a.id desc  "
			"limit %s offset %s"% (hospital_code,rowcount,offset))
			rows = cur.fetchall()
			rowdata['struct']="id,user_name,name,type,status,create_id,create_time,pass"
			rowdata['rows']= rows
			cur.execute("select count(*) from public.ACCOUNT a  "
			"left join system.CODE_VALUE b on a.type=b.code   "
			"inner join system.CODE_TYPE c on b.type_id=c.id and c.code='ACCOUNT_TYPE' and c.status='1' "
			"left join system.CODE_VALUE d on a.status=d.code "
			"inner join system.CODE_TYPE e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1' "
			"left join public.ACCOUNT g on g.id=a.create_id  "
			"where a.name like '%%"+name+"%%' and a.hospital_code='%s'  "%(hospital_code))
			row = cur.fetchone() 
			rowdata['count']=row[0]
			self.response(rowdata)
		elif hospital_code!='':
			cur.execute("select a.id,a.user_name,a.name,b.name as accounttypename,d.name as statusname,g.name as create_name,a.create_time,a.pass from public.ACCOUNT a  "
						"left join system.CODE_VALUE b on a.type=b.code   "
						"inner join system.CODE_TYPE c on b.type_id=c.id and c.code='ACCOUNT_TYPE' and c.status='1' "
						"left join system.CODE_VALUE d on a.status=d.code "
						"inner join system.CODE_TYPE e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1'"
						"left join public.ACCOUNT g on g.id=a.create_id  "
						"where a.hospital_code='%s' "
						"order by a.id desc  "  
						"limit %s offset %s"% (hospital_code,rowcount,offset))
			rows = cur.fetchall()
			rowdata['struct']="id,user_name,name,type,status,create_id,create_time,pass"
			rowdata['rows']= rows
			cur.execute("select count(*) from public.ACCOUNT a  "
						"left join system.CODE_VALUE b on a.type=b.code   "
						"inner join system.CODE_TYPE c on b.type_id=c.id and c.code='ACCOUNT_TYPE' and c.status='1' "
						"left join system.CODE_VALUE d on a.status=d.code "
						"inner join system.CODE_TYPE e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1'"
						"left join public.ACCOUNT g on g.id=a.create_id  "
						"where a.hospital_code='%s' "%(hospital_code))
			row = cur.fetchone() 
			rowdata['count']=row[0]
			self.response(rowdata)
		else:
			pass
		
	@operator_except
	def post(self):
		# 取POST Form提交的数据
		alldata = self.getRequestData()
		#oprname=self.objUserInfo['name']
		s=entity.Accountmanage(self.db)
		eid = alldata['pass']
		username=alldata['username']
		action=alldata['action']
		name=alldata['name']
		hospital_code=alldata['hospital_code']
		create_id=alldata['create_id']
		#先查看code是否存在
		cur=self.db.getCursor()
		cur.execute("select id from public.account where user_name='%s'"% (username))
		if cur.fetchall():
			raise BaseError(804)  #code已存在
		if action=='1':
			lsData={
				'user_name'	:	username,
				'pass'		:	eid,
				'name'		:	name,
				'create_id'	:	create_id,
				'status'	:	'0',
				'type'		:	'1',
			        'account_type':'0',
				'hospital_code'	:	hospital_code,
				'create_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
				
					
			}
			id=s.save(lsData,table='public.account')
			#lsData={
			#	'group_id'	:	alldata['menusAut_id'],
			#	'create_id'	:	create_id,
			#	'user_id'	:	id,
			#	'create_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			#}
			#data=s.save(lsData,table='system.menu_authority_group_relation')
			#lsData={
			#	
			#	'group_id'	:	alldata['dataAut_id'],
			#	'create_id'	:	alldata['create_id'],
			#	'user_id'	:	id,
			#	'create_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			#}
			#data=s.save(lsData,table='system.data_authority_group_relation')
			#operation_log(self.db).addLog(alldata['create_id'],alldata['hospital_code'],'account_manage',"新增一个账户:"+alldata['username'],id)
			#msg=Message(self.db)
			#msg.addMsg(hospital_code, hospital_code,name+"新增一个账户:"+alldata['username'])
			self.response(id)
		else:
			lsData={
				'user_name'	:	username,
				'pass'		:	eid,
				'name'		:	name,
				'create_id'	:	create_id,
				'status'	:	'0',
				'type'		:	'1',
				'hospital_code'	:	hospital_code,
			        'account_type':'0',
				'create_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			}
			id=s.save(lsData,table='public.account')
			#保存到医生表
			lsData={
			        'phone'         :       alldata['phone'],
			        'introduce'     :       alldata['introduce'],
				'dept_id'	:	alldata['dept_id'],
				'title'		:	alldata['title'],
			        'post'		:	alldata['post'],
				'name'		:	name,
			        'account_id'    :       id,
				'create_id'	:	create_id,
				'hospital_code'	:	hospital_code,
				'create_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			}
			id=s.save(lsData,table='public.doctor')
			#lsData={
			#	'group_id'	:	alldata['menusAut_id'],
			#	'create_id'	:	create_id,
			#	'user_id'	:	id,
			#	'create_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			#}
			#data=s.save(lsData,table='system.menu_authority_group_relation')
			#operation_log(self.db).addLog(alldata['create_id'],alldata['hospital_code'],'account_manage',"新增一个账户:"+alldata['username'],id)
			#msg=Message(self.db)
			#msg.addMsg(hospital_code, hospital_code,name+"新增一个账户:"+alldata['username'])
			self.response(id)
	@operator_except
	def put(self):
		# 取POST Form提交的数据
		alldata = self.getRequestData()
		s=entity.Accountmanage(self.db)
		eid = alldata['status']
		name=self.objUserInfo['name']
		hospital_code=alldata['hospital_code']
		user_name=alldata['user_name']
		#pid=alldata['type']
		if user_name!='':
			cond={
				'select'	:	"user_name,status,type",
				'where'		:	"user_name='%s'" %(user_name,),
			}
			rowdata=s.find(cond,table='public.account')
			#if pid=='0':
			#	eid=='0'
			#else:
			if eid!='0':
				eid==0
			else:
				pass
			lsData={
				
				'status'	:	eid,
				'update_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			}
			data=s.save(lsData,alldata['id'],table='public.account',key='id')
			#operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'account_manage',"账户"+alldata['user_name']+"生失效状态更改",alldata['id'])
			#msg=Message(self.db)
			#msg.addMsg(hospital_code, hospital_code,name+"使账户"+alldata['user_name']+"生失效状态更改")
			self.response(data)
	@operator_except
	def delete(self):
		alldata = self.getRequestData()
		name=self.objUserInfo['name']
		hospital_code=alldata['hospital_code']
		s=entity.Accountmanage(self.db)
		r=s.remove(alldata['id'],table='public.account',delete=True)
		r=s.remove(alldata['id'],table='public.doctor',key='account_id',delete=True)
		#operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'account_manage',"删除一个账户:"+alldata['user_name'],alldata['id'])
		#msg=Message(self.db)
		#msg.addMsg(hospital_code, hospital_code,name+"删除一个账户:"+alldata['user_name'])
		self.response(r) 