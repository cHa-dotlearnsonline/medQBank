# Generated by Django 4.0 on 2022-05-02 18:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0009_attempted_topic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attempted',
            name='topic',
        ),
    ]
