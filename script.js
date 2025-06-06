let current = 0;
let score = 0;
let selectedIndex = null;
let timerId;
let timeLeft = 60;

const numberEl = document.getElementById("question-number");
const timerEl = document.getElementById("timer");
const questionEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("answer-result");
const nextBtn = document.getElementById("next-button");
const submitBtn = document.getElementById("submit-answer");
const finalScoreEl = document.getElementById("final-score");
const progressBarEl = document.getElementById("progress-bar");

// Create progress bar dots based on the number of questions
for (let i = 0; i < quiz.length; i++) {
  const dot = document.createElement("span");
  dot.className = "step-dot";
  progressBarEl.appendChild(dot);
}

function updateProgressBar() {
  const dots = progressBarEl.querySelectorAll(".step-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === current);
  });
}

const seCorrect = document.getElementById("se-correct");
const seIncorrect = document.getElementById("se-incorrect");

function showQuestion() {
  const q = quiz[current];
  selectedIndex = null;
  numberEl.textContent = `第 ${current + 1} 問（全${quiz.length}問中）`;
  questionEl.textContent = q.question;
  resultEl.style.display = "none";
  nextBtn.style.display = "none";
  submitBtn.style.display = "none";
  resultEl.classList.remove("correct", "incorrect");
  choicesEl.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const li = document.createElement("li");
    li.textContent = choice;
    li.className = "choice";
    li.addEventListener("click", () => selectChoice(index));
    choicesEl.appendChild(li);
  });

  updateProgressBar();
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 60;
  timerEl.textContent = `残り時間: ${timeLeft}秒`;

  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `残り時間: ${timeLeft}秒`;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  const q = quiz[current];
  const choices = document.querySelectorAll(".choice");
  choices.forEach(el => el.style.pointerEvents = "none");

  choices[q.answerIndex].classList.add("correct");
  const mark = document.createElement("span");
  mark.className = "mark-o";
  choices[q.answerIndex].appendChild(mark);

  seIncorrect.currentTime = 0;
  seIncorrect.play();

  resultEl.textContent = `時間切れ。不正解。正解は「${q.choices[q.answerIndex]}」`;
  resultEl.classList.remove("correct");
  resultEl.classList.add("incorrect");
  resultEl.style.display = "block";
  nextBtn.style.display = "inline-block";
  submitBtn.style.display = "none";
}

function selectChoice(index) {
  selectedIndex = index;
  document.querySelectorAll(".choice").forEach((el, i) => {
    el.classList.toggle("selected", i === index);
  });
  submitBtn.style.display = "inline-block";
}

submitBtn.addEventListener("click", () => {
  clearInterval(timerId);
  const q = quiz[current];
  const choices = document.querySelectorAll(".choice");

  choices.forEach(el => el.style.pointerEvents = "none");

  resultEl.classList.remove("correct", "incorrect");

  if (selectedIndex === q.answerIndex) {
    choices[selectedIndex].classList.add("correct");

    const mark = document.createElement("span");
    mark.className = "mark-o";
    choices[selectedIndex].appendChild(mark);

    seCorrect.currentTime = 0;
    seCorrect.play();

    resultEl.textContent = "正解！";
    resultEl.classList.add("correct");
    score++;
  } else {
    choices[selectedIndex].classList.add("incorrect");

    const markX = document.createElement("span");
    markX.className = "mark-x";
    choices[selectedIndex].appendChild(markX);

    choices[q.answerIndex].classList.add("correct");
    const markO = document.createElement("span");
    markO.className = "mark-o";
    choices[q.answerIndex].appendChild(markO);

    seIncorrect.currentTime = 0;
    seIncorrect.play();

    resultEl.textContent = `不正解。正解は「${q.choices[q.answerIndex]}」`;
    resultEl.classList.add("incorrect");
  }

  resultEl.style.display = "block";
  nextBtn.style.display = "inline-block";
  submitBtn.style.display = "none";
});

nextBtn.addEventListener("click", () => {
  current++;
  if (current < quiz.length) {
    showQuestion();
  } else {
    showFinalScore();
  }
});

function showFinalScore() {
  document.getElementById("question-box").style.display = "none";
  finalScoreEl.textContent = `終了！あなたの正解数は ${score} / ${quiz.length} です。`;
  finalScoreEl.style.display = "block";
}

showQuestion();
