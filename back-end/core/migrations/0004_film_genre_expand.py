from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_add_fields_and_constraints'),
    ]

    operations = [
        migrations.AlterField(
            model_name='film',
            name='genre',
            field=models.CharField(
                max_length=50,
                choices=[
                    ('comedy', 'Comedy'), ('drama', 'Drama'),
                    ('thriller', 'Thriller'), ('action', 'Action'),
                    ('horror', 'Horror'), ('romance', 'Romance'),
                    ('scifi', 'Sci-Fi'), ('documentary', 'Documentary'),
                    ('animation', 'Animation'), ('other', 'Other'),
                ],
            ),
        ),
    ]
