#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from blast import entity
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE
from Notification.msgEntity import Message
import time,datetime,os
import re,os,sys,os.path,shutil
from Bio.Blast import NCBIWWW
from Bio.Blast import NCBIXML

class Restful(WebRequestHandler):

	@operator_except
	def get(self):
		s=entity.blast(self.db)
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='10'))
		offset=(offset-1)*rowcount

		no=self.get_argument('no', default='')
		department=self.get_argument('department', default='')
		search=self.get_argument('doc_name', default='')
		type_name=self.get_argument('type', default='')
		file_id=self.get_argument('file_id', default='')
		if  file_id:
			cur=self.db.getCursor()

			sql="select a.path,a.file_name from public.file a where a.id=%s "%(file_id)
			cur.execute(sql)
			row = cur.fetchone()
			rowdata={}
			rowdata['rows']=row
			filename="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/"+row[0]
			print(filename)
			keydata=re.split(',|，',search)
			print(row)
			xmlname=keydata[0]+keydata[1]+row[1][:-6]
			filepath="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/uploads/tm/"+xmlname+".xml"
			print(xmlname)
			if os.path.isfile(filepath):
				pass
			else:
				try:
					fasta_string=open(filename).read()
					result_handle=NCBIWWW.qblast(keydata[0],keydata[1],fasta_string)
				except:
					raise BaseError(851)
				finally:
					print("aaaaaa")	
				save_file = open(filepath, "w")
				save_file.write(result_handle.read())
				save_file.close()
				result_handle.close()
			#filepath="/home/ubuntu/my_blast.xml"
			result_handle = open(filepath)
			blast_record = NCBIXML.read(result_handle)
			E_VALUE_THRESH = 0.04
			rowdata={}
			rows=[]
			print("adadasdsadsadasd")
			for alignment in blast_record.alignments:
				for hsp in alignment.hsps:
					if hsp.expect < E_VALUE_THRESH:
						a=('****Alignment****')
						a1="sequence:"+str(alignment.title)
						a2="length:"+str(alignment.length)
						a3="e value:"+str(hsp.expect)
						a4=str(hsp.query)+'...'
						a5=str(hsp.match)+'...'
						a6=str(hsp.sbjct)+'...'
						print("里面呢")
						rows.append((a,a1,a2,a3,a4,a5,a6))
			rowdata['rows']=rows
			rowdata['count']=len(rows)
			self.response(rowdata)						
		else:
			keydata=re.split(',|，',search)
			xmlname=keydata[0]+keydata[1]+keydata[2]
			try:
				result_handle=NCBIWWW.qblast(keydata[0],keydata[1],keydata[2])
			except:
				raise BaseError(851)
			finally:
				print("xxxx")

			filepath="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/uploads/tm/"+xmlname+".xml"
			if os.path.isfile(filepath):
				pass
			else:
				save_file = open(filepath, "w")
				save_file.write(result_handle.read())
				save_file.close()
				result_handle.close()
				#filepath="/home/ubuntu/my_blast.xml"
			result_handle = open(filepath)
			blast_record = NCBIXML.read(result_handle)
			E_VALUE_THRESH = 0.04
			rowdata={}
			rows=[]
			for alignment in blast_record.alignments:
				for hsp in alignment.hsps:
					if hsp.expect < E_VALUE_THRESH:
						a=('****Alignment****')
						a1="sequence:"+str(alignment.title)
						a2="length:"+str(alignment.length)
						a3="e value:"+str(hsp.expect)
						a4=str(hsp.query)+'...'
						a5=str(hsp.match)+'...'
						a6=str(hsp.sbjct)+'...'
						rows.append((a,a1,a2,a3,a4,a5,a6))
			rowdata['rows']=rows
			rowdata['count']=len(rows)
			self.response(rowdata)

	@operator_except
	def delete(self):

		cur=self.db.getCursor()
		alldata = self.getRequestData()
		sql="delete from public.doctor a where a.id=%s " % (alldata['doctor_id'])
		#print ("delete"+sql)
		cur.execute(sql)

		#sql="select a.name from public.hospital_account a where a.id=%s " % (alldata['update_person_id']) 
		cur.execute(sql)
		row = cur.fetchone()


		log_str=":删除了医生%s的信息" % (alldata['doctor_name'])
		log_str1="%s删除了医生%s的信息" % (row[0],alldata['doctor_name'])

		operation_log(self.db).addLog(alldata['update_person_id'],alldata['hospital_code'],'Doctor',log_str1,103)
		msg=Message(self.db)
		msg.addMsg(alldata['hospital_code'], alldata['hospital_code'], log_str1);  

		self.response("Operation OK")

	@operator_except
	def post(self):




		name=self.get_argument('name', default='')
		dept_id=self.get_argument('dept_id', default='')
		account_id=self.get_argument('account_id', default='')
		his_id=self.get_argument('his_id', default='')
		title_id=self.get_argument('title_id', default='')
		post_id=self.get_argument('post_id', default='')
		create_person_id=self.get_argument('create_person_id', default='')
		hospital_code=self.get_argument('hospital_code', default='')
		introduce=self.get_argument('introduce', default='')
		phone=self.get_argument('phone', default='')


		#alldata['name'],alldata['dept_id'],alldata['title_id'],alldata['post_id'],mtime,
		#alldata['create_person_id'],alldata['hospital_code'],alldata['introduce'],alldata['phone'])
		#alldata = self.getRequestData()
		mtime=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

		mtype=self.get_argument('type', default='')
		upload=self.get_argument('upload', default='')

		#mtype=alldata['type']
		#upload=alldata['uploadfile']
		cur=self.db.getCursor()
		upload_path=self.getUploadPath()


		if(mtype=="insert"):
			
			sql="insert into  public.doctor(name,dept_id,account_id,his_id,title,post,create_time,create_id,hospital_code,introduce,phone)"\
			" values ('%s', %s,'%s','%s','%s','%s','%s',%s,'%s','%s','%s')" %( name,dept_id,account_id,his_id,title_id,post_id,mtime,create_person_id,hospital_code,introduce,phone)
			cur.execute(sql)

			#sql="select a.name from public.hospital_account a where a.id=%s " % (create_person_id) 
			cur.execute(sql)
			row = cur.fetchone()

			log_str1="%s新增了医生%s的信息" % (row[0],name)

			operation_log(self.db).addLog(create_person_id,hospital_code,'Doctor',log_str1,102)
			msg=Message(self.db)
			msg.addMsg(hospital_code, hospital_code, log_str1);  


			sql="select a.id from public.doctor a where a.name='%s'  and  a.create_time='%s' " % (name,mtime) 
			cur.execute(sql)
			dov_id = cur.fetchone()


			if(int(upload)==1):

				file_metas=self.request.files['file']  
				data={}
				file_id=0
				for meta in file_metas:
					filename=meta['filename']
					if len(meta['body'])>4194304:#文件大于4M则不允许上传

						data['code']=1
						data['message']="文件大于4M则不允许上传"                
					else:
						timeStamp = int(time.time())
						fname=str(timeStamp)+'.'+filename.split('.').pop()#生成新的文件名
						filepath=os.path.join(upload_path,fname)
						#有些文件需要已二进制的形式存储，实际中可以更改
						with open(filepath,'wb') as up:      
							up.write(meta['body'])
						data['code']=0
						data['message']="文件上传成功"

						lsData={
							'create_time'   :   datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
							'create_id'     :   1,
							'file_name'     :   fname,
							'path'          :   filepath,
						}
						#data=cur.save(lsData,table='public.file')


						sql="insert into public.file (create_time,create_id,file_name,path) values ('%s', %s,'%s','%s') " %( mtime,create_person_id,fname,filepath)
						cur.execute(sql)

						sql="select max(a.id) from public.file a where a.create_time='%s' and a.file_name='%s' " % (mtime,fname)
						cur.execute(sql)
						row = cur.fetchone()
						file_id=row[0]

						sql="update public.doctor  set photo_file=%s  where id=%s  " %(file_id,dov_id[0]) 
						#print (sql)
						cur.execute(sql)

			self.response("Insert Operation OK")

	@operator_except
	def put(self):
	
		mtime=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

		mtype=self.get_argument('type', default='')
		upload=self.get_argument('upload', default='')

		name=self.get_argument('name', default='')
		dept_id=self.get_argument('dept_id', default='')
		account_id=self.get_argument('account_id', default='')
		his_id=self.get_argument('his_id', default='')
		title_id=self.get_argument('title_id', default='')
		post_id=self.get_argument('post_id', default='')
		update_person_id=self.get_argument('update_person_id', default='')
		hospital_code=self.get_argument('hospital_code', default='')
		introduce=self.get_argument('introduce', default='')
		phone=self.get_argument('phone', default='')
		doc_id=self.get_argument('doc_id', default='')


		cur=self.db.getCursor()
		upload_path=self.getUploadPath()


		if(mtype=="modify"):


		
			sql="update public.doctor  set name='%s',dept_id=%s,account_id='%s',his_id=%s,title='%s',post='%s',update_time='%s',update_id=%s ,hospital_code='%s',introduce='%s',phone='%s' where id=%s " %( name,dept_id,account_id,his_id,title_id,post_id,mtime,update_person_id,hospital_code,introduce,phone,doc_id)
			cur.execute(sql)


			#sql="select a.name from public.hospital_account a where a.id=%s " % (update_person_id) 
			cur.execute(sql)
			row = cur.fetchone()

			log_str1="%s修改了医生%s的信息" % (row[0],name)

			operation_log(self.db).addLog(update_person_id,hospital_code,'Doctor',log_str1,101)
			msg=Message(self.db)
			msg.addMsg(hospital_code,hospital_code,log_str1);  

			if(int(upload)==1):

				file_metas=self.request.files['file']  
				data={}
				file_id=0
				for meta in file_metas:
					filename=meta['filename']
					if len(meta['body'])>4194304:#文件大于4M则不允许上传

						data['code']=1
						data['message']="文件大于4M则不允许上传"                
					else:
						timeStamp = int(time.time())
						fname=str(timeStamp)+'.'+filename.split('.').pop()#生成新的文件名
						filepath=os.path.join(upload_path,fname)
						#有些文件需要已二进制的形式存储，实际中可以更改
						with open(filepath,'wb') as up:      
							up.write(meta['body'])
						data['code']=0
						data['message']="文件上传成功"


						sql="insert into public.file (create_time,create_id,file_name,path) values ('%s', %s,'%s','%s') " %( mtime,update_person_id,fname,filepath)
						cur.execute(sql)

						sql="select max(a.id) from public.file a where a.create_time='%s' and a.file_name='%s' " % (mtime,fname)
						cur.execute(sql)
						row = cur.fetchone()
						file_id=row[0]

						sql="update public.doctor  set photo_file=%s  where id=%s  " %(file_id,doc_id) 
						#print (sql)
						cur.execute(sql)


			self.response("Modify Operation OK")

	def getUploadPath(self):
        #获取文件保存路径
		cut_path=os.path.dirname(__file__)#获取当前py文件目录
		parent_path = os.path.dirname(cut_path) #上级路径unionhospital/hospital/trunk/service
		parent_path=os.path.dirname(parent_path) #上级路径unionhospital/hospital/trunk
		upload_path=os.path.join(parent_path,'files') #文件保存目录unionhospital/hospital/trunk/files
		if not os.path.exists(upload_path): #文件夹不存在则创建
			os.makedirs(upload_path)
		return upload_path
		
		
