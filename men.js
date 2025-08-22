const questions = [
  {
question: "1. A linear function f is defined as f(x) = mx + b. If f(2) = 7 and f(5) = 16, what is the value of m?",
        options: ["2", "3", "4", "5"],
        answer: 1
      },
      {
        question: "2. The line y = 4x - 2 intersects the y-axis at which point?",
        options: ["(0, -2)", "(2, 0)", "(-2, 0)", "(0, 4)"],
        answer: 0
      },
      {
        question: "3. If f(x) = -3x + 9, what is the x-intercept?",
        options: ["x = -3", "x = 3", "x = -9", "x = 9"],
        answer: 1
      },
      {
        question: "4. The graph of y = mx + 2 passes through the point (4, 10). What is the value of m?",
        options: ["1", "2", "3", "4"],
        answer: 1
      },
      {
        question: "5. Two linear functions f and g intersect at (2, 5). If f(x) = 2x + 1, what is g(x) at x = 2?",
        options: ["5", "4", "6", "3"],
        answer: 0
      },
      {
        question: "6. What is the slope of a line perpendicular to y = -2x + 3?",
        options: ["2", "1/2", "-1/2", "1/2"],
        answer: 1
      },
      {
        question: "7. A line has a slope of 3 and passes through the point (1, 2). What is its equation?",
        options: ["y = 3x + 1", "y = 3x - 1", "y = 3x - 2", "y = 3x + 2"],
        answer: 2
      },
      {
        question: "8. f(x) = 5x - 4 and g(x) = -2x + 3. At what x do they intersect?",
        options: ["x = 1", "x = 0.5", "x = 1.2", "x = 7/8"],
        answer: 3
      },
      {
        question: "9. The average rate of change of f(x) = 2x - 1 from x = 3 to x = 7 is:",
        options: ["1", "2", "3", "4"],
        answer: 1
      },
      {
        question: "10. A line has a y-intercept of 5 and passes through (4, 13). What's the slope?",
        options: ["1", "2", "3", "4"],
        answer: 1
      },
      {
        question: "11. Which of the following equations represents a horizontal line?",
        options: ["y = 3", "x = 3", "y = x + 3", "y = -3x"],
        answer: 0
      },
      {
        question: "12. f(x) = ax + b. If f(1) = 4 and f(3) = 10, what is the value of a?",
        options: ["2", "3", "4", "5"],
        answer: 0
      },
      {
        question: "13. A line passes through (2, 5) and has a slope of -1. What's its equation?",
        options: ["y = -x + 7", "y = x + 3", "y = -2x + 5", "y = -x + 2"],
        answer: 0
      },
      {
        question: "14. The slope of the line 2y - 6x = 8 is:",
        options: ["3", "-3", "1/3", "3/2"],
        answer: 1
      },
      {

question: "15. What is the x-value where f(x) = g(x) if f(x) = x + 3 and g(x) = -2x + 9?",
        options: ["x = 1", "x = 2", "x = 3", "x = 4"],
        answer: 3
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