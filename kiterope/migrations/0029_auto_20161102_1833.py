# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-02 18:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0028_auto_20161102_1825'),
    ]

    operations = [
        migrations.AddField(
            model_name='step',
            name='durationMetric',
            field=models.CharField(blank=True, default='Hour', max_length=10),
        ),
        migrations.AlterField(
            model_name='step',
            name='date',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='step',
            name='endTime',
            field=models.CharField(blank=True, default=' ', max_length=10),
        ),
        migrations.AlterField(
            model_name='step',
            name='plan',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.Plan'),
        ),
        migrations.AlterField(
            model_name='step',
            name='startTime',
            field=models.CharField(blank=True, default=' ', max_length=10),
        ),
    ]
