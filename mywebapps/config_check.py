from pathlib import Path
from warnings import warn


_REQUIRED_CONFIG_KEYS = [
    'SECRET_KEY', 'MUSIC_DIRECTORY', 'PING_COMMAND',
    'MACHINES_FILE', 'WAKEONLAN_COMMAND',
    'EDCBSENDSUSPEND_COMMAND', 'OSUDB_FILE', 'ROOMAN_URL']


def _key_not_found_message(key):
    return 'The config key "{key}" not found.'.format(key=key)


def _warn(key, message):
    warn('[Config Check: {key}] {message}'.format(
        key=key, message=message), stacklevel=2)


def _check_path(path, instance_path):
    path = Path(path)
    if not path.is_absolute():
        path = instance_path / path
    return path.exists()


def check_config(config, instance_path):
    for key in _REQUIRED_CONFIG_KEYS:
        assert key in config, _key_not_found_message(key)

    if not _check_path(config['MUSIC_DIRECTORY'], instance_path):
        _warn('MUSIC_DIRECTORY',
              'The specified directory "{config[MUSIC_DIRECTORY]}" not '
              'found.'.format(config=config))

    if 'DISABLE_MUSICPLAYER' not in config:
        config['DISABLE_MUSICPLAYER'] = False
    if 'DISABLE_SMARTROOM' not in config:
        config['DISABLE_SMARTROOM'] = False

    if not _check_path(config['MACHINES_FILE'], instance_path):
        _warn('MACHINES_FILE',
              'The specified file "{config[MACHINES_FILE]}" not found.'.format(
                  config=config))

    if not _check_path(config['OSUDB_FILE'], instance_path):
        _warn('OSUDB_FILE',
              'The specified file "{config[OSUDB_FILE]}" not found.'.format(
                  config=config))
