# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-02 18:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0026_remove_step_substeps'),
    ]

    operations = [
        migrations.AlterField(
            model_name='step',
            name='endTime',
            field=models.CharField(default=' ', max_length=10),
        ),
        migrations.AlterField(
            model_name='step',
            name='startTime',
            field=models.CharField(default=' ', max_length=10),
        ),
    ]
