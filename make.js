const questions = [
  {
        question: "A plumber charges a flat fee of 50 plus25 per hour. Which equation represents the total cost C for h hours?",
        options: ["C = 50h + 25", "C = 25h + 50", "C = 75h", "C = h + 75"],
        answer: 1
      },
      {
        question: "A taxi ride costs 3 base fare plus2 per mile. What is the cost function?",
        options: ["C = 2m + 3", "C = 3m + 2", "C = 5m", "C = m + 5"],
        answer: 0
      },
      {

question: "A teacher grades 8 exams per hour. How many hours to grade 64 exams?",
        options: ["x = 64 + 8", "x = 64 × 8", "x = 64 ÷ 8", "x = 8 ÷ 64"],
        answer: 2
      },
      {
        question: "A mobile plan offers 100 minutes for 20. Each extra minute costs0.10. Cost function?",
        options: ["C = 20x + 0.10", "C = 100 + 0.1x", "C = 20 + 0.1x", "C = 0.1x"],
        answer: 2
      },
      {
        question: "The sum of two numbers is 50. One is 3 times the other. Which equation is correct?",
        options: ["x + 3 = 50", "x + 3x = 50", "3x + x = 100", "x × 3 = 50"],
        answer: 0
      },
      {
        question: "A rectangle's length is 4 more than its width. Perimeter is 40. Find the equation.",
        options: ["x + x + 4 = 40", "2x + 2(x + 4) = 40", "x + 4 = 20", "x + x = 40"],
        answer: 1
      },
      {
        question: "Scores: 65, 70, 80. What must be the fourth score to average 75?",
        options: ["x ≥ 75", "(65 + 70 + 80 + x)/4 ≥ 75", "x/4 = 75", "x = 75"],
        answer: 1
      },
      {
        question: "A train travels 60 mph. Distance in t hours?",
        options: ["d = t/60", "d = 60t", "d = t + 60", "d = 60/t"],

answer: 1
      },
      {
        question: "Battery loses 5% per hour from 100%. Function for remaining charge?",
        options: ["C = 100 - 5h", "C = 100 + 5h", "C = 5h - 100", "C = h - 5"],
        answer: 0
      },
      {
        question: "Trip costs 600. Each student pays30. Equation?",
        options: ["30x = 600", "x + 30 = 600", "x = 600 - 30", "x = 600 × 30"],
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