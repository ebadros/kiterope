# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-26 23:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kiterope', '0233_remove_updateoccurrence_pictures'),
    ]

    operations = [
        migrations.CreateModel(
            name='UrlClass',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='updateoccurrence',
            name='pictures',
            field=models.ManyToManyField(blank=True, to='kiterope.UrlClass'),
        ),
    ]
