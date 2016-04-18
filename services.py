from google.appengine.ext import db, deferred, blobstore
from google.appengine.api import mail, images, urlfetch, memcache
import os

from datetime import datetime,timedelta

import tools
# from oauth2client import client
import authorized
import logging
from models import *
from constants import *
import handlers
import json

# Google OAuth

def GetGoogleKeyCerts():
    d = memcache.get(MC_GOOGLE_KEY_CERT_DICT)
    if not d:
        d = UpdateGoogleKeyCerts()
    else:
        logging.debug("Got Google Key Certs")
    return d

def UpdateGoogleKeyCerts():
    url = "https://www.googleapis.com/oauth2/v1/certs"
    result = urlfetch.fetch(url, deadline=15)
    if result.status_code == 200:
        try:
            response = json.loads(result.content)
            logging.debug("Updated Key Certs from Google! %s" % response.keys())
            memcache.set(MC_GOOGLE_KEY_CERT_DICT, response, 6*60*60) # 6 hours TODO: Handle expire!
            return response
        except Exception, e:
            logging.error("Error decoding key certs: %s" % result.content)
    return None

def VerifyGoogleJWT(token, iss="accounts.google.com", aud=TOKEN_AUD, azp=TOKEN_AZP, email=None):
    return True
    # LIB = "OAUTH2CLIENT"
    # certs = GetGoogleKeyCerts()
    # _jwt = None
    # ok = False
    # if LIB == "OAUTH2CLIENT": # TODO: Does not verify token!!
    #     _jwt = client._extract_id_token(token)
    # if _jwt:
    #     logging.debug("Decoded JWT!")
    #     logging.debug(_jwt)
    #     ok = _jwt['iss'] == iss and _jwt['aud'] == aud and _jwt['azp'] in azp and _jwt['email'] == email
    # return ok

