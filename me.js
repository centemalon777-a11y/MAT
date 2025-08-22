const questions = [
  {
    question: "1. Solve for x: 2x - 3 = 7",
    options: ["x = 2", "x = 3", "x = 5", "x = 7"],
    answer: 2
  },
  {
    question: "2. Which of the following is a solution to 3x + 2 < 11?",
    options: ["x < 3", "x > 3", "x < 2", "x = 4"],
    answer: 0
  },
  {
    question: "3. If f(x) = 2x + 1, what is f(3)?",
    options: ["5", "6", "7", "8"],
    answer: 2
  },
  {
    question: "4. What is the slope of the line y = -4x + 2?",
    options: ["4", "-2", "-4", "2"],
    answer: 2
  },
  {
    question: "5. Solve: |x - 5| = 3",
    options: ["x = 2 or x = 8", "x = 3 or x = 6", "x = 4 or x = 9", "x = 1 or x = 7"],
    answer: 0
  },
  {
    question: "6. A line passes through (0, 3) and (2, 7). What is the slope?",
    options: ["1", "2", "3", "4"],
    answer: 1
  },
  {
    question: "7. Solve: 5x - 2 = 3x + 6",
    options: ["x = 4", "x = -4", "x = 2", "x = 8"],
    answer: 0
  },
  {
    question: "8. If y varies directly with x, and y = 10 when x = 2, what is y when x = 5?",
    options: ["20", "15", "25", "30"],
    answer: 1
  },
  {
    question: "9. Which expression is equivalent to (x + 3)(x - 2)?",
    options: ["x² + x - 6", "x² - x + 6", "x² + 5x - 6", "x² - 5x - 6"],
    answer: 0
  },
  {
    question: "10. If 4x² = 100, what is x?",
    options: ["±5", "5", "10", "±10"],
    answer: 3
  },
        {
        question: "1. Solve for x: 2x - 3 = 7",
        options: ["x = 2", "x = 3", "x = 5", "x = 7"],
        answer: 2
      },
      {
        question: "2. Which of the following is a solution to the inequality 3x + 2 < 11?",
        options: ["x < 3", "x > 3", "x < 2", "x = 4"],
        answer: 0
      },
      {
        question: "3. If f(x) = 2x + 1, what is f(3)?",
        options: ["5", "6", "7", "8"],
        answer: 2
      },
      {
        question: "4. What is the slope of the line y = -4x + 2?",
        options: ["4", "-2", "-4", "2"],
        answer: 2
      },
      {
        question: "5. Solve: |x - 5| = 3",
        options: ["x = 2 or x = 8", "x = 3 or x = 6", "x = 4 or x = 9", "x = 1 or x = 7"],
        answer: 0
      }
];
  let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let timerInterval;
let timeLeft = 30 * 60; // 30 minutes in seconds

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  timerEl.textContent = `Time Left: ${formatTime(timeLeft)}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${formatTime(timeLeft)}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
      speak("Time is up! The quiz has ended.");
    }
  }, 1000);
}

function showQuestion() {
  selectedOption = null;
  nextBtn.disabled = true;
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx, btn);
    li.appendChild(btn);
    optionsEl.appendChild(li);
  });
  scoreEl.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  // Show/hide buttons
  if (currentQuestion === questions.length - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
  } else {
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  }
}

function selectOption(idx, btn) {
  selectedOption = idx;
  Array.from(optionsEl.querySelectorAll('button')).forEach(b => b.disabled = true);
  const isCorrect = idx === questions[currentQuestion].answer;
  btn.style.background = isCorrect ? '#28a745' : '#dc3545';
  if (isCorrect) {
    score++;
    speak("Correct! Well done.");
  } else {
    const correctAnswer = questions[currentQuestion].options[questions[currentQuestion].answer];
    speak("Incorrect. The correct answer is " + correctAnswer + ".");
  }
  nextBtn.disabled = false;
  submitBtn.disabled = false;
}

nextBtn.onclick = () => {
  currentQuestion++;
  showQuestion();
};

submitBtn.onclick = showResult;

function showResult() {
  if (timerInterval) clearInterval(timerInterval);
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = '';
  nextBtn.style.display = 'none';
  submitBtn.style.display = 'none';
  scoreEl.textContent = `Your Score: ${score} / ${questions.length}`;
  speak(`Quiz completed. Your score is ${score} out of ${questions.length}.`);
  saveScoreHistory(score, questions.length);
  displayScoreHistory();
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
}

// Score history logic
function saveScoreHistory(score, total) {
  const history = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
  const now = new Date();
  history.push({
    date: now.toLocaleString(),
    score: score,
    total: total
  });
  localStorage.setItem('scoreHistory', JSON.stringify(history));
}

function displayScoreHistory() {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;
  const history = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
  historyList.innerHTML = '';
  history.slice(-10).reverse().forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.date}: ${entry.score} / ${entry.total}`;
    historyList.appendChild(li);
  });
}

displayScoreHistory();
showQuestion();
startTimer();