#
from kiterope.settings.common import *
from urllib.parse import urlparse


DEBUG = False
IN_PRODUCTION = True

DOMAIN_NAME = 'kiterope.com'
ALLOWED_HOSTS = ['localhost', 'kiterope.com', 'https://kiterope.com', 'http://kiterope.com','kiterope-dev.us-west-1.elasticbeanstalk.com', '54.183.105.27']

#STATIC_ROOT ='/opt/python/current/app/kiterope/static/'

STATIC_ROOT = os.path.join(BASE_DIR, "..", "www", "static")
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join("/opt/python/ondeck/app/assets/"),

    #    '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/static/',
)

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles-prod/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-prod-stats.json'),
    }
}

LOCATION_OF_CELERY_CONFIG_FILE = 'kiterope.celeryconfig'


REACT_SERVICE_URL = 'http://localhost:63578/render'

MIDDLEWARE_CLASSES += (
    'django_seo_js.middleware.EscapedFragmentMiddleware',  # If you're using #!
    'django_seo_js.middleware.UserAgentMiddleware',  # If you want to detect by user agent
)

AWS_KEY='GaC4RBmmGb5hMWq/sTerxmMFAK8cLTnfYTwxfPOX'
AWS_KEY_ID='AKIAJ5YZL4QGGT7IUJRA'
CLUSTER_NAME='kiterope-es'
EC2_TAG_NAME='kiterope-dev'
MASTER_NODES=1
PORT=9200
SECRET_KEY='53)0ss5l+^$y$s%p=6^7_kq5dqukpw)&g8zgx#m%zmk+4m37du'

import elasticsearch
from requests_aws4auth import AWS4Auth

host = 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com'
awsauth = AWS4Auth('AKIAJ5YZL4QGGT7IUJRA', 'GaC4RBmmGb5hMWq/sTerxmMFAK8cLTnfYTwxfPOX', 'us-west-1', 'es')

es = elasticsearch.Elasticsearch(
    hosts=[{'host': host, 'port': 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=elasticsearch.RequestsHttpConnection
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
            'connection_class': elasticsearch.RequestsHttpConnection,
        }
    },
}
'''
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
else:'''


SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True



REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',

        #'oauth2_provider.ext.rest_framework.OAuth2Authentication',

        #'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',

    ),

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',

    ),

    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler'

    #'DEFAULT_PAGINATION_CLASS': 'kiterope.views.StandardResultsSetPagination',

    #'PAGE_SIZE': 9,

}




CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [os.environ.get('REDIS_URL', 'redis://localhost:6379')],
        },
        "ROUTING": "kiterope.routing.channel_routing",
    },
}
ROOT_URLCONF = 'kiterope.urls_production'

#This is the id of the site within the database that we should be using as our base site
SITE_ID=1
