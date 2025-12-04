// Game state
let gameState = {
    difficulty: '',
    words: [],
    currentWordIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    shuffledWords: [],
    currentWordAttempts: 0
};

// Initialize the game
function initGame(difficulty) {
    gameState.difficulty = difficulty;
    fetchWords(difficulty);
}

// Fetch words from the API
async function fetchWords(difficulty) {
    try {
        const response = await fetch(`/api/words/${difficulty}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch words');
        }
        const words = await response.json();

        if (words.length === 0) {
            showError('No words found for this difficulty level');
            return;
        }

        gameState.words = words;
        gameState.shuffledWords = shuffleArray([...words]);
        gameState.currentWordIndex = 0;
        gameState.currentWordAttempts = 0;

        startGame();
    } catch (error) {
        console.error('Error fetching words:', error);
        showError('Failed to load words. Please try again.');
    }
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Start the game
function startGame() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';

    updateScore();
    displayCurrentWord();

    // Set up form submission
    const form = document.getElementById('answer-form');
    form.addEventListener('submit', handleSubmit);
}

// Display current word
function displayCurrentWord() {
    const currentWord = gameState.shuffledWords[gameState.currentWordIndex];
    const katakanaDisplay = document.getElementById('katakana-word');
    const feedback = document.getElementById('feedback');
    const answerInput = document.getElementById('answer-input');

    katakanaDisplay.textContent = currentWord.katakana;
    feedback.textContent = '';
    feedback.className = 'feedback';
    answerInput.value = '';
    answerInput.focus();

    // Reset attempts for new word
    gameState.currentWordAttempts = 0;

    updateProgress();
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();

    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentWord = gameState.shuffledWords[gameState.currentWordIndex];
    const correctAnswer = currentWord.english.toLowerCase();

    if (!userAnswer) {
        return;
    }

    const feedback = document.getElementById('feedback');

    if (userAnswer === correctAnswer) {
        // Correct answer
        gameState.correctCount++;
        feedback.textContent = 'Correct!';
        feedback.className = 'feedback correct';

        // Move to next word after a short delay
        setTimeout(() => {
            gameState.currentWordIndex++;

            if (gameState.currentWordIndex >= gameState.shuffledWords.length) {
                // Level complete
                completeLevel();
            } else {
                // Display next word
                displayCurrentWord();
            }

            updateScore();
        }, 1000);
    } else {
        // Incorrect answer - progressive hints
        gameState.incorrectCount++;
        gameState.currentWordAttempts++;

        if (gameState.currentWordAttempts === 1) {
            // First wrong attempt: just say try again
            feedback.textContent = 'Try again';
            feedback.className = 'feedback incorrect';
        } else if (gameState.currentWordAttempts === 2) {
            // Second wrong attempt: show romaji
            feedback.innerHTML = `Try again<br><span style="font-style: italic; opacity: 0.8;">Hint: ${currentWord.romaji}</span>`;
            feedback.className = 'feedback incorrect';
        } else {
            // Third wrong attempt: offer to reveal answer
            feedback.innerHTML = `
                <div>Still incorrect</div>
                <button id="reveal-btn" class="reveal-btn" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Reveal Answer
                </button>
            `;
            feedback.className = 'feedback incorrect';

            // Add event listener to reveal button
            document.getElementById('reveal-btn').addEventListener('click', () => {
                revealAnswer(currentWord);
            });
        }

        answerInput.value = '';
        answerInput.focus();
        updateScore();
    }
}

// Reveal answer and move to next word
function revealAnswer(currentWord) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = `The answer was: <strong>${currentWord.english}</strong>`;
    feedback.className = 'feedback incorrect';

    // Move to next word after a short delay
    setTimeout(() => {
        gameState.currentWordIndex++;

        if (gameState.currentWordIndex >= gameState.shuffledWords.length) {
            // Level complete
            completeLevel();
        } else {
            // Display next word
            displayCurrentWord();
        }

        updateScore();
    }, 2000);
}

// Update score display
function updateScore() {
    document.getElementById('correct-count').textContent = gameState.correctCount;
    document.getElementById('incorrect-count').textContent = gameState.incorrectCount;
}

// Update progress display
function updateProgress() {
    const total = gameState.shuffledWords.length;
    const current = gameState.currentWordIndex + 1;
    document.getElementById('progress').textContent = `${current}/${total}`;
}

// Complete level
function completeLevel() {
    // Hide quiz content
    document.getElementById('quiz-content').style.display = 'none';

    // Show completion screen
    const completion = document.getElementById('completion');
    const completionTitle = document.getElementById('completion-title');
    const completionMessage = document.getElementById('completion-message');
    const nextLevelBtn = document.getElementById('next-level-btn');

    completion.style.display = 'block';

    const accuracy = gameState.shuffledWords.length > 0
        ? Math.round((gameState.correctCount / (gameState.correctCount + gameState.incorrectCount)) * 100)
        : 0;

    completionTitle.textContent = `${capitalize(gameState.difficulty)} Level Complete!`;
    completionMessage.innerHTML = `
        <p>Great job! You completed the ${gameState.difficulty} level.</p>
        <p><strong>Score:</strong> ${gameState.correctCount} correct, ${gameState.incorrectCount} incorrect</p>
        <p><strong>Accuracy:</strong> ${accuracy}%</p>
    `;

    // Determine next level
    const nextLevel = getNextLevel(gameState.difficulty);
    if (nextLevel) {
        nextLevelBtn.style.display = 'inline-block';
        nextLevelBtn.textContent = `Continue to ${capitalize(nextLevel)}`;
        nextLevelBtn.onclick = () => {
            window.location.href = `/game/${nextLevel}/`;
        };
    } else {
        nextLevelBtn.style.display = 'none';
        completionMessage.innerHTML += '<p><strong>Congratulations! You\'ve completed all levels!</strong></p>';
    }
}

// Get next difficulty level
function getNextLevel(currentLevel) {
    const levels = {
        'beginner': 'intermediate',
        'intermediate': 'advanced',
        'advanced': null
    };
    return levels[currentLevel];
}

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show error message
function showError(message) {
    const loading = document.getElementById('loading');
    loading.textContent = message;
    loading.style.color = '#ef4444';
}
