#!/usr/bin/env python

from distutils.core import setup

setup(name='eo wrapper',
      version='1.0',
      description='EO Wrapper',
      author='David Blackman',
      author_email='eo1@blackmad.com',
      scripts=['eo.py'],
      install_requires=[
        'eo-python',
      ]
     )
