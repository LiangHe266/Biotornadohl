#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Menuadmin import entity
import re
import time
import os
import urllib
import json

class Restful(WebRequestHandler):
    #文件获取测试
    @operator_except
    def get(self,filename):
        #Content-Type这里我写的时候是固定的了，也可以根据实际情况传值进来
        self.set_header ('Content-Type', 'application/octet-stream')
        self.set_header ('Content-Disposition', 'attachment; filename='+filename)
        upload_path=self.getUploadPath()
        filename=os.path.join(upload_path,filename)
        #读取的模式需要根据实际情况进行修改
        buf_size=1024
        with open(filename, 'rb') as f:
            while True:
                data = f.read(buf_size)
                if not data:
                    break
                self.write(data)
        #记得有finish哦
        self.finish()   
        
    # 文件上传测试
    @operator_except
    def post(self):
        #接受回复消息
        #sms_reply=self.request.body.decode('utf-8')
        #print(sms_reply)
    
        fname=self.get_argument('file_name')
        #print(sms_reply)
        file_content_type=self.get_argument('file_content_type')
        #print(sms_reply)   
        fileUrl=self.get_argument('file_path')
        #print(sms_reply)     
        file_size=self.get_argument('file_size')
        #print(sms_reply) 

        data = {
                "file_name" : fname,
                "path" : fileUrl,
                "file_content_type":file_content_type,
                "file_size":file_size
    
            }
          
        #sms_reply=self.get_argument('name')
        #print(sms_reply)           
        '''upload_path=self.getUploadPath()
        formname=self.get_argument('name')#获取表单的其他参数
        #提取表单中‘name’为‘file’的文件元数据
        file_metas=self.request.files['file']  
        data={}
        for meta in file_metas:
            filename=meta['filename']
            if len(meta['body'])>4194304:#文件大于4M则不允许上传
                #raise BaseError(819)
                data['code']=1
                data['message']="文件大于4M则不允许上传"                
            else:
                timeStamp = int(time.time())
                name=str(timeStamp)+'.'+filename.split('.').pop()#生成新的文件名
                filepath=os.path.join(upload_path,name)
                #有些文件需要已二进制的形式存储，实际中可以更改
                with open(filepath,'wb') as up:      
                    up.write(meta['body'])
                data['code']=0
                data['message']="文件上传成功"
        '''
        self.response(data)
                
    
    def getUploadPath(self):
        #获取文件保存路径
        cut_path=os.path.dirname(__file__)#获取当前py文件目录
        parent_path = os.path.dirname(cut_path) #上级路径unionhospital/hospital/trunk/service
        parent_path=os.path.dirname(parent_path) #上级路径unionhospital/hospital/trunk
        upload_path=os.path.join(parent_path,'files') #文件保存目录unionhospital/hospital/trunk/files
        if not os.path.exists(upload_path): #文件夹不存在则创建
            os.makedirs(upload_path)
        return upload_path
        
     




