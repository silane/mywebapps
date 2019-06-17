class ResponseMessage:

	id='response'

	def __init__(self,success,message=None):
		self.success=success
		self.message=message


class ValueResponseMessage(ResponseMessage):

	id='monitorresponse'

	def __init__(self,success,value,message=None):
		super().__init__(success,message)
		self.value=value


class SetJobEnabledMessage:

	id='setjobenabled'

	def __init__(self,jobid,enable):
		self.jobid=jobid
		self.enable=enable


class GetJobEnabledMessage:

	id='getjobenabled'

	def __init__(self,jobid):
		self.jobid=jobid


class OperateMessage:

	id='operate'

	def __init__(self,operationid,**kwargs):
		self.operationid=operationid
		self.parameters=kwargs


class MonitorMessage:

	id='monitor'

	def __init__(self,monitoringid,**kwargs):
		self.monitoringid=monitoringid
		self.parameters=kwargs


class SetJobConfigMessage:

	id='setjobconfig'

	def __init__(self,jobid,config_dict):
		self.jobid=jobid
		self.config_dict=config_dict


class GetJobConfigMessage:

	id='getjobconfig'

	def __init__(self,jobid):
		self.jobid=jobid
