# Generated by Django 3.2.14 on 2023-08-01 06:33

import contentcuration.models
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contentcuration', '0144_soft_delete_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='CaptionFile',
            fields=[
                ('id', contentcuration.models.UUIDField(default=uuid.uuid4, max_length=32, primary_key=True, serialize=False)),
                ('file_id', contentcuration.models.UUIDField(default=uuid.uuid4, max_length=32)),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='caption_file', to='contentcuration.language')),
            ],
            options={
                'unique_together': {('file_id', 'language')},
            },
        ),
        migrations.CreateModel(
            name='CaptionCue',
            fields=[
                ('id', contentcuration.models.UUIDField(default=uuid.uuid4, max_length=32, primary_key=True, serialize=False)),
                ('text', models.TextField()),
                ('starttime', models.FloatField()),
                ('endtime', models.FloatField()),
                ('caption_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='caption_cue', to='contentcuration.captionfile')),
            ],
        ),
    ]
