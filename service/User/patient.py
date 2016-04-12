from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Accountmanage import entity
import time
import datetime
import random
from User import user

class Handler(WebRequestHandler):
    
    @operator_except
    def get(self):
        cur=self.db.getCursor()
        sql="select a.id,a.user_name,a.pass,a.status,a.create_time,p.id_no,p.phone,p.his_id,cv.name status_name "
        sql+="from public.account a inner join public.patient p on a.id=p.account_id left join "
        sql+="(select *from system.code_value where type_code='HOSPITAL_ACCOUNT_STATUS' and status='1')cv on a.status=cv.code "
        sql+="where "
        
    @operator_except    
    def post(self): 
        #患者注册
        #alldata = self.getRequestData()
        s=entity.Accountmanage(self.db)
        phone=self.get_argument("phone", default='')
        user_name=self.get_argument("user_name", default='')
        pwd=self.get_argument("pass", default='')
        name=self.get_argument("name", default='')
        id_no=self.get_argument("id_no", default='')
        ver_code=self.get_argument("ver_code", default='')
        #print(ver_code)
        #验证码
        #u = user.user();
        #strcode=u.getVerificationCode(phone); 
        #strcode=str(strcode)
        #print(strcode)
        #if not strcode or strcode!=ver_code:
        #    raise BaseError(607)#验证码错误
        
        cur=self.db.getCursor()
        cur.execute("select id from public.account where user_name='%s'"% (user_name))
        if cur.fetchall():
            raise BaseError(804)  #code已存在        
        data={}
        data['user_name']=user_name
        data['pass']=pwd
        data['type']=1
        data['account_type']=1
        data['status']=0
        data['name']=name
        data['hospital_code']=self.get_argument("hos_id", default='')
        data['create_time']=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        id=s.save(data,table='public.account')
        
        data={}
        data['id_no']=id_no
        data['phone']=phone
        data['name']=name
        data['create_time']=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data['account_id']=id
        data['hospital_code']=self.get_argument("hos_id", default='')
        data['sex']=self.get_argument("sex", default='')
        data['address']=self.get_argument("address", default='')
        data['description']=self.get_argument("description", default='')
        id=s.save(data,table='public.patient')    
        self.response(id)
        
    @operator_except    
    def put(self):  
        #验证账号
        user_name=self.get_argument("user_name", default='')
        cur=self.db.getCursor()
        cur.execute("select id from public.account where user_name='%s'"% (user_name))
        if cur.fetchall():
            self.response(1)  #code已存在             
        self.response(0)
        
    @operator_except
    def patch(self):
        #短信验证
        phone=self.get_argument("phone", default='')
        sms=SMS()
        #获取验证码
        strcode=self.verificationcode();
        #缓存到redis中
        u = user.user();
        u.setVerificationCode(phone, strcode);  
        #text="【极感科技】您的验证码是"+strcode+"。如非本人操作，请忽略本短信"
        #查账户信息
        #print(sms.get_user_info())
        #调用智能匹配模版接口发短信
        #data=sms.send_sms( text, phone)
        #code为状态值
        #code==0发送成功
        #code>0调用API时发生错误，需要开发者进行相应的处理。错误描述:msg。详情：detail
        #code>-50&&code <= -1权限验证失败，需要开发者进行相应的处理。错误描述:msg。详情：detail
        #code<=-50系统内部错误，请联系技术支持，调查问题原因并获得解决方案。错误描述:msg。详情：detail
        
        #调用模板接口发短信
        tpl_id = 2 #对应的模板内容为：您的验证码是#code#【#company#】
        
        tpl_value ='#company#=远程会诊系统'+'&#code#='+strcode
        data=sms.tpl_send_sms(tpl_id, tpl_value, phone)
        print(data)        
        if data['code']==0:
            data['msg']=strcode
            self.response(data);
        else:
            #返回错误信息
            self.response(data);
    
    def verificationcode(self):
        #随机生成6为验证码
        codes=random.sample('0123456789',6)
        str=""
        for code in codes:
            str+=code
        return str
    
        
        
       
