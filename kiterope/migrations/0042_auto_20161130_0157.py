# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-30 01:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0041_auto_20161129_2314'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='step',
            name='update01',
        ),
        migrations.RemoveField(
            model_name='step',
            name='update02',
        ),
        migrations.RemoveField(
            model_name='step',
            name='update03',
        ),
        migrations.AlterField(
            model_name='metric',
            name='measuringWhat',
            field=models.CharField(default='emotions and thoughts', max_length=30),
        ),
        migrations.AlterField(
            model_name='metric',
            name='units',
            field=models.CharField(blank=True, default=' ', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='update',
            name='metricLabel',
            field=models.CharField(default='Please provide an update:', max_length=100),
        ),
    ]
