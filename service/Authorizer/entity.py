#coding:utf-8
import sys
from BioTornado import dbMysql
from BioTornado.baseException import errorDic,BaseError

class Authorizer(dbMysql.CURD) :
    def __init__(self,db) :
        if sys.version > '3':
            # python 3.0 +
            super().__init__(db,'public.authorizer',False) # 定义本实例需要操作的表名
        else :
            # python 2.7
            super(Authorizer,self).__init__(db,'public.authorizer',False)