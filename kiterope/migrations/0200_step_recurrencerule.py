# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-06-07 21:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0199_remove_step_recurrence'),
    ]

    operations = [
        migrations.AddField(
            model_name='step',
            name='recurrenceRule',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]