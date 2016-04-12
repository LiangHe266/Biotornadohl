#coding:utf-8

from BioTornado.Base  import WebRequestHandler,BaseError,operator_except

from tm import entity

import time

class Restful(WebRequestHandler):



    @operator_except

    def get(self):

        #查询与自己有关的会诊

        #参数

        searchHos=self.get_argument("searchHos", default='')

        searchSTime=self.get_argument("searchSTime", default='')

        searchETime=self.get_argument("searchETime", default='')

        searchStatus=self.get_argument("searchStatus", default='')

        

        offset   = int(self.get_argument("o",default='1'))

        rowcount = int(self.get_argument("r",default='10'))

        offset=(offset-1)*rowcount

        

        user = self.objUserInfo 

        

        sql1=""

        

        if searchHos:

            sql1+=" and hi.name like '%"+searchHos+"%'"

            

        if searchSTime:

            sql1+=" and rc.consultation_time>='"+searchSTime+"'";

        

        if searchETime:

            searchETime=searchETime+" 23:59:59"

            sql1+=" and rc.consultation_time<='"+searchETime+"'";

            

        if searchStatus:

            sql1+=" and cv.code='"+searchStatus+"'"

        sql="select rc.id,rc.consultation_name,rc.consultation_time,rc.status,hi.name,d.name,cv.name,rc.apply_code,rc.apply_doctor  "

        sql+="from public.remote_consultation rc left join public.hospital_info hi on rc.apply_code=hi.code left join "

        sql+="public.doctor d on rc.apply_doctor=d.his_id left join (select *from system.code_value where "

        sql+="type_code='REMOTE_CONSULTATION_STATUS') cv on rc.status=cv.code where rc.patient='%s' %s"%(user['his_id'],sql1)

        sql+="order by rc.status asc,rc.id desc limit %s offset %s"%(rowcount,offset)          

        #print(sql);

        cur=self.db.getCursor()

        cur.execute(sql)

        rows = cur.fetchall() 

        rowdata={}

        rowdata['struct']="id,consultation_name,consultation_time,status,hospital_name,doctor_name,status_name,hospital_code,doctor_id"

        rowdata['rows']=rows

        sql="select count(*) from public.remote_consultation rc left join public.hospital_info hi on rc.apply_code=hi.code left join "

        sql+="public.doctor d on rc.apply_doctor=d.his_id left join (select *from system.code_value where "

        sql+="type_code='REMOTE_CONSULTATION_STATUS') cv on rc.status=cv.code where rc.patient='%s' %s"%(user['his_id'],sql1)

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

            'patient':user['his_id'],
            'patient_hospital_code':user['hospital_code'],
            'dept_id':objdata['dept_id'],
            'type':'2',

            'apply_code':objdata['apply_code']

        }

        

        id =s.save(lstData,table='public.remote_consultation')

         
        #生成单号
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

        

        self.response(id)

        

    @operator_except

    def put(self):

        # 医生参与

        objdata = self.getRequestData()

        user = self.objUserInfo
        create_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        s = entity.MDT(self.db)
        cur=self.db.getCursor()
        #cur.excute("select id from public.remote_consultation where id<>%s"% (objdata['tnid']))
        lstData = {
            'create_id':user['id'],
            'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
            'update_id':user['id'],
            'update_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
            'status':0,
            'consultation_name':objdata['consultation_name'],
            'consultation_time':objdata['consultation_time'],
            'description':objdata['description'],
            'apply_doctor':objdata['apply_doctor'],
            'patient':user['his_id'],
            'patient_hospital_code':user['hospital_code'],
            'dept_id':objdata['dept_id'],
            'type':'2',
            'apply_code':objdata['apply_code']
        }

      
        id =s.save(lstData,table='public.remote_consultation')

        consultation_no='rc'+time.strftime("%Y%m%d",time.localtime(time.time()))+str(id)

        lstData={

            'consultation_no':consultation_no

        }

        s.save(lstData,id,table='public.remote_consultation')
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

        
        self.response(id)

        

    @operator_except

    def delete(self):

        objdata = self.getRequestData()
        user = self.objUserInfo
        cur=self.db.getCursor()
        cur.execute("select id from public.remote_consultation where id='%s'"% objdata['id'])
        s = entity.MDT(self.db)
        r=s.remove(objdata['id'],delete=True)
       # if not self.objUserInfo :
            #raise BaseError(604)
        user = user['name']
        user_code=self.user['id']
        operation_log(self.db).addLog(user_code,user+'修改了申请重新申请了门诊:'+objdata['consultation_name'],objdata['id'])
        self.response(r)



    

    @operator_except

    def patch(self):

        #通过id获取详细信息

        objdata = self.getRequestData()

        cur=self.db.getCursor()

        #获取会诊信息

        sql="select rc.id,rc.consultation_name,rc.status,rc.consultation_time,rc.description,rc.patient,"

        sql+="rc.apply_doctor,rc.consultation,rc.handle,rc.reject,rc.apply_code from public.remote_consultation rc where rc.id=%s"%(objdata['tm_id'])

        cur.execute(sql)                    

        rows=cur.fetchall()  

        if not rows or len(rows)==0:

            raise BaseError(801)

        data={}

        rowdata={}

        rowdata['struct']="id,consultation_name,status,consultation_time,description,patient,apply_doctor,consultation,handle,reject,hospital_code"

        rowdata['rows']=rows  

        data['tm']=rowdata

        #获取医生信息

        sql="select d.id,d.name,d.title,d.his_id,d.phone,hi.name,hd.name,cv.name "

        sql+="from public.doctor d,public.hospital_info hi,public.hospital_dept hd,"

        sql+="(select *from system.code_value where type_code='TITLE')cv "

        sql+="where d.his_id='%s' and d.hospital_code=hi.code and d.dept_id=hd.id and d.title=cv.code"%(rows[0][6])

        cur.execute(sql)                    

        rows=cur.fetchall()          

        rowdata={}

        rowdata['struct']="id,name,title,his_id,phone,hospital_name,dept_name,title_name"

        rowdata['rows']=rows  

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




















