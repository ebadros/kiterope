# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-15 01:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0106_remove_room_users'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='users2',
            new_name='users',
        ),
    ]