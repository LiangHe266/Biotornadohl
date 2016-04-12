#coding:utf-8
import time
import datetime
import logging
import psycopg2
import config
from config import PostgresqlDbConfig


class Scheduler():
    #测试使用
    def test1(self):
        print('1111111111111111111111111111111111111111111')
    #获取数据库连接
    def getConn(self):
        try:
            #conn=psycopg2.connect(database="hospitalmanager", user="postgres", password="postgres", host="192.168.10.32", port="5432");
            conn=psycopg2.connect(database=PostgresqlDbConfig['database'], user=PostgresqlDbConfig['user'], 
                                  password=PostgresqlDbConfig['password'], host=PostgresqlDbConfig['host'], 
                                  port=PostgresqlDbConfig['port']);
            return conn
        except Exception as e:
            logging.error('获取数据库连接失败:%s' % e)
    
    #日志写入
    def addlog(self,context):
        conn = self.getConn()
        if not conn:
            return  
        cur = conn.cursor();         
        createTime=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        sql="insert into public.operation_log (create_time,operation_context) "
        sql+="values('%s','%s') "   
        sql=sql%(createTime,context)
        try:
            cur.execute(sql)
            conn.commit()
        except Exception as e:
            conn.rollback()   #如果出错，则事务回滚
            logging.error('数据写入失败:%s' % e)
        finally:
            logging.info(sql)
            cur.close()
            conn.close()            
        
    def noticeUpdate(self):
        #每天早上8:00，查看明天是否存在例行会议，发短信通知创建人修改
        conn = self.getConn()
        if not conn:
            return  
        cur = conn.cursor();          
        sms=SMS()
        #获取明天日期
        today = datetime.date.today() 
        today=today + datetime.timedelta(days=1)
        dayStr=today.strftime("%Y-%m-%d") 
        startStr=dayStr+" 00:00:00"
        endStr=dayStr+" 23:59:59"
        #获取申请人
        sql="select d.account_id,d.phone,d.name,mc.consultation_name,d.hospital_code from public.multidisciplinary_consultation mc,public.doctor d "
        sql+="where mc.create_type='1' and mc.consultation_time>='%s' and mc.consultation_time<='%s' "%(startStr,endStr)
        sql+=" and mc.apply_code=d.hospital_code and mc.apply_doctor=d.his_id"
        try:
            cur.execute(sql)
            ids=cur.fetchall()   
            if ids:
                sms=SMS()
                for row in ids:
                    #发送短信
                    
                    pass
                
        except Exception as e:
            conn.rollback()   #如果出错，则事务回滚
            logging.error('数据写入失败:%s' % e)
            self.addlog("定任务发送短信提醒修改例行会诊信息失败：%s"% e)
        finally:
            cur.close()
            conn.close()             
        
    def consultation(self):
        #每15分钟执行一次，将多学科会诊中已确认的改为会诊中
        conn = self.getConn()
        if not conn:
            return  
        cur = conn.cursor(); 
        
        dateStr=time.strftime("%Y-%m-%d",time.localtime(time.time())) 
        createTime=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        today = datetime.datetime.now()
        start=today-datetime.timedelta(minutes=1)#之前一分钟
        end=today+datetime.timedelta(minutes=16)#之后16分钟
        start=start.strftime("%Y-%m-%d %H:%M:%S")
        end=end.strftime("%Y-%m-%d %H:%M:%S")
        sql="update public.multidisciplinary_consultation set status='2' where status='1' and "
        sql+="consultation_time>='%s' and consultation_time<='%s' returning id,consultation_name,apply_code,apply_doctor,type"%(start,end) 
        logging.info(sql)
        try:
            cur.execute(sql)
            ids=cur.fetchall()
            if ids:
                #插入消息
                for row in ids:
                    #通知所有签到的医生
                    context='多学科会诊“'+row[1]+'”已开始，请准时参加'
                    type=""
                    if row[4]=='0':
                        type="INNER_CONSULTATION"
                    elif row[4]=='1':
                        type="REMOTE_CONSULTATION"
                        
                    #获取所有签到医生
                    sql="select d.account_id,d.phone,d.hospital_code,d.his_id,mr.name,mr2.name "
                    sql+="from public.multidisciplinary_consultation_doctor mcd inner join public.doctor d on "
                    sql+="(mcd.hospital_code=d.hospital_code and mcd.doctor=d.his_id) "
                    sql+="inner join public.multidisciplinary_consultation mc on mcd.consultation_id=mc.id "
                    sql+="left join public.meeting_room mr on mc.room_id=mr.id "
                    sql+="left join public.meeting_room mr2 on mc.center_room_id=mr2.id "
                    sql+="where mcd.consultation_id=%s and mcd.status='0' "%(row[0])                  
                    
                    logging.info(sql)
                    cur.execute(sql)
                    docs=cur.fetchall()
                    #获取申请医生
                    sql="select d.account_id from public.doctor d where d.hospital_code='%s' and d.his_id='%s'"%(row[2],row[3])
                    logging.info(sql)
                    cur.execute(sql)
                    apply=cur.fetchone()                    
                    if docs:
                        for doc in docs:
                            docContext=context
                            if doc[4]:
                                docContext+=",会议地点："+doc[4]
                            if doc[5]:
                                docContext+=",中心医院会议地点："+doc[5]
                            addsql="insert into public.wait_handle(source_code,source_id,target_id,create_time,context,operation_id,page_id,type) "
                            addsql+="values ('%s',%s,%s,'%s','%s',%s,'mdt','%s')"%(row[2],apply[0],doc[0],createTime,docContext,row[0],type)
                            logging.info(addsql)
                            cur.execute(addsql) 
                            #发送短信
                
                self.addlog("任务更新多学科会诊状态成功“会诊中”")
             
            #将远程门诊中的排队中的改为会诊中
            sql="update public.remote_consultation set status='2' where status='1' and "
            sql+="consultation_time>='%s' and consultation_time<='%s' returning id,"%(start,end)
            sql+="consultation_name,apply_code,apply_doctor,patient_hospital_code,patient"
            logging.info(sql)
            cur.execute(sql)
            ids=cur.fetchall() 
            if ids:
                #插入消息
                for row in ids:
                    context='远程门诊“'+row[1]+'”以开始，请准时参加'
                    #获取医生id
                    sql="select account_id,phone from public.doctor where hospital_code='%s' and his_id='%s'"%(row[2],row[3])
                    logging.info(sql)
                    cur.execute(sql)
                    doc=cur.fetchall() 
                    #获取患者id
                    sql="select account_id,phone from public.patient where hospital_code='%s' and id_no='%s'"%(row[4],row[5])
                    cur.execute(sql)
                    pat=cur.fetchall()  
                    if doc and pat:
                        addsql="insert into public.wait_handle(source_code,source_id,target_id,create_time,context,operation_id,page_id,type) "
                        addsql+="values ('%s',%s,%s,'%s','%s',%s,'tm','OUT_PATIENT')"
                        #患者待办
                        addsql1=addsql%(row[2],doc[0][0],pat[0][0],createTime,context,row[0])
                        logging.info(addsql1)
                        cur.execute(addsql1)
                        #医生待办
                        addsql2=addsql%(row[4],pat[0][0],doc[0][0],createTime,context,row[0])
                        logging.info(addsql2)
                        cur.execute(addsql2)                        
                    #发送短信
            
                self.addlog("任务更新远程门诊状态成功“会诊中”")                
            conn.commit()
        except Exception as e:
            conn.rollback()   #如果出错，则事务回滚
            logging.error('数据写入失败:%s' % e)
            self.addlog("定任务更新会议状态失败：%s"% e)
        finally:
            cur.close()
            conn.close()
            
    def auditWaitHandle(self):
        #获取当天有那些例行需要审批的，为管理员发送待办
        
        pass
    
    #超时的会诊未结束则自动作废        
    def timeout(self):
        #时间每天晚11:30
        conn = self.getConn()
        if not conn:
            return  
        cur = conn.cursor();          
        today = datetime.date.today() 
        start=today + datetime.timedelta(days=-7)
        dayStr=today.strftime("%Y-%m-%d") 
        startStr=start.strftime("%Y-%m-%d") 
        startStr=startStr+" 00:00:00"
        
        endStr=dayStr+" 23:59:59"
        sql="update public.multidisciplinary_consultation set status='5' where consultation_time>='%s' and consultation_time<='%s' and status in('0','1','2','6') returning id"%(startStr,endStr)
        try:
            logging.info(sql)
            cur.execute(sql)
            ids=cur.fetchall()  
            if ids:
                #删除待办事务
                idstr=""
                for id in ids:
                    idstr+=","+str(id[0])
                idstr=idstr[1:]
                #print(idstr)
                cur.execute("delete from public.wait_handle where operation_id in(%s) and page_id in('mdt','mdtDetail','mdtUpdate','mdtAdminDetail')" % (idstr))                
            
            sql="update public.remote_consultation set status='3' where consultation_time>='%s' and consultation_time<='%s' returning id"%(startStr,endStr)
            logging.info(sql)
            cur.execute(sql)
            ids=cur.fetchall()  
            if ids:
                #删除待办事务
                idstr=""
                for id in ids:
                    idstr+=","+str(id[0])
                idstr=idstr[1:]
                #print(idstr)
                cur.execute("delete from public.wait_handle where operation_id in(%s) and page_id in('tmDetail','tm')" % (idstr))                            
            conn.commit()
        except Exception as e:
            conn.rollback()   #如果出错，则事务回滚
            logging.error('数据写入失败:%s' % e)
            self.addlog("作废过时会诊/门诊失败：%s"% e)
        finally:
            cur.close()
            conn.close()        
        pass
    
    #获取下周起始日期
    def getNextWeek(self):
        today = datetime.date.today() 
        week=today.weekday()
        start=None
        if week==0:#周一
            start = today + datetime.timedelta(days=7)#获取下周一日期
        elif week==1:
            start = today + datetime.timedelta(days=6)
        elif week==2:
            start = today + datetime.timedelta(days=5)
        elif week==3:
            start = today + datetime.timedelta(days=4)
        elif week==4:
            start = today + datetime.timedelta(days=3)  
        elif week==5:
            start = today + datetime.timedelta(days=2)  
        elif week==6:
            start = today + datetime.timedelta(days=1)          
        end=start+datetime.timedelta(days=6)#下周末日期    
        startStr=start.strftime("%Y-%m-%d")#开始日期字符串
        endStr=end.strftime("%Y-%m-%d")#结束日期字符串     
        nextWeek={}
        nextWeek['startStr']=startStr
        nextWeek['endStr']=endStr
        return nextWeek
    
    #获取本周起始日期
    def getNowWeek(self):
        today = datetime.date.today() 
        week=today.weekday()
        start=None
        if week==0:#周一
            start = today
        elif week==1:
            start = today - datetime.timedelta(days=1)
        elif week==2:
            start = today - datetime.timedelta(days=2)
        elif week==3:
            start = today - datetime.timedelta(days=3)
        elif week==4:
            start = today - datetime.timedelta(days=4)  
        elif week==5:
            start = today - datetime.timedelta(days=5)  
        elif week==6:
            start = today - datetime.timedelta(days=6)          
        end=start+datetime.timedelta(days=6)#周末日期    
        startStr=start.strftime("%Y-%m-%d")#开始日期字符串
        endStr=end.strftime("%Y-%m-%d")#结束日期字符串     
        nextWeek={}
        nextWeek['startStr']=startStr
        nextWeek['endStr']=endStr
        return nextWeek        
        

