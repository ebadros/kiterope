# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-05-04 22:55
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0195_auto_20180504_2230'),
    ]

    operations = [
        migrations.RenameField(
            model_name='planoccurrence',
            old_name='startDate',
            new_name='startDateTime',
        ),
    ]