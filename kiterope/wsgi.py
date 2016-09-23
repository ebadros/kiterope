"""
WSGI config for kiterope project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
sys.path.insert(0, "/home/ebadros/webapps/kiterope/kiterope/")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "kiterope.settings.settingsConfiguration")


application = get_wsgi_application()
