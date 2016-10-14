#
from kiterope.settings.common import *

DEBUG = True
WWW_ROOT = '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope'


IS_DEV = True
IS_PROD = False

ALLOWED_HOSTS = []
ROOT_URLCONF = 'kiterope.urls_development'

#ALLOWED_HOSTS = ['*']

TEMPLATE_DEBUG = True
THUMBNAIL_DEBUG = True

CORS_ORIGIN_ALLOW_ALL = True



'''VP STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
    '/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/static/',
)'''






