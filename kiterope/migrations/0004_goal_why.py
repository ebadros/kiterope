# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-06 17:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0003_goal_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='why',
            field=models.CharField(default=' ', max_length=200),
        ),
    ]
