from django.contrib import admin
from .models import KatakanaWord


@admin.register(KatakanaWord)
class KatakanaWordAdmin(admin.ModelAdmin):
    list_display = ('katakana', 'english', 'difficulty', 'created_at')
    list_filter = ('difficulty',)
    search_fields = ('katakana', 'english')
    ordering = ('difficulty', 'katakana')
