# Generated by Django 4.2.6 on 2024-04-24 23:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Character',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('backstory', models.TextField()),
                ('character_type', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Trait',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('collaborators', models.ManyToManyField(related_name='collaborating_stories', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Script',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('genre', models.CharField(max_length=100)),
                ('setting', models.CharField(max_length=200)),
                ('time_period', models.CharField(max_length=100)),
                ('story_type', models.CharField(max_length=100)),
                ('pace', models.CharField(max_length=100)),
                ('story_tone', models.CharField(max_length=100)),
                ('writing_style', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('story', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scripts', to='script_generation.story')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scripts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Relationship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField(default=5)),
                ('relationship_type', models.CharField(max_length=100)),
                ('from_character', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relationships_from', to='script_generation.character')),
                ('to_character', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relationships_to', to='script_generation.character')),
            ],
        ),
        migrations.AddField(
            model_name='character',
            name='script',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='characters', to='script_generation.script'),
        ),
        migrations.AddField(
            model_name='character',
            name='story',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='characters', to='script_generation.story'),
        ),
        migrations.AddField(
            model_name='character',
            name='traits',
            field=models.ManyToManyField(related_name='characters', to='script_generation.trait'),
        ),
    ]