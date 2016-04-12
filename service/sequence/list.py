#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
import time,datetime,os
from Bio.Seq import Seq
from Bio import SeqIO
from Bio.Alphabet import IUPAC
class Restful(WebRequestHandler):

	@operator_except
	def get(self):

		user_id=self.get_argument('user_id', default='')
		hospital_code=self.get_argument('hospital_code', default='')
		his_id=self.get_argument('his_id', default='')#进首页不需要，n>1
		name=self.get_argument('name', default='')#进首页的查询
		no=int(self.get_argument('no', default=''))#根据no的值判断不同的请求
		id_no=self.get_argument('id_no', default='')#病人的身份证号
		offset   = int(self.get_argument("o",default='1'))
		rowcount = int(self.get_argument("r",default='10'))
		file_id  = self.get_argument('file_id', default='')
		print(file_id)
		offset=(offset-1)*rowcount

		#翻译
		if no==1:
			try:
				messenger_rna =  Seq(name, IUPAC.unambiguous_rna)
				a=messenger_rna.translate()
			except Exception as e:
				raise BaseError(601)
			rowdata={}
			rowdata['rows']=str(a)
			print(rowdata)
			self.response(rowdata)
		
		#转录
		if no==2:
			coding_dna = Seq(name,IUPAC.unambiguous_dna)
			template_dna = coding_dna.reverse_complement()
			rowdata={}
			rowdata['rows']=str(template_dna)
			print(rowdata)			
			self.response(rowdata)


		
		#互补序列
		if no==3:
			my_seq = Seq(name, IUPAC.unambiguous_dna)
			a=my_seq.complement()
			rowdata={}
			rowdata['rows']=str(a)
			print(rowdata)			
			self.response(rowdata)


		
		#将序列文件转换为大写
		if no==4:
			cur=self.db.getCursor()
			if file_id:
				sql="select file_name,path from public.file where id=%s  "%(file_id)
			else:
				sql=" "
			cur.execute(sql)
			rows=cur.fetchall()
			filepath='/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/'+rows[0][1]
			oldpath=filepath.replace(rows[0][0],"upp"+rows[0][0])
			rowdata={}
			records = (rec.upper() for rec in SeqIO.parse(filepath, "fasta"))
			count = SeqIO.write(records,oldpath,"fasta")
			rowss="Converted %i records to upper case" % count
			rowdata['resu']=rowss
			rowdata['down']=str(rows[0][1]).replace(rows[0][0],"upp"+rows[0][0])
			#print(rows[0][1],row[0][0])
			for seq_record in SeqIO.parse(oldpath, "fasta"):
				rowdata['rows']=((str(seq_record.id)),str(seq_record.seq),len(seq_record),rows[0][0],str(repr(seq_record.description)))			
			
			self.response(rowdata)


		
		#对序列文件进行排序
		if no==5:
			cur=self.db.getCursor()
			if file_id:
				sql="select file_name,path from public.file where id=%s  "%(file_id)
			else:
				sql=" "
			cur.execute(sql)
			rows=cur.fetchall()
			filepath='/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/'+rows[0][1]
			oldpath=filepath.replace(rows[0][0],"sort"+rows[0][0])
			
			rowdata={}
			len_and_ids = sorted((len(rec), rec.id) for rec in \
			SeqIO.parse(filepath,"fasta"))
			ids = reversed([id for (length, id) in len_and_ids])
			del len_and_ids #free this memory
			record_index = SeqIO.index(filepath, "fasta")
			records = (record_index[id] for id in ids)
			SeqIO.write(records, oldpath, "fasta")
			rowdata['resu']="排序成功"
			rowdata['down']=str(rows[0][1]).replace(rows[0][0],"sort"+rows[0][0])
			#print(rows[0][1],row[0][0])
			for seq_record in SeqIO.parse(oldpath, "fasta"):
				rowdata['rows']=((str(seq_record.id)),str(seq_record.seq),len(seq_record),rows[0][0],str(repr(seq_record.description)))						
			print(rowdata)
			self.response(rowdata)


		
		#no=6,显示序列文件
		if no==6:
			cur=self.db.getCursor()
			
			if file_id:
				sql="select file_name,path from public.file where id=%s  "%(file_id)
			else:
				sql=" "
			cur.execute(sql)
			rows=cur.fetchall()
			filepath='/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/'+rows[0][1]
			
			rowdata={}
			rowdata['down']=str(rows[0][1])
			for seq_record in SeqIO.parse(filepath, "fasta"):
				rowdata['rows']=((str(seq_record.id)),str(seq_record.seq),len(seq_record),rows[0][0],str(repr(seq_record.description)))
			print(rowdata)
			self.response(rowdata)



		
		#n0==7,读取序列文件
		if no==7:
			
			self.response(rowdata)


		
		#no=8,患者信息
		if no==8:
			self.response(rowdata)




	





			
	
