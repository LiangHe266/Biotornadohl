from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Meun_ag_manage import entity
import time
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE
class Restful(WebRequestHandler):
    # 查询权限组基本信息
    @operator_except
    def get(self):
        s=entity.Meun_ag_manage(self.db)
        gid=self.get_argument("id",default='')
        hospital_code=self.get_argument("hospital_code",default='')
        ctype=self.choosetype(hospital_code)
        #print(ctype)
        #'''       
        cur=self.db.getCursor()
        cur.execute('select id,code,name,sort from "system".menu  where tier=0 order by sort')
        #cur.execute('select m.id,m.code,m.name,m.sort from (select m1.id,m1.code,m1.name,m1.tier,m1.sort from "system".menu m1 left join '
         #           '"system".menu m2 on m1.parent_id=m2."id") m where m.tier=0 order by m.sort')
        rows = cur.fetchall()
      
        #将所有元组转为对象,因为前台tree组件无法加载元组类型
        li=self.tupleToList(rows)
        
        for obj in li:
            cur.execute('select id,code,name,sort from "system".menu  where tier=1 and parent_id=%s order by sort'% (obj['id']))
            #cur.execute('select m.id,m.code,m.name,m.sort from (select m1.id,m1.code,m1.name,m1.tier,m1.sort ,m1.parent_id from "system".menu m1 left join '
             #       '"system".menu m2 on m1.parent_id=m2."id") m where m.tier=1 and m.parent_id=%s order by m.sort'% (obj['id']))
            rows = cur.fetchall()
            obj['children']=self.tupleToList(rows)
            
            #三级菜单
            for thobj in obj['children']:
                cur.execute('select id, type  from "system".menu_item where menu_id=%s and type in(%s)'%(thobj['id'],ctype)  )
                rows = cur.fetchall() 
                thobj['children']=self.tupleToList2(rows)
        cur.execute("select menu_item_id from system.menu_authority_relation_group where menu_group_id=%s"%gid)
        rows = cur.fetchall()
        #print(rows)        
        for obj in li:
            for thobj in obj['children']:
                for foobj in thobj['children']:
                    for k in rows:#判断第3层的checked
                        if foobj['id']==k[0]:
                            foobj['checked']=True
                            break
                        else:
                            foobj['checked']=False
        de=[]
        for obj in li:
            for thobj in obj['children']:
                if thobj['children']==[]:
                    de.append(thobj)
        #print(de)
        for i in de:
            for obj in li :
                try:
                    obj['children'].remove(i)
                except:
                    pass
        #确定二级菜单的'checked'，把三级菜单的id放入二级菜单。
        for obj in li:
           for thobj in obj['children']:
               for foobj in thobj['children']:
                   thobj['checked']=foobj['checked']
                   thobj['id']=foobj['id']
                   thobj['chkDisabled']=False
        #删除三级菜单
        for obj in li:
            for thobj in obj['children']:
                thobj.pop('children')

       
        self.response(li)
        #'''
    @operator_except
    def put(self):
        # 取POST Form提交的数据
        alldata = self.getRequestData()
        inst = entity.Meun_ag_manage(self.db)
        #先删除所有
        inst.remove(alldata['menu_group_id'],table="system.menu_authority_relation_group",key='menu_group_id',delete=True)
        #再循环插入
        #if not alldata['items']:
        #    raise BaseError(801)
        ids=0
        for menu_item_id in alldata['items']:
            lstData = {
                'menu_group_id':alldata['menu_group_id'],
                'create_id':alldata['create_id'],           
                'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
                'menu_item_id':menu_item_id                
                            }            
            id = inst.save(lstData,table='system.menu_authority_relation_group')
            if id <= 0:
                raise BaseError(703)  #参数错误 
            ids+=1
        cur=self.db.getCursor()
        cur.execute("select name from SYSTEM.MENU_AUTHORITY_GROUP where id=%s"%alldata['menu_group_id'])
        rows = cur.fetchall()
        oc=rows[0][0]
        if not self.objUserInfo :
            raise BaseError(604)
        name = self.objUserInfo['name']
        #msg=Message(self.db)
        #msg.addMsg(alldata['hospital_code'], alldata['hospital_code'], "%s修改了一个菜单权限组的菜单权限:%s"%(name,oc))
        operation_log(self.db).addLog(alldata['create_id'],alldata['hospital_code'],'menus_aut_group_manage',"修改了一个菜单权限组的菜单权限:%s"%oc,alldata['menu_group_id'])    
        self.response(ids)  
       
    def tupleToList(self,rows):
        li=[]
        for row in rows:
            obj={}
            obj['id']=row[0]
            obj['code']=row[1]
            obj['name']=row[2]
            obj['sort']=row[3]
            obj['children']=[]
            obj['chkDisabled']=True
            obj['open']=True
            obj['checked']=False
            li.append(obj)
        return li    
    def tupleToList2(self,rows):
        li=[]
        for row in rows:
            obj={}
            obj['id']=row[0]
            obj['chkDisabled']=False
            obj['checked']=False
            if row[1]==0:
                obj['name']='中心医院'
            elif row[1]==1:
                obj['name']='加盟医院'
            elif row[1]==2:
                obj['name']='不区分版'            
            else:
                obj['name']='病友版本'
            
            li.append(obj)
        return li 
    
    def choosetype(self,hospital_code):
        li=''
        cur=self.db.getCursor()
        cur.execute("select count(*) from public.hospital_relation  where franchisee_code='%s'"%hospital_code)
        row = cur.fetchall()
        j=row[0][0]
        if j :
            li='1,2'
        else:
            li='0,2'
        return li    
        
            