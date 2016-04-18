from models import *
from constants import *
import outbox
import handlers

def bgRunSensorProcess(sptkey=None):
    from workers import SensorProcessWorker
    logging.info("bgRunSensorProcess: %s" % sptkey)
    if sptkey:
        spt = SensorProcessTask.get(sptkey)
        if spt:
            worker = SensorProcessWorker(spt)
            worker.run()


# class RunProcessTask(handlers.BaseRequestHandler):
#     def post(self):
#         key = self.request.get('key')
#         if key:
#             pt = ProcessTask.get(key)
#             if pt and pt.can_run_now():
#                 spts = pt.get_sensor_tasks()
#                 # TODO: Avoid running for sensors with no data since last?
#                 logging.info("Got %d sensor tasks" % len(spts))
#                 n_ran = 0
#                 for st in spts:
#                     ran = st.run()
#                     if ran:
#                         n_ran += 1

#                 # Schedule next
#                 eta = datetime.now() + timedelta(seconds=pt.interval)
#                 logging.info("Ran %d -- Scheduling next at %s" % (n_ran, eta))
#                 tools.safe_add_task("/tasks/processtask/run", params={"key":key}, eta=eta)
#                 if not n_ran:
#                     outbox.email_admins("No process tasks run", "")
#             else:
#                 logging.info("Can't run %s now" % pt)
#         else:
#             logging.error("No key passed")