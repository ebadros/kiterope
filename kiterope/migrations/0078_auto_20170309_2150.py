# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-09 21:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0077_auto_20170309_2132'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profilePhoto',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]