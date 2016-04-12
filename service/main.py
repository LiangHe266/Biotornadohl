#coding:utf-8
import os.path
import sys
import ssl

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.gen
from tornado.options import define, options

import logging
import route
import config

import BioTornado.dbMysql,BioTornado.dbRedis,config

from BioTornado.Base  import BaseError


define("port", default=config.App_Port, help="run port", type=int)

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "templates")
STATIC_PATH   = os.path.join(os.path.dirname(__file__), "static")


class MainHandler(tornado.web.RequestHandler):
	def get(self):
		raise tornado.web.HTTPError(404)

class MyFile(tornado.web.StaticFileHandler):
	def set_extra_headers(self, path):
		self.set_header("Cache-control", "no-cache")

class Application(tornado.web.Application):
	def __init__(self):
		dbConfig	   = config.DbConfig		# 得到 DB Config
		redisConfig	= config.RedisConfig	   # 得到 Redis Config

		settings = dict(						  # 得到模板及静态地址路径
			debug = config.DEBUG  #开启调试模式
		)

		if config.DEBUG :
			sys.stdout = sys.stderr

		handlers	= route.handlers											 # 注入路由
		tornado.web.Application.__init__(self, handlers, **settings)
		self.db  = BioTornado.dbMysql.DB(dbConfig)						 # 注入MySql/Oracle
		#self.rds = BioTornado.dbRedis.RedisCache(redisConfig)			  # 注入Redis

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.tornado import TornadoScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.events import EVENT_JOB_EXECUTED
from apscheduler.events import EVENT_JOB_ERROR
from datetime import datetime
import scheduler
from scheduler import scheduler

def consultation():
	sch=scheduler.Scheduler()
	sch.consultation()

def scheduler_listener(event):
	if event.exception:
		print('%s The job crashed :('% datetime.now())
	else:
		print('%s The job worked :)'% datetime.now())
def noticeUpdate():
	sch=scheduler.Scheduler()
	sch.noticeUpdate()
def timeout():
	sch=scheduler.Scheduler()
	sch.timeout()

def main():
	tornado.options.parse_command_line()
	app = tornado.httpserver.HTTPServer(Application())
	app.listen(options.port)
	scheduler = TornadoScheduler()
	consultationCron=CronTrigger(second='0',minute='*/15',hour='*') #每隔15分钟刷新一次
	scheduler.add_job(consultation,consultationCron) #添加任务

	noticeUpdateCron=CronTrigger(second='0',minute='0',hour='8') #
	scheduler.add_job(noticeUpdate,noticeUpdateCron) #添加任务

	timeoutCron=CronTrigger(second='0',minute='30',hour='23') #
	scheduler.add_job(timeout,timeoutCron) #添加任务

	scheduler.add_listener(scheduler_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR) #调度运行监听
	scheduler.start() #启动调度
	tornado.ioloop.IOLoop.instance().start()#启动服务

def sslMain():
	#if config.DEBUG :
	#	logging.basicConfig(filename=config.LOG_FILENAME,format=config.LOG_FORMAT,datefmt='%y-%m-%d %H:%M:%S',level=logging.DEBUG)

	#tornado.options.options.logging = "debug"  #注意parse_command_line(默认层级为info)对logging层级的影响
	tornado.options.parse_command_line()
	app = tornado.httpserver.HTTPServer(Application(),ssl_options={
		   "certfile": os.path.join(os.path.abspath("./"), "CA/120.25.124.115.crt"),
		   "keyfile": os.path.join(os.path.abspath("./"), "CA/120.25.124.115.key"),
		})
	app.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
	if config.App_SSL :
		sslMain()
	else :
		main()
