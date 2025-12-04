from django.urls import path
from . import views

app_name = 'quiz'

urlpatterns = [
    path('', views.home, name='home'),
    path('game/<str:difficulty>/', views.game, name='game'),
    path('api/words/<str:difficulty>/', views.get_words_api, name='api_words'),
]
