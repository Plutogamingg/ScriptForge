# Generated by Django 4.2.6 on 2024-05-11 15:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('script_generation', '0007_script_script_context'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='stories', to=settings.AUTH_USER_MODEL),
        ),
    ]
