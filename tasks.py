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

