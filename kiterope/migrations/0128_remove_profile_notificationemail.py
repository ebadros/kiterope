# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-16 16:46
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0127_profile_notificationemail'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='notificationEmail',
        ),
    ]
