import os
ROOT_PATH = os.path.dirname(os.path.abspath(__file__))

# You can key the configurations off of anything - I use project path.
configs = {'/Users/eric/Dropbox/_syncFolder/Business/kiterope/code/kiterope/kiterope/settings': 'development',
    '/opt/python/current/app/kiterope/kiterope/settings': 'production',
    '/opt/python/current/app/kiterope/kiterope/settings': 'staging',
}

# Import the configuration settings file - REPLACE projectname with your project
#config_module = __import__('kiterope.settings.%s' % configs[ROOT_PATH], globals(), locals(), 'kiterope')

config_module = __import__('kiterope.settings.%s' % configs[ROOT_PATH], globals(), locals(), 'kiterope')


# Load the config settings properties into the local scope.
for setting in dir(config_module):

    if setting == setting.upper():
        locals()[setting] = getattr(config_module, setting)