# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-28 21:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0117_auto_20170428_1739'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='contacts',
            field=models.ManyToManyField(blank=True, related_name='kiterope_profile_related', through='kiterope.Contact', to='kiterope.Profile'),
        ),
        migrations.AlterField(
            model_name='contact',
            name='receiver',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='contact_receiver', to='kiterope.Profile'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='contact',
            name='sender',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='contact_sender', to='kiterope.Profile'),
            preserve_default=False,
        ),
    ]