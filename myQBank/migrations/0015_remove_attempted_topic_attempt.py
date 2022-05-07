# Generated by Django 4.0 on 2022-05-06 16:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myQBank', '0014_alter_attempted_topic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attempted',
            name='topic',
        ),
        migrations.CreateModel(
            name='Attempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('totalAttempts', models.IntegerField(default=0)),
                ('correctAttempts', models.IntegerField(default=0)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='myQBank.course')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myQBank.question')),
                ('topic', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='myQBank.topic')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myQBank.user')),
            ],
        ),
    ]