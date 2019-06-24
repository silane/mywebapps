from datetime import datetime

from flask import Blueprint, render_template


app = Blueprint('myroom', __name__)

@app.route('/index')
@app.route('/')
def index():
    return render_template('myroom.html', title='MyRoom',
                           year=datetime.now().year)
