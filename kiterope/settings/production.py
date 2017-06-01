#
from kiterope.settings.common import *
from urlparse import urlparse


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

from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

host = 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com'
awsauth = AWS4Auth('AKIAJ5YZL4QGGT7IUJRA', 'GaC4RBmmGb5hMWq/sTerxmMFAK8cLTnfYTwxfPOX', 'us-west-1', 'es')

es = Elasticsearch(
    hosts=[{'host': host, 'port': 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection
)
parsed = urlparse('https://user:pass@host:port')
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com',
        'INDEX_NAME': 'haystack',
        'KWARGS': {
            'port': 443,
            'http_auth': awsauth,
            'use_ssl': True,
            'verify_certs': True,
            'connection_class': RequestsHttpConnection,
        }
    },
}

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
            'NAME': 'aasprfhxks9uh7',
            'USER': 'kiteropeadmin',
            'PASSWORD': 'regul8or1',
            'HOST': 'aasprfhxks9uh7.carvp3y5yq9m.us-west-1.rds.amazonaws.com',
            'PORT': '5432',
        }
    }
ROOT_URLCONF = 'kiterope.urls_production'

#This is the id of the site within the database that we should be using as our base site
SITE_ID=1
