# -*- coding: utf-8 -*-

from flask import Flask
from flask import Response
from flask import stream_with_context
from flask import Flask, request, send_from_directory, render_template

import logging
logging.basicConfig()


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
  eo.set_url('http://eo1.blackmad.com:5222/app/text/chunk/chunk2.html?text=' + request.form['text'])
  return 'okay, cool, hope that worked'

@app.route('/app/<path:path>')
def send_app(path):
 print 'trying to send ' + path
 return send_from_directory('app', path)

@app.route('/proxy/<path:url>')
def home(url):
  req = requests.get(url, stream = True)
  return Response(stream_with_context(req.iter_content()), content_type = req.headers['content-type'])

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5222)
