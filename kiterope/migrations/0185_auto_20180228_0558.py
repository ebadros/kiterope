# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-02-28 05:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0184_auto_20180203_0831'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='coreValues',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='goal',
            name='description',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='goal',
            name='obstacles',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
    ]