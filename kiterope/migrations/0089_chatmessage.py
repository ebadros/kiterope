# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-13 00:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0088_auto_20170411_2053'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=1000)),
                ('room', models.CharField(max_length=100)),
            ],
        ),
    ]