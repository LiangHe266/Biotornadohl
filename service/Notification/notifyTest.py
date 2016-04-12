from BioTornado.Base  import WebRequestHandler,BaseError,operator_except

from Notification.msgEntity import Message
from Notification.todoEntity import Todo

class Restful(WebRequestHandler):

	@operator_except
	def get(self):

		print('test start')

		#test add msg
		msg = Message(self.db)
		msg.addMsg("100000", "200000", "消息内容，消息内容");

		#test add todo
		todo = Todo(self.db)
		id = todo.addTodo("100000", "200000", "agree_manage", "待办内容1", 100);

		#test delete
		todo.delTodoById(id);

		#test add todo
		todo = Todo(self.db)
		id = todo.addTodo("100000", "200000", "agree_manage", "待办内容2", 200);

		#test delete
		todo.delTodo("agree_manage", 200);

		print('test end')

