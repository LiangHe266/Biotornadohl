#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Main_ac_manage import entity
#from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE
#from Notification.msgEntity import Message
import time
import datetime

class Restful(WebRequestHandler):
	# 查询His病人基础数据

	@operator_except
	def get(self):
		s=entity.Main_ac_manage(self.db)
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='10'))
		offset=(offset-1)*rowcount
		name = self.get_argument('name', default='')
		code=self.get_argument('code', default='')
		id=self.get_argument('id',default='')
		
		cur=self.db.getCursor()
		sql=""
		rowdata={}
		
		if name!='':
			
			sql=" and b.name like '%"+name+"%' "
			#print("select u.*,d.name statu_name  from (select c.id,c.user_name,c.name,c.create_time,c.status,h.code,h.hospital_name from public.hospital_account c,(select b.id,b.code,b.name hospital_name from public.hospital_relation a inner join public.hospital_info b on b.code= a.franchisee_code and a.center_code='%s' %s and (a.status='1' or a.status='2' or a.status='3')) h where c.hospital_code=h.code and c.type='0' order by c.id asc LIMIT %s OFFSET %s) u left join system.code_value d on u.status=d.code inner join system.code_type e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1' "% (code,sql,rowcount,offset));
			cur.execute("select u.id,u.user_name,u.name,u.create_time,u.status,u.code,u.hospital_name,d.name statu_name  from (select c.id,c.user_name,c.name,c.create_time,c.status,h.code,h.hospital_name from public.account c,(select b.id,b.code,b.name hospital_name from public.hospital_relation a inner join public.hospital_info b on b.code= a.franchisee_code and a.center_code='%s' %s and (a.status='1' or a.status='2' or a.status='3')) h where c.hospital_code=h.code and c.type='0' order by c.id asc LIMIT %s OFFSET %s) u left join system.code_value d on u.status=d.code inner join system.code_type e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1' "% (code,sql,rowcount,offset))
			rows = cur.fetchall()
			rowdata['struct']="id,user_name,name,create_time,status,code,hospital_name,statu_name"
			rowdata['rows']= rows
			cur.execute("select count(*) from public.account c,(select b.id,b.code,b.name hospital_name from public.hospital_relation a inner join public.hospital_info b on b.code= a.franchisee_code and a.center_code='%s' %s and (a.status='1' or a.status='2' or a.status='3')) h where c.hospital_code=h.code and c.type='0'"% (code,sql));
			rows = cur.fetchone()
			rowdata['count']=rows[0]
			self.response(rowdata)
			
		else:
			
			cur.execute("select u.id,u.user_name,u.name,u.create_time,u.status,u.code,u.hospital_name,d.name statu_name  "
			"from (select c.id,c.user_name,c.name,c.create_time,c.status,h.code,h.hospital_name from public.account c,(select b.id,b.code,b.name hospital_name from public.hospital_relation a inner join public.hospital_info b on b.code= a.franchisee_code and a.center_code='%s' and (a.status='1' or a.status='2' or a.status='3')) h where c.hospital_code=h.code and c.type='0') u left join system.code_value d on u.status=d.code inner join system.code_type e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1' order by u.id asc LIMIT %s OFFSET %s "% (code,rowcount,offset))
			rows = cur.fetchall()
			rowdata['struct']="id,user_name,name,create_time,status,code,hospital_name,statu_name"
			rowdata['rows']= rows
			cur.execute("select count(*)  "
			"from (select c.id,c.user_name,c.name,c.create_time,c.status,h.code,h.hospital_name from public.account c,(select b.id,b.code,b.name hospital_name from public.hospital_relation a inner join public.hospital_info b on b.code= a.franchisee_code and a.center_code='%s' and (a.status='1' or a.status='2' or a.status='3')) h where c.hospital_code=h.code and c.type='0' ) u left join system.code_value d on u.status=d.code inner join system.code_type e on d.type_id=e.id and e.code='HOSPITAL_ACCOUNT_STATUS' and e.status='1' "% (code))
			rows = cur.fetchone()

			rowdata['count']=rows[0]
			self.response(rowdata)
			

	@operator_except
	def post(self):
		# 取POST Form提交的数据
		alldata = self.getRequestData()
		s=entity.Main_ac_manage(self.db)
		eid = alldata['pass']
		#print(eid)
		uid=alldata['id']
		lsData={
			'pass'	:	eid,
			'update_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
			'update_id':alldata['update_id']
		}
		id=s.save(lsData,uid,table='public.account',key='id')
		#operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'joinhospital_account',"新增加盟医院主账号:"+alldata['user_name'],alldata['id'])
		#msg=Message(self.db)
		#msg.addMsg(alldata['hospital_code'], alldata['hospital_code'],"新增加盟医院主账号:"+alldata['user_name'])
		self.response(id)

	@operator_except
	def put(self):
		# 取POST Form提交的数据
		alldata = self.getRequestData()
		s=entity.Main_ac_manage(self.db)
		user = self.objUserInfo['name']
		uid=alldata['id']

		eid=''
		if uid:
			cond={
				'select'	:	"id,user_name,status",
				'where'		:	"id=%s" %(uid),
			}
			rowdata=s.find(cond,table='public.account')
			account=rowdata['rows'][0]
			if account[2]=='0':
				eid='1'
			else:
				eid='0'
		lsData={
			'status'	:	eid,
			'update_time'	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
		        'update_id':alldata['update_id'],
		}
		#更新自身
		data=s.save(lsData,uid,table='public.account',key='id')
		#更新由该用户创建的子账号
		s.save(lsData,account[0],table='public.account',key='create_id')
		# msg=Message(self.db)
		# if eid=='0':
		# 	msg.addMsg(alldata['hospital_code'], alldata['hospital_code'],user+"使"+alldata['name']+"的主账号"+alldata['user_name']+"生效")
		# 	operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'joinhospital_account',user+"使"+alldata['name']+"的主账号"+alldata['user_name']+"生效",alldata['id'])
		# else:
		# 	msg.addMsg(alldata['hospital_code'], alldata['hospital_code'],user+"使"+alldata['name']+"的主账号"+alldata['user_name']+"失效")
		# 	operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'joinhospital_account',user+"使"+alldata['name']+"的主账号"+alldata['user_name']+"失效",alldata['id'])
		self.response(data)