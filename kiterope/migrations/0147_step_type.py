# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-10-06 18:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0146_auto_20170929_2228'),
    ]

    operations = [
        migrations.AddField(
            model_name='step',
            name='type',
            field=models.CharField(choices=[('COMPLETION', 'Completion-Based Step'), ('TIME', 'Time-Based Step'), ('ORDERED_COMPLETION', 'Ordered, Completion-Based Step')], default='COMPLETION', max_length=30),
        ),
    ]