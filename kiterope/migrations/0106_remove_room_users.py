# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-15 01:10
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0105_room_users2'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='users',
        ),
    ]
