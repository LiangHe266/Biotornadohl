#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Meun_ag_manage import entity
import time
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE 
class Restful(WebRequestHandler):
    # 查询权限组基本信息

    @operator_except
    def get(self):
        s=entity.Meun_ag_manage(self.db)
        autname=self.get_argument("search", default='')
        offset   = int(self.get_argument("o",default='1'))
        rowcount = int(self.get_argument("r",default='10'))
        code=self.get_argument("code",default='')
        offset=(offset-1)*rowcount
        sql1=""
        if autname:
            sql1=" and a.name like '%"+autname+"%'"
            
        else:
            pass
        
        sql="select a.id,a.name,b.name create_name,c.name hospital_name,a.create_time from "
        sql+="system.menu_authority_group a left join public.account b on a.create_id=b.id, public.hospital_info c "
        sql+="where c.code='%s' and b.status='0' and a.hospital_code=c.code %s order by a.create_time desc LIMIT %s OFFSET %s"%(code,sql1,rowcount,offset)
        cur=self.db.getCursor()
        cur.execute(sql)
        rows = cur.fetchall() 
        rowdata={}
        #rowdata=s.find(cond,table='system.menu_authority_group a left join public.hospital_account b on a.create_id=b.id, public.hospital_info c')
        rowdata['struct']="id,name,create_name,hospital_name,create_time"
        rowdata['rows']=rows
        sql="select count(*) from system.menu_authority_group a left join public.account b on a.create_id=b.id, public.hospital_info c "
        sql+="where c.code='%s' and a.hospital_code=c.code %s"%(code,sql1)
        cur.execute(sql)
        row = cur.fetchone() 
        rowdata['count']=row[0]
        self.response(rowdata)
   
    @operator_except
    def post(self):
        # 取POST Form提交的数据
        objdata = self.getRequestData()
        s = entity.Meun_ag_manage(self.db)
        cur=self.db.getCursor()
        cur.execute("select count('id') from  system.menu_authority_group where name='%s' and hospital_code='%s'" %(objdata['name'],objdata['hospital_code']))
        rows = cur.fetchall()
        su=rows[0][0]
        if su:
            raise BaseError(891)
        lstData = {
            'create_id':'create_id',
            'name':'name',           
            'create_time':'create_time',
            'hospital_code':'hospital_code'
        }
        data = {}
        for (k, v) in lstData.items():
            try:
                if k == 'hospital_code' or k == 'name':
                    if objdata[v]=="" or objdata[v] is None:
                        raise BaseError(801)
                    data[k] = objdata[v]
                elif k=="create_time":
                    try:
                        data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
                    except Exception as ex:
                        print(ex)                  
                else :
                    data[k]=objdata[v]
            except:
                pass
        if data is None or data == {}:
            raise BaseError(801)  #参数错误
    
        id =s.save(data,table='system.menu_authority_group')
        if id <= 0:
            raise BaseError(703)  #参数错误 
        if not self.objUserInfo :
            raise BaseError(604)
        name = self.objUserInfo['name']
        #msg=Message(self.db)
        #msg.addMsg(objdata['hospital_code'], objdata['hospital_code'], "%s新增了一个菜单权限组:%s"%(name,objdata['name']))
        operation_log(self.db).addLog(objdata['create_id'],objdata['hospital_code'],'menus_aut_group_manage',"新增了一个菜单权限组:%s"%objdata['name'],id)
        self.response(id)
        
    @operator_except
    def put(self):
        # 取POST Form提交的数据
        objdata = self.getRequestData()
        s = entity.Meun_ag_manage(self.db)
        lstData = {
            'update_id':'update_id',
            'name':'name',           
            'update_time':'update_time'
        }
        data = {}
        for (k, v) in lstData.items():
            try:
                if k == 'update_id' or k == 'name':
                    if objdata[v]=="" or objdata[v] is None:
                        raise BaseError(801)
                    data[k] = objdata[v]
                elif k=="update_time":
                    try:
                        data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
                    except Exception as ex:
                        print(ex)                  
                else :
                    data[k] = objdata[v]
            except:
                pass
        if data is None or data == {}:
            raise BaseError(801)  #参数错误
    
        id =s.save(data,objdata['id'],table='system.menu_authority_group')
        if id <= 0:
            raise BaseError(703)  #参数错误
        if not self.objUserInfo :
            raise BaseError(604)
        name = self.objUserInfo['name']

        #msg=Message(self.db)
        #msg.addMsg(objdata['hospital_code'], objdata['hospital_code'], "%s新增了一个菜单权限组:%s"%(name,objdata['name'])) 
        operation_log(self.db).addLog(objdata['update_id'],objdata['hospital_code'],'menus_aut_group_manage',"修改了一个菜单权限组:%s"%objdata['name'],objdata['id'])
        self.response(id)
        
    @operator_except
    def delete(self):
        objdata = self.getRequestData()
        s = entity.Meun_ag_manage(self.db)
        cur=self.db.getCursor()
        cur.execute("select name from SYSTEM.MENU_AUTHORITY_GROUP where id=%s"%objdata['id'])
        rows = cur.fetchall() 
        oc=rows[0][0]
        r=s.remove(objdata['id'],delete=True)
        s.remove(objdata['id'],table="system.menu_authority_relation_group",key="menu_group_id",delete=True)
        s.remove(objdata['id'],table="system.menu_authority_group_relation",key="group_id",delete=True)
        if not self.objUserInfo :
            raise BaseError(604)
        name = self.objUserInfo['name']
        #msg=Message(self.db)
        #msg.addMsg(objdata['hospital_code'], objdata['hospital_code'], "%s删除了一个菜单权限组:%s"%(name,oc))
        operation_log(self.db).addLog(objdata['uid'],objdata['hospital_code'],'menus_aut_group_manage',"删除了一个菜单权限组:%s"%oc,objdata['id'])
        self.response(r)
                    
                        










