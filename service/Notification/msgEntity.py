#coding:utf-8
import sys,datetime
from BioTornado import dbRedis,dbMysql

class Message(dbMysql.CURD) :
	def __init__(self, db) :
		if sys.version > '3':
			# python 3.0 +
			super().__init__(db,'public.message',False) # 定义本实例需要操作的表名
		else :
			# python 2.7
			super(Main_ac_manage,self).__init__(db,'public.message',False)

	# source_code, 源医院编码
	#source_id，发送人
	# target_id, 接受人id
	# context, 提示消息, 如: "xxx医院申请了yy业务"
	#top_status:消息置顶1表示置顶0表示否
	def addMsg(self,source_code,source_id,target_id,context,top_status):

		data = {};
		data['source_code'] = source_code;
		data['source_id'] = source_id;
		data['target_id'] = target_id;
		data['create_time'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S');
		data['context'] = context;
		data['top_status'] = top_status;
		data['status'] = 0;#未读

		return self.add(data);
	
	#给医院所有账号发消息
	def addMsgToHospital(self,source_code,source_id,target_code,context,top_status):
		create_time=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S');
		addsql="insert into public.message(source_code,target_id,create_time,context,status,top_status,source_id) "
		addsql+="select '%s',d.account_id,'%s','%s','0','%s',%s "%(source_code,create_time,context,top_status,source_id)
		addsql+="from public.doctor d where d.hospital_code='%s'"%(target_code)		
		cur=self.db.getCursor()
		cur.execute(sql)			
	
	#通过his_id获取账号id
	def getIdByHisForDoctor(self,his_id):
		sql="select a.id from public.account a,public.doctor d where d.his_id='%s' and a.id=d.account_id"%(his_id)
		cur=self.db.getCursor()
		cur.execute(sql)
		row = cur.fetchone() 	
		if row[0]:
			return row[0]
		else:
			return None

