# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-01-27 01:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0063_auto_20170126_2018'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='coreValues',
            field=models.CharField(blank=True, default=' ', max_length=2000, null=True),
        ),
        migrations.AddField(
            model_name='goal',
            name='goalInAlignmentWithCoreValues',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='goal',
            name='isThisReasonable',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='goal',
            name='metric',
            field=models.CharField(blank=True, default=' ', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='goal',
            name='obstacles',
            field=models.CharField(blank=True, default=' ', max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='goal',
            name='description',
            field=models.CharField(blank=True, default=' ', max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='goal',
            name='image',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='goal',
            name='why',
            field=models.CharField(blank=True, default=' ', max_length=2000, null=True),
        ),
    ]
