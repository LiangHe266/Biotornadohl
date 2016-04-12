#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
import re,os,sys,os.path,shutil,random
import time
import datetime
from data_mining import Entity
from Bio import LogisticRegression
from Bio import kNN
from Bio import NaiveBayes
class Restful(WebRequestHandler):
	@operator_except
	def get(self):
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='10'))
		offset=(offset-1)*rowcount
		no = self.get_argument('no', default='')
		model_id = self.get_argument('model_id', default='')
		model_type = self.get_argument('model_type', default='')
		package=self.get_argument('model_name', default='')
		cur=self.db.getCursor()
		rowdata={}
		#查询
		if no=='1':
			if model_type =='1':
				cur.execute(" select b.name,a.create_id,a.name,a.note,a.beta from public.logistis a "
				            " left join public.account b on a.create_id = b.id "
						"where a.id='%s'  "% (model_id) )
				rows = cur.fetchall()
				print(rows)
				rowdata['struct']="id,create_id,name,note,beta "
				rowdata['rows']= rows
			else:
				cur.execute(" select b.name,a.create_id,a.name,a.note,c.name,a.file_name from public.pymodel a "
					    " left join public.account b on a.create_id = b.id "
				            " left join public.model c on a.type = c.type "
					    " where a.id='%s' and a.type='%s' "% (model_id,model_type) )
				rows = cur.fetchall()
				rowdata['struct']="id,create_id,name,note,type,filename "
				rowdata['rows']= rows				
			self.response(rowdata)
		elif no=='2':
			if model_type=='1':
				beta = self.get_argument('beta', default='')
				model_data=self.get_argument('model', default='')
				a=[]
				q=0
				print(model_data)
				a=(list(eval(model_data)))	
				model=LogisticRegression.LogisticRegression()
				model.beta=(list(eval(beta)))
				rowdata={}
				rowdata['op']=LogisticRegression.calculate(model,a)
				rowdata['rows']=LogisticRegression.classify(model,a)
			elif model_type=='2':
				pack='data_mining.'+package
				import importlib
				bb=importlib.import_module(pack)
				ma=kNN.kNN()
				model=bb.model.knn(ma)
				model_data=self.get_argument('model', default='')
				a=[]
				a=(list(eval(model_data)))	
				rowdata={}
				rowdata['op']=kNN.calculate(model,a)
				rowdata['rows']=kNN.classify(model,a)			
			elif model_type=='3':
				pack='data_mining.'+package
				import importlib
				bb=importlib.import_module(pack)
				ma=NaiveBayes.NaiveBayes()
				model=bb.model.bayes(ma)
				model_data=self.get_argument('model', default='')
				a=[]
				a=(list(eval(model_data)))	
				rowdata={}
				rowdata['op']=NaiveBayes.calculate(model,a)
				rowdata['rows']=NaiveBayes.classify(model,a)				
		
			self.response(rowdata)
	@operator_except
	def post(self):
		alldata = self.getRequestData()
		user = self.objUserInfo
		s=Entity.model(self.db)
		print(alldata)
		if alldata['model_type']==1:
			xss=alldata['xs'].split()
			xs=[]
			ys=[]
			q=0
			for i in xss:
				xs.append([float(i.split(',')[0]),float(i.split(',')[1])])
			for i in range(len(xs)):
				ys.append(int(alldata['ys'].split(',')[q]))
				q=q+1
			print(len(xs),len(ys))
			model=LogisticRegression.train(xs,ys)
			if model.beta:
				lsData={
					"create_id"	:	user['id'],
					"name"		:	alldata['name'],
					"beta"	:	str(model.beta),
				        "note"			:	alldata['note']
			
					}
				id = s.save(lsData,table='public.logistis')
				self.response(id)			
		elif alldata['model_type']==2:
			xss=alldata['xs'].split()
			xs=[]
			ys=[]
			q=0
			for i in xss:
				xs.append([float(i.split(',')[0]),float(i.split(',')[1])])
			for i in range(len(xs)):
				ys.append(int(alldata['ys'].split(',')[q]))
				q=q+1
			print(xs,ys)
			print(xs,ys)
			count=1
			while count >= 0 :
				rpath = str(random.randint(10000, 90000))
				pyfile='/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/service/data_mining/'+rpath+'.py'
				if not os.path.isfile(pyfile):
					count=-1
				else:
					count=1
				
				
			
			f=open(pyfile,'w')
			text = 'from Bio import kNN'+'\n'+'class model():'+'\n'+'	def knn(self):'+'\n'+'		xs = '+str(xs)+'\n'+'		ys ='+str(ys)+'\n'+'		k='+str(alldata['k'])+'\n'+'		model = kNN.train(xs,ys,k)'+'\n'+'		return model'
			print(text)
			f.write(text)
			f.close()
			if os.path.isfile(pyfile):
				lsData={
					"create_id"	:	user['id'],
				        "name"  	:	alldata['name'],
					"file_name"	:	rpath,
				        "packpath"	:	pyfile,
				        "type"          :       '2',
					"note"		:	alldata['note']
				       }
				id = s.save(lsData,table='public.pymodel')
				self.response(id)					
		elif alldata['model_type']==3:
			xss=alldata['xs'].split()
			xs=[]
			ys=[]
			q=0
			for i in xss:
				xs.append([float(i.split(',')[0]),float(i.split(',')[1])])
			for i in range(len(xs)):
				ys.append(int(alldata['ys'].split(',')[q]))
				q=q+1
			print(xs,ys)
			count=1
			while count >= 0 :
				rpath = str(random.randint(10000, 90000))
				pyfile='/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/service/data_mining/'+rpath+'.py'
				if not os.path.isfile(pyfile):
					count=-1
				else:
					count=1
			f=open(pyfile,'w')
			text = 'from Bio import NaiveBayes'+'\n'+'class model():'+'\n'+'	def bayes(self):'+'\n'+'		xs = '+str(xs)+'\n'+'		ys ='+str(ys)+'\n'+'		model = NaiveBayes.train(xs,ys)'+'\n'+'		return model'
			print(text)
			f.write(text)
			f.close()
			if os.path.isfile(pyfile):
				lsData={
				"create_id"	:	user['id'],
				"name"  	:	alldata['name'],
				"file_name"	:	rpath,
				"packpath"	:	pyfile,
				"type"          :       '3',
				"note"		:	alldata['note']
				}
			id = s.save(lsData,table='public.pymodel')
			self.response(id)								
		

		
	@operator_except
	def put(self):
		alldata = self.getRequestData()
		s=centerEntity.Case_learn_center(self.db)
		lsData={
			"update_time"	:	"update_time",
			"update_id"		:	"update_id",
			"hospital_code"	:	"hospital_code",
			"name"			:	"name",
			"related_case"	:	"related_case",
			"detail"		:	"detail",
			"apply_status "		:	'1'
		}
		data={}
		for (k, v) in lsData.items():
			try:
				
				if k=="update_time":
					try:
						data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
					except Exception as ex:
						print(ex)
				elif k in ['update_id','hospital_code','name','related_case','detail']:
					if alldata[v]=="" or alldata[v] is None:
						pass
					else:
						data[k] = alldata[v] 
				else :
					data[k] = alldata[v]
			except:
				pass
		if data is None or data == {}:
			raise BaseError(801)  #参数错误
		id = s.save(data, alldata['id'],table='public.case_learn',key='id')
	@operator_except
	def delete(self):
		alldata = self.getRequestData()
		s=centerEntity.Case_learn_center(self.db)
		cur=self.db.getCursor()
		status=''
		cur.execute("select status from public.case_learn "
					"where id=%s "%(alldata['id']))
		rows = cur.fetchone()
		if rows[0]!='1':
			status=1
		lsData={
			"status"	:	status
		}
		id=s.save(lsData,alldata['id'],table='public.case_learn',key='id')
		self.response(id)
	@operator_except
	def patch(self):
		#获取文件信息
		alldata = self.getRequestData()
		cur=self.db.getCursor()
		rowdata={}
		cur.execute("select a.id,a.file_id,a.file_name,a.size,a.remark,b.path from public.case_learn_file a "
					"left join public.file b on a.file_id=b.id "
					"where a.case_id=%s "%(alldata['case_id']))
		rows = cur.fetchall()
		rowdata['struct']="id,file_id,file_name,size,remark,path"
		rowdata['rows']=rows
		self.response(rowdata)






