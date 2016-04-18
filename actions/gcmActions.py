import os, logging
from datetime import datetime,timedelta

from google.appengine.ext import db
from google.appengine.api import images, taskqueue
import logging
from models import *
import tools
import services
import authorized

import json

import handlers

# class SendMessage(handlers.BaseRequestHandler):
#     """
#     """
#     @authorized.role()
#     def post(self, d):
#         uid = self.request.get_range('uid')
#         story_id = self.request.get_range('story_id')
#         u = User.get_by_id(uid)
#         notify._SendMessage(users=[u],
#             payload={'story_id': story_id},
#             collapse="GCM_MESSAGE_%d_STORY_%d" % (_type, story_id)
#             )

class GCMConnection(handlers.JsonRequestHandler):
    @authorized.role('api')
    def post(self, d):
        success = False
        message = None
        regid = self.request.get('regid')
        if d['user'] and regid:
            logging.debug("Got new gcm registration id: %s" % regid)
            d['user'].Update(gcm_reg_id=regid)
            d['user'].put()
            success = True
        else:
            message = "User not found or no regid"
        self.json_out(success=success, message=message, data={"reg_id": regid})
