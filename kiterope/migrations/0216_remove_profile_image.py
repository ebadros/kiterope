# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-05 21:02
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0215_auto_20180705_2033'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='image',
        ),
    ]