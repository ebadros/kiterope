# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-06-26 02:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0203_program_stripeproductid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='program',
            name='cost',
            field=models.IntegerField(default=0),
        ),
    ]
