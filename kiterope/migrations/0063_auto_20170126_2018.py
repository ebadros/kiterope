# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-01-26 20:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0062_auto_20170121_0149'),
    ]

    operations = [
        migrations.CreateModel(
            name='SearchQuery',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(default=' ', max_length=2000)),
            ],
        ),
        migrations.AlterField(
            model_name='plan',
            name='timeCommitment',
            field=models.CharField(blank=True, choices=[('1h', '1 hour per day'), ('2h', '2 hours per day'), ('3h', '3 hours per day'), ('4h', '4 hours per day'), ('5h', '5 hours per day'), ('8h', '8 hours per day')], default='1h', max_length=100),
        ),
    ]
