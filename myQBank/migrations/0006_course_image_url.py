# Generated by Django 4.0 on 2022-03-25 17:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0005_userscourses'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='image_url',
            field=models.URLField(blank=True),
        ),
    ]