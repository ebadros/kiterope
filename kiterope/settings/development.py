#
from kiterope.settings.common import *

DEBUG = True
WWW_ROOT = '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope'


IS_DEV = True
IS_PROD = False

ALLOWED_HOSTS = ['192.168.1.156', '*']
ROOT_URLCONF = 'kiterope.urls_development'

#ALLOWED_HOSTS = ['*']


#TEMPLATE_DEBUG = True
THUMBNAIL_DEBUG = True

CORS_ORIGIN_ALLOW_ALL = True


''

INSTALLED_APPS += [
    'sslserver',
]

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'kiterope',
            'USER': 'kiteropeadmin',
            'PASSWORD': 'regul8or1',
            'HOST': 'localhost',
            'PORT': '',
        }
    }


SITE_ID=3