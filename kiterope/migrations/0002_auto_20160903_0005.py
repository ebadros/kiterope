# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-03 00:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='goal',
            name='description',
        ),
        migrations.RemoveField(
            model_name='goal',
            name='isPublic',
        ),
        migrations.AddField(
            model_name='goal',
            name='viewableBy',
            field=models.CharField(choices=[('ANYONE', 'Anyone'), ('ALL_COACHES', 'All coaches'), ('MY_COACHES', 'Just my coaches'), ('SHARED', "Just people I've shared this goal with"), ('ONLY_ME', 'Only me')], default='ONLY_ME', max_length=20),
        ),
    ]