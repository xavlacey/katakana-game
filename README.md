# Katakana Learning Game

A flashcard-style web game to help you learn Japanese katakana characters by typing English translations of katakana words.

![Game Preview](https://img.shields.io/badge/Django-5.2.9-green) ![Python](https://img.shields.io/badge/Python-3.11+-blue)

## Features

- **Progressive Difficulty Levels**: Three levels (Beginner, Intermediate, Advanced) with auto-advancement
- **Smart Hint System**:
  - 1st wrong attempt: "Try again"
  - 2nd wrong attempt: Shows romaji pronunciation hint
  - 3rd wrong attempt: Offers to reveal the answer
- **87 Curated Words**: Carefully selected katakana vocabulary with difficulty classification
- **Session-Only Tracking**: No login required, scores tracked during gameplay session
- **Responsive Design**: Works on desktop and mobile devices
- **Instant Feedback**: Real-time validation with visual feedback

## Difficulty Levels

Words are automatically categorized by complexity:

- **Beginner** (28 words): Basic katakana only - no diacritics, small characters, or long vowel marks
- **Intermediate** (36 words): Words with diacritics (゛゜) like バ, ギ, パ
- **Advanced** (23 words): Words with small characters (ッ, ェ, ァ, ォ, ュ)

## Tech Stack

- **Backend**: Django 5.2.9
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with gradient backgrounds and animations

## Installation

### Prerequisites

- Python 3.11 or higher
- pip

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd katakana-game
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Django:
```bash
pip install django
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Load the initial word data:
```bash
python manage.py load_katakana_words
```

6. Start the development server:
```bash
python manage.py runserver
```

7. Open your browser and navigate to:
```
http://127.0.0.1:8000/
```

## How to Play

1. **Select a difficulty level**: Start with Beginner or jump to any level
2. **Read the katakana word**: A Japanese word will be displayed in katakana
3. **Type the English translation**: Enter what you think the word means in English
4. **Get instant feedback**:
   - Correct answers advance to the next word
   - Wrong answers show progressive hints
5. **Complete the level**: After finishing all words, automatically advance to the next difficulty
6. **Master all levels**: Complete Beginner → Intermediate → Advanced

## Project Structure

```
katakana-game/
├── katakanagame/              # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── views.py
├── quiz/                      # Main quiz app
│   ├── models.py             # KatakanaWord model
│   ├── views.py              # Game views and API
│   ├── urls.py               # App URL routing
│   ├── admin.py              # Django admin config
│   ├── templates/
│   │   └── quiz/
│   │       ├── base.html     # Base template
│   │       ├── home.html     # Landing page
│   │       └── game.html     # Game interface
│   ├── static/
│   │   └── quiz/
│   │       ├── css/
│   │       │   └── style.css # Game styling
│   │       └── js/
│   │           └── game.js   # Game logic
│   ├── fixtures/
│   │   └── initial_words.json # Word database
│   └── management/
│       └── commands/
│           └── load_katakana_words.py
├── manage.py
└── README.md
```

## Database Schema

### KatakanaWord Model

| Field | Type | Description |
|-------|------|-------------|
| katakana | CharField | The katakana characters |
| romaji | CharField | Romanized pronunciation |
| english | CharField | English translation |
| difficulty | CharField | beginner/intermediate/advanced |
| created_at | DateTimeField | Timestamp |

## Adding New Words

You can add new words through the Django admin interface:

1. Create a superuser:
```bash
python manage.py createsuperuser
```

2. Access the admin panel:
```
http://127.0.0.1:8000/admin/
```

3. Navigate to "Katakana Words" and add entries

Or edit the fixtures file directly:
```bash
# Edit quiz/fixtures/initial_words.json
# Then reload:
python manage.py load_katakana_words
```

## API Endpoints

- `GET /` - Home page with difficulty selection
- `GET /game/<difficulty>/` - Game interface for specified difficulty
- `GET /api/words/<difficulty>/` - JSON API returning words for a difficulty level

## Game Logic

The game implements a progressive hint system:

1. **Attempt Tracking**: Each word tracks wrong attempts independently
2. **Hint Progression**:
   - Shows romaji after 2nd wrong attempt
   - Offers answer reveal after 3rd wrong attempt
3. **Score Tracking**: Counts correct and incorrect answers
4. **Auto-Advancement**: Automatically moves to next difficulty upon completion

## Development

### Running Tests

```bash
python manage.py test quiz
```

### Code Style

The project follows standard Django conventions and PEP 8 style guidelines.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Word data sourced from [JLPT Sensei](https://jlptsensei.com/japanese-katakana-words-list/)
- Built with Django and vanilla JavaScript for maximum simplicity

## Future Enhancements

Potential features to add:

- [ ] Sound pronunciation for katakana words
- [ ] Spaced repetition algorithm
- [ ] User accounts with progress tracking
- [ ] Leaderboards
- [ ] Multiple choice mode
- [ ] Custom word sets
- [ ] Dark mode
- [ ] Mobile app version

---

**Enjoy learning katakana! がんばって！(Ganbatte!)**
