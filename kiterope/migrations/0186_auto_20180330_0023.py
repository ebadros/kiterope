# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-03-30 00:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0185_auto_20180228_0558'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='goalInAlignmentWithCoreValues',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='goal',
            name='isThisReasonable',
            field=models.BooleanField(default=False),
        ),
    ]
