# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-07 23:26
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0047_auto_20161207_2307'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='updateoccurrence',
            name='stepOccurrence',
        ),
        migrations.RemoveField(
            model_name='updateoccurrence',
            name='update',
        ),
    ]