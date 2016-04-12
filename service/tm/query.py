#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from tm import entity
import time
class Restful(WebRequestHandler):

    @operator_except
    def get(self):
        #查询患者
        search=self.get_argument("search", default='')
        
        user = self.objUserInfo 
        
        sql1=""
        if search:
            sql1+=" and (mp.name like '%"+search+"%'"
            sql1+=" or mp.id_no like '%"+search+"%'"
            sql1+=" or mp.clinic_diagnose like '%"+search+"%')"
        
        sql="select mp.id,mp.id_no,mp.name,mp.phone,mp.his_id,mp.sex,mp.birthday,mp.department_name,mp.clinic_no,"
        sql+="mp.in_no,mp.pmh,mp.fmh,mp.allergic_history,mp.clinic_diagnose,cv.name,mp.hospital_code from public.my_patient mp "
        sql+="left join (select *from system.code_value where type_code='SEX') cv on mp.sex=cv.code "
        sql+="where mp.housedoc_his_id='%s' and hospital_code='%s' %s"%(user['his_id'],user['hospital_code'],sql1)     
        
        #print(sql);
        cur=self.db.getCursor()
        cur.execute(sql)
        rows = cur.fetchall() 
        rowdata={}
        rowdata['struct']="id,id_no,name,phone,his_id,sex,birthday,department_name,clinic_no,in_no,pmh,fmh,allergic_history,clinic_diagnose,sex_name,hospital_code"
        rowdata['rows']=rows
        sql="select count(*) from public.my_patient mp left join (select *from system.code_value where type_code='SEX') cv "
        sql+="on mp.sex=cv.code where mp.housedoc_his_id='%s' and hospital_code='%s' %s "%(user['his_id'],user['hospital_code'],sql1) 
        cur.execute(sql)
        row = cur.fetchone() 
        rowdata['count']=row[0];
        self.response(rowdata)
   
    @operator_except
    def post(self):
        # 通过科室和职称查询医生
        objdata = self.getRequestData()
        #用户信息
        user = self.objUserInfo 
        s = entity.TM(self.db)
        cur=self.db.getCursor()
        where=""
        if 'title' in objdata.keys():
            where=" and d.title='%s'"%(objdata['title'])
        sql="select d.id,d.name,d.his_id from public.doctor d where d.dept_id=%s %s "%(objdata['dept_id'],where)
        cur.execute(sql)
        rows = cur.fetchall() 
        rowdata={}
        rowdata['struct']="id,name,his_id"
        rowdata['rows']=rows        
        self.response(rowdata)
        
    @operator_except
    def put(self):
        # 获取医生所在科室
        user = self.objUserInfo
        sql="select hd.id,hd.name,hd.his_id from public.doctor d,public.hospital_dept hd "
        sql+="where d.account_id=%s and d.dept_id=hd.id"%(user['id'])
        cur=self.db.getCursor()
        cur.execute(sql)
        rows = cur.fetchall() 
        rowdata={}
        rowdata['struct']="id,name,his_id"
        rowdata['rows']=rows        
        self.response(rowdata)
        
    @operator_except
    def delete(self):
        #获取医生下一个门诊id
        user = self.objUserInfo
        start=time.strftime("%Y-%m-%d",time.localtime(time.time()))
        startStr=start+" 00:00:00"
        endStr=start+" 23:59:59"
        cur=self.db.getCursor()        
        sql="select id from public.remote_consultation where apply_code='%s' and apply_doctor='%s' and "%(user['hospital_code'],user['his_id'])
        sql+="status in('1','2') and consultation_time>='%s' and consultation_time<='%s' order by consultation_time desc"%(startStr,endStr)
        cur.execute(sql)                    
        rows=cur.fetchall()   
        if rows:
            id=rows[0][0] 
        else:
            id=0        
        self.response(id)
    
    @operator_except
    def patch(self):
        #获取医生当天的患者数量，当前排队数量，已完成数量
        user = self.objUserInfo
        start=time.strftime("%Y-%m-%d",time.localtime(time.time()))
        startStr=start+" 00:00:00"
        endStr=start+" 23:59:59"
        cur=self.db.getCursor()
        #获取当天总数
        sql="select count(*) from public.remote_consultation where apply_code='%s' and apply_doctor='%s' and "%(user['hospital_code'],user['his_id'])
        sql+="status in('1','2','3') and consultation_time>='%s' and consultation_time<='%s'"%(startStr,endStr)
        cur.execute(sql)                    
        row=cur.fetchone()  
        data={}
        data['allnum']=row[0]
        #获取当前完成数
        sql="select count(*) from public.remote_consultation where apply_code='%s' and apply_doctor='%s' and "%(user['hospital_code'],user['his_id'])
        sql+="status='3' and consultation_time>='%s' and consultation_time<='%s'"%(startStr,endStr)    
        cur.execute(sql)                    
        row=cur.fetchone()  
        data['completenum']=row[0]        
        #获取当前排队数量
        sql="select count(*) from public.remote_consultation where apply_code='%s' and apply_doctor='%s' and "%(user['hospital_code'],user['his_id'])
        sql+="status in('1','2') and consultation_time>='%s' and consultation_time<='%s'"%(startStr,endStr)    
        cur.execute(sql)                    
        row=cur.fetchone()  
        data['queuenum']=row[0]     
        #获取下一个排队的id
        #sql="select id from public.remote_consultation where apply_code='%s' and apply_doctor='%s' and "%(user['hospital_code'],user['his_id'])
        #sql+="status in('1','2') and consultation_time>='%s' and consultation_time<='%s' order by consultation_time desc"%(startStr,endStr)
        #cur.execute(sql)                    
        #rows=cur.fetchall()   
        #if len(rows)>1:
        #    data['next_id']=rows[1][0] 
        #else:
        #    data['next_id']=0
        self.response(data)










