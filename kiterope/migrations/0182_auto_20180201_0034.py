# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-02-01 00:34
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0181_auto_20180131_2332'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='profilePhoto',
            new_name='image',
        ),
    ]
