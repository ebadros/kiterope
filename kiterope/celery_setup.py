from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings



#settings.configure()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kiterope.settings.settingsConfiguration')

app = Celery('kiterope')
app.config_from_object('django.conf:settings', namespace='CELERY')
#app.config_from_object('django.conf:settings')
#app.config_from_object('kiterope.celeryconfigDev', namespace='CELERY')
app.autodiscover_tasks()

if __name__ == '__main__':
    app.start()



@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))




