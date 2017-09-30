# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-09-22 22:40
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0140_auto_20170916_0138'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='utcMidnight',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2000, 1, 1, 23, 59, 59, tzinfo=utc), null=True),
        ),
    ]
