# mywebapps
My private web applications written in python3

## Requirments
- flask (written in `setup.py`)
- [osudb_parser](https://github.com/silane/osudb-parser) (written in `setup.py`)
- ping command
- [wakeonlan command](https://github.com/silane/wake-on-lan)
- [EDCB_SendSuspend command](https://github.com/silane/EDCB-SendSuspend)

## Configuration
When this package is not installed, `instance/config.py` will be used by default.

When this package is installed, `$PREFIX/var/mywebapps-instance/config.py` will be the default path,
where `$PREFIX` is root of a python virtual environment.
So we should place the configuration file there when deploy.

To use another file, specify the path in environment varibale `MYWEBAPPS_CONFIG`.

## Usage
```python
from mywebapps import create_app

app = create_app()
```
`app` will be WSGI handler.

## Development
```sh
FLASK_APP=mywebapps flask run
```
will start development server.
