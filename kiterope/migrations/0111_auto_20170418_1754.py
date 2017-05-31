# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-18 17:54
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kiterope', '0110_auto_20170418_1640'),
    ]

    operations = [
        migrations.CreateModel(
            name='KChannel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.TextField(max_length=16, unique=True)),
                ('permission', models.CharField(choices=[('ONLYRECEIVER_ONLYSENDER', 'Only receiver and sender'), ('ONLYRECEIVER_ANYSENDER', 'Only receiver, any sender')], default='ONLYRECEIVER_ONLYSENDER', max_length=30)),
            ],
        ),
        migrations.RenameModel(
            old_name='ChannelUser',
            new_name='KChannelUser',
        ),
        migrations.RemoveField(
            model_name='channel',
            name='users',
        ),
        migrations.AlterField(
            model_name='kchanneluser',
            name='channel',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kiterope.KChannel'),
        ),
        migrations.AlterField(
            model_name='krmessage',
            name='channel',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='krmessages', to='kiterope.KChannel'),
        ),
        migrations.AlterField(
            model_name='messagethread',
            name='channel',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.KChannel'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='notificationChannel',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kiterope.KChannel'),
        ),
        migrations.DeleteModel(
            name='Channel',
        ),
        migrations.AddField(
            model_name='kchannel',
            name='users',
            field=models.ManyToManyField(blank=True, related_name='kiterope_kchannel_related', through='kiterope.KChannelUser', to=settings.AUTH_USER_MODEL),
        ),
    ]