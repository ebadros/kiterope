# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-05 22:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0220_remove_contact_relationship'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactgroup',
            name='contacts',
            field=models.ManyToManyField(blank=True, to='kiterope.Contact'),
        ),
    ]