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
IN_PRODUCTION = False
IN_STAGING=False


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '53)0ss5l+^$y$s%p=6^7_kq5dqukpw)&g8zgx#m%zmk+4m37du'



ALLOWED_HOSTS = ['*']


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
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.linkedin_oauth2',
    'allauth.socialaccount.providers.facebook',
    'sorl.thumbnail',
    'rest_framework',
    # 'pipeline',
    'webpack_loader',
    'rest_framework_swagger',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',


]


#REGISTRATION_FORM = 'registration.forms.UserRegistrationForm'
ROOT_URLCONF = 'kiterope.urls'
DOMAIN_NAME = 'kiterope.com'



#DJSTRIPE_SUBSCRIPTION_REQUIRED_EXCEPTION_URLS = (
#    'home',
#    'about',
#    "(allauth)",  # anything in the django-allauth URLConf

#)



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',

            ],
        },
    },
]

SITE_ID=1


WSGI_APPLICATION = 'kiterope.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = normpath(join(BASE_DIR, 'static'))

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "assets"),
#    '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/static/',
)



# Django-allauth Settings



AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)


EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


LOGIN_REDIRECT_URL = '/'

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

LOGIN_REDIRECT_URL = '/'
ACCOUNT_AUTHENTICATED_LOGIN_REDIRECTS = False
ACCOUNT_EMAIL_VERIFICATION = "none"
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

AWS_QUERYSTRING_AUTH = False
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

AWS_ACCESS_KEY_ID = 'AKIAIHACGECWLNX6K5NQ'

AWS_SECRET_ACCESS_KEY = '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'

AWS_STORAGE_BUCKET_NAME = 'kiterope'
MEDIA_ROOT = 'https://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME
MEDIA_URL = 'https://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME

if USE_S3:
    DEFAULT_FILE_STORAGE = 'kiterope.s3utils.MediaRootS3BotoStorage'
    THUMBNAIL_DEFAULT_STORAGE = 'kiterope.s3utils.MediaRootS3BotoStorage'
    MEDIA_URL = S3_URL + '/media/'

#MEDIA_ROOT = os.path.join(PROJECT_ROOT, '../..',  'media')
#STATIC_ROOT = os.path.join(PROJECT_ROOT, '../..', 'static')
AWS_HEADERS = {
    'Expires': 'Thu, 15 Apr 2010 20:00:00 GMT',
    'Cache-Control': 'max-age=86400',
}

DATETIME_INPUT_FORMATS = [
    '%Y-%m-%d %H:%i' ,
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    'PAGE_SIZE': 10
}

# Django Pipeline (and browserify)
#STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #'pipeline.finders.PipelineFinder',
)

