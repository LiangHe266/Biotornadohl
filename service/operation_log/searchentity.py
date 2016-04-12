#coding:utf-8
import sys
from BioTornado import dbMysql
from BioTornado.baseException import errorDic,BaseError

class operation_log(dbMysql.CURD) :
    def __init__(self,db) :
        if sys.version > '3':
            # python 3.0 +
            super().__init__(db,'PUBLIC.ACCOUNT',False) # 定义本实例需要操作的表名
        else :
            # python 2.7
            super(operation_log,self).__init__(db,'PUBLIC.ACCOUNT',False)