# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-14 20:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0095_auto_20170414_1915'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='permission',
            field=models.TextField(choices=[('ONLYRECEIVER_ONLYSENDER', 'Only receiver and sender'), ('ONLYRECEIVER_ANYSENDER', 'Only receiver, any sender')], default='ONLYRECEIVER_ONLYSENDER'),
        ),
    ]
