#
"""
Django settings for vp project.

Generated by 'django-admin startproject' using Django 1.8.6.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import sys
import os
from os.path import abspath, basename, dirname, join, normpath
import kiterope

IN_PRODUCTION = False
IN_STAGING=False

UNAUTHENTICATED_USER = 'django.contrib.auth.models.AnonymousUser'
UNAUTHENTICATED_TOKEN = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '53)0ss5l+^$y$s%p=6^7_kq5dqukpw)&g8zgx#m%zmk+4m37du'


ALLOWED_HOSTS = ['192.168.1.48', '*', '127.0.0.1']


TWILIO_ACCOUNT_SID = 'AC8d2c5238f8d12bb1b382e57428af3c90'
TWILIO_AUTH_TOKEN = 'b60fb541d009c43132260367a4f84d56'
TWILIO_DEFAULT_CALLERID = 'Kiterope'
TWILIO_PHONE_NUMBER = 'Kiterope'
SENDSMS_BACKEND = 'sendsms.backends.twiliorest.SmsBackend'


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'kiterope',
    'storages',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'tinymce',
    'colorfield',
    #'allauth.socialaccount.providers.google',
    #'allauth.socialaccount.providers.linkedin_oauth2',
    #'allauth.socialaccount.providers.facebook',
    'sorl.thumbnail',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'rest_auth.registration',
    'haystack',
    #'oauth2_provider', #django-oauth-toolkit
    'corsheaders',
    'timezone_field',
    'webpack_loader',
    'rest_framework_swagger',
    'channels',
    'django_twilio',
    'phonenumber_field',
    'django_celery_beat',

]

TINYMCE_JS_URL = "https://cdn.tinymce.com/4/tinymce.min.js"


TINYMCE_DEFAULT_CONFIG = {
    'theme': "simple", # default value
    'relative_urls': False, # default value
    'width': '100%',
    'height': 300,
    'language': 'en',
    'theme': 'modern',
    'toolbar': 'bold italic underline strikethrough hr | bullist numlist | link unlink | undo redo | spellchecker code',
    'menubar': True,
    'statusbar': True,
    'resize': True,
    'plugins': 'emoticons template paste textcolor colorpicker textpattern imagetools codesample insertdatetime media nonbreaking save table contextmenu directionality advlist autolink lists link image charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen',
    'toolbar1': 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    'toolbar2': 'print preview media | forecolor backcolor emoticons | codesample ',
    'image_advtab': True,
    'theme_modern_toolbar_location': 'top',
    'theme_modern_toolbar_align': 'left'
}

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
    #'oauth2_provider.backends.OAuth2Backend',

)

SERIALIZATION_MODULES = {
    'xml':    'tagulous.serializers.xml_serializer',
    'json':   'tagulous.serializers.json',
    'python': 'tagulous.serializers.python',
    'yaml':   'tagulous.serializers.pyyaml',
}



GEOIP_DATABASE = 'static/GeoLiteCity.dat'
GEOIPV6_DATABASE = 'static/GeoIPv6.dat'

DEBUG_TOOLBAR_PATCH_SETTINGS = False
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    #'kiterope.middleware.DisableCsrfCheck',
    #'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    #'oauth2_provider.middleware.OAuth2TokenMiddleware',

]

#CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_WHITELIST = ('kiterope.com', 'localhost:8000','http://localhost:8000', 'localhost', 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com')
CORS_REPLACE_HTTPS_REFERER = True

'''CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
)'''

OAUTH2_PROVIDER = {
    # this is the list of available scopes
    'SCOPES': {'read': 'Read scope', 'write': 'Write scope', 'groups': 'Access to your groups'}
}

#REGISTRATION_FORM = 'registration.forms.UserRegistrationForm'
DOMAIN_NAME = 'kiterope.com'


#DJSTRIPE_SUBSCRIPTION_REQUIRED_EXCEPTION_URLS = (
#    'home',
#    'about',
#    "(allauth)",  # anything in the django-allauth URLConf

#)



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS':  [os.path.join(BASE_DIR, 'templates'),'/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/templates/' ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

            ],
        },
    },
]

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

WSGI_APPLICATION = 'kiterope.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
'''DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}'''

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

INTERNAL_IPS = (
    '192.168.1.48',
)
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = normpath(join(BASE_DIR, 'static'))

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "assets"),
#    '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/static/',
)



DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
]

# Django-allauth Settings






EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'eric@kiterope.com'
EMAIL_HOST_PASSWORD = 'passionate1'
DEFAULT_FROM_EMAIL = 'support@kiterope.com'

LOGIN_REDIRECT_URL = '/'



LOGIN_REDIRECT_URL = '/'
ACCOUNT_EMAIL_REQUIRED=True
ACCOUNT_AUTHENTICATED_LOGIN_REDIRECTS = False
ACCOUNT_EMAIL_VERIFICATION = "optional"
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_PROVIDERS = \
    {
    'facebook':
       {'METHOD': 'oauth2',
        'SCOPE': ['email', 'public_profile', 'user_friends'],
        'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
        'FIELDS': [
            'id',
            'email',
            'name',
            'first_name',
            'last_name',
            'verified',
            'locale',
            'timezone',
            'link',
            'gender',
            'updated_time'],
        'EXCHANGE_TOKEN': True,
        'LOCALE_FUNC': lambda request: 'en_US',
        'VERIFIED_EMAIL': False,
        'VERSION': 'v2.4'},
        'linkedin':
         {'SCOPE': ['r_emailaddress'],
          'PROFILE_FIELDS': ['id',
                            'first-name',
                            'last-name',
                            'email-address',
                            'picture-url',
                            'public-profile-url']},
        'google':
            { 'SCOPE': ['profile', 'email'],
            'AUTH_PARAMS': { 'access_type': 'online' } }
}
USE_S3 = False



AUTH_PROFILE_MODULE = 'accounts.Profile'


AWS_QUERYSTRING_AUTH = False
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

AWS_ACCESS_KEY_ID = 'AKIAJ5YZL4QGGT7IUJRA'
AWS_SECRET_ACCESS_KEY = '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'

S3_ACCESS_KEY_ID = 'AKIAJBHT4Q2VVU5CLFHQ'
S3_SECRET_ACCESS_KEY = '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'

AWS_STORAGE_BUCKET_NAME = 'kiterope-static'
MEDIA_ROOT = 'https://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME
MEDIA_URL = 'https://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME

if USE_S3:
    DEFAULT_FILE_STORAGE = 'kiterope-static.s3utils.MediaRootS3BotoStorage'
    THUMBNAIL_DEFAULT_STORAGE = 'kiterope-static.s3utils.MediaRootS3BotoStorage'
    MEDIA_URL = S3_URL + '/media/'

#MEDIA_ROOT = os.path.join(PROJECT_ROOT, '../..',  'media')
#STATIC_ROOT = os.path.join(PROJECT_ROOT, '../..', 'static')


DATETIME_INPUT_FORMATS = [
    '%Y-%m-%d %H:%i' ,
]

REST_AUTH_REGISTER_SERIALIZERS = {
        'REGISTER_SERIALIZER': 'kiterope.serializers.MyRegisterSerializer',
}

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

REST_SESSION_LOGIN = False

# Django Pipeline (and browserify)
#STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #'pipeline.finders.PipelineFinder',
)

# Celery configuration
broker_url = 'amqp://5ebe2294ecd0e0f08eab7690e2a6ee69:eac8d74fae134a9bbedb21ff824605ead6d858ef@localhost:5672'
result_backend = 'rpc://localhost'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
beat_scheduler='django_celery_beat.schedulers.DatabaseScheduler',

timezone = 'North America/Los Angeles'
enable_utc = True
include='kiterope.tasks'