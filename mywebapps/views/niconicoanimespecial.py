from datetime import datetime
import json
import urllib
from flask import Blueprint, render_template, jsonify


app = Blueprint('niconicoanimespecial', __name__)


@app.route('/index')
@app.route('/')
def index():
    return render_template('niconicoanimespecial.html',
                           title='NiconicoAnimeSpecial',
                           year=datetime.now().year)


@app.route('/get')
def get():
    search_url = 'http://api.search.nicovideo.jp/api/v2/live/contents/search?'
    parameter = {'q': 'ニコニコアニメスペシャル',
                 'targets': 'tags',
                 '_sort': '+startTime',
                 'fields': 'contentId,title,tags,description,startTime',
                 'filters[liveStatus][0]': 'reserved',
                 '_limit': 100}
    with urllib.request.urlopen(
            search_url + urllib.parse.urlencode(parameter)) as f:
        resp = json.load(f)

    if resp['meta']['status'] != 200:
        return resp['meta']['errorMessage'], resp['meta']['status']

    return jsonify(resp['data'])
