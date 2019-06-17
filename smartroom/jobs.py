import datetime
from .error import SmartRoomError


class JobError(SmartRoomError):

	def __init__(self,message,*args):
		super().__init__(message,*args)
		self.message=message


class Job:

	def start(self,room):
		pass

	def update(self):
		pass

	def end(self):
		pass

	def setconfig(self,config_dict):
		pass

	def getconfig(self):
		pass


def _timetosecond(time):
	return time.hour*3600+time.minute*60+time.second

def _secondtotime(second):
	return datetime.time(hour=second//3600,minute=(second//60)%60,second=second%60)

class MorningTurnOnLightJob(Job):

	id='morninglight'

	def __set_alarmtime(self,time):
		now=datetime.datetime.now()
		self.alarm_time=time
		self.next_alarm_datetime=datetime.datetime.combine(now.date(),self.alarm_time)
		if now.time() >= self.alarm_time:
			self.next_alarm_datetime += datetime.timedelta(days=1)

	def __init__(self):
		self.__set_alarmtime(datetime.time(7))


	def start(self,room):
		self.__room=room

	def update(self):
		if datetime.datetime.now() < self.next_alarm_datetime:
			return

		self.next_alarm_datetime += datetime.timedelta(days=1)

		self.__room.light.on()

	def setconfig(self,config_dict):
		if 'alarm_time' in config_dict:
			try:
				self.__set_alarmtime(_secondtotime(config_dict['alarm_time']))
			except TypeError:
				raise JobError('Type of "alarm_time" option should be integer')

	def getconfig(self):
		return {'alarm_time':_timetosecond(self.alarm_time)}


class TestJob(Job):

	id='test'

	def __init__(self):
		self.state=True

	def start(self,room):
		self.__room=room

	def update(self):
		if self.state:
			self.__room.light.on()
		else:
			self.__room.light.off()
		self.state=not self.state


def getjobbyid(id):

	joblist=(MorningTurnOnLightJob,TestJob,)

	for job in joblist:
		if job.id==id:
			return job()

	raise IDNotFoundError('jobid "{0}" was not found'.format(id))
