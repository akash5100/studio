# Generated by Django 3.2.14 on 2023-06-15 06:13

import contentcuration.models
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contentcuration', '0142_add_task_signature'),
    ]

    operations = [
        migrations.CreateModel(
            name='Caption',
            fields=[
                ('id', contentcuration.models.UUIDField(default=uuid.uuid4, max_length=32, primary_key=True, serialize=False)),
                ('caption', models.JSONField()),
                ('language', models.CharField(max_length=10)),
            ],
        ),
    ]