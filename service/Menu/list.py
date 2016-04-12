#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Menu import entity
import time

class Restful(WebRequestHandler):
    # 获取用户菜单
    @operator_except
    def get(self):
        uid=self.get_argument('uid',default='')#用户id
        account_type=self.get_argument('account_type',default='')
        if uid:
            if account_type=='0':#医生
                cur=self.db.getCursor()
                sql="select mis.* from (select m1.id pid,m1.name pname,m1.code pcode,m2.id cid,m2.name cname,m2.code ccode,mi.id,mi.type,mi.path,m1.sort psort,m2.sort csort "
                sql+="from (select *from system.menu where tier=0) m1,(select *from system.menu where tier=1) m2,system.menu_item mi "
                sql+="where m1.id=m2.parent_id and mi.menu_id=m2.id) mis, "
                sql+="((select distinct(marg.menu_item_id) from system.menu_authority_group_relation magr,system.menu_authority_relation_group marg "
                sql+="where magr.user_id=%s and marg.menu_group_id=magr.group_id) union "
                sql+="(select mar.menu_item_id from system.menu_authority_relation mar where mar.user_id=%s)) mii "
                sql+="where mis.id=mii.menu_item_id order by mis.psort,mis.csort "
                sql=sql%(uid,uid)
                #print(sql)
                cur.execute(sql)
                rows = cur.fetchall() 
                if not rows:
		    #如果没有菜单，判断该用户是否为主账号，如果为主账号获取所有菜单
                    sql="select id,hospital_code from public.account where id=%s and type='0'"%(uid)
                    cur.execute(sql)
                    user = cur.fetchall() 		
                    if not user:
                        raise BaseError(802) # 未找到数据
                    else:
			#获取医院拥有的菜单类型
                        types=self.choosetype(user[0][1])
                        sql="select mis.* from (select m.pid,m.pname,m.pcode,m.cid,m.cname,m.ccode,mi.id iid,mi.type,mi.path,m.psort,m.csort from "
                        sql+="(select pm.id pid,pm.code pcode,cm.id cid,pm.name pname,pm.sort psort,cm.sort csort,cm.name cname,cm.code ccode from (select id,code,name,sort from system.menu where tier=0)pm, "
                        sql+="(select id,code,name,parent_id,sort from system.menu where tier=1)cm where pm.id=cm.parent_id) m, "
                        sql+="system.menu_item mi where mi.menu_id=m.cid and mi.type in(%s)) mis "
                        sql+="order by mis.psort,mis.csort"
                        sql=sql%(types)
                        cur.execute(sql)
                        rows = cur.fetchall() 		    
            else:
                #print("111111111111111111111111111111111111")
                cur=self.db.getCursor()
                sql="select mis.* from (select m.pid,m.pname,m.pcode,m.cid,m.cname,m.ccode,mi.id iid,mi.type,mi.path,m.psort,m.csort from "
                sql+="(select pm.id pid,pm.code pcode,cm.id cid,pm.name pname,pm.sort psort,cm.sort csort,cm.name cname,cm.code ccode from (select id,code,name,sort from system.menu where tier=0)pm, "
                sql+="(select id,code,name,parent_id,sort from system.menu where tier=1)cm where pm.id=cm.parent_id) m, "
                sql+="system.menu_item mi where mi.menu_id=m.cid and mi.type in(3)) mis "
                sql+="order by mis.psort,mis.csort"
                cur.execute(sql)
                rows = cur.fetchall() 		
	    #将元组转为树形结构
            tree=self.createTree(rows,'pid','pname',0)
	    #print(tree);
            self.response(tree)	    
        else:
            raise BaseError(801)  #参数错误		

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
                node['name']=group[0][1]
                node['id']=group[0][0]
                node['children']=self.createTree(group, "cid", "cname",3)
            elif  area=="cid":    
                node['name']=group[0][4]
                node['id']=group[0][3]
                node['children']=self.createTree(group, "id", "type",6)
            else:
                node['children']=[]
                if group[7]==0:
                    node['name']='中心医院'
                elif group[7]==1:
                    node['name']='加盟医院'
                elif group[7]==2:
                    node['name']='不区分版'		
                else:
                    node['name']='病友版本'
                node['id']=group[6]
                node['path']=group[8]
            tree.append(node)
        return tree

