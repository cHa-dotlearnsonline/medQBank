# Generated by Django 4.0 on 2022-09-09 23:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0023_remove_essayquestion_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='paidup',
            field=models.BooleanField(default=True),
        ),
    ]
