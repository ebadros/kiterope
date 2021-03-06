# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-29 21:33
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kiterope', '0039_auto_20161124_2300'),
    ]

    operations = [
        migrations.CreateModel(
            name='Metric',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('measuringWhat', models.CharField(default='quantity', max_length=20)),
                ('units', models.CharField(max_length=10)),
                ('format', models.CharField(choices=[('text', 'text'), ('integer', 'integer'), ('float', 'float'), ('url', 'url'), ('picture', 'picture'), ('video', 'video'), ('audio', 'audio')], default='text', max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='UpdateOccurrence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('integer', models.IntegerField(blank=True, null=True)),
                ('float', models.FloatField(blank=True, null=True)),
                ('audio', models.FileField(blank=True, null=True, upload_to='updates_audio')),
                ('video', models.FileField(blank=True, null=True, upload_to='updates_video')),
                ('picture', models.FileField(blank=True, null=True, upload_to='updates_picture')),
                ('url', models.URLField()),
                ('text', models.CharField(max_length=1000)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('stepOccurrence', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.StepOccurrence')),
            ],
        ),
        migrations.RemoveField(
            model_name='update',
            name='audioMeasurement',
        ),
        migrations.RemoveField(
            model_name='update',
            name='description',
        ),
        migrations.RemoveField(
            model_name='update',
            name='floatMeasurement',
        ),
        migrations.RemoveField(
            model_name='update',
            name='hasMetric',
        ),
        migrations.RemoveField(
            model_name='update',
            name='integerMeasurement',
        ),
        migrations.RemoveField(
            model_name='update',
            name='stepOccurrence',
        ),
        migrations.RemoveField(
            model_name='update',
            name='videoMeasurement',
        ),
        migrations.AddField(
            model_name='update',
            name='metricLabel',
            field=models.CharField(default=' ', max_length=100),
        ),
        migrations.AddField(
            model_name='update',
            name='step',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.Step'),
        ),
        migrations.AlterField(
            model_name='update',
            name='metric',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.Metric'),
        ),
        migrations.AddField(
            model_name='updateoccurrence',
            name='update',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kiterope.Update'),
        ),
    ]
