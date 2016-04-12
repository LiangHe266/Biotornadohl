#coding:utf-8
import sys
from BioTornado import dbMysql
from BioTornado.baseException import errorDic,BaseError
import time

LOG_ADD="增添了记录"
LOG_UPDATE="修改了记录"
LOG_DELETE="删减了记录"

class operation_log(dbMysql.CURD) :
    def __init__(self,db) :
        if sys.version > '3':
            # python 3.0 +
            super().__init__(db,'PUBLIC.OPERATION_LOG',False) # 定义本实例需要操作的表名
        else :
            # python 2.7
            super(operation_log,self).__init__(db,'PUBLIC.OPERATION_LOG',False)
    
    #添加日志,使用方法参考数据权限list.py
    def addLog(self,operator_id,hospital_code,menu_code,operation_context,operation_id,operation_no=""):
        if not operator_id or not hospital_code or not menu_code or not operation_context:
            raise BaseError(801)
        
        lstData = {
            'operator_id':operator_id,
            'hospital_code':hospital_code,           
            'menu_code':menu_code,             
            'operation_context':operation_context,               
            'operation_id':operation_id,                   
            'create_time':time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),
            'operation_no':operation_no
        }
        
        id = self.save(lstData, table='public.operation_log')
        if id <= 0:
            raise BaseError(703)
        return True   
    
    #添加日志
    def addLog2(self,logData):
        if not logData['operator_id'] or not logData['hospital_code'] or not logData['menu_code'] or not logData['operation_context'] or not logData['operation_id']:
            raise BaseError(801)
                      
        logData['create_time']=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        id = self.save(logData, table='public.operation_log')
        if id <= 0:
            raise BaseError(703)
        return True      
        