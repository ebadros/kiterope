# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-13 22:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0223_contactgroup_isdefault'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='visualization',
            name='plan',
        ),
        migrations.RemoveField(
            model_name='visualization',
            name='program',
        ),
        migrations.AddField(
            model_name='planoccurrence',
            name='visualizations',
            field=models.ManyToManyField(blank=True, null=True, to='kiterope.Visualization'),
        ),
        migrations.AddField(
            model_name='program',
            name='visualizations',
            field=models.ManyToManyField(blank=True, null=True, to='kiterope.Visualization'),
        ),
        migrations.AddField(
            model_name='visualization',
            name='plans',
            field=models.ManyToManyField(blank=True, null=True, to='kiterope.PlanOccurrence'),
        ),
        migrations.AddField(
            model_name='visualization',
            name='programs',
            field=models.ManyToManyField(blank=True, null=True, to='kiterope.Program'),
        ),
    ]