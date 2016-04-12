#coding:utf-8
errorDic={
        900 : {
                "code": "900",
                "status": 500,
                "message": "未被定义的错误类型",
                "help_document": "/oauth/v1.0.0/help/900"
        },
        601: {
            "code": "601",
            "status":401,
            "message": "未经过JctOAuth授权的第三方应用",
            "help_document": "/oauth/v1.0.0/help/601"
        },
        602: {
            "code": "602",
            "status":401,
            "message": "未登录授权的应用",
            "help_document": "/oauth/v1.0.0/help/602"
        },
        603: {
            "code": "603",
            "status":404,
            "message": "无法识别的用户名",
            "help_document": "/oauth/v1.0.0/help/603"
        },
        605: {
            "code": "605",
            "status":404,
            "message": "账号被禁用",
            "help_document": "/oauth/v1.0.0/help/605"
        },
        606: {
            "code": "606",
            "status":404,
            "message": "密码不正确",
            "help_document": "/oauth/v1.0.0/help/606"
        },              
        604: {
            "code": "604",
            "status":404,
            "message": "未授权的访问",
            "help_document": "/oauth/v1.0.0/help/604"
        },
        607 : {
            "code": "607",
            "status": 404,
            "message": "验证码错误",
            "help_document": "/oauth/v1.0.0/help/607"
        },        
        701: {
              "code": "701",
              "status":500,
              "message": "数据库连接失败",
              "help_document": "/oauth/v1.0.0/help/701"
        },
        702: {
                      "code": "702",
                      "status":500,
                      "message": "无法从链接池中获得数据库连接",
                      "help_document": "/oauth/v1.0.0/help/702"
        },        
        703: {
              "code": "703",
              "status":500,
              "message":"SQL 语句执行失败(I)",
              "help_document":"/oauth/v1.0.0/help/703"
        },
        704: {
              "code": "704",
              "status":500,
              "message":"SQL 语句执行失败(D)",
              "help_document":"/oauth/v1.0.0/help/704"
        },
        705: {
              "code": "705",
              "status":500,
              "message":"SQL 语句执行失败(U)",
              "help_document":"/oauth/v1.0.0/help/705"
        },
        706: {
              "code": "706",
              "status":500,
              "message":"SQL 语句执行失败(S)",
              "help_document":"/oauth/v1.0.0/help/706"
        },
        707: {
              "code": "707",
              "status":500,
              "message":"SQL 语句执行失败(C)",
              "help_document":"/oauth/v1.0.0/help/707"
        },
        801: {
              "code": "801",
              "status":400,
              "message":"转录失败，参数错误",
              "help_document":"/o2b/v1.0.0/help/801"
        },
        802 : {
            "code": "802",
            "status":404,
            "message":"翻译失败，参数错误",
            "help_document":"/o2b/v1.0.0/help/802"
        },
        803 : {
                    "code": "803",
                    "status":404,
                    "message":"修改数据失败",
                    "help_document":"/o2b/v1.0.0/help/803"
        }, 
        804 : {
            "code": "804",
            "status":404,
            "message":"fna文件与gbk文件不能混选",
            "help_document":"/o2b/v1.0.0/help/803"
        }, 
        805 : {
            "code": "805",
            "status":404,
            "message":"用户已存在",
            "help_document":"/o2b/v1.0.0/help/805"
        },   
        806 : {
            "code": "806",
            "status":404,
            "message":"该数据权限组已存在",
            "help_document":"/o2b/v1.0.0/help/806"
        },  
        807 : {
            "code": "807",
            "status":404,
            "message":"该菜单编码已存在",
            "help_document":"/o2b/v1.0.0/help/807"
        },    
        808 : {
            "code": "808",
            "status":404,
            "message":"该菜单已存在该类菜单项，无法重复添加",
            "help_document":"/o2b/v1.0.0/help/808"
        },  
        809 : {
            "code": "809",
            "status":404,
            "message":"文件上传失败",
            "help_document":"/o2b/v1.0.0/help/808"
        }, 
        851 : {
            "code": "851",
            "status":404,
            "message":"BLAST系统忙请多次尝试",
            "help_document":"/o2b/v1.0.0/help/851"
        }, 
        852 : {
            "code": "852",
            "status":404,
            "message":"训练失败，参数个数不一致",
            "help_document":"/o2b/v1.0.0/help/852"
        },    
        853 : {
            "code": "853",
            "status":404,
            "message":"计算机失败，参数数目不一致",
            "help_document":"/o2b/v1.0.0/help/853"
        },
        854 : {
            "code": "854",
            "status":404,
            "message":"计算机失败",
            "help_document":"/o2b/v1.0.0/help/854"
        },              
        811 : {
            "code"          : "811",
            "status"        : 400,
            "message"       : "未知的图片格式（从文件后缀上判断）",
            "help_document" : "/o2b/v1.0.0/help/811"
        },
        812 : {
                    "code"          : "812",
                    "status"        : 400,
                    "message"       : "未知的图片格式",
                    "help_document" : "/o2b/v1.0.0/help/811"
        },        
        813 : {
            "code"          : "813",
            "status"        : 400,
            "message"       : "值得怀疑的图片(非法图片格式)",
            "help_document" : "/o2b/v1.0.0/help/812"
        },
        814 : {
            "code"          : "814",
            "status"        : 400,
            "message"       : "图片长宽超界",
            "help_document" : "/o2b/v1.0.0/help/814"
        },
        815 : {
            "code"          : "815",
            "status"        : 404,
            "message"       : "没有找到图片",
            "help_document" : "/o2b/v1.0.0/help/815"
        },
        816 : {
            "code"          : "816",
            "status"        : 400,
            "message"       : "文件存贮失败！",
            "help_document" : "/o2b/v1.0.0/help/816"
        },
        819 : {
            "code"          : "819",
            "status"        : 400,
            "message"       : "文件大小超过限制！",
            "help_document" : "/o2b/v1.0.0/help/819"
        },        
        817 : {
            "code"          : "817",
            "status"        : 400,
            "message"       : "文件移动失败！",
            "help_document" : "/o2b/v1.0.0/help/817"
        },  
        818 : {
            "code"          : "818",
            "status"        : 400,
            "message"       : "发送消息失败！",
            "help_document" : "/o2b/v1.0.0/help/818"
        },
        823 : {
            "code"          : "823",
            "status"        : 400,
            "message"       : "插入数据失败!(redis)",
            "help_document" : "/o2b/v1.0.0/help/823"
        }, 
        890 : {
            "code"          : "890",
            "status"        : 400,
            "message"       : "读 Config.json 配置文件失败！",
            "help_document" : "/o2b/v1.0.0/help/890"            
        },
        891 : {
            "code"          : "891",
            "status"        : 400,
            "message"       : "权限组名称不能相同！",
            "help_document" : "/o2b/v1.0.0/help/891"            
        }
}


# _version_ = 0.2.0
# 新增strErrorNMessage参数，传递原始的错误信息

class BaseError(Exception) :
    def __init__(self,code,strErrorMessage='') :
        self.code=code
        self.message = strErrorMessage
    
    def __str__(self) :
        return repl(self.code)


