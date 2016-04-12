from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Authorizer import entity
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE
from Notification.msgEntity import Message
import re
import time
import datetime

class Restful(WebRequestHandler):
	# 查询His病人基础数据
	@operator_except
	def get(self):
		s=entity.Authorizer(self.db)
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='10'))
		offset=(offset-1)*rowcount
		name=self.get_argument('name',default='')
		action=self.get_argument('action',default='')
		hospital_code=self.get_argument('hospital_code',default='')
		departnment=self.get_argument('department',default='')
		cur=self.db.getCursor()
		rowdata={}
		#下拉部门
		if action=='1':
			cur.execute("select e.id,e.name as departnment_name from public.hospital_dept e "
						"left join public.authorizer i on e.id=i.departnment  "
						"where e.hospital_code='%s' "
						"union select 0 as id,'医院' as departnment_name "%(hospital_code))
			rows = cur.fetchall()
			rowdata['struct']="department_code,department_name"
			rowdata['rows']= rows
			self.response(rowdata)
		#下拉职位
		elif action=='2':
			cur.execute("select f.code,f.name from system.code_value f  "
						"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' ")
			rows = cur.fetchall()
			rowdata['struct']="position_code,position_name"
			rowdata['rows']= rows
			self.response(rowdata)
		else:
			if name!='' and departnment!='':
				sql=	"select a.id,a.name,h.name as dept_name,f.name as position_name,a.cellphone,a.tel,a.email,b.name as create_id,a.create_time,c.name as update_id,a.update_time,d.name as hospital_name ,a.departnment,a.post from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code  "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' "
				sql+=	"where h.name= '"+departnment+"' and a.hospital_code='"+hospital_code+"' and a.name like '%"+name+"%' "
				sql+=	"order by a.id desc "
				sql+=	"limit "+str(rowcount)+" offset "+str(offset)
				cur.execute(sql)
				rows = cur.fetchall()
				rowdata['struct']="id,name,dept_name,position_name,cellphone,tel,email,create_id,create_time,update_id,update_time,hospital_name,dept_name,departnment,post"
				rowdata['rows']= rows
				sql=	"select count(*) from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code  "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' "
				sql+=	"where h.name= '"+departnment+"' and a.hospital_code='"+hospital_code+"' and a.name like '%"+name+"%' "
				cur.execute(sql)
				row = cur.fetchone() 
				rowdata['count']=row[0]
				self.response(rowdata)
			elif name!='':
				sql=	"select a.id,a.name,h.name as dept_name,f.name as position_name,a.cellphone,a.tel,a.email,b.name as create_id,a.create_time,c.name as update_id,a.update_time,d.name as hospital_name ,a.departnment,a.post from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code  "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' "
				sql+=	"where a.name like '%"+name+"%' and a.hospital_code='"+hospital_code+"' "
				sql+=	"order by a.id desc "
				sql+=	"limit "+str(rowcount)+" offset "+str(offset)
				cur.execute(sql)
				rows = cur.fetchall()
				rowdata['struct']="id,name,dept_name,position_name,cellphone,tel,email,create_id,create_time,update_id,update_time,hospital_name,dept_name,departnment,post"
				rowdata['rows']= rows
				sql=	"select count(*) from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code  "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' "
				sql+=	"where  a.hospital_code='"+hospital_code+"' and a.name like '%"+name+"%' "
				cur.execute(sql)
				row = cur.fetchone() 
				rowdata['count']=row[0]
				self.response(rowdata)
			elif departnment!='':
				sql=	"select a.id,a.name,h.name as dept_name,f.name as position_name,a.cellphone,a.tel,a.email,b.name as create_id,a.create_time,c.name as update_id,a.update_time,d.name as hospital_name ,a.departnment,a.post from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code  "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' "
				sql+=	"where h.name='"+departnment+"' and a.hospital_code='"+hospital_code+"' "
				sql+=	"order by a.id desc "
				sql+=	"limit "+str(rowcount)+" offset "+str(offset)
				cur.execute(sql)
				rows = cur.fetchall()
				rowdata['struct']="id,name,dept_name,position_name,cellphone,tel,email,create_id,create_time,update_id,update_time,hospital_name,dept_name,departnment,post"
				rowdata['rows']= rows
				sql=	"select count(*) from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code  "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' "
				sql+=	"where h.name= '"+departnment+"' and a.hospital_code='"+hospital_code+"' "
				cur.execute(sql)
				row = cur.fetchone() 
				rowdata['count']=row[0]
				self.response(rowdata)
			else:
				sql=	"select a.id,a.name,h.name as dept_name,f.name as position_name,a.cellphone,a.tel,a.email,b.name as create_id,a.create_time,c.name as update_id,a.update_time,d.name as hospital_name ,a.departnment,a.post from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1'"
				sql+=	"where a.hospital_code='"+hospital_code+"' "
				sql+=	"order by a.id desc "
				sql+=	"limit "+str(rowcount)+" offset "+str(offset)
				cur.execute(sql)
				rows = cur.fetchall()
				rowdata['struct']="id,name,dept_name,position_name,cellphone,tel,email,create_id,create_time,update_id,update_time,hospital_name,dept_name,departnment,post"
				rowdata['rows']= rows
				sql=	"select count(*) from public.authorizer a "
				sql+=	"left join public.account b on b.id=a.create_id "
				sql+=	"left join public.account c on  a.update_id=c.id "
				sql+=	"left join public.hospital_info d on a.hospital_code=d.code "
				sql+=	"left join (select e.id,e.name from public.hospital_dept e left join public.authorizer i on e.id=i.departnment union select 0 as id,'医院' as name) h on h.id=a.departnment "
				sql+=	"left join system.code_value f on a.post=f.code  "
				sql+=	"inner join system.code_type g on f.type_code=g.code and g.code='POSITION' and g.status='1' "
				sql+=	"where  a.hospital_code='"+hospital_code+"' "
				cur.execute(sql)
				row = cur.fetchone() 
				rowdata['count']=row[0]
				self.response(rowdata)
	@operator_except
	def post(self):
		s=entity.Authorizer(self.db)
		name=self.objUserInfo['name']
		alldata = self.getRequestData()
		lsData={}
		# lsData={
		# 	"name"	:	alldata['name'],
		# 	"departnment"	:	alldata['department'],
		# 	"post"	:	alldata['position'],
		# 	"cellphone"	:	alldata['phone1'],
		# 	"tel"	:	alldata['phone2'],
		# 	"email"	:	alldata['email'],
		# 	"create_time"	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		# }
		# data=s.add(lsData)
		# self.response(data)
		lsData={
			'name'	:	'name',
			'departnment'	:	'department',
			'post'	:	'position',
			'cellphone'	:	'phone1',
			'tel'	:	'phone2',
			'email'	:	'email',
			'create_id'	:	'create_id',
			'create_time'	:	'create_time',
			'hospital_code'	:	'hospital_code'
		}
		data = {}
		for (k, v) in lsData.items():
			try:
				if k == 'tel' or k == 'email':
					if alldata[v]=="" or alldata[v] is None:
						raise BaseError(801)
					data[k] = alldata[v]
				elif k=="create_time":
					try:
						data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
					except Exception as ex:
						print(ex) 
				elif k=="create_id":
					if alldata[v] is None:
						pass
					else :
						data[k] = alldata[v]
				else :
					data[k] = alldata[v]
			except:
				pass
		if data is None or data == {}:
			raise BaseError(801)  #参数错误
		id = s.save(data, table='public.authorizer')
		if id <= 0:
			raise BaseError(703)  #参数错误
		#operation_log(self.db).addLog(alldata['create_id'],alldata['hospital_code'],'authorizer',"新增授权人"+alldata['name']+"的信息",id)
		#msg=Message(self.db)
		#msg.addMsg(alldata['hospital_code'],alldata['hospital_code'],name+"新增授权人"+alldata['name']+"的信息")
		self.response(id)
	@operator_except
	def put(self):
		s=entity.Authorizer(self.db)
		name=self.objUserInfo['name']
		alldata = self.getRequestData()
		id=alldata['id']
		# lsData={
		# 	"name"	:	alldata['name'],
		# 	"departnment"	:	alldata['department'],
		# 	"post"	:	alldata['position'],
		# 	"cellphone"	:	alldata['phone1'],
		# 	"tel"	:	alldata['phone1'],
		# 	"email"	:	alldata['email'],
		# 	"update_time"	:	datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		# }
		# data=s.save(lsData,id,table='public.authorizer',key='id')
		# self.response(data)
		lsData={
			'name'	:	'name',
			'departnment'	:	'department',
			'post'	:	'position',
			'cellphone'	:	'phone1',
			'tel'	:	'phone2',
			'email'	:	'email',
			'update_id'	:	'update_id',
			"update_time"	:	'update_time',
			'hospital_code'	:	'hospital_code'
		}
		data = {}
		for (k, v) in lsData.items():
			try:
				if k == 'tel' or k == 'email':
					if alldata[v]=="" or alldata[v] is None:
						raise BaseError(801)
					data[k] = alldata[v]
				elif k=="update_time":
					try:
						data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
					except Exception as ex:
						print(ex) 
				elif k=="update_id":
					if alldata[v] is None:
						pass
					else :
						data[k] = alldata[v]
				else :
					data[k] = alldata[v]
			except:
				pass
		if data is None or data == {}:
			raise BaseError(801)  #参数错误
		id = s.save(data,id,table='public.authorizer')
		if id <= 0:
			raise BaseError(703)  #参数错误
		#operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'authorizer',"修改授权人"+alldata['name']+"信息",alldata['id'])
		#msg=Message(self.db)
		#msg.addMsg(alldata['hospital_code'],alldata['hospital_code'],name+"修改授权人"+alldata['name']+"的信息")
		self.response(id)
	@operator_except
	def delete(self):
		alldata = self.getRequestData()
		name=self.objUserInfo['name']
		s=entity.Authorizer(self.db)
		r=s.remove(alldata['id'],delete=True)
		#operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'authorizer',"删除授权人"+alldata['name']+"的信息",alldata['id'])
		#msg=Message(self.db)
		#msg.addMsg(alldata['hospital_code'],alldata['hospital_code'],name+"删除授权人"+alldata['name']+"的信息")
		self.response(r)



