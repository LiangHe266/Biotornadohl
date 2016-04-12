#coding:utf-8
import os


App_Port   = 85
App_Key    = 'fb98ab9159f51fd2'
App_Secret = '09f7c8cba635f7616bc131b0d8e25947s'
App_SSL    = False

UserAuthTimeout		= 3600
UserAuthOneSession	= False

Default_Header='header_boy.jpg'

Administrator='test@163.com'

MiniUserDataBase=os.path.join(os.path.abspath("./"), "auth.db")
#大文件上传端口
url= "192.168.1.10"
ser="5555"

smtp_163_server = {
    'smtp.server' : 'smtp.163.com',
    'username'    : 'jct_sender',
    'password'    : 'jct_sender2013'
}

smtp_qq_server ={
    'smtp.server' : '',
    'username'    : '',
    'password'    : ''
}

EmailConfig={
    'server'  : smtp_163_server,
    'fromAdd' : 'jct_sender@163.com',
    'logo'    : '/image/logo.jpg',
    'content_verification' : '',
    'subject_verification' : '智戴网注册确认邮件',
}

# www.sms.com SMS API
www_sms_com_API = {
    'vender'    : 'sms.com',
    'url'       : 'http://api.sms.cn/mtutf8/',
    'method'    : 'GET',
    'arguments_Record' : {   # 已备案账号
        'uid'       : 'jetcloudtech',
        'pwd'       : '2cb1097237d74363f70db9c55cb36fc9',  # pwd=md5('Admin2013jetcloudtech') 即md5(密码+用户名)
        'mobile'    : '',
        'content'   : ''
    },
    'arguments' : {
            'uid'       : 'jctadmin',   #未备案账号
            'pwd'       : 'a4659ff67fd595fbdb59b7e9f16af830',  # pwd=md5('Admin2014jctadmin') 即md5(密码+用户名)
            'mobile'    : '',
            'content'   : ''
    },
    'status': {
        '100' : '发送成功',
        '101' : '验证失败',
        '102' : '短信不足',
        '103' : '操作失败',
        '104' : '非法字符',
        '105' : '内容过多',
        '106' : '号码过多',
        '107' : '频率过快',
        '108' : '号码内容空',
        '109' : '账号冻结',
        '110' : '禁止频繁单条发送',
        '112' : '号码不正确',
        '120' : '系统升级'
    }
}

SMSConfig={
    'api'          : www_sms_com_API,
    'verification' : '您的验证码是%s。请在页面中提交验证码完成验证。【优安鲜品】'
    #'verification' : '检验码：%s，检验码仅限本人使用，请勿泄漏，感谢您的注册。【智穿戴】'
    #'verification' : '检验码：%s，检验码仅限本人使用，请勿泄漏，感谢您的注册。【智悲德育】'
}

# pool_size 最大32
MySqlConfig = {
  'pool_name'         : 'dbpool',
  'pool_size'         : 16,
  'user'              : 'root',
  'password'          : '123456',
  'host'              : '192.168.1.210',
  'database'          : 'o2b',
  'raise_on_warnings' : True,
  'datatype'          : 'MYSQL'
}

#OracleDbConfig = {
    #'user'      : 'system',
    #'password'  : 'manage',
    #'dsn'       : '192.168.1.230/ckd',
    #'min'       : 16,
    #'max'       : 32,
    #'increment' : 1,
    #'datatype'  : 'ORACLE',
    #'NLS_LANG'  : 'AMERICAN_AMERICA.AL32UTF8'  # NLS_LANG 必须是大写
#}

OracleDbConfig = {
    'user'      : 'system',
    'password'  : 'manage',
    'dsn'       : '192.168.128.22:36889/orcl',
    'min'       : 16,
    'max'       : 32,
    'increment' : 1,
    'datatype'  : 'ORACLE',
    'NLS_LANG'  : 'AMERICAN_AMERICA.AL32UTF8'  # NLS_LANG 必须是大写
}

PostgresqlDbConfig = {
    'minconn'   : 1,
    'maxconn'   : 20,
    'host'      : 'localhost',
    'database'  : 'biology',
    'user'      : 'kesin',
    'password'  : 'heliang',
    'port'      :  5432,
    'datatype'  : 'POSTGRESQL'
}

AppRedisConfig={
    'host'     : 'localhost',
    'port'     : 6379,
    'db'       : 12,
   # 'password' : '123456'
}

DcmConfig = {
    'host'	: '192.168.1.60',
    'port'	: 11112,
    'aec'	: 'DCM4CHEE',
    'qureyConfig' : '192.168.1.60 11112 -aec DCM4CHEE',
    'revConfig' : '-aem GETDCM2 --port 23456'
}

DbConfig    = PostgresqlDbConfig

RedisConfig = AppRedisConfig
#RedisConfig = None



TableToRedisNo={
    'tbProductList':'08',
    'tbAdSense' : '09',
    'tbMsg'     : '10',
    'tbUser'    : '12'
}


imageRootPath='/var/www/o2b/v1.0.0/app'
imageConfig={
    'product.*' : {
        'path' : imageRootPath+'/images/products',
        'url'  : '/images/products',
        'long' : 2560,
        'wide' : 900,
        'size' : 4*1024*1024
    },
    'product.detail' : {
        'path' : imageRootPath+'/images/products/detail',
        'url'  : '/images/products/detail',
        'long' : 2560,
        'wide' : 900,
        'size' : 4*1024*1024
    },
    'product.banner' : {
        'path' : imageRootPath+'/images/products',
        'url'  : '/images/products',
        'long' : 2560,
        'wide' : 450,
        'size' : 4*1024*1024
    },
    'product.large' : {
            'path' : imageRootPath+'/images/products',
            'url'  : '/images/products',
            'long' : 468,
            'wide' : 224,
            'size' : 2*1024*1024
    },
    'product.medium' : {
            'path' : imageRootPath+'/images/products',
            'url'  : '/images/products',
            'long' : 223,
            'wide' : 165,
            'size' : 1*1024*1024
    },
    'product.small' : {
            'path' : imageRootPath+'/images/products',
            'url'  : '/images/products',
            'long' : 60,
            'wide' : 60,
            'size' : 1*512*1024
    },
    'order.returns' : {
            'path' : imageRootPath+'/images/returns',
            'url'  : '/images/returns',
            'long' : 1920,
            'wide' : 1080,
            'size' : 2*1024*1024
        },
    'userheader'  : {
        'path' : imageRootPath+'/images/header',
        'url'  : '/images/header',
        'long' : 80,
        'wide' : 80,
        'size' : 1*512*1024
        },
    'groupheader'  : {
        'path' : imageRootPath+'/images/group/header',
        'url'  : '/images/group/header',
        'long' : 80,
        'wide' : 80,
        'size' : 1*512*1024
        },
    'group'  : {
        'path':imageRootPath+'/images/group',
        'url'  : '/images/group',
        'long':100,
        'wide' : 100,
        'size' : 4*1024*1024
    },
    'news'  : {
        'path':imageRootPath+'/images/news',
        'url'  : '/images/news',
        'long' :1024,
        'wide' :768,
        'size' : 4*1024*1024
    },
    'temp' : {
        'path':imageRootPath+'/images/tmp',
        'url' :'/images/tmp/{yyyy}{mm}{dd}'
    },
    'imageFileType': ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/bmp', 'image/png', 'image/x-png']
}

DEBUG = True
LOG_FILENAME = os.path.join(os.path.abspath('./logs/'), 'o2b.log')
LOG_FORMAT   = '%(filename)s [%(asctime)s] [%(levelname)s] %(message)s'
