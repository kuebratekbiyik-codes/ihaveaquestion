// script.js
// Purpose: run the Valentine flow + make "No" impossible + gate the final with a quiz answer.

const CONFIG = {
  valentineName: "Lisa",
  pageTitle: "Lisa, will you be my Valentine? 💝",
  header: {
    title: "Hi princess 💖",
    subtitle: "I made this little thing just for you (aka obviously be and ChatGPT cause where the fuck should I have learned how to code a website in JavaScript??)."
  },
  // Your insider line + quiz
  insiderLine: "I love you to Jupiter and back… with a tiny picnic on Enceladus. 🌙✨",
  quiz: {
    question: "Quick quiz: what kind of picnic was it?",
    correctAnswer: "romantic",
    correctMsg: "Correct 😍 okay you REALLY know us.",
    wrongMsg: "Not quite 😄 hint: it's one word."
  },

  // Buttons & text
  steps: [
    {
      text: "Do you like me? 🙂",
      yes: "Yes 💗",
      no: "No 🙃"
    },
    {
      text: "How much do you love me?",
      yes: "This much! 🚀",
      no: "No 🙃"
    },
    {
      text: "Will you be my Valentine? 🌹",
      yes: "Yes!! 💘",
      no: "No 🙃"
    }
  ],

  final: {
    title: "YAY! I'm the luckiest person alive! 🎉💝",
    message: "Now come get your gift: a big warm hug + a huge kiss 😘",
    emojis: "🎁💖🤗💝💋❤️💕"
  },

  noButton: {
    dodgeOnHover: true,
    ignoreClick: true,
    teaseText: "Nice try 😌"
  }
};

// --- DOM
document.title = CONFIG.pageTitle;

const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const qEl = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const controls = document.getElementById("controls");
const quizBox = document.getElementById("quiz");
const quizTitle = document.getElementById("quizTitle");
const quizInput = document.getElementById("quizInput");
const quizSubmit = document.getElementById("quizSubmit");
const quizHint = document.getElementById("quizHint");

const finalBox = document.getElementById("final");
const finalTitle = document.getElementById("finalTitle");
const finalText = document.getElementById("finalText");
const emojiCloud = document.getElementById("emojiCloud");
const replayBtn = document.getElementById("replay");

// --- state
let step = 0;

function setStep(i) {
  step = i;
  const s = CONFIG.steps[step];

  titleEl.textContent = CONFIG.header.title;
  subtitleEl.textContent = CONFIG.header.subtitle;

  qEl.textContent = s.text;
  yesBtn.textContent = s.yes;
  noBtn.textContent = s.no;

  controls.classList.remove("hidden");
  quizBox.classList.add("hidden");
  finalBox.classList.add("hidden");
  quizHint.textContent = "";
  quizInput.value = "";
}

function showQuiz() {
  controls.classList.add("hidden");
  quizBox.classList.remove("hidden");
  quizTitle.textContent = `${CONFIG.insiderLine}\n\n${CONFIG.quiz.question}`;
  quizInput.focus();
}

function showFinal() {
  quizBox.classList.add("hidden");
  finalBox.classList.remove("hidden");

  finalTitle.textContent = CONFIG.final.title;
  finalText.textContent = CONFIG.final.message;

  // throw emojis
  emojiCloud.textContent = CONFIG.final.emojis.split("").join(" ");
}

function normalize(s) {
  return (s || "").trim().toLowerCase();
}

// --- Yes flow
yesBtn.addEventListener("click", () => {
  if (step < CONFIG.steps.length - 1) {
    setStep(step + 1);
    return;
  }
  // last step -> quiz gate
  showQuiz();
});

// --- Quiz submit
quizSubmit.addEventListener("click", () => {
  const ans = normalize(quizInput.value);
  if (ans === normalize(CONFIG.quiz.correctAnswer)) {
    quizHint.textContent = CONFIG.quiz.correctMsg;
    showFinal();
  } else {
    quizHint.textContent = CONFIG.quiz.wrongMsg;
  }
});

quizInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") quizSubmit.click();
});

// --- No button: unclickable + dodges
if (noBtn && CONFIG.noButton.ignoreClick) {
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    noBtn.blur();
    qEl.textContent = CONFIG.noButton.teaseText;
  }, true);
}

if (noBtn && CONFIG.noButton.dodgeOnHover) {
  noBtn.addEventListener("mouseenter", () => {
    const dx = Math.random() * 200 - 100;
    const dy = Math.random() * 150 - 75;
    noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
}

// --- Replay
replayBtn.addEventListener("click", () => setStep(0));

// start
setStep(0);
