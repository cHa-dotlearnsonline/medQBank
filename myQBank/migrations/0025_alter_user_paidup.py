# Generated by Django 4.0 on 2022-09-09 23:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0024_user_paidup'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='paidup',
            field=models.BooleanField(default=False),
        ),
    ]
