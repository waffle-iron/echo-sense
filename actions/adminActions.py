import django_version
import re, logging, string

from google.appengine.ext import webapp, db, deferred
from google.appengine.api import users, images, memcache, taskqueue
from google.appengine.ext.webapp import template
from django.template import defaultfilters

from models import *
import json
import random
import services
import tools
import authorized
import outbox
import handlers

class Init(handlers.BaseRequestHandler):
    def get(self):
        e = None
        create_ent = self.request.get_range('enterprise') == 1
        create_user = self.request.get_range('user') == 1
        create_data = self.request.get_range('data') == 1

        # Populate some random data

        if create_ent:
            e = Enterprise.Create()
            e.Update(name="Test Enterprise")
            e.put()

        if e and create_user:
            email = self.request.get('email')
            password = self.request.get('password')
            phone = self.request.get('phone')
            u = User.Create(e, email=email)
            u.Update(password=password, level=USER.ADMIN, phone=phone)
            u.put()

        if create_data:

            geosensor = SensorType.Create(e)
            schema = {
                'speed': {
                    'label': "Speed",
                    'unit': 'kph',
                    'type': 'number'
                },
                'location': {
                    'label': "Location",
                    'unit': 'degrees',
                    'type': 'latlng'
                }
            }
            geosensor.Update(name="GPS", schema=schema)
            geosensor.put()

            geosensor1 = Sensor.Create(e, "000-000")
            geosensor1.Update(sensortype_id=geosensor.key().id(), name="GPS Device 1")
            geosensor1.put()

            speeding_alarm = Rule.Create(e)
            speeding_alarm.Update(name="Speeding", sensortype_id=geosensor.key().id(), column="speed", trigger=RULE.CEILING, value2=80.0, duration=0)
            speeding_alarm.put()

            process = ProcessTask.Create(e)
            spec = json.dumps({ 'processers':[
                {
                    'expr': 'MAX({speed})',
                    'column': 'max_speed',
                    'analysis_key_pattern': '%SID_%Y-%M-%D'
                }
            ]})
            process.Update(label="Speed Processer", spec=spec, rule_ids=[speeding_alarm.key().id()], interval=60*5)
            process.put()

            MOVE_SIZE = 0.01
            N_POINTS = 10
            DELAY_SECS = 1
            lat = 1.3
            lon = 36.9
            now = datetime.now()

            # Populate dummy data with random moves / speeds
            records = []
            for x in range(N_POINTS):
                now += timedelta(seconds=DELAY_SECS)
                lat += (random.random()-0.5) * MOVE_SIZE
                lon += (random.random()-0.5) * MOVE_SIZE
                data = {
                    'location': "%s,%s" % (lat, lon),
                    'speed': random.random() * 60 + 40
                }
                r = Record.Create(tools.unixtime(now), geosensor1, data)
                records.append(r)
            db.put(records)

        self.response.out.write("OK")


class CleanDelete(handlers.BaseRequestHandler):
    """Completely removes a single entity with given key by calling their clean_wipe method, if present"""
    @authorized.role("admin")
    def get(self, key, d):
        origin = str(self.request.get('origin', default_value="/admin"))
        if key:
            entity = db.get(key)
            if entity:
                try:
                    entity._clean_delete()
                except:
                    logging.debug("Failed to clean delete entity key(%s) kind(%s).  Perhaps method clean_wipe isn't defined?  Or perhaps we timed out." % (key, entity.kind()))
        self.redirect(origin)

class SimpleDeleteEntity(handlers.BaseRequestHandler):
    @authorized.role("admin")
    def get(self, key, d):
        origin = self.request.get('origin')
        if not origin:
            origin = "/admin"
        entity = db.get(key)
        if entity:
            entity.delete()
        self.redirect(origin)

class UpdateGoogleKeyCerts(handlers.BaseRequestHandler):
    @authorized.role()
    def get(self, d):
        cert = services.UpdateGoogleKeyCerts()
        self.json_out(cert)

class ManualGCM(handlers.BaseRequestHandler):
    """
    """
    @authorized.role('admin')
    def post(self, d):
        message = self.request.get('message')
        if message:
            data = json.loads(message)
        else:
            data = None
        user_ids_raw = self.request.get('user_ids')
        if user_ids_raw:
            users = User.get([int(_id.strip()) for _id in user_ids_raw.split(',') if _id])
        else:
            users = []
        if len(users) and data:
            outbox.send_gcm_message(payload=data, users=users)
        self.redirect_to('vAdminGCM', n=len(users))

class CreateUser(handlers.BaseRequestHandler):
    @authorized.role("admin")
    def get(self, key, d):
        pass

class LogoutUser(handlers.BaseRequestHandler):
    @authorized.role("admin")
    def get(self, ukey, d):
        u = User.get(ukey)
        if u:
            u.session_id_token = None
            u.put()
        self.redirect_to("vAdminUsers")
