# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-06-26 20:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0209_auto_20180626_1939'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='stripeCustomerId',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
