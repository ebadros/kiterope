# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-09 20:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0010_auto_20160908_2057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plan',
            name='endDate',
            field=models.CharField(default=' ', max_length=16),
        ),
        migrations.AlterField(
            model_name='plan',
            name='startDate',
            field=models.CharField(default=' ', max_length=16),
        ),
    ]