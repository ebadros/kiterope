# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-10-24 21:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0160_update_default'),
    ]

    operations = [
        migrations.AddField(
            model_name='updateoccurrence',
            name='boolean',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='updateoccurrence',
            name='datetime',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='metric',
            name='format',
            field=models.CharField(choices=[('text', 'text'), ('integer', 'integer'), ('decimal', 'decimal'), ('url', 'url'), ('picture', 'picture'), ('video', 'video'), ('audio', 'audio'), ('boolean', 'boolean'), ('datetime', 'datetime')], default='text', max_length=10),
        ),
        migrations.AlterField(
            model_name='update',
            name='format',
            field=models.CharField(choices=[('text', 'text'), ('integer', 'integer'), ('decimal', 'decimal'), ('url', 'url'), ('picture', 'picture'), ('video', 'video'), ('audio', 'audio'), ('boolean', 'boolean'), ('datetime', 'datetime')], default='text', max_length=10),
        ),
    ]
