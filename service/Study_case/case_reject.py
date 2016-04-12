from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
from Study_case import centerEntity,detailEntity
import time

import datetime
class Restful(WebRequestHandler):
	@operator_except
	def get(self):  #
		s=centerEntity.Study_case_center(self.db)
		case_id = self.get_argument('case_id', default='')
		cur=self.db.getCursor()
		rowdata={}


		cur.execute("select a.reject_reason from public.CASE_LEARN a  "
						"where a.id=%s and a.apply_status='3' " % (case_id))

		rows = cur.fetchall()
		rowdata['struct']="rejectReason"
		rowdata['rows']= rows
		print (rowdata)
		self.response(rowdata)
