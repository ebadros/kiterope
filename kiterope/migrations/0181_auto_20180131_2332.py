# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-01-31 23:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0180_program_croppableimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='croppableImage',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.CroppableImage'),
        ),
        migrations.AddField(
            model_name='profile',
            name='croppableImage',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.CroppableImage'),
        ),
    ]
