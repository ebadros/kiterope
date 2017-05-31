# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-15 01:10
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kiterope', '0104_auto_20170415_0105'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='users2',
            field=models.ManyToManyField(blank=True, related_name='kiterope_room_related', through='kiterope.RoomUser', to=settings.AUTH_USER_MODEL),
        ),
    ]