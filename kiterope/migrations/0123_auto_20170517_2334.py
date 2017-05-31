# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-17 23:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0122_auto_20170505_0619'),
    ]

    operations = [
        migrations.AlterField(
            model_name='program',
            name='timeCommitment',
            field=models.CharField(blank=True, choices=[('10m', '10 minutes per day'), ('20m', '20 minutes per day'), ('30m', '30 minutes per day'), ('40m', '40 minutes per day'), ('50m', '50 minutes per day'), ('1h', '1 hour per day'), ('2h', '2 hours per day'), ('3h', '3 hours per day'), ('4h', '4 hours per day'), ('5h', '5 hours per day'), ('8h', '8 hours per day')], default='1h', max_length=100),
        ),
        migrations.AlterField(
            model_name='step',
            name='description',
            field=models.CharField(default=' ', max_length=1000),
        ),
        migrations.AlterField(
            model_name='step',
            name='duration',
            field=models.CharField(choices=[('1', '1 minute'), ('2', '2 minutes'), ('3', '3 minutes'), ('4', '4 minutes'), ('5', '5 minutes'), ('6', '6 minutes'), ('7', '7 minutes'), ('8', '8 minutes'), ('9', '9 minutes'), ('10', '10 minutes'), ('15', '15 minutes'), ('20', '20 minutes'), ('30', '30 minutes'), ('45', '45 minutes'), ('(60', '1 hour'), ('90', '1.5 hours'), ('120', '2 hours'), ('150', '2.5 hours'), ('180', '3 hours')], default='1', max_length=20),
        ),
    ]