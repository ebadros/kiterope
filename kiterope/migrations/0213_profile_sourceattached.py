# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-06-28 00:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0212_auto_20180626_2341'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='sourceAttached',
            field=models.BooleanField(default=False),
        ),
    ]
