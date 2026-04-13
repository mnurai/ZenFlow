from django.contrib import admin
from .models import Task, DailyCheckIn, Film, Book

admin.site.register(Task)
admin.site.register(DailyCheckIn)
admin.site.register(Film)
admin.site.register(Book)
