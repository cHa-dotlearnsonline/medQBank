# Generated by Django 4.0 on 2022-04-15 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0007_attempted_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='is_answered',
            field=models.BooleanField(default=False),
        ),
    ]
