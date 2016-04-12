from BioTornado.Base  import WebRequestHandler,BaseError,operator_except

class Restful(WebRequestHandler):

	@operator_except
	def get(self):
		if not self.objUserInfo :
			raise BaseError(604)

		user_id = self.objUserInfo['id']
		
		search_msg = self.get_argument('search_msg', default='')
		offset   = int(self.get_argument('o',default='1'))
		rowcount = int(self.get_argument('r',default='100'))
		offset = (offset - 1) * rowcount

		cur = self.db.getCursor()
		
		rowdata = {}
		my_hos_code = self.objUserInfo["id"];

		
		if search_msg == '' :
			cur.execute("select a.id,a.source_code,a.target_id,a.create_time,a.page_id,a.context,a.operation_id from public.wait_handle a "
			        
						" order by a.id desc limit %s offset %s " % ( rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="id,source_code,target_id,create_time,page_id,context,operation_id"
			rowdata['rows']= rows

			cur.execute("select count(*) from public.wait_handle where target_id=%s " % (my_hos_code))
			rows = cur.fetchone()
			rowdata['count']=rows[0]

			self.response(rowdata)

		else :
			cur.execute("select a.id,a.source_code,a.target_id,a.create_time,a.page_id,a.context,a.operation_id from public.wait_handle a "
						"left join public.hospital_info s on s.code=a.source_code "
						"left join public.account t on t.id=a.target_id "
						"left join public.account u on u.id=a.source_id "
						"left join system.code_value v on a.type=v.code "
						"inner join system.code_type w on v.type_code=w.code and w.code='WAIT_TYPE' and w.status='1' "
						"where a.target_id=%s and (a.source_code='%s' or context like '%%%s%%' or s.name like '%%%s%%' or u.name like '%%%s%%' or v.name like '%%%s%%') "
						"order by a.id desc limit %s offset %s " % (my_hos_code, search_msg, search_msg, search_msg,search_msg,search_msg,rowcount, offset))
			rows = cur.fetchall()
			rowdata['struct']="id,source_code,target_id,create_time,page_id,context,operation_id,source_hos,target_hos,source_name,type_name"
			rowdata['rows']= rows

			cur.execute("select count(*) from public.wait_handle a "
						"left join public.hospital_info s on s.code=a.source_code "
						"left join public.account t on t.id=a.target_id "
						"left join public.account u on u.id=a.source_id "
						"left join system.code_value v on a.type=v.code "
						"inner join system.code_type w on v.type_code=w.code and w.code='WAIT_TYPE' and w.status='1' "
					"where a.target_id=%s and (a.source_code='%s' or context like '%%%s%%' or s.name like '%%%s%%' or u.name like '%%%s%%' or v.name like '%%%s%%') "
					% (my_hos_code, search_msg, search_msg, search_msg,search_msg,search_msg))
			rows = cur.fetchone()
			rowdata['count']=rows[0]

			self.response(rowdata)
		


