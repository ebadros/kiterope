# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-11 23:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0221_auto_20180705_2245'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='contactGroups',
            field=models.ManyToManyField(blank=True, to='kiterope.ContactGroup'),
        ),
    ]