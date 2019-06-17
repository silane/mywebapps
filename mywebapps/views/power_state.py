import os.path
from datetime import datetime
import re
import json
from os import system
from subprocess import call, TimeoutExpired, DEVNULL
import shlex
from flask import Blueprint, render_template, request, jsonify, current_app

app = Blueprint('power_state', __name__)


def __ping(host, timeout=None):
    try:
        args = shlex.split(
            current_app.config['PING_COMMAND'].format(destination=host))
        return call(args, stdin=DEVNULL, stdout=DEVNULL, stderr=DEVNULL,
                    timeout=timeout) == 0
    except TimeoutExpired:
        return False


@app.route('/index')
@app.route('/')
def index():
    """パソコンの電源管理画面を表示する"""

    return render_template('powerstate.html', title='PowerState',
                           year=datetime.now().year)


@app.route('/getmachines')
def get_machines():
    """マシンのリストとその稼働状況をjsonで返す"""

    machines_file_path = current_app.config['MACHINES_FILE']
    if not os.path.isabs(machines_file_path):
        machines_file_path = os.path.join(current_app.instance_path,
                                          machines_file_path)
    with open(machines_file_path, 'r', encoding='utf-8') as f:
        machineList = json.load(f)

    for machine in machineList:
        machine['active'] = __ping(machine['ip'], timeout=0.1)

    return jsonify(machineList)


macAddressPattern = re.compile(r'^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$')
ipAddressPattern = re.compile(
    r'^(([1-9]?[0-9]|1[0-9]{2}|1[0-4][0-9]|25[0-5])\.){3}'
    r'([1-9]?[0-9]|1[0-9]{2}|1[0-4][0-9]|25[0-5])$')
portPattern = re.compile(r'^[0-9]+$')


@app.route('/changepowerstate', methods=['POST'])
def changepowerstate():
    """EDCBの動いているwindowsマシンの電源を操作する"""

    ip = request.form.get('ip')
    mac = request.form.get('mac')
    state = request.form.get('state')

    error_message = None
    if state == 'wake':
        if mac is None:
            return ('"mac" field is missing', 400)
        if not macAddressPattern.match(mac):
            return ('"mac" field should be like "01:23:45:67:89:ab"', 400)

        if system(current_app.config['WAKEONLAN_COMMAND']
                  .format(mac=mac)) != 0:
            error_message = 'failed to send wake request'

    elif state == 'suspend' or state == 'sleep' or state == 'shutdown':
        if ip is None:
            return ('"ip" field is missing', 400)
        if not ipAddressPattern.match(ip):
            return ('"ip" field should be like "127.0.0.1"', 400)
        # if port != None and not portPattern.match(port):
        #     return ('"port" field`s format is invalid',400)

        if system(current_app.config['EDCBSENDSUSPEND_COMMAND']
                  .format(ip=ip, mode=state)) != 0:
            error_message = 'failed to send request'
    else:
        error_message = ('"state" field should be either '
                         '"wake", "sleep", "suspend" or "shutdown"')

    if error_message is None:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': error_message})
