#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Menuadmin import entity
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE 
import time

class Restful(WebRequestHandler):
    # 获取菜单树形列表
    
    @operator_except
    def get(self):
        #获取所有以及目录
        cur=self.db.getCursor()
        cur.execute('select m.*,a.name create_name,a2.name update_name from (select m1.*,m2."name" parent_name from "system".menu m1 left join '
                    '"system".menu m2 on m1.parent_id=m2."id") m left join "public".account a on m.create_id=a."id"  '
                    "left join public.account a2 on m.update_id=a2.id "
                    'where m.tier=0 order by m.sort')
        rows = cur.fetchall()
        #print(len(rowData['rows']));
        #将所有元组转为对象,因为前台tree组件无法加载元组类型
        li=self.tupleToList(rows)
        #分组菜单
        for obj in li:
            cur.execute('select m.*,a.name create_name,a2.name update_name from (select m1.*,m2."name" parent_name from "system".menu m1 left join '
                        '"system".menu m2 on m1.parent_id=m2."id") m left join "public".account a on m.create_id=a."id"  '
                        "left join public.account a2 on m.update_id=a2.id "
                        'where m.tier=1 and m.parent_id=%s order by m.sort'% (obj['id']))            
            rows = cur.fetchall()
            obj['children']=self.tupleToList(rows)
        self.response(li)
    
    @operator_except
    def post(self):
        # 取POST Form提交的数据
        alldata = self.getRequestData()
        inst = entity.Menuadmin(self.db)
        #先查看code是否存在
        cur=self.db.getCursor()
        cur.execute("select id from system.menu where code='%s'"% (alldata['code']))
        if cur.fetchall():
            raise BaseError(807)  #code以存在
        
        rows = []
        lstData = {
            'code':'code',
            'name':'name',           
            'sort':'sort',             
            'tier':'tier',               
            'parent_id':'parent_id',                   
            'parent_code':'parent_code',          
            'create_id':'create_id',
            'create_time':'create_time'
        }
        data = {}
        for (k, v) in lstData.items():
            try:
                if k == 'code' or k == 'name':
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
        id = inst.save(data, table='system.menu')
        if id <= 0:
            raise BaseError(703)  #参数错误 
        operation_log(self.db).addLog(alldata['create_id'],alldata['hospital_code'],'edit_menu',"添加菜单:"+alldata['name'],id)
        self.response(id)
    
    @operator_except
    def put(self):
        # 取POST Form提交的数据
        alldata = self.getRequestData()
        inst = entity.Menuadmin(self.db)
        #先查看code是否存在
        id=alldata['id']
        cur=self.db.getCursor()
        cur.execute("select id from system.menu where code='%s' and id<>%s"% (alldata['code'],id))
        if cur.fetchall():
            raise BaseError(807)  #code以存在        
        rows = []
        lstData = {
            'code':'code',
            'name':'name',           
            'sort':'sort',             
            'tier':'tier',               
            'parent_id':'parent_id',                   
            'parent_code':'parent_code',          
            'update_id':'update_id',
            'update_time':'update_time'
        }
        data = {}
        for (k, v) in lstData.items():
            try:
                if k == 'code' or k == 'name':
                    if alldata[v]=="" or alldata[v] is None:
                        raise BaseError(801)
                    data[k] = alldata[v]
                elif k=="update_time":
                    try:
                        data[k]=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
                    except Exception as ex:
                        print(ex)
                elif k=="update_id" or k=="parent_id" or k=="parent_code":
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
        id = inst.save(data,id, table='system.menu')
        if id <= 0:
            raise BaseError(703)  #参数错误 
        operation_log(self.db).addLog(alldata['update_id'],alldata['hospital_code'],'edit_menu',"修改菜单："+alldata['name'],alldata['id'])
        self.response(id)    
    
    @operator_except
    def delete(self):
        alldata = self.getRequestData()
        e = entity.Menuadmin(self.db)  
        r=e.remove(alldata['id'],delete=True)
        #删除下一级菜单
        e.remove(alldata['id'],key='parent_id',delete=True)
        if r<=0:
            raise BaseError(703)
        operation_log(self.db).addLog(alldata['uid'],alldata['hospital_code'],'edit_menu',"删除菜单",alldata['id'])
        self.response(r) 
        
        
    def tupleToList(self,rows):
        li=[]
        for row in rows:
            obj={}
            obj['id']=row[0]
            obj['code']=row[1]
            obj['name']=row[2]
            obj['sort']=row[3]
            obj['create_time']=row[4]
            obj['update_time']=row[5]
            obj['create_id']=row[6]
            obj['update_id']=row[7]
            obj['tier']=row[8]
            obj['parent_id']=row[9]
            obj['parent_code']=row[10]
            obj['parent_name']=row[11]
            obj['create_name']=row[12]
            obj['update_name']=row[13]
            obj['children']=[]
            li.append(obj)
        return li    
    




