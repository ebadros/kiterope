# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-02-03 08:31
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0183_croppableimage_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='croppableImage',
            field=models.ForeignKey(blank=True, default='215', null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.CroppableImage'),
        ),
        migrations.AlterField(
            model_name='program',
            name='croppableImage',
            field=models.ForeignKey(blank=True, default='217', null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.CroppableImage'),
        ),
    ]
