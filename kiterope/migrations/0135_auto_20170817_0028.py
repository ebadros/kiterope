# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-17 00:28
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0134_auto_20170816_1726'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expopushtoken',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]