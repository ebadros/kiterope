# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-21 01:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0080_auto_20170314_1831'),
    ]

    operations = [
        migrations.AddField(
            model_name='label',
            name='type',
            field=models.CharField(default='', max_length=20),
        ),
    ]
