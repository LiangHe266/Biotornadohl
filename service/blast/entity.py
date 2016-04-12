#coding:utf-8
import sys
from BioTornado import dbMysql
from BioTornado.baseException import errorDic,BaseError

class blast(dbMysql.CURD) :
    def __init__(self,db) :
        if sys.version > '3':
            # python 3.0 +
            super().__init__(db,'public.doctor',False) # 定义本实例需要操作的表名
        else :
            # python 2.7
            super(blast,self).__init__(db,'public.doctor',False)
