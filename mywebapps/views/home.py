from datetime import datetime
from flask import (Blueprint, render_template, request, session, jsonify,
                   redirect, url_for)

app = Blueprint('home', __name__)


@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )


@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )


@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Renders the login page and does login job."""

    userdatabase = {'michio': '1234'}

    if request.method == 'POST':
        error = None
        username = request.form['username']
        passwd = userdatabase.get(username)
        if passwd is None:
            error = "Invalid username or password"
        elif passwd != request.form['password']:
            error = "Invalid username or password"
        else:
            session['user'] = username
        return jsonify(username=username,
                       success=False if error else True, message=error,
                       redirect=url_for('.home') if not error else None)
    else:
        return render_template(
            'login.html',
            title='Login',
            year=datetime.now().year,
        )


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('.home'))
