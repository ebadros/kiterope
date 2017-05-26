#apps.py

from django.apps import AppConfig

class ApiConfig(AppConfig):
    name = 'kiterope'

    def ready(self):
        from . import signals