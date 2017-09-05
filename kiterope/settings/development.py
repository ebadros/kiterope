#
from kiterope.settings.common import *
from urllib.parse import urlparse
import elasticsearch
from requests_aws4auth import AWS4Auth


DEBUG = True
WWW_ROOT = '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope'


IS_DEV = True
IS_PROD = False

ALLOWED_HOSTS = ['192.168.1.156', '*', '127.0.0.1', 'kiterope-dev.us-west-1.elasticbeanstalk.com', 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com']
ROOT_URLCONF = 'kiterope.urls_development'

#ALLOWED_HOSTS = ['*']


#TEMPLATE_DEBUG = True
THUMBNAIL_DEBUG = True

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

''

INSTALLED_APPS += [
    'sslserver',
]

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
        "ROUTING": "kiterope.routing.channel_routing",
    },
}

DATABASES = {
'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'ebdb',
            'USER': 'kiteropeAdmin',
            'PASSWORD': 'regul8or1',
            'HOST': 'aa1arj4p56yj6vl.carvp3y5yq9m.us-west-1.rds.amazonaws.com',
            'PORT': '5432',
            'OPTIONS': {
                'sslmode': 'require',
            },
        }
}
'''
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
'''
'''
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'haystack',
        'TIMEOUT': 60
    },
}'''

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