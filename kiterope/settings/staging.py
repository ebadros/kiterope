#



from kiterope.settings.common import *

DEBUG = True
WWW_ROOT = '/home/ebadros/webapps/kiterope_dev/kiterope'
DOMAIN_NAME = 'dev.kiterope.com'

''' VP
STATICFILES_DIRS = (
    '/home/ebadros/webapps/kiterope_dev/kiterope/static/',

)
'''
# This is where the static files will be collected to
STATIC_ROOT = '/home/ebadros/webapps/kiterope_dev_static/'

ALLOWED_HOSTS = ['*']

IN_STAGING=True

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

IS_DEV = False
IS_PROD = True

