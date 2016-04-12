#coding:utf-8
from BioTornado.Base  import WebRequestHandler,BaseError,operator_except
class Handle(WebRequestHandler):
    @operator_except
    def get(self):
        self.response(':)')