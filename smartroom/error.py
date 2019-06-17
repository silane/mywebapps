class SmartRoomError(Exception):
	pass


class IDNotFoundError(SmartRoomError):
	pass


class DuplicateItemError(SmartRoomError):
	pass


class InvalidOperationError(SmartRoomError):
	pass
