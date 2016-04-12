#coding:utf-8

from BioTornado.Base  import WebRequestHandler,BaseError,operator_except

import time,datetime,random



class Restful(WebRequestHandler):
	@operator_except
	def get(self):
		alldata={}
		cur=self.db.getCursor()
		doctor_id=self.get_argument('doctor_id', default='')
		sql="select min(a.id) as id,max(d.name) as survey_name,round(avg(a.satisfaction_item_value),1) as average "
		sql+="from public.satisfaction_item_result a "
		sql+="left join public.satisfaction b on b.id=a.satisfaction_id "
		sql+="left join public.multidisciplinary_consultation c on   b.type='0' and c.id=b.consultation_id "
		sql+="left join public.remote_consultation z on b.type='1' and z.id=b.consultation_id "
		sql+="left join public.satisfaction_item d on d.id=a.satisfaction_item_id "
		sql+="left join public.doctor e on c.apply_doctor=e.his_id " 
		sql+="left join public.doctor f on z.apply_doctor=f.his_id where e.id=%s or f.id=%s "%(doctor_id,doctor_id)
		sql+="group by a.satisfaction_item_id order by a.satisfaction_item_id "
		cur.execute(sql)
		survey_data = cur.fetchall()
		alldata['struct']='id,survey_name,average'
		alldata['survey']=survey_data	

		self.response(alldata)
