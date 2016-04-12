#coding:utf-8
import sys,datetime
from BioTornado import dbRedis,dbMysql

class Todo(dbMysql.CURD) :
	def __init__(self, db) :
		if sys.version > '3':
			# python 3.0 +
			super().__init__(db,'public.wait_handle',False) # 定义本实例需要操作的表名
		else :
			# python 2.7
			super(Main_ac_manage,self).__init__(db,'public.wait_handle',False)

	# source_code, 源医院编码
	# target_id, 接受者ID
	# page_id, 当前操作所属菜单编码，在网页的"系统管理"->"菜单管理" 可以看到每个菜单项的"菜单编码"
	# context, 待办内容描述, 如: "xxx医院申请了yy业务"
	# operation_id, 关联的数据库表条目的id, 比如"xx申请业务"的申请业务条目id,用于前端显示对应的数据
	def addTodo(self, source_code, target_id, page_id, context, operation_id,source_id,type_name):

		data = {};
		data['source_code'] = source_code;
		data['target_id'] = target_id;
		data['create_time'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S');
		data['page_id'] = page_id;
		data['context'] = context;
		data['operation_id'] = operation_id;
		data['source_id'] = source_id;
		data['type'] = type_name;

		return self.add(data);
	def addTodoToHospital(self, source_code,target_code, page_id, context, operation_id,source_id,type_name):
		create_time=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S');
		addsql="insert into public.wait_handle(source_code,create_time,page_id,context,operation_id,target_id,source_id,type) "
		addsql+="select '%s','%s','%s','%s',%s,d.account_id,%s,'%s'"%(source_code,create_time,page_id,context,operation_id,source_id,type_name)
		addsql+="from public.doctor d where d.hospital_code='%s'"%(target_code)		
		cur=self.db.getCursor()
		cur.execute(sql)		

	# operation_id, 待办事项相关ID
	# page_id, 当前操作所属菜单编码
	def delTodo(self, operation_id, page_id,target_id):

		cur = self.db.getCursor()
		cur.execute("delete from public.wait_handle where operation_id=%s and page_id='%s' and target_id=%s" % (operation_id, page_id,target_id))

		return cur.rowcount >= 0
	def delTodo2(self, operation_id, page_id):
	
		cur = self.db.getCursor()
		cur.execute("delete from public.wait_handle where operation_id=%s and page_id='%s'" % (operation_id, page_id))
	
		return cur.rowcount >= 0	

	# todo_id, 待办事项ID
	def delTodoById(self, todo_id):
		conf = {
			"id" : todo_id
		}
		return self.remove(todo_id, table="public.wait_handle", key="id", delete=True)



