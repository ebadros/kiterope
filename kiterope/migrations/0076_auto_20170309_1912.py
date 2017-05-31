# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-09 19:12
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kiterope', '0075_auto_20170308_2141'),
    ]

    operations = [
        migrations.CreateModel(
            name='MessageThread',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('labels', models.ManyToManyField(blank=True, related_name='labels', to='kiterope.Label')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='message',
            name='labels',
        ),
        migrations.RemoveField(
            model_name='message',
            name='receiver',
        ),
        migrations.RemoveField(
            model_name='message',
            name='sender',
        ),
        migrations.AddField(
            model_name='message',
            name='thread',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='messageThread', to='kiterope.MessageThread'),
            preserve_default=False,
        ),
    ]
