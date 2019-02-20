#!/usr/local/opt/python/bin/python2.7

from eo_python.eo import ElectricObject, get_credentials

import requests

credentials = get_credentials()
print credentials
eo = ElectricObject(username=credentials["username"], password=credentials["password"])

import sys
print sys.argv[1]
eo.set_url(sys.argv[1])
