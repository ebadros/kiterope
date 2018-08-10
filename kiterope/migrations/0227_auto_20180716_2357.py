# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-16 23:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0226_auto_20180716_2208'),
    ]

    operations = [
        migrations.AlterField(
            model_name='update',
            name='measuringWhat',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AlterField(
            model_name='update',
            name='metricLabel',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='update',
            name='name',
            field=models.CharField(max_length=60),
        ),
        migrations.AlterField(
            model_name='update',
            name='units',
            field=models.CharField(default='', max_length=30, null=True),
        ),
    ]