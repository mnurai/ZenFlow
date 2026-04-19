from django.contrib import admin
from .models import Task, DailyCheckIn, Film, Book

admin.site.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'title', 'quadrant', 'is_done', 'created_at')
    list_filter   = ('quadrant', 'is_done')
    search_fields = ('title', 'user__username')
  
admin.site.register(DailyCheckIn)
class DailyCheckInAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'date', 'score', 'sleep_hours', 'mood', 'energy_level')
    list_filter   = ('date',)
    search_fields = ('user__username',)
    readonly_fields = ('score',)

admin.site.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'title', 'director', 'genre', 'status', 'rating', 'added_at')
    list_filter   = ('genre', 'status')
    search_fields = ('title', 'director', 'user__username')

admin.site.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'title', 'author', 'year', 'mood_tag', 'status', 'added_at')
    list_filter   = ('mood_tag', 'status')
    search_fields = ('title', 'author', 'user__username')

