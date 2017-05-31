#
from kiterope.settings.common import *
from requests_aws4auth import AWS4Auth
from elasticsearch import Elasticsearch, RequestsHttpConnection
import elasticsearch

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

awsauth = AWS4Auth('AKIAJ5YZL4QGGT7IUJRA', 'GaC4RBmmGb5hMWq/sTerxmMFAK8cLTnfYTwxfPOX', 'REGION', 'es')

HAYSTACK_CONNECTIONS = (
    'default': {
     'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
     'URL': host,
     'INDEX_NAME': 'haystack',
     'KWARGS': {
         'port':443,
         'http_auth': awsauth,
         'use_ssl': True,
         'verify_certs': True,
         'connection_class': elasticsearch.RequestsHttpConnection,
     },
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
