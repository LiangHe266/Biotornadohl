#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Menuadmin import itemEntity
import time
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE 

class Restful(WebRequestHandler):
    
    # 获取菜单项
    @operator_except
    def get(self):
        id = self.get_argument("id",default='')
        if id=='':
            raise BaseError(801)
        cur=self.db.getCursor()
        cur.execute('select mi.*,a.name create_name from "system".menu_item mi left join "public".account a '
	            'on mi.create_id=a.id where mi.menu_id=%s'% (id))
        rows = cur.fetchall()
        rowdata={}
        rowdata['rows']=rows;
        rowdata['struct']='id,menu_code,create_time,update_time,create_id,update_id,menu_id,type,path,create_name';
        self.response(rowdata)
    
    @operator_except
    def post(self):
        # 取POST Form提交的数据
        alldata = self.getRequestData()
        inst = itemEntity.MenuItem(self.db)
        #先查看该菜单项类型是否存在
        cur=self.db.getCursor()
        cur.execute("select id from system.menu_item where type=%s and menu_id=%s"% (alldata['type'],alldata['menu_id']))
        if cur.fetchall():
            raise BaseError(808)  #以存在
        
        rows = []
        lstData = {
            'menu_code':'menu_code',         
            'create_id':'create_id',
            'create_time':'create_time',
            'menu_id':'menu_id',
            'type':'type',
            'path':'path'
        }
        data = {}
        for (k, v) in lstData.items():
            try:
                if k == 'menu_id' or k == 'type':
                    if alldata[v]=="" or alldata[v] is None:
                        raise BaseError(801)
                    data[k] = alldata[v]
                elif k=="create_time":
                    try:
                        data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
                    except Exception as ex:
                        print(ex)                  
                else :
                    data[k] = alldata[v]
            except:
                pass
        
        if data is None or data == {}:
            raise BaseError(801)  #参数错误
        id = inst.save(data, table='system.menu_item')
        if id <= 0:
            raise BaseError(703)  #参数错误 
        operation_log(self.db).addLog(alldata['create_id'],alldata['hospital_code'],'edit_menu_item',"添加菜单项："+alldata['menu_code'],id)
        self.response(id) 
        
    @operator_except
    def put(self):
        # 取POST Form提交的数据
        alldata = self.getRequestData()
        inst = itemEntity.MenuItem(self.db)
        #先查看该菜单项类型是否存在
        id=alldata['id']
        cur=self.db.getCursor()
        cur.execute("select id from system.menu_item where type=%s and menu_id=%s and id<>%s"% (alldata['type'],alldata['menu_id'],id))
        if cur.fetchall():
            raise BaseError(808)  #以存在
        
        rows = []
        lstData = {
            'menu_code':'menu_code',         
            'update_id':'update_id',
            'update_time':'update_time',
            'menu_id':'menu_id',
            'type':'type',
            'path':'path'
        }
        data = {}
        for (k, v) in lstData.items():
            try:
                if k == 'menu_id' or k == 'type':
                    if alldata[v]=="" or alldata[v] is None:
                        raise BaseError(801)
                    data[k] = alldata[v]
                elif k=="update_time":
                    try:
                        data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
                    except Exception as ex:
                        print(ex)   
                elif k=="update_id":
                    if alldata[v] is None:
                        pass
                    else : 
                        data[k] = alldata[v]                
                else :
                    data[k] = alldata[v]
            except:
                pass
        
        if data is None or data == {}:
            raise BaseError(801)  #参数错误
        id = inst.save(data,id,table='system.menu_item')
        if id <= 0:
            raise BaseError(703)  #参数错误 
        operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'edit_menu_item',"修改菜单项："+alldata['menu_code'],alldata['id'])
        self.response(id)    
    
    
    @operator_except
    def delete(self):
        alldata = self.getRequestData()
        e = itemEntity.MenuItem(self.db)
        r=e.remove(alldata['id'],delete=True)
        operation_log(self.db).addLog(alldata['uid'],alldata['hospital_code'],'edit_menu_item',"删除菜单项",alldata['id'])
        self.response(r)     
