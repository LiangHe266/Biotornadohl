#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Login import entity
from User import user

import config
import base64,time
from Crypto.Cipher import AES
from hashlib import md5

class Handle(WebRequestHandler):

	@operator_except
	def get(self,callback_url,dataPacket):
		s=entity.Login(self.db)
		rowData={}

		appId	 = self.getRequestHeader('App-Key')
		appSecret = self.getRequestHeader('App-Secret')

		#2. 解数据包
		dataPacket   = base64.standard_b64decode(dataPacket).decode()
		uidLength	= int(dataPacket[17:19])
		iv		   = dataPacket[:16]
		uid		  = dataPacket[-uidLength:]
		encryptedUrl = dataPacket[19:-uidLength]

		cond1 = {
			'select':'pass,status,account_type',
			'where' :"user_name = '%s'"%(uid),
		}

		rowData_sysuser=s.find(cond1,table='public.account')	# 查询实验室检查信息

		if len(rowData_sysuser)==0 :
			raise BaseError(603) # 用户名错误或密码错误
		if rowData_sysuser['rows'][0][1]=='1':
			raise BaseError(605)
		passwd = rowData_sysuser['rows'][0][0]
		#4. 用passwd对surl进行AES反解码
		
		generator = AES.new(passwd, AES.MODE_CBC, iv)
	
		cryptedStr = encryptedUrl
		crypt	  = base64.b64decode(cryptedStr)
		try :
			recovery = generator.decrypt(crypt).decode()
		except :
			recovery = ''
	
		url = recovery.rstrip('\0')
	
		self.set_header('Access-Control-Allow-Origin','*')
		if callback_url != url :
			self.set_header('Authorization', '')
			raise BaseError(606) # '603' - 用户名或密码错误.
	
		#获取用户信息
		if rowData_sysuser['rows'][0][2]=='0':
			cur=self.db.getCursor()
			cur.execute("select a.id,a.user_name,a.name,a.hospital_code,a.account_type,a.type,f.name as hospital_name,d.his_id from public.account a  "
				                "left join public.hospital_info f on a.hospital_code=f.code left join public.doctor d on a.id=d.account_id "
				                "where a.user_name='%s'"%(uid))
			rows = cur.fetchall()
			rowData['struct']="id,user_name,name,hospital_code,account_type,type,hospital_name,his_id"
			rowData['rows']=rows
			rowData['code']='0'
			cur.execute("select center_code from public.hospital_relation "
				                "where center_code='%s' "%(rows[0][3]))
			row=cur.fetchall()
			if row:
				rowData['code']='0'
			cur.execute("select hr.franchisee_code,hr.center_code,hi.name from public.hospital_relation hr,public.hospital_info hi "
				                "where franchisee_code='%s' and hr.center_code=hi.code "%(rows[0][3]))
			row=cur.fetchall()
			if row:
				rowData['code']='1'
				rowData['center_code']=row[0][1]
				rowData['center_name']=row[0][2]
			#新增
			#save user info to cache
			#################################
			index = 0;
			doctor = {}
			fields = ['id','user_name','name','hospital_code','account_type','type','hospital_name','his_id']
			row = rows[0]
			for field in fields :
				doctor[field] = row[index]
				index += 1
	
			doctor['code'] = rowData['code']
			if doctor['code'] == '1' :
				doctor['center_code'] = rowData['center_code']
				doctor['center_name'] = rowData['center_name']
				
			authcode = appId+uid+iv+url+str(int(time.time()))
			authcode = md5(authcode.encode()).hexdigest()
			self.set_header('Access-Control-Expose-Headers','Authorization')
			self.set_header('Authorization', authcode)			
			
			u = user.user();
			u.set(authcode, doctor);
	
			#################################
	
			self.response(rowData)
		else:
			#患者信息
			cur=self.db.getCursor()
			sql="select a.id,a.user_name,a.pass,a.name,a.account_type,p.id_no,p.phone,p.his_id,a.hospital_code,hi.name from "
			sql+="public.account a left join public.hospital_info hi on a.hospital_code=hi.code "
			sql+="left join public.patient p on a.id=p.account_id where a.user_name='%s'"%(uid)
			cur.execute(sql)
			rows = cur.fetchall()
			rowData['struct']="id,user_name,pass,name,account_type,id_no,phone,his_id,hospital_code,hospital_name"
			rowData['rows']=rows			
			rowData['code']='2'
			authcode = appId+uid+iv+url+str(int(time.time()))
			authcode = md5(authcode.encode()).hexdigest()
			self.set_header('Access-Control-Expose-Headers','Authorization')
			self.set_header('Authorization', authcode)
			index = 0;
			pat = {}
			fields = ['id','user_name','pass','name','account_type','id_no','phone','his_id','hospital_code','hospital_name']
			row = rows[0]
			for field in fields :
				pat[field] = row[index]
				index += 1			
			u = user.user();
			u.set(authcode, pat);
			self.response(rowData)