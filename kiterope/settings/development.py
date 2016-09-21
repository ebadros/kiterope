#
from kiterope.settings.common import *

DEBUG = True
WWW_ROOT = '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope'

IS_DEV = True
IS_PROD = False

ALLOWED_HOSTS = ['*']


STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
    '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/static/',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/templates'],
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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

