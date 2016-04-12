#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Menuadmin import entity
import time
from operation_log.entity import operation_log,LOG_ADD,LOG_UPDATE,LOG_DELETE 

class Restful(WebRequestHandler):
    @operator_except
    def post(self):
        # 取POST Form提交的数据
        alldata = self.getRequestData()
        inst = entity.Menuadmin(self.db)
        user = self.objUserInfo['name']
        #先删除所有
        inst.remove(alldata['user_id'],table="system.menu_authority_relation",key='user_id',delete=True)
        #再循环插入
        #if not alldata['items']:
         #   raise BaseError(801)
        ids=0
        for menu_item_id in alldata['items']:
            lstData = {
                'menu_item_id':menu_item_id,
                'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),           
                'user_id':alldata['user_id'],
                'create_id':alldata['create_id']
            }            
            id = inst.save(lstData,table='system.menu_authority_relation')
            if id <= 0:
                raise BaseError(703)  #参数错误 
            ids+=1
        cur=self.db.getCursor()
        cur.execute("select name from public.account where id=%s"%alldata['user_id'])
        rows = cur.fetchall()
        oc=rows[0][0]      
        operation_log(self.db).addLog(alldata['create_id'],alldata['hospital_code'],'menus_aut_user',"%s给用户%s授予菜单权限"%(user,oc),alldata['user_id'])
        #msg=Message(self.db)
        #msg.addMsg(alldata['hospital_code'], alldata['hospital_code'],"%s给用户%s授予菜单权限"%(user,oc))
        self.response(ids)    
    
    @operator_except
    def get(self):   
        #获取菜单树形结构
        hoscode=self.get_argument("hoscode", default='')#医院code
        uid=self.get_argument('uid',default='')#用户id
        if hoscode and uid:
            types=self.choosetype(hoscode)
            cur=self.db.getCursor()
            sql="select mis.*,mar.id from (select m.pid,m.cid,mi.id iid,m.pname,m.cname,mi.type,m.psort,m.csort from "
            sql+="(select pm.id pid,cm.id cid,pm.name pname,cm.name cname,pm.sort psort,cm.sort csort from (select id,code,name,sort from system.menu where tier=0)pm, "
            sql+="(select id,code,name,parent_id,sort from system.menu where tier=1)cm where pm.id=cm.parent_id) m, "
            sql+="system.menu_item mi where mi.menu_id=m.cid and mi.type in(%s)) mis left join "
            sql+="(select *from system.menu_authority_relation where user_id=%s)mar on mis.iid=mar.menu_item_id order by mis.psort,mis.csort"
            sql=sql%(types,uid)
            print(sql)
            cur.execute(sql)
            rows = cur.fetchall() 
            #print(rows)
            if not rows:
                raise BaseError(802) # 未找到数据
            #将元组转为树形结构
            tree=self.createTree(rows,'pid','pname',0)
            for obj in tree:
               for thobj in obj['children']:
                  for foobj in thobj['children']:
                      thobj['checked']=foobj['checked']
                      thobj['id']=foobj['id']
                      thobj['chkDisabled']=False
            #删除三级菜单
            for obj in tree:
               for thobj in obj['children']:
                   thobj.pop('children')

            #print(tree);
            self.response(tree)
        else:
            raise BaseError(801)  #参数错误
    
    #生成树结构     
    def createTree(self,rows,area,area_name,index):
        if not rows:
            return []
        li=[]
        #先按级别分组
        if area=="pid" or area=="cid":
            tempRow=rows[0]
            tempRows=[]
            length=len(rows)
            for i in range(length):
                row=rows[i]
                if i==0 and i!=(length-1):
                    tempRows=[]
                    tempRows.append(row)
                elif tempRow[index]!=row[index]:
                    li.append(tempRows)
                    tempRows=[]
                    tempRow=row
                    tempRows.append(row)                     
                    if i==(length-1):
                        li.append(tempRows)
                elif i==(length-1):
                    tempRows.append(row)
                    li.append(tempRows)
                    tempRows=[]
                else:
                    tempRows.append(row)
        else:
            li=rows
        #生成该级对象
        tree=[]
        for group in li:
            node={}
            if area=="pid":
                node['chkDisabled']=True
                node['open']=True
                node['checked']=False
                node['name']=group[0][3]
                node['id']=group[0][0]
                node['children']=self.createTree(group, "cid", "cname",1)
            elif  area=="cid":
                node['chkDisabled']=True
                node['open']=True
                node['checked']=False    
                node['name']=group[0][4]
                node['id']=group[0][1]
                node['children']=self.createTree(group, "iid", "type",2)
            else:
                node['chkDisabled']=False
                node['open']=False
                node['children']=[]
                if group[5]==0:
                    node['name']='中心医院'
                elif group[5]==1:
                    node['name']='加盟医院'
                elif group[5]==2:
                    node['name']='不区分版'                
                else:
                    node['name']='病友版本'
                
                node['id']=group[2]
                if group[8]:
                    node['checked']=True
                else:
                    node['checked']=False
            tree.append(node)
        return tree
    
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
                    
                        










