# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-14 17:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0078_auto_20170309_2150'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='isSender',
            field=models.BooleanField(default=False),
        ),
    ]
