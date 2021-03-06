# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-06 19:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0004_goal_why'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='image',
            field=models.FileField(null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='goal',
            name='viewableBy',
            field=models.CharField(choices=[('ONLY_ME', 'Only me'), ('SHARED', "Just people I've shared this goal with"), ('MY_COACHES', 'Just my coaches'), ('ALL_COACHES', 'All coaches'), ('ANYONE', 'Anyone')], default='ONLY_ME', max_length=20),
        ),
    ]
