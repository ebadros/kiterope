# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-06-26 19:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0208_program_stripeplanid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='planoccurrence',
            name='stripePlanId',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
