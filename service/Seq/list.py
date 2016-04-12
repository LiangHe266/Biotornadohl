#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Seq import entity
import time
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE 

class Restful(WebRequestHandler):
    # 地区管理
    
    @operator_except
    def patch(self): 
        #通过层级和父id获取地区信息
        objdata = self.getRequestData()
        cur=self.db.getCursor() 
        if objdata['parent_seq']==0:
            if objdata['type']==0:
                sql="select id,file_name from public.file  "
            elif objdata['type']==1:
                sql="select id,file_name from public.file where file_name like '%%.fasta' "
            elif objdata['type']==2:
                sql="select id,file_name from public.file where file_name like '%%.gb' "
            elif objdata['type']==3:
                sql="select id,file_name from public.file where file_name like '%%.fna' or file_name like '%%.gbk'  "
            elif objdata['type']==4:
                sql="select id,file_name from public.file where file_name like '%%.gbk' "                
        elif objdata['parent_seq']==2:
            if objdata['type']==0:
                sql="select id,name from public.model  "   
            elif objdata['type']==1:
                sql="select id,name from public.logistis  " 
            elif objdata['type']==2:
                sql="select id,name from public.pymodel where type='2'  " 
            elif objdata['type']==3:
                sql="select id,name from public.pymodel where type='3'  " 
        elif objdata['parent_seq']==3:
            sql=" select a.id,a.name from public.model a  " 
        print(objdata)
        cur.execute(sql)
        rows=cur.fetchall()
        rowdata={}
        rowdata['struct']="id,name"
        rowdata['rows']=rows         
        self.response(rowdata)  
    
   
    
  