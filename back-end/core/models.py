from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class UrgentTaskManager(models.Manager):
    def urgent(self):
        return self.filter(quadrant='UI')

class Task(models.Model):
    QUADRANT_CHOICES = [
        ('UI',   'Urgent + Important'),
        ('UNI',  'Urgent + Not Important'),
        ('NUI',  'Not Urgent + Important'),
        ('NUNI', 'Not Urgent + Not Important'),
    ]
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title      = models.CharField(max_length=255)
    quadrant   = models.CharField(max_length=10, choices=QUADRANT_CHOICES)
    is_done    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    objects    = models.Manager()
    urgent_tasks = UrgentTaskManager()

    def __str__(self):
        return f"[{self.quadrant}] {self.title}"

class DailyCheckIn(models.Model):
    MOOD_CHOICES = [(i, i) for i in range(1, 6)]
    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='checkins')
    date         = models.DateField(auto_now_add=True)
    sleep_hours  = models.FloatField(validators=[MinValueValidator(0.0)])
    mood         = models.IntegerField(choices=MOOD_CHOICES)
    food_quality = models.IntegerField(choices=MOOD_CHOICES)
    energy_level = models.IntegerField(choices=MOOD_CHOICES)
    score        = models.FloatField(editable=False)
    notes        = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'date'], name='unique_checkin_per_day')
        ]
        ordering = ['-date']


    def calculate_score(self):
        sleep_norm  = min(self.sleep_hours / 8, 1.0) * 40
        mood_norm   = (self.mood / 5) * 30
        food_norm   = (self.food_quality / 5) * 15
        energy_norm = (self.energy_level / 5) * 15
        return round(sleep_norm + mood_norm + food_norm + energy_norm, 1)

    def save(self, *args, **kwargs):
        self.score = self.calculate_score()
        super().save(*args, **kwargs)

class Film(models.Model):
    GENRE_CHOICES = [
        ('comedy', 'Comedy'), ('drama', 'Drama'),
        ('thriller', 'Thriller'), ('documentary', 'Documentary'), ('scifi', 'Sci-fi'),
    ]
    STATUS_CHOICES = [
        ('want_to_watch', 'Want to Watch'),
        ('watching', 'Watching'),
        ('watched', 'Watched'),
    ]
    user     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='films')
    title    = models.CharField(max_length=255)
    director = models.CharField(max_length=255, blank=True)
    genre    = models.CharField(max_length=50, choices=GENRE_CHOICES)
    status   = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want_to_watch')
    rating   = models.IntegerField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Book(models.Model):
    MOOD_TAG_CHOICES = [
        ('light', 'Light'), ('deep', 'Deep'),
        ('educational', 'Educational'), ('fiction', 'Fiction'),
    ]
    STATUS_CHOICES = [
        ('want_to_read', 'Want to Read'),
        ('reading', 'Reading'),
        ('finished', 'Finished'),
    ]
    GENRE_CHOICES = [
        ('fantasy', 'Fantasy'),
        ('sci_fi', 'Sci-Fi'),
        ('romance', 'Romance'),
        ('thriller', 'Thriller'),
        ('mystery', 'Mystery'),
        ('biography', 'Biography'),
        ('self_help', 'Self-Help'),
        ('history', 'History'),
        ('other', 'Other'),
    ]
    user     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    title    = models.CharField(max_length=255)
    author   = models.CharField(max_length=255, blank=True)
    year     = models.IntegerField(null=True, blank=True)
    genre    = models.CharField(max_length=50, choices=GENRE_CHOICES, default='other')
    mood_tag = models.CharField(max_length=50, choices=MOOD_TAG_CHOICES)
    status   = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want_to_read')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
