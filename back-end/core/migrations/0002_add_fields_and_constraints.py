from django.db import migrations, models


class Migration(migrations.Migration):
  
    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        
        migrations.AddField(
            model_name='film',
            name='director',
            field=models.CharField(blank=True, max_length=255),
        ),
        
        migrations.AddField(
            model_name='book',
            name='author',
            field=models.CharField(blank=True, max_length=255),
        ),
        
        migrations.AddField(
            model_name='book',
            name='year',
            field=models.IntegerField(blank=True, null=True),
        ),
        
        migrations.AddConstraint(
            model_name='dailycheckin',
            constraint=models.UniqueConstraint(
                fields=['user', 'date'],
                name='unique_checkin_per_day',
            ),
        ),
    ]
