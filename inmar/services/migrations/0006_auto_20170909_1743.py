# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-09-09 17:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0005_auto_20170909_1633'),
    ]

    operations = [
        migrations.AlterField(
            model_name='department',
            name='name',
            field=models.TextField(),
        ),
    ]
