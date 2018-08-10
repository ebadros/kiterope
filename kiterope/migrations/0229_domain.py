# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-07-19 19:49
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kiterope', '0228_auto_20180717_0006'),
    ]

    operations = [
        migrations.CreateModel(
            name='Domain',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subdomain', models.CharField(max_length=255)),
                ('logo', models.CharField(default='', max_length=255)),
                ('name', models.CharField(default='', max_length=255)),
                ('primaryColor', models.CharField(default='', max_length=6)),
                ('secondaryColor', models.CharField(default='', max_length=6)),
                ('tertiaryColor', models.CharField(default='', max_length=6)),
                ('adminUser', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('users', models.ManyToManyField(blank=True, related_name='users', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]