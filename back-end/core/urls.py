from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import register_view, login_view, logout_view, TaskListView, TaskDetailView

from .views import (
    FilmListView, film_detail_view,
    BookListView, book_detail_view,
    checkin_view, checkin_latest_view,
    recommendation_view, task_stats_view,
)

urlpatterns = [
    path('auth/register/', register_view),
    path('auth/login/', login_view),
    path('auth/logout/', logout_view),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('tasks/stats/', task_stats_view),
    path('tasks/', TaskListView.as_view()),
    path('tasks/<int:pk>/', TaskDetailView.as_view()),

    path('films/', FilmListView.as_view()),
    path('films/<int:pk>/', film_detail_view),
    path('books/', BookListView.as_view()),
    path('books/<int:pk>/', book_detail_view),
    path('checkins/latest/', checkin_latest_view),
    path('checkins/', checkin_view),
    path('recommendation/', recommendation_view),   
]
