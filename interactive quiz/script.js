const questions = [
    { question: "What is the capital of Japan?", options: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"], answer: 0 },
    { question: "Which Japanese city is known for its historic temples?", options: ["Kyoto", "Tokyo", "Nagoya", "Fukuoka"], answer: 0 },
    { question: "What is Japan's national sport?", options: ["Sumo", "Judo", "Kendo", "Karate"], answer: 0 },
    { question: "In which Japanese city is the famous cherry blossom festival held?", options: ["Tokyo", "Kyoto", "Sapporo", "Osaka"], answer: 1 },
    { question: "Which Japanese company is known for its video game consoles?", options: ["Sony", "Nintendo", "Panasonic", "Sharp"], answer: 1 },
    { question: "What is Japan's traditional rice wine called?", options: ["Sake", "Shochu", "Umeshu", "Hibiki"], answer: 0 },
    { question: "Which Japanese island is famous for its hot springs?", options: ["Hokkaido", "Honshu", "Kyushu", "Shikoku"], answer: 2 },
    { question: "Which city in Japan is known for its electronics industry?", options: ["Osaka", "Kyoto", "Tokyo", "Nagoya"], answer: 3 },
    { question: "What is the name of the Japanese art of folding paper into various shapes?", options: ["Origami", "Ikebana", "Calligraphy", "Sumi-e"], answer: 0 },
    { question: "What type of theater is traditional in Japan?", options: ["Kabuki", "Noh", "Bunraku", "All of the above"], answer: 3 }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let userAnswers = [];
let selectedOptionIndex = null;

document.getElementById('user-info-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
});

document.getElementById('next-button').addEventListener('click', () => {
    if (selectedOptionIndex !== null) {
        handleOptionSelection(selectedOptionIndex);
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResults();
        }
    }
});

document.getElementById('restart-button').addEventListener('click', () => {
    location.reload();
});

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.remove('selected-option', 'correct-option', 'incorrect-option');
        button.addEventListener('click', () => handleOptionClick(index, button));
        optionsContainer.appendChild(button);
    });

    selectedOptionIndex = null;
    document.getElementById('next-button').style.display = 'none';
    resetTimer(); // Ensure the timer is reset before starting
    startTimer();
}

function handleOptionClick(selectedIndex, button) {
    const optionButtons = document.querySelectorAll('#options button');
    optionButtons.forEach((btn, index) => {
        if (index === selectedIndex) {
            btn.classList.add('selected-option');
            selectedOptionIndex = selectedIndex;
        } else {
            btn.classList.remove('selected-option');
        }
    });
    document.getElementById('next-button').style.display = 'block';
}

function handleOptionSelection(selectedIndex) {
    const question = questions[currentQuestionIndex];
    if (selectedIndex === question.answer) {
        score += 4;
    } else {
        score -= 0.25;
    }
    userAnswers[currentQuestionIndex] = { selectedIndex, correct: selectedIndex === question.answer };
}

function startTimer() {
    let timeLeft = 20;
    document.getElementById('timer-count').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-count').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleOptionSelection(-1); // Automatically proceed to the next question with a penalty
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResults();
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    document.getElementById('timer-count').textContent = 20;
}

function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<h3>Your final score is: <strong>${score.toFixed(2)}</strong></h3>`;

    questions.forEach((question, index) => {
        const optionButtons = Array.from(document.querySelectorAll('#options button'));
        resultsContainer.innerHTML += `<p>Question: ${question.question}</p>`;

        question.options.forEach((option, optionIndex) => {
            const optionClass = optionIndex === question.answer ? 'correct-option' :
                                (userAnswers[index] && optionIndex === userAnswers[index].selectedIndex) ? 'incorrect-option' : '';
            resultsContainer.innerHTML += `<p class="${optionClass}">${option}</p>`;
        });

        resultsContainer.innerHTML += `<p>Correct Answer: ${question.options[question.answer]}</p>`;
        resultsContainer.innerHTML += `<p>Your Answer: ${userAnswers[index] ? question.options[userAnswers[index].selectedIndex] : 'Not answered'}</p><br>`;
    });
}
