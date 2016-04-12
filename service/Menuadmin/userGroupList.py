#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Menuadmin import entity
import time
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE 

class Restful(WebRequestHandler):
    
    @operator_except
    def get(self):
        #获取该医院的账号信息
        offset   = int(self.get_argument('o',default='1'))
        rowcount = int(self.get_argument('r',default='10'))
        hoscode = self.get_argument('hoscode',default='')
        search = self.get_argument('search',default='')    
        offset=(offset-1)*rowcount
        if search:
            search=" and (ha1.name like '%"+search+"%' or ha1.user_name like '%"+search+"%')"
        cur=self.db.getCursor()
        sql="select ha1.id,ha1.user_name,ha1.hospital_code,ha1.name,ha1.type,d.name type_name from public.account ha1 left join system.code_value d on ha1.type=d.code inner join system.code_type e on d.type_id=e.id and e.code='ACCOUNT_TYPE' and e.status='1'where ha1.hospital_code='%s' %s and ha1.status='0'  order by ha1.id desc LIMIT %s OFFSET %s"% (hoscode,search,rowcount,offset)
        #print(sql)
        cur.execute(sql)
        rows = cur.fetchall()
        data={}
        data['rows']=rows
        data['struct']="id,user_name,hospital_code,name,type,type_name"
        #获取数量
        cur.execute("select count(*) from public.account ha1 where ha1.hospital_code='%s' "
                    "and ha1.status='0' %s"% (hoscode,search));
        rows = cur.fetchone()
        data['count']=rows[0]
        self.response(data)
    
    @operator_except
    def post(self):
        # 取所有权限组
        alldata = self.getRequestData()
        inst = entity.Menuadmin(self.db)
        code=alldata['hos_code'];
        cur=self.db.getCursor()
        sql="select mag.id,mag.name,ha.name create_name,hi.name hospital_name,mag.create_time from system.menu_authority_group mag left join "
        sql+="public.account ha on mag.create_id=ha.id,public.hospital_info hi where hi.code='%s' and mag.hospital_code=hi.code order by mag.id asc"%(code)
        cur.execute(sql)
        rows = cur.fetchall()   
        data={}
        data['rows']=rows
        data['struct']="id,name,create_name,hospital_name,create_time"        
        self.response(data)
        
    @operator_except
    def patch(self):
        #获取用户已有权限组
        alldata = self.getRequestData()
        uid=alldata['uid'];
        inst = entity.Menuadmin(self.db)
        con={
            'select':'group_id',
            'where':'user_id=%s'%(uid)
        }
        data=inst.find(con,table="system.menu_authority_group_relation");
        self.response(data)
    
    @operator_except
    def put(self):
        # 取POST Form提交的数据
        alldata = self.getRequestData()
        inst = entity.Menuadmin(self.db)
        #先删除所有
        inst.remove(alldata['user_id'],table="system.menu_authority_group_relation",key='user_id',delete=True)
        #再循环插入
        #if not alldata['groups']:
        #    raise BaseError(801)
        ids=0
        for group_id in alldata['groups']:
            lstData = {
                'group_id':group_id,
                'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),           
                'user_id':alldata['user_id'],
                'create_id':alldata['update_id']
            }            
            id = inst.save(lstData,table='system.menu_authority_group_relation')
            if id <= 0:
                raise BaseError(703)  #参数错误 
            ids+=1
        operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'menus_aut_group_manage',"给用户授予菜单权限组",alldata['user_id'])#'menus_aut_user_group'
        self.response(ids)    
    
        
    




