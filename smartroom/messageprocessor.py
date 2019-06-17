from . import jobs
from . import messages
from .error import DuplicateItemError,IDNotFoundError
from .room import OperationError
from .jobs import JobError


class MessageHandlerContext:
	def __init__(self,room,job_manager):
		self.room=room
		self.job_manager=job_manager


class MessageProcessor:

	handlertable={}

	def __init__(self,room,job_manager):
		self.messagehandler_ctx=MessageHandlerContext(room,job_manager)

	def process(self,message):
		if not message.__class__ in self.handlertable:
			return messages.ResponseMessage(False,'Unknown message type: "{0}"'.format(message.__class__))
		return self.handlertable[message.__class__](message,self.messagehandler_ctx)

	@classmethod
	def register_messagehandler(cls,messagecls,func):
		cls.handlertable[messagecls]=func
		
	@classmethod
	def messagehandler(cls,messagecls):
		def _ret(func):
			cls.register_messagehandler(messagecls,func)
			return func
		return _ret


@MessageProcessor.messagehandler(messages.SetJobEnabledMessage)
def process_enablejob_message(message,ctx):

	if message.enable:
		try:
			ctx.job_manager.appendjob(jobs.getjobbyid(message.jobid))
		except IDNotFoundError:
			return messages.ResponseMessage(False,'Unknown jobid: "{0}" '.format(message.jobid))
		except DuplicateItemError:
			return messages.ResponseMessage(False,'The job "{0}" is already enabled'.format(message.jobid))
	else:
		try:
			ctx.job_manager.removejob(message.jobid)
		except IDNotFoundError:
			return messages.ResponseMessage(False,'The job "{0}" is unknown or already disabled'.format(message.jobid))
	return messages.ResponseMessage(True)


@MessageProcessor.messagehandler(messages.GetJobEnabledMessage)
def process_getjobenabled_message(message,ctx):

	return messages.ValueResponseMessage(True,message.jobid in [job.id for job in ctx.job_manager.jobs])


@MessageProcessor.messagehandler(messages.GetJobConfigMessage)
def getjobconfig_message_handler(message,ctx):

	try:
		return messages.ValueResponseMessage(True,ctx.job_manager.getjobconfig(message.jobid))
	except IDNotFoundError:
		return messages.ResponseMessage(False,'jobid: "{0}" was not found'.format(message.jobid))
	except JobError as e:
		return messages.ResponseMessage(False,'Getting config of "{0}" was failed due to following reason: {1}'.format(message.jobid,e.message))

@MessageProcessor.messagehandler(messages.SetJobConfigMessage)
def setjobconfig_message_handler(message,ctx):

	try:
		ctx.job_manager.setjobconfig(message.jobid,message.config_dict)
		return messages.ResponseMessage(True)
	except IDNotFoundError:
		return messages.ResponseMessage(False,'jobid: "{0}" was not found'.format(message.jobid))
	except JobError as e:
		return messages.ResponseMessage(False,'Setting config of "{0}" was failed due to following reason: {1}'.format(message.jobid,e.message))


@MessageProcessor.messagehandler(messages.OperateMessage)
def process_operate_message(message,ctx):

	obj=ctx.room
	for attrname in message.operationid.split('-'):
		obj=getattr(obj,attrname,None)
		if obj==None:
			return messages.ResponseMessage(False,'Unknown operation id: {0}'.format(message.operationid))
	
	if not callable(obj):
		return messages.ResponseMessage(False,'Unknown operation id: {0}'.format(message.operationid))

	try:
		obj(**message.parameters)
	except OperationError as e:
		return messages.ResponseMessage(False,'The operation "{0}" was failed due to following reason: {1}'.format(message.operationid,e.reason))

	return messages.ResponseMessage(True)
