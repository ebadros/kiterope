# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-28 17:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0115_remove_profile_contacts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='wasConfirmed',
            field=models.CharField(default=' ', max_length=20),
        ),
    ]