# Generated by Django 4.0 on 2022-05-02 19:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0012_alter_attempted_topic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attempted',
            name='topic',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='myQBank.topic'),
        ),
    ]
