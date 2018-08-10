#
from kiterope.settings.common import *
from urllib.parse import urlparse


DEBUG = False
IN_PRODUCTION = True

DOMAIN_NAME = 'kiterope.com'
ALLOWED_HOSTS = ['localhost', '.kiterope.com', 'kiterope.com', 'https://kiterope.com', 'http://kiterope.com','kiterope-dev.us-west-1.elasticbeanstalk.com', '54.183.105.27']

#STATIC_ROOT ='/opt/python/current/app/kiterope/static/'

STATIC_ROOT = os.path.join(BASE_DIR, "..", "www", "static")
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join("/opt/python/ondeck/app/assets/"),

    #    '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/static/',
)

# Celery stuff
LOCATION_OF_CELERY_CONFIG_FILE = 'kiterope.celeryconfig'




broker_url = 'amqp://5ebe2294ecd0e0f08eab7690e2a6ee69:eac8d74fae134a9bbedb21ff824605ead6d858ef@localhost:5672'
result_backend = 'rpc://localhost'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
beat_scheduler='django_celery_beat.schedulers.DatabaseScheduler',

timezone = 'North America/Los Angeles'
enable_utc = True
include=['kiterope']



#include='kiterope.tasks'


WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles-prod/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-prod-stats.json'),
    }
}


REACT_SERVICE_URL = 'http://localhost:63578/render'

MIDDLEWARE_CLASSES += (
    'django_seo_js.middleware.EscapedFragmentMiddleware',  # If you're using #!
    'django_seo_js.middleware.UserAgentMiddleware',  # If you want to detect by user agent
)


CLUSTER_NAME='kiterope-es'
EC2_TAG_NAME='kiterope-dev'
MASTER_NODES=1
PORT=9200

import elasticsearch
from requests_aws4auth import AWS4Auth

host = 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com'

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
