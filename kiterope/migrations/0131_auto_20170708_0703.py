# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-08 07:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0130_planoccurrence_notificationsendtime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='metric',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='goal',
            name='why',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
    ]
