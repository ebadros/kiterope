# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-02 18:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0027_auto_20161102_1824'),
    ]

    operations = [
        migrations.AlterField(
            model_name='step',
            name='begins',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='step',
            name='ends',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
