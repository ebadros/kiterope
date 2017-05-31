# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-07 00:43
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kiterope', '0073_auto_20170307_0038'),
    ]

    operations = [
        migrations.AddField(
            model_name='label',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
