#
from kiterope.settings.common import *

DEBUG = False
IN_PRODUCTION = True

DOMAIN_NAME = 'kiterope.com'
ALLOWED_HOSTS = ['localhost', 'kiterope.com']

STATIC_ROOT ='/home/ebadros/webapps/kiterope_static/'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
         'NAME': 'kiterope_staging_db',
         'USER': 'kiterope_admin',
         'PASSWORD': 'eporetik4',
         'HOST': '127.0.0.1',
         'PORT': '5432',
    }
}
ROOT_URLCONF = 'kiterope.urls_production'

#This is the id of the site within the database that we should be using as our base site
SITE_ID=1
