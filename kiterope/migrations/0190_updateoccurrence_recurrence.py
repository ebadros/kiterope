# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-04-25 22:44
from __future__ import unicode_literals

from django.db import migrations
import recurrence.fields


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0189_auto_20180413_2000'),
    ]

    operations = [
        migrations.AddField(
            model_name='updateoccurrence',
            name='recurrence',
            field=recurrence.fields.RecurrenceField(blank=True, null=True),
        ),
    ]
