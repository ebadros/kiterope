# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-10-24 21:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0161_auto_20171024_2113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='update',
            name='steps',
            field=models.ManyToManyField(null=True, related_name='kiterope_stepupdate', to='kiterope.Step'),
        ),
    ]
