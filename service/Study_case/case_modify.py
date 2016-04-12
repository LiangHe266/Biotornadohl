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


		cur.execute("select a.id as case_id, a.name as case_name,a.AUTHOR,a.AUTHOR_COMPANY as company,array_to_string(array(SELECT bb.key  FROM   public.case_learn_key  bb  WHERE bb.case_id=a.id), ',') as key,c.name as upname,a.CREATE_TIME as ctime,a.ABSTRACT,a.DETAIL,avg(d.VALUE) as avgcount,a.apply_status from public.CASE_LEARN a  "
						"left join public.CASE_LEARN_KEY b on b.case_id=a.id "
						"left join public.account c on c.id=a.create_id "
						"left join public.CASE_LEARN_VALUE d  on d.case_id=a.id "
						"where a.id=%s "
						"group by a.id,a.name,a.AUTHOR,a.AUTHOR_COMPANY,key,c.name,a.CREATE_TIME,a.ABSTRACT,a.DETAIL "
						"order by a.id desc  " % (case_id))

		rows = cur.fetchall()
		rowdata['struct']="case_id,case_name,author,company,key,upname,ctime,abstract,detial,,avgcount,apply_status"
		rowdata['rows']=rows
		self.response(rowdata)
