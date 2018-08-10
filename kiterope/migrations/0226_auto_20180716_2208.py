# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-16 22:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0225_auto_20180713_2224'),
    ]

    operations = [
        migrations.AlterField(
            model_name='update',
            name='format',
            field=models.CharField(choices=[('text', 'text'), ('integer', 'integer'), ('decimal', 'decimal'), ('url', 'url'), ('picture', 'picture'), ('video', 'video'), ('audio', 'audio'), ('boolean', 'boolean'), ('datetime', 'datetime')], default='text', max_length=30),
        ),
        migrations.AlterField(
            model_name='update',
            name='measuringWhat',
            field=models.CharField(default='emotions and thoughts', max_length=50),
        ),
        migrations.AlterField(
            model_name='update',
            name='units',
            field=models.CharField(blank=True, default=' ', max_length=30, null=True),
        ),
    ]