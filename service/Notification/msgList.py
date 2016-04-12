from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Notification import msgEntity
import time
import datetime
class Restful(WebRequestHandler):
	@operator_except
	def get(self):
		if not self.objUserInfo :
			raise BaseError(604)

		user_id = self.objUserInfo['id']
		code = self.objUserInfo['code']

		search_msg = self.get_argument('search_msg', default='')
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='100'))
		offset = (offset - 1) * rowcount
		where=""
		if search_msg:
			where=" and (m.context like '%"+search_msg+"%' or hi.name like '%"+search_msg+"%' ) "

		cur = self.db.getCursor()
		rowdata = {}
		sql="select m.id,m.create_time,m.context,hi.name hos_name,a.name source_name,m.status,cv.name status_name,top_status "
		sql+="from public.message m left join public.hospital_info hi on m.source_code=hi.code "
		sql+="left join (select *from system.code_value where type_code='MSG_STATUS') cv on m.status=cv.code "
		sql+="left join public.account a on m.source_id=a.id where m.target_id=%s and m.status in('0','1') %s"%(user_id,where)
		sql+="order by m.status asc,m.top_status desc,m.id desc limit %s offset %s"%(rowcount, offset)
		cur.execute(sql)
		rows = cur.fetchall()
		rowdata['rows']= rows
		rowdata['struct']="id,create_time,context,hos_name,source_name,status,status_name,top_status"
		sql="select count(*) from public.message m left join public.hospital_info hi on m.source_code=hi.code where m.target_id=%s and m.status in('0','1') %s"%(user_id,where)
		cur.execute(sql)
		rows = cur.fetchone()
		rowdata['count'] = rows[0]
		self.response(rowdata)
	
	@operator_except
	def post(self):
		#删除一页
		ids = self.getRequestData()
		if not ids:
			raise BaseError(801)
		inst = msgEntity.Message(self.db)
		idstr=""
		for id in ids:
			idstr+=","+str(id)
		idstr=idstr[1:]
		user_id = self.objUserInfo['id']
		createTime=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		lstData = {
		        'status':2,
		        'UPDATE_TIME':createTime
		}
		id = inst.save(lstData,idstr)
		self.response(id)
		
	@operator_except
	def put(self):	
		#修改消息优先级
		objdata = self.getRequestData()
		msg_id = objdata["msg_id"]	
		cur = self.db.getCursor()
		cur.execute("select top_status from public.message where id=%s"%(msg_id))
		row = cur.fetchone()	
		status='0'
		if row[0]:
			#print(row[0])
			if row[0]=='0':
				status=1
			else:
				status=0
		else:
			raise BaseError(801)
		inst = msgEntity.Message(self.db)
		createTime=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		lstData = {
	                'top_status':status,
	                'UPDATE_TIME':createTime
	        }	
		id = inst.save(lstData,msg_id)
		self.response(id) 			
		
	@operator_except
	def patch(self):
		#消息设为已读
		objdata = self.getRequestData()
		msg_id = objdata["msg_id"]
		user_id = self.objUserInfo['id']
		inst = msgEntity.Message(self.db)
		createTime=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		lstData = {
	                'status':1,
	                'UPDATE_TIME':createTime
	        }	
		id = inst.save(lstData,msg_id)
		self.response(id) 		
	

	@operator_except
	def delete(self):

		objdata = self.getRequestData()
		msg_id = objdata["msg_id"]
		user_id = self.objUserInfo['id']
		inst = msgEntity.Message(self.db)
		createTime=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
		lstData = {
			'status':2,
			'UPDATE_TIME':createTime
		}	
		id = inst.save(lstData,msg_id)
		self.response(id)  #not support

