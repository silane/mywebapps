import os.path
import subprocess
from .error import SmartRoomError


class OperationError(SmartRoomError):

	def __init__(self,reason):
		self.reason=reason


class IRController:

	def __init__(self,root_path):
		self.root_path=root_path

	def send_file(self,source,count=1):

		if not hasattr(source,'read'):
			source=os.path.join(self.root_path,source)
			returncode = subprocess.call(['ir_send','1','-c',str(count),'-f',source])
		else:
			returncode = subprocess.call(['ir_send','1','-c',str(count)],stdin=source)

		if returncode != 0:
			raise OperationError('IR sending failed. Return code from "ir_send" is {0}'.format(returncode))


class Light:

	def __init__(self,ir_controller):
		self.__ir_controller=ir_controller

	def on(self):
		self.__ir_controller.send_file('light/on.txt')

	def off(self):
		self.__ir_controller.send_file('light/off.txt')

	def full(self):
		self.__ir_controller.send_file('light/full.txt')

	def mini(self):
		self.__ir_controller.send_file('light/mini.txt')


class HumanSensor:

	def __init__(self):
		self.update()

	def is_active(self):
		return self.__is_active

	def update(self):
		self.__is_active=False

class Room:

	def __init__(self):
		self.__ir_controller=IRController('/usr/local/my/irdata/')
		self.light=Light(self.__ir_controller)
		self.human_sensor=HumanSensor()

	def update(self):
		self.human_sensor.update()
