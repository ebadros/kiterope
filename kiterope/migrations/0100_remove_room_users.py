# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-14 23:19
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0099_auto_20170414_2318'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='users',
        ),
    ]
