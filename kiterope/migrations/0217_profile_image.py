# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-05 21:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0216_remove_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='image',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]