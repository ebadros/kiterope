#
from kiterope.settings.common import *

DEBUG = True
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

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['/home/ebadros/webapps/kiterope/kiterope/templates/'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
				#'django_common.context_processors.common_settings',
				'django.core.context_processors.request',

            ],
        },
    },
]