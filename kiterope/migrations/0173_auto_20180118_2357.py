# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-01-18 23:57
from __future__ import unicode_literals

from django.db import migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0172_auto_20180118_2254'),
    ]

    operations = [
        migrations.AlterField(
            model_name='croppableimage',
            name='cropperCropboxData',
            field=jsonfield.fields.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='croppableimage',
            name='cropperImageData',
            field=jsonfield.fields.JSONField(blank=True, null=True),
        ),
    ]
