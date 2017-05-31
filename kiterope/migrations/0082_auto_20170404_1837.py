# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-04 18:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0081_label_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='goal',
            name='coreValues',
        ),
        migrations.RemoveField(
            model_name='goal',
            name='goalInAlignmentWithCoreValues',
        ),
        migrations.RemoveField(
            model_name='goal',
            name='isThisReasonable',
        ),
        migrations.RemoveField(
            model_name='goal',
            name='obstacles',
        ),
        migrations.AlterField(
            model_name='plan',
            name='costFrequencyMetric',
            field=models.CharField(choices=[('MONTH', 'Per Month'), ('WEEK', 'Per Week'), ('ONE_TIME', 'One Time')], default='PER MONTH', max_length=20),
        ),
    ]