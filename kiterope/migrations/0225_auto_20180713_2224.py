# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-13 22:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0224_auto_20180713_2211'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='planoccurrence',
            name='visualizations',
        ),
        migrations.RemoveField(
            model_name='program',
            name='visualizations',
        ),
        migrations.RemoveField(
            model_name='visualization',
            name='plans',
        ),
        migrations.RemoveField(
            model_name='visualization',
            name='programs',
        ),
        migrations.AddField(
            model_name='visualization',
            name='plan',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.PlanOccurrence'),
        ),
        migrations.AddField(
            model_name='visualization',
            name='program',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.Program'),
        ),
    ]
