# Generated by Django 4.0 on 2022-07-05 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0016_essayanswer_essayquestion_subquestion_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='essay_topic',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='topic',
            name='mcq_topic',
            field=models.BooleanField(default=True),
        ),
    ]