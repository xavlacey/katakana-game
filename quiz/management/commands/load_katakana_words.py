import json
import os
from django.core.management.base import BaseCommand
from quiz.models import KatakanaWord


class Command(BaseCommand):
    help = 'Load katakana words from fixtures/initial_words.json into the database'

    def handle(self, *args, **options):
        fixtures_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'fixtures',
            'initial_words.json'
        )

        if not os.path.exists(fixtures_path):
            self.stdout.write(self.style.ERROR(f'Fixtures file not found: {fixtures_path}'))
            return

        with open(fixtures_path, 'r', encoding='utf-8') as f:
            words_data = json.load(f)

        created_count = 0
        updated_count = 0

        for word_data in words_data:
            word, created = KatakanaWord.objects.update_or_create(
                katakana=word_data['katakana'],
                defaults={
                    'romaji': word_data.get('romaji', ''),
                    'english': word_data['english'],
                    'difficulty': word_data['difficulty']
                }
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully loaded {created_count} new words and updated {updated_count} existing words'
            )
        )
