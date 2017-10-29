# -*- coding: utf-8 -*-

from flask import Flask
from flask import Response
from flask import stream_with_context
from flask import Flask, request, send_from_directory, render_template
from flaskrun import flaskrun


import logging
logging.basicConfig()

from flask import make_response
from functools import wraps, update_wrapper
from datetime import datetime

def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return update_wrapper(no_cache, view)


from eo_python.eo import ElectricObject, get_credentials

import requests

app = Flask(__name__)

credentials = get_credentials()
print credentials
eo = ElectricObject(username=credentials["username"], password=credentials["password"])

@app.route('/eo1/set_text', methods=['GET'])
def set_text_form():
  return render_template('set_text.html')

@app.route('/eo1/set_text', methods=['POST'])
def set_text():
  # eo.set_url('http://eo1.blackmad.com:5222/app/text/chunk/chunk2.html?text=' + request.form['text'])
  eo.set_url('http://eo1.blackmad.com/app/text/chunk/chunk2.html?text=you%20should%20test%20this!')
  return 'okay, cool, hope that worked'

@nocache
@app.route('/app/<path:path>')
def send_app(path):
 print 'trying to send ' + path
 return send_from_directory('app', path)

@app.route('/proxy/<path:url>')
def home(url):
  req = requests.get(url, stream = True)
  return Response(stream_with_context(req.iter_content()), content_type = req.headers['content-type'])

if __name__ == '__main__':
  flaskrun(app)
