#coding:utf-8
import BioTornado.Base
import Seq
import Login
import Menu
import Menuadmin
import Meun_ag_manage
import tm
import Accountmanage
import operation_log
import Notification
import Main_ac_manage
import User
import Case_learn
import Upload
import blast 
import data_mining
import Study_case
import graphics
import sequence


from Seq import list                   # 省市级联
from Login import login,heartbeat       # 登录
from Login import logout				# 注销
from Menu import list           #菜单表
from Menuadmin import list                   #菜单管理表
from Menuadmin import itemList           #菜单项
from Menuadmin import file           #文件测试
from Menuadmin import userGroupList           #菜单组用户
from Accountmanage import list          #账户管理
from Accountmanage import passList          #账户管理密码修改
from Accountmanage import infoList          #账户管理信息修改
from Meun_ag_manage import list          #菜单组权限管理
from Meun_ag_manage import agmlist       #菜单组权限管理确权
from Menuadmin import userMenu    #菜单权限管理
from operation_log import list   #操作日志
from operation_log import searchlist    #操作日志
from operation_log import operatylist   #操作日志
from Notification import todoList
from Notification import msgList
from Main_ac_manage import list         #加盟医院主账号管理
from Main_ac_manage import passList         #加盟医院主账号管理密码修改
from graphics import list
from User import patient
from Case_learn import centerList    #案例学习
from Case_learn import Ue_ImageUp    #案例学习百度编辑器图片上传
from Case_learn import case_examine  #案例学习审批



from Upload import list
from sequence import list
from tm import query
from tm import list
from tm import doclist
from blast import list         #blast模块
from data_mining import list  #数据挖掘模型模块
from Study_case import centerList 
from Study_case import case_detail,case_reject,case_modify,case_recommend
handlers = [

    (r"/mdt/tm/query", tm.query.Restful), 
    (r"/mdt/tm/list", tm.list.Restful), 
    (r"/mdt/tm/doclist", tm.doclist.Restful), 
    (r"/mdt/upload", Upload.list.Restful),    
    #省市级联
    (r"/mdt/seq", Seq.list.Restful),


    #登录
    (r"/mdt/logout", Login.logout.Handle),
    (r"/mdt/login/(.*)/(.*)", Login.login.Handle),
    (r"/mdt/login/heartbeat", Login.heartbeat.Handle),
    
    
    #菜单表
    (r"/mdt/Menu", Menu.list.Restful),
    (r"/mdt/Menuadmin", Menuadmin.list.Restful),
    (r"/mdt/Menuadmin/menuItem", Menuadmin.itemList.Restful),
    (r"/mdt/Menuadmin/userGroup", Menuadmin.userGroupList.Restful),
    (r"/mdt/Menuadmin/userMenu", Menuadmin.userMenu.Restful),
    (r"/mdt/file_test/(.*)", Menuadmin.file.Restful),#文件获取
    (r"/upload", Menuadmin.file.Restful),#文件上传
    #账户管理
    (r"/mdt/Accountmanage", Accountmanage.list.Restful),
    #账户管理密码修改
    (r"/mdt/Accountmanage/Accountmanage_pass", Accountmanage.passList.Restful),
    #账户管理信息修改
    (r"/mdt/Accountmanage/Accountmanage_info", Accountmanage.infoList.Restful),    



   
    #加盟医院主账号管理
    (r"/mdt/Main_ac_manage", Main_ac_manage.list.Restful),
    #加盟医院主账号管理密码修改
    (r"/mdt/Main_ac_manage/Main_ac_manage_pass", Main_ac_manage.passList.Restful),
   

    #菜单组权限管理
    (r"/mdt/Meun_ag_manage",Meun_ag_manage.list.Restful),
    (r"/mdt/Meun_ag_manage/meunag",Meun_ag_manage.agmlist.Restful),

  
    #操作日志
    (r"/mdt/operation_log", operation_log.list.Restful),
    (r"/mdt/search", operation_log.searchlist.Restful),
    (r"/mdt/operaty", operation_log.operatylist.Restful),
    (r"/mdt/Notification/todo", Notification.todoList.Restful),
    (r"/mdt/Notification/message", Notification.msgList.Restful),  
    (r"/mdt/user/patient", User.patient.Handler),
    
    
    
    #案例学习
    (r"/mdt/Case_learn/center", Case_learn.centerList.Restful),
    #案例学习百度编辑器图片上传
    (r"/mdt/Case_learn/Ue_ImageUp", Case_learn.Ue_ImageUp.Restful),
    #案例学习审批
    (r"/mdt/Case_learn/case_examine", Case_learn.case_examine.Restful),
    #blast模块

    (r"/mdt/blast", blast.list.Restful),
    (r"/mdt/datamining", data_mining.list.Restful),
    
    (r"/mdt/Study_case/search", Study_case.centerList.Restful),
    (r"/mdt/Study_case/detail", Study_case.case_detail.Restful),
    (r"/mdt/Study_case/reject", Study_case.case_reject.Restful),
    (r"/mdt/Study_case/modify", Study_case.case_modify.Restful),
    (r"/mdt/Study_case/recommend", Study_case.case_recommend.Restful),

    #我的患者
    (r"/mdt/sequence", sequence.list.Restful),
  

    #加盟医院信息管理
    (r"/mdt/graphics", graphics.list.Restful),


  

    
    (r".*", BioTornado.Base.Base404Handler),
    



]

