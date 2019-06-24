from os import environ
from flask import Flask
from .config_check import check_config


def create_app(test_config=None):

    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        if not app.config.from_envvar('MYWEBAPPS_CONFIG', silent=True):
            app.config.from_pyfile('config.py')
    else:
        app.config.from_mapping(test_config)

    check_config(app.config, app.instance_path)

    if not app.config['DISABLE_MUSICPLAYER']:
        from . import osudb
        osudb.init_app(app)

    from .views.home import app as home
    from .views.power_state import app as power_state
    from .views.niconicoanimespecial import app as niconicoanimespecial
    from .views.myroom import app as myroom

    app.register_blueprint(home)
    app.register_blueprint(power_state, url_prefix='/powerstate')
    if not app.config['DISABLE_MUSICPLAYER']:
        from .views.osu_music_player import app as osu_music_player
        app.register_blueprint(osu_music_player, url_prefix='/osumusicplayer')
    if not app.config['DISABLE_SMARTROOM']:
        from .views.smartroom import app as smartroom
        app.register_blueprint(smartroom, url_prefix='/smartroom')
    app.register_blueprint(niconicoanimespecial,
                           url_prefix='/niconicoanimespecial')
    app.register_blueprint(myroom, url_prefix='/myroom')

    return app
