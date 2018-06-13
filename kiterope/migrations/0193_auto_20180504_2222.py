# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-05-04 22:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0192_auto_20180425_2328'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='step',
            name='absoluteEndDate',
        ),
        migrations.RemoveField(
            model_name='step',
            name='absoluteStartDate',
        ),
        migrations.RemoveField(
            model_name='step',
            name='duration',
        ),
        migrations.RemoveField(
            model_name='step',
            name='endDate',
        ),
        migrations.RemoveField(
            model_name='step',
            name='startDate',
        ),
        migrations.RemoveField(
            model_name='step',
            name='startTime',
        ),
        migrations.AddField(
            model_name='step',
            name='absoluteEndDateTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='step',
            name='absoluteStartDateTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='step',
            name='endRecurrence',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='step',
            name='interval',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='step',
            name='monthlyDay',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='step',
            name='monthlyDayOption',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='step',
            name='monthlySpecificity',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='step',
            name='numberOfOccurrences',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='step',
            name='relativeEndDateTime',
            field=models.DurationField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='step',
            name='relativeStartDateTime',
            field=models.DurationField(blank=True, null=True),
        ),
    ]
