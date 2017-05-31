#
from kiterope.settings.common import *


DEBUG = True
IN_PRODUCTION = True

DOMAIN_NAME = 'kiterope.com'
ALLOWED_HOSTS = ['localhost', 'kiterope.com', 'kiterope-dev.us-west-1.elasticbeanstalk.com']

#STATIC_ROOT ='/opt/python/current/app/kiterope/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "..", "www", "static")
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join("/opt/python/ondeck/app/assets/"),
#    '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/static/',
)


ADMIN_MEDIA_PREFIX = '/static/admin/'

if 'RDS_DB_NAME' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.environ['RDS_DB_NAME'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOSTNAME'],
            'PORT': os.environ['RDS_PORT'],
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'kiterope',
            'USER': 'kiteropeadmin',
            'PASSWORD': 'regul8or1',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }
ROOT_URLCONF = 'kiterope.urls_production'

#This is the id of the site within the database that we should be using as our base site
SITE_ID=1
