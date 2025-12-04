from django.db import models


class KatakanaWord(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    katakana = models.CharField(max_length=100, unique=True)
    romaji = models.CharField(max_length=100, default='')
    english = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['difficulty', 'katakana']
        indexes = [
            models.Index(fields=['difficulty']),
        ]

    def __str__(self):
        return f"{self.katakana} - {self.english} ({self.difficulty})"
