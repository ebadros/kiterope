# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-01-31 00:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0067_auto_20170130_1956'),
    ]

    operations = [
        migrations.AddField(
            model_name='participant',
            name='session',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='kiterope.Session'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='participant',
            name='joiningTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='participant',
            name='leavingTime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='participant',
            name='role',
            field=models.CharField(choices=[('INITIATING_USER', 'Initiating User'), ('USER', 'User'), ('INITIATING_COACH', 'Initiating Coach'), ('COACH', 'Coach')], max_length=20),
        ),
        migrations.AlterField(
            model_name='session',
            name='participants',
            field=models.ManyToManyField(blank=True, related_name='participants', to='kiterope.Participant'),
        ),
    ]
