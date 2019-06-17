from flask import current_app
from osudb_parser import read_osudb

_osudb_dict = {}


def _load_db(path):
    with open(path, 'rb') as f:
        _osudb_dict[path] = read_osudb(f)


def init_app(app):
    _load_db(app.config['OSUDB_FILE'])


def get_db():
    return _osudb_dict[current_app.config['OSUDB_FILE']]


def reload_db():
    _load_db(current_app.config['OSUDB_FILE'])
