from datetime import datetime
import atexit
from flask import Blueprint, render_template, request, jsonify
from flask import json
from smartroom.messages import (
    MonitorMessage, OperateMessage, SetJobEnabledMessage, GetJobEnabledMessage,
    SetJobConfigMessage, GetJobConfigMessage)
from smartroom.main import SmartRoomSystem, SmartRoomSystemProcessDownError


app = Blueprint('smartroom', __name__)

smartroom = SmartRoomSystem()
smartroom.start()


@atexit.register
def stop_smartroom():
    smartroom.stop()


@app.errorhandler(SmartRoomSystemProcessDownError)
def handle_systemprocessdownerror(e):
    global smartroom
    smartroom.stop()
    smartroom = SmartRoomSystem()
    smartroom.start()
    return 'SmartRoomSystem is down. Now trying to restart the system.', 503


@app.route('/index')
@app.route('/')
def index():
    return render_template('smartroom.html', title='SmartRoom',
                           year=datetime.now().year)


@app.route('/monitor')
def monitor():

    ret = []

    monitoringid = request.form.get('monitoringid')
    if monitoringid is None:
        return ('"monitoringid" field is missing', 400)

    form = request.form.copy()
    del form['monitoringid']
    ret = smartroom.send_message(MonitorMessage(monitoringid, **form))

    return jsonify({'success': ret.success, 'message': ret.message})


@app.route('/operate', methods=['POST'])
def operate():

    operationid = request.form.get('operationid')
    if operationid is None:
        return ('"operationid" field is missing', 400)

    form = request.form.copy()
    del form['operationid']
    ret = smartroom.send_message(OperateMessage(operationid, **form))

    return jsonify({'success': ret.success, 'message': ret.message})


@app.route('/setjobenabled', methods=['POST'])
def setjobenabled():

    jobid = request.form.get('jobid')
    try:
        enable = int(request.form.get('enable', '')) != 0
    except ValueError:
        enable = None
    if jobid is None:
        return ('"jobid" field is missing', 400)
    if enable is None:
        return ('"enable" field is missing or it\'s format is invalid', 400)

    ret = smartroom.send_message(SetJobEnabledMessage(jobid, enable))

    return jsonify({'success': ret.success, 'message': ret.message})


@app.route('/getjobenabled')
def getjobenabled():

    jobid = request.args.get('jobid')
    if jobid is None:
        return ('"jobid" field is missing', 400)

    ret = smartroom.send_message(GetJobEnabledMessage(jobid))

    if ret.success:
        ret = {'success': ret.success,
               'value': ret.value, 'message': ret.message}
    else:
        ret = {'success': ret.success, 'message': ret.message}
    return jsonify(ret)


@app.route('/setjobconfig', methods=['POST'])
def setjobconfig():

    jobid = request.form.get('jobid')
    config = request.form.get('config')
    if jobid is None:
        return ('"jobid" field is missing', 400)
    if config is None:
        return ('"config" field is missing', 400)

    config = json.loads(config)
    ret = smartroom.send_message(SetJobConfigMessage(jobid, config))

    ret = {'success': ret.success, 'message': ret.message}

    return jsonify(ret)


@app.route('/getjobconfig')
def getjobconfig():

    jobid = request.args.get('jobid')
    if jobid is None:
        return ('"jobid" field is missing', 400)

    ret = smartroom.send_message(GetJobConfigMessage(jobid))

    if ret.success:
        ret = {'success': ret.success,
               'value': ret.value, 'message': ret.message}
    else:
        ret = {'success': ret.success, 'message': ret.message}
    return jsonify(ret)
