#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from tm import entity
import time
from Notification.todoEntity import Todo
from Notification.msgEntity import Message
class Restful(WebRequestHandler):

    @operator_except
    def get(self):
        #查询与自己有关的会诊
        #参数
        searchPat=self.get_argument("searchPat", default='')
        searchSTime=self.get_argument("searchSTime", default='')
        searchETime=self.get_argument("searchETime", default='')
        searchPatHisId=self.get_argument("searchPatHisId", default='')
        searchStatus=self.get_argument("searchStatus", default='')
        
        offset   = int(self.get_argument("o",default='1'))
        rowcount = int(self.get_argument("r",default='10'))
        offset=(offset-1)*rowcount
        
        user = self.objUserInfo 
        
        sql1=""
        
        if searchPat:
            sql1+=" and p.name like '%"+searchPat+"%'"
    
        if searchSTime:
            sql1+=" and rc.consultation_time>='"+searchSTime+"'";
    
        if searchETime:
            searchETime=searchETime+" 23:59:59"
            sql1+=" and rc.consultation_time<='"+searchETime+"'";
    
        if searchPatHisId:
            sql1+=" and p.id_no like '%"+searchPatHisId+"%'"
    
        if searchStatus:
            sql1+=" and cv.code='"+searchStatus+"'"
            
        sql="select rc.id,rc.consultation_name,rc.consultation_time,rc.status,cv.name,p.name "
        sql+="from public.remote_consultation rc inner join public.patient p on rc.patient=p.id_no and rc.patient_hospital_code=p.hospital_code "
        sql+="left join (select *from system.code_value where type_code='REMOTE_CONSULTATION_STATUS' and status='1') "
        sql+="cv on rc.status=cv.code where rc.apply_doctor='%s' and rc.apply_code='%s' %s "%(user['his_id'],user['hospital_code'],sql1)
        sql+="order by cv.sort asc,rc.id desc limit %s offset %s"%(rowcount,offset)    
        #print(sql);
        cur=self.db.getCursor()
        cur.execute(sql)
        rows = cur.fetchall() 
        rowdata={}
        rowdata['struct']="id,consultation_name,consultation_time,status,status_name,pat_name"
        rowdata['rows']=rows
        sql="select count(*) from public.remote_consultation rc inner join public.patient p on rc.patient=p.id_no and rc.patient_hospital_code=p.hospital_code "
        sql+="left join (select *from system.code_value where type_code='REMOTE_CONSULTATION_STATUS' and status='1') "
        sql+="cv on rc.status=cv.code where rc.apply_doctor='%s' and rc.apply_code='%s' %s "%(user['his_id'],user['hospital_code'],sql1)
        cur.execute(sql)
        row = cur.fetchone() 
        rowdata['count']=row[0]
        self.response(rowdata)
   
    @operator_except
    def post(self):
        # 取POST Form提交的数据
        objdata = self.getRequestData()
        #用户信息
        user = self.objUserInfo 
        s = entity.TM(self.db)
        create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        
        lstData = {
            'create_id':user['id'],         
            'create_time':create_time,
            'consultation_name':objdata['consultation_name'],
            'consultation_time':objdata['consultation_time'],
            'status':0,
            'description':objdata['description'],
            'apply_doctor':objdata['apply_doctor'],
            'patient':objdata['patient'],
            'patient_hospital_code':objdata['patient_hospital_code'],
            'type':'2',
            'apply_code':objdata['apply_code'],
            'dept_id':objdata['dept_id']
        }
        #如果所申请医生为自己，则无需审核
        status=0;
        if objdata['apply_code']==user['hospital_code'] and objdata['apply_doctor']==user['his_id']:
            lstData['status']=1
            status=1
        
        id =s.save(lstData,table='public.remote_consultation')
        
        consultation_no='rc'+time.strftime("%Y%m%d",time.localtime(time.time()))+str(id)
        lstData={
            'consultation_no':consultation_no
        }
        s.save(lstData,id,table='public.remote_consultation')
        #保存文件
        for file in objdata['files']:
            lstData = {
                'create_id':user['id'],         
                'create_time':create_time, 
                'file_id':file['file_id'],
                'file_name':file['file_name'],
                'size':file['size'],
                'remark':file['remark'],
                'remote_id':id
            }
            s.save(lstData,table='public.remoteconsultation_file')  
        
        #发送待办事务
        #获取医生id
        cur=self.db.getCursor()
        sql="select account_id from public.doctor where hospital_code='%s' and his_id='%s'"%(objdata['apply_code'],objdata['apply_doctor'])
        cur.execute(sql)
        doc=cur.fetchall()
        #获取患者id
        sql="select account_id from public.patient where hospital_code='%s' and id_no='%s'"%(objdata['patient_hospital_code'],objdata['patient'])
        cur.execute(sql)
        pat=cur.fetchall()        
        if doc and pat and status==0:
            content="有新的远程门诊“"+objdata['consultation_name']+"“申请，时间为"+objdata['consultation_time']+",请及时查看审核"
            Todo(self.db).addTodo(objdata['patient_hospital_code'],doc[0][0],'tmDetail',content,id,pat[0][0],"OUT_PATIENT")
            content="有新的远程门诊“"+objdata['consultation_name']+"“申请，时间为"+objdata['consultation_time']+",请及时查看处理"
            Message(self.db).addMsg(objdata['patient_hospital_code'],pat[0][0],doc[0][0],content,1)
        self.response(id)
        
    @operator_except
    def put(self):
        # 状态修改
        objdata = self.getRequestData()
        user = self.objUserInfo
        s = entity.TM(self.db)
        lstData = {
            'update_id':user['id'],
            'update_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
            'status':objdata['status'],
            'reject':objdata['reject']
        }
        #删除待办
        if objdata['status']==1 or objdata['status']==5:
            Todo(self.db).delTodo(objdata['tm_id'],"tmDetail",user['id'])
        id =s.save(lstData,objdata['tm_id'],table='public.remote_consultation')
        self.response(id)
        
    @operator_except
    def delete(self):
        #保存医生诊断结果
        objdata = self.getRequestData()
        user = self.objUserInfo
        s = entity.TM(self.db)
        lstData = {
            'update_id':user['id'],
            'update_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
            'consultation':objdata['consultation'],
            'handle':objdata['handle'],
            'status':'3'
        }
        id =s.save(lstData,objdata['tm_id'],table='public.remote_consultation')
        Todo(self.db).delTodo(objdata['tm_id'],"tm",user['id'])
        self.response(id)
    
    @operator_except
    def patch(self):
        #通过id获取详细信息
        objdata = self.getRequestData()
        cur=self.db.getCursor()
        #获取会诊信息
        sql="select rc.id,rc.consultation_name,rc.status,rc.consultation_time,rc.description,rc.patient,"
        sql+="rc.apply_doctor,rc.consultation,rc.handle,rc.reject,rc.consultation_no,rc.apply_code,rc.patient_hospital_code "
        sql+="from public.remote_consultation rc where rc.id=%s"%(objdata['tm_id'])
        cur.execute(sql)                    
        rows=cur.fetchall()  
        if not rows or len(rows)==0:
            raise BaseError(801)
        data={}
        rowdata={}
        rowdata['struct']="id,consultation_name,status,consultation_time,description,patient,apply_doctor,consultation,handle,reject,consultation_no,apply_code,patient_hospital_code"
        rowdata['rows']=rows  
        data['tm']=rowdata
        #获取患者详情
        sql="select mp.id,mp.id_no,mp.name,mp.phone,mp.his_id,mp.sex,mp.birthday,mp.pmh,mp.fmh,mp.allergic_history,cv.name,hospital_code "
        sql+="from public.my_patient mp left join (select *from system.code_value where type_code='SEX') cv "
        sql+="on mp.sex=cv.code where mp.id_no='%s' and mp.hospital_code='%s'"%(rows[0][5],rows[0][12])       
        cur.execute(sql)                    
        rows1=cur.fetchall()          
        rowdata={}
        rowdata['struct']="id,id_no,name,phone,his_id,sex,birthday,pmh,fmh,allergic_history,sex_name,hospital_code"
        rowdata['rows']=rows1  
        data['patient']=rowdata
        #获取医生信息
        sql="select d.id,d.hospital_code,d.his_id,d.name,d.phone,hi.name,hd.name,cv.name " 
        sql+="from public.doctor d left join public.hospital_info hi on d.hospital_code=hi.code "
        sql+="left join public.hospital_dept hd on d.dept_id=hd.id left join "
        sql+="(select *from system.code_value where type_code='TITLE' and status='1') cv on d.title=cv.code "
        sql+="where d.hospital_code='%s' and d.his_id='%s'"%(rows[0][11],rows[0][6])
        cur.execute(sql)                    
        rows1=cur.fetchall()          
        rowdata={}
        rowdata['struct']="id,hospital_code,his_id,name,phone,hospital_name,dept_name,title_name"
        rowdata['rows']=rows1  
        data['doctor']=rowdata        
        #获取文件信息
        sql="select mcf.id,mcf.file_id,mcf.file_name,mcf.size,mcf.remark,f.path from "
        sql+="public.remoteconsultation_file mcf,public.file f where mcf.remote_id=%s and mcf.file_id=f.id "%(objdata['tm_id'])  
        cur.execute(sql)                    
        rows=cur.fetchall()          
        rowdata={}
        rowdata['struct']="id,file_id,file_name,size,remark,path"
        rowdata['rows']=rows  
        data['files']=rowdata
        self.response(data)










