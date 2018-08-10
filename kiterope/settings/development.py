#
from kiterope.settings.common import *
from urllib.parse import urlparse
import elasticsearch
from requests_aws4auth import AWS4Auth


DEBUG = True
WWW_ROOT = '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope'


IS_DEV = True
IS_PROD = False

ALLOWED_HOSTS = ['192.168.1.156', '*', '127.0.0.1',  'localhost', 'kiterope-dev.us-west-1.elasticbeanstalk.com', 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com']
ROOT_URLCONF = 'kiterope.urls_development'

#ALLOWED_HOSTS = ['*']



#TEMPLATE_DEBUG = True
THUMBNAIL_DEBUG = True

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-local-stats.json'),
    }
}
S3_ACCESS_KEY_ID = 'AKIAJBHT4Q2VVU5CLFHQ'
S3_SECRET_ACCESS_KEY = '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'

''

INSTALLED_APPS += [
    'sslserver',

]

# Celery Stuff
LOCATION_OF_CELERY_CONFIG_FILE = 'kiterope.celeryconfigDev'


broker_url = 'amqp://localhost:5672'
result_backend = 'rpc://localhost'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']

timezone = 'North America/Los Angeles'
enable_utc = True
include=['kiterope.tasks']






CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
        "ROUTING": "kiterope.routing.channel_routing",
    },
}

MIDDLEWARE_CLASSES = [
    #'tenant_schemas.middleware.DefaultTenantMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django_seo_js.middleware.EscapedFragmentMiddleware',
    'django_seo_js.middleware.UserAgentMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',


    #'kiterope.middleware.DisableCsrfCheck',
    #'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    #'oauth2_provider.middleware.OAuth2TokenMiddleware',

]

#TENANT_MODEL = "kiterope.Client" # app.Model


SEO_JS_ENABLED = False



DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'ebdb',
        'USER': 'kiteropeAdmin',
        'PASSWORD': 'regul8or1',
        'HOST': 'kiterope-development.carvp3y5yq9m.us-west-1.rds.amazonaws.com',
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}




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

SITE_ID=1