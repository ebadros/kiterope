#signals.py

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from haystack import signals
from .models import Program
from django.db import models

from haystack.exceptions import NotHandled

@receiver(post_save, sender=User)
def init_new_user(sender, instance, signal, created, **kwargs):
    if created:
        Token.objects.create(user=instance)


class ProgramSignalProcessor(signals.RealtimeSignalProcessor):
    def handle_save(self, sender, instance, **kwargs):
        if isinstance(instance, Program):
            using_backends = self.connection_router.for_write(instance=instance)
            for using in using_backends:
                try:
                    index = self.connections[using].get_unified_index().get_index(sender)
                    if instance.isActive:
                        print(instance.id)
                        index.update_object(instance, using=using)
                    else:
                        index.remove_object(instance, using=using)
                except NotHandled:
                    print(NotHandled.message)
        else:
            super(signals.RealtimeSignalProcessor, self).handle_save(sender, instance, **kwargs)




