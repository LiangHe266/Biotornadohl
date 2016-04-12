#coding:utf-8
# Unicorn 专用

class Token():
    def __init__(self,config):
        pass
        #self.r  = redis.Redis(**config)
        #self.pr = self.r.pipeline()
        
    def saveToRedis(self,token,uid,timeout=36000) :
        pass
        
    def getUser(self,token) :
        return null
        #return self.r.get(token)
    

    def delUser(self,token) :
        pass
        #return self.r.delete(token)