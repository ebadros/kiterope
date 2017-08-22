from __future__ import absolute_import, unicode_literals
import os
#from celery import Celery
import celery
print(celery.__file__)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kiterope.settings.settingsConfiguration')

app = Celery('kiterope')
app.config_from_object('kiterope.celeryconfig', namespace='CELERY')
app.autodiscover_tasks()

if __name__ == '__main__':
    app.start()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


