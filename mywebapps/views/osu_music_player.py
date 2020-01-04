import itertools
from unicodedata import normalize
from flask import (Blueprint, render_template, request, abort,
                   send_from_directory, json, current_app)
from .. import osudb

app = Blueprint('osu_music_player', __name__)


@app.route('/query')
def query():
    """Used by javascript, query database"""

    q = request.args.get('keyword', '')
    db = osudb.get_db()

    beatmaps = {b.beatmapset_id: b for b in db.beatmaps}
    # Some beatmap has beatmapset_id 2**32-1, which should be ignored.
    del beatmaps[2 ** 32 - 1]
    beatmaps = beatmaps.values()
    keywords = [normalize('NFKD', keyword.casefold()) for keyword in q.split()]
    dbresult = [b for b in beatmaps if all(
        any(keyword in normalize('NFKD', string.casefold())
            if string else False for string in (
                b.artist_name, b.artist_name_unicode,
                b.song_title, b.song_title_unicode,
                b.creator_name, b.song_source, b.song_tags,
                )) for keyword in keywords)]
    dbresult = [x for x in dbresult if x.beatmapset_id != 2 ** 32 - 1]
    return json.jsonify([{
        'id': b.beatmapset_id,
        'title': b.song_title,
        'artist': b.artist_name,
        'creator': b.creator_name,
        'last_modification_time': b.last_modification_time.isoformat(),
        'source': b.song_source,
        'tags': b.song_tags.split(),
        'title_unicode': b.song_title_unicode,
        'artist_name_unicode': b.artist_name_unicode
    } for b in dbresult])


@app.route('/musicfile/<int:id>')
def musicfile(id):
    """Get music file"""

    db = osudb.get_db()
    beatmap = next((b for b in db.beatmaps if b.beatmapset_id == id), None)
    if not beatmap:
        abort(404)
    audio_path = beatmap.folder_name+'/'+beatmap.audio_file_name

    ret = send_from_directory(
        current_app.config['MUSIC_DIRECTORY'], audio_path, conditional=True)
    return ret


@app.route('/bgimg/<int:item_id>/<int:index>')
def bgimg(item_id, index):
    '''Get background image'''

    if index <= 0:
        abort(404)
    img_pathes = []

    db = osudb.get_db()
    beatmaps = (b for b in db.beatmaps if b.beatmapset_id == item_id)
    for beatmap in beatmaps:
        osu_path = beatmap.folder_name+'/'+beatmap.osu_file_name
        with open(current_app.config['MUSIC_DIRECTORY']+'/'+osu_path) as f:
            events_section = itertools.dropwhile(
                lambda x: x != '[Events]\n', f)
            next(events_section)
            for line in events_section:
                if line.startswith('//'):
                    continue
                if line.startswith('['):
                    break

                pathes = (x[1:-1] for x in line.rstrip('\n').split(',')
                          if (x[0], x[-1]) == ('"', '"'))
                pathes = (beatmap.folder_name+'/'+x for x in pathes
                          if any(x.lower().endswith(ext)
                                 for ext in ('.jpg', '.jpeg', '.png')))
                img_pathes.extend(
                    [path for path in pathes if path not in img_pathes])

    if index > len(img_pathes):
        abort(404)
    return send_from_directory(current_app.config['MUSIC_DIRECTORY'],
                               img_pathes[index-1])


@app.route('/reload')
def reload():
    osudb.reload_db()
    return ('', 204)


@app.route('/index')
@app.route('/')
def index():
    return render_template('player.html', title='OsuMusicPlayer')
