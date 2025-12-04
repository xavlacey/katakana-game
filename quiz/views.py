from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import KatakanaWord


def home(request):
    """Landing page with difficulty level selection"""
    return render(request, 'quiz/home.html')


def game(request, difficulty):
    """Main game interface for specified difficulty level"""
    # Validate difficulty level
    valid_difficulties = ['beginner', 'intermediate', 'advanced']
    if difficulty not in valid_difficulties:
        return redirect('quiz:home')

    context = {
        'difficulty': difficulty,
    }
    return render(request, 'quiz/game.html', context)


def get_words_api(request, difficulty):
    """API endpoint that returns JSON array of words for specified difficulty"""
    # Validate difficulty level
    valid_difficulties = ['beginner', 'intermediate', 'advanced']
    if difficulty not in valid_difficulties:
        return JsonResponse({'error': 'Invalid difficulty level'}, status=400)

    # Fetch words for the specified difficulty
    words = KatakanaWord.objects.filter(difficulty=difficulty).values('id', 'katakana', 'romaji', 'english')
    words_list = list(words)

    return JsonResponse(words_list, safe=False)
