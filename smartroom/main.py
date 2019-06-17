import multiprocessing
from .messageprocessor import MessageProcessor
from .room import Room
from .error import SmartRoomError,DuplicateItemError,IDNotFoundError,InvalidOperationError
from .jobs import JobError


class JobManager:

	def __init__(self,room):
		self.jobs=[]
		self.room=room

	def update(self):
		for job in self.jobs.copy():
			try:
				job.update()
			except JobError as e:
				self.removejob(job.jobid)

	def appendjob(self,newjob):
		if not all(job.id!=newjob.id for job in self.jobs):
			raise DuplicateItemError()
		newjob.start(self.room)
		self.jobs.append(newjob)

	def removejob(self,jobid):
		job=self.findjob(jobid)

		self.jobs.remove(job)
		try:
			job.end()
		except JobError:
			pass

	def findjob(self,jobid):
		for job in self.jobs:
			if job.id==jobid:
				return job

		raise IDNotFoundError()

	def setjobconfig(self,jobid,config_dict):
		job=self.findjob(jobid)
		job.setconfig(config_dict)

	def getjobconfig(self,jobid):
		ret = self.findjob(jobid).getconfig()
		return ret if ret!=None else {}

def main(messaging_pipe):
	room=Room()
	job_manager=JobManager(room)
	message_processor=MessageProcessor(room,job_manager)

	while True:
		if messaging_pipe.poll(1):
			message = messaging_pipe.recv()
			if message is None:
				break
			else:
				messaging_pipe.send(message_processor.process(message))

		room.update()
		job_manager.update()


class SmartRoomSystemProcessDownError(SmartRoomError):

	def __init__(self,exitcode):
		super().__init__('Subprocess for SmartRoomSystem is down. It can be caused by a error in the subprocess')
		self.exitcode=exitcode


class SmartRoomSystem:

	def __init__(self):
		self.__pipe=None
		self.__process=None

	def start(self):
		self.__pipe,child_pipe=multiprocessing.Pipe()
		self.__process=multiprocessing.Process(target=main,args=[child_pipe])
		self.__process.start()

	def stop(self):
		self.__pipe.send(None)
		self.__process.join()

	def send_message(self,message):
		self.__processcheck()

		self.__pipe.send(message)
		return self.__pipe.recv()

	def __processcheck(self):
		if self.__process==None:
			raise InvalidOperationError('SmartRoomSystem is not started yet. "start" should be called first')

		if not self.__process.is_alive():
			raise SmartRoomSystemProcessDownError(self.__process.exitcode)
