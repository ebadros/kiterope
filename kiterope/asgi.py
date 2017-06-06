import os
import channels.asgi

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "kiterope.settings.settingsConfiguration")
channel_layer = channels.asgi.get_channel_layer()