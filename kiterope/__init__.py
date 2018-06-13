from __future__ import absolute_import, unicode_literals

default_app_config = 'kiterope.apps.ApiConfig'

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from kiterope.celery_setup import app as celery_app

__all__ = ['celery_app']