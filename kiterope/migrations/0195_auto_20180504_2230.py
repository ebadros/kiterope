# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-05-04 22:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0194_auto_20180504_2229'),
    ]

    operations = [
        migrations.AlterField(
            model_name='program',
            name='startDateTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]