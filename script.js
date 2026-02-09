// script.js
// Flow per your ideas:
// 1) Do you like me? (No not clickable + hidden answer)
// 2) Slider: how much do you love me? milestones -> Jupiter and back
// 3) ...with? 3 options (only tiny picnic on Enceladus correct)
// 4) Random hedgehog spawned: pet 3 times -> sweet outcome
// 5) Text input: only "romantic" accepted; wrong -> hints
// 6) Final ask: Valentine on 14th FEBRUARY 2026; Yes -> confetti; No not clickable

const CONFIG = {
  pageTitle: "Lisa, will you be my Valentine? 💝",
  header: {
    title: "Hi princess 💖",
    subtitle:
      "I made this little thing just for you (aka obviously me and ChatGPT cause where the fuck should I have learned how to code a website in JavaScript??)."
  },

  step1: {
    question: "Do you like me? 🙂",
    yes: "Yes 💗",
    no: "No 🙃",
    subnote: `Don't you dare clicking “No”… but you can try it 😌`,
    teaseOnNo: "Nice try 😌",
    teaseExtra: " (psst… there’s a hidden answer somewhere 👀)"
  },

  slider: {
    question: "Okay, well how much do you love me?",
    subnote: "Be honest. I will be watching 👁️",
    nextText: "Next 💞",
    labels: [
      { at: 0, text: "…hello??" },
      { at: 10, text: "okay, cute." },
      { at: 25, text: "mmmhm 😏" },
      { at: 40, text: "that’s suspiciously high" },
      { at: 55, text: "now we're talking" },
      { at: 70, text: "obsessed, I see" },
      { at: 85, text: "STOP, my ego can’t handle this" },
      { at: 95, text: "okay you’re literally insane (in a hot way)" },
      { at: 100, text: "to Jupiter and back 🚀" }
    ]
  },

  withChoices: {
    question: "... with?",
    subnote: "Choose wisely. Your future depends on it.",
    options: [
      { text: "A tiny picnic on Enceladus 🌙✨", correct: true },
      { text: "A kebab at 3am behind the Bahnhof 🥙", correct: false },
      { text: "A business lunch on Saturn (tax reasons) 💼🪐", correct: false }
    ],
    wrongTease: "Wrong universe 😭 try again."
  },

  hedgehog: {
    question: "Important interruption:",
    introHTML:
      "Oh look — a random hedgehog spawned 🦔✨<br/>Go and pet it <b>3</b> times.",
    afterEach: ["one pet 🥹", "two pets 😭", "THREE PETS!!! 💖"],
    afterDone:
      "He likes you. I like you. We all like you. Okay continue 😌"
  },

  quiz: {
    question: "Anyway, back to what I was saying: What kind of a picnic?",
    title: "Reminder: “to Jupiter and back”… with a tiny picnic on Enceladus. 🌙✨",
    accepted: "romantic",
    correctMsg: "GOOOOOD 😍",
    wrongMsg: "Not quite 😄 Hint: it's only one word.",
    wrongMsg2: "Also… it starts with “r” 😉"
  },

  finalAsk: {
    question:
      "GOOOOOD, since you passed the test, I can finally ask you now:\nDO YOU WANT TO BE MY VALENTINE ON THE 14th FEBRUARY 2026? 💘",
    yes: "YES!!! 💝",
    no: "No 🙃",
    subnote: "Choose the correct button or the hedgehog will be disappointed."
  },

  final: {
    title: "YAY! I'm the luckiest person alive! 🎉💝",
    message: "Now come get your gift: a big warm hug + a huge kiss 😘",
    emojis: "🎁💖🤗💝💋❤️💕🦔✨"
  }
};

// --- DOM
document.title = CONFIG.pageTitle;

const secretBtn = document.getElementById("secretBtn");

const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const qEl = document.getElementById("question");
const subEl = document.getElementById("subnote");
const tinyTip = document.getElementById("tinyTip");

const controls = document.getElementById("controls");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const maybeBtn = document.getElementById("maybeBtn");

const sliderBox = document.getElementById("sliderBox");
const loveRange = document.getElementById("loveRange");
const sliderLabel = document.getElementById("sliderLabel");
const sliderValue = document.getElementById("sliderValue");
const sliderNext = document.getElementById("sliderNext");

const hedgehogBox = document.getElementById("hedgehogBox");
const hog = document.getElementById("hog");
const hogText = document.getElementById("hogText");
const hogHint = document.getElementById("hogHint");
const hogNext = document.getElementById("hogNext");

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
const confetti = document.getElementById("confetti");

// Hidden answer safety (works even if HTML changed)
if (tinyTip && !tinyTip.dataset.secret) {
  tinyTip.dataset.secret = "I don’t just like you, I love you.";
}

// --- helpers
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function setHeader() {
  titleEl.textContent = CONFIG.header.title;
  subtitleEl.textContent = CONFIG.header.subtitle;
}

function normalize(s) {
  return (s || "").trim().toLowerCase();
}

// --- state: 0..5
let step = 0;
let hogPets = 0;

function noIsForbiddenNow() {
  return step === 0 || step === 5;
}

function hideAllPanels() {
  show(controls);
  hide(sliderBox);
  hide(hedgehogBox);
  hide(quizBox);
  hide(finalBox);
}

function resetButtons() {
  yesBtn.style.transform = "";
  noBtn.style.transform = "";
  yesBtn.disabled = false;
  noBtn.disabled = false;
  maybeBtn.disabled = false;

  show(yesBtn);
  show(noBtn);
  hide(maybeBtn);

  // clear lingering transforms from dodging
  noBtn.style.transform = "";
  yesBtn.style.transform = "";
}

// --- Slider UI (simple + reliable)
function updateSliderUI() {
  const v = Number(loveRange.value);

  sliderValue.textContent = `${v}%`;

  let label = "Move it 🙂";
  for (const item of CONFIG.slider.labels) {
    if (v >= item.at) label = item.text;
  }
  sliderLabel.textContent = label;

  // always keep next clickable
  sliderNext.disabled = false;

  // pulse when high
  if (v >= 85) sliderNext.classList.add("pulse");
  else sliderNext.classList.remove("pulse");
}

// --- render per step
function renderStep() {
  setHeader();
  hideAllPanels();
  resetButtons();
  // default: hide secret button except step 0
  secretBtn.classList.add("hidden");

  // reset small UI states
  subEl.textContent = "";
  quizHint.textContent = "";
  quizInput.value = "";
  quizHint.dataset.triedOnce = "";
  hogHint.textContent = "";
  hogNext.classList.add("hidden");

  confetti.classList.add("hidden");
  confetti.innerHTML = "";

  if (step === 0) {
    qEl.textContent = CONFIG.step1.question;
    tinyTip.textContent = CONFIG.step1.subnote;
    yesBtn.textContent = CONFIG.step1.yes;
    noBtn.textContent = CONFIG.step1.no;
    // show secret button only on step 1
    secretBtn.classList.remove("hidden");
    return;
  }

  if (step === 1) {
    qEl.textContent = CONFIG.slider.question;
    subEl.textContent = CONFIG.slider.subnote;

    hide(controls);
    show(sliderBox);

    loveRange.value = "10";
    sliderNext.textContent = CONFIG.slider.nextText;
    sliderNext.disabled = false;
    sliderNext.classList.remove("pulse");
    updateSliderUI();
    return;
  }

  if (step === 2) {
    qEl.textContent = CONFIG.withChoices.question;
    subEl.textContent = CONFIG.withChoices.subnote;

    yesBtn.textContent = CONFIG.withChoices.options[0].text;
    noBtn.textContent = CONFIG.withChoices.options[1].text;
    maybeBtn.textContent = CONFIG.withChoices.options[2].text;
    show(maybeBtn);

    tinyTip.textContent = "Pick the correct one 😌";
    return;
  }

  if (step === 3) {
    qEl.textContent = CONFIG.hedgehog.question;
    hide(controls);
    show(hedgehogBox);

    hogPets = 0;
    hogText.innerHTML = CONFIG.hedgehog.introHTML;
    hogHint.textContent = "";
    hogNext.classList.add("hidden");

    tinyTip.textContent = "Pet responsibly.";
    return;
  }

  if (step === 4) {
    qEl.textContent = CONFIG.quiz.question;
    hide(controls);
    show(quizBox);

    quizTitle.textContent = CONFIG.quiz.title;
    quizInput.focus();

    tinyTip.textContent = "Spelling matters 😌";
    return;
  }

  if (step === 5) {
    qEl.textContent = CONFIG.finalAsk.question;
    subEl.textContent = CONFIG.finalAsk.subnote;

    yesBtn.textContent = CONFIG.finalAsk.yes;
    noBtn.textContent = CONFIG.finalAsk.no;

    tinyTip.textContent = "Don't you dare clicking “No”… again 😌";
    return;
  }
}

// --- Button behavior

// No: forbidden on step 0 and 5 (unclickable + tease)
noBtn.addEventListener("click", (e) => {
  if (!noIsForbiddenNow()) return; // allow normal click on step 2
  e.preventDefault();
  e.stopPropagation();
  noBtn.blur();
  qEl.textContent = CONFIG.step1.teaseOnNo + CONFIG.step1.teaseExtra;
}, true);

// Dodge No (hover) only when forbidden
noBtn.addEventListener("mouseenter", () => {
  if (!noIsForbiddenNow()) return;
  const dx = Math.random() * 200 - 100;
  const dy = Math.random() * 150 - 75;
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});

// Yes: global logic
yesBtn.addEventListener("click", () => {
    if (step === 0) {
      qEl.textContent = "…think again… maybe there is a secret button out here somewhere 👀";
      subEl.textContent = "";
      return;
    }
  }

  if (step === 2) {
    // option A
    if (CONFIG.withChoices.options[0].correct) {
      step = 3;
      renderStep();
    }
    return;
  }

  if (step === 5) {
    showFinalWithConfetti();
    return;
  }
});

// Step 2: wrong options
noBtn.addEventListener("click", () => {
  if (step !== 2) return;
  qEl.textContent = CONFIG.withChoices.wrongTease;
});

maybeBtn.addEventListener("click", () => {
  if (step !== 2) return;
  qEl.textContent = CONFIG.withChoices.wrongTease;
});

// Slider events
loveRange.addEventListener("input", updateSliderUI);

sliderNext.addEventListener("click", () => {
  step = 2;
  renderStep();
});

// Hedgehog petting (3x)
function petHog() {
  hogPets += 1;
  hog.classList.add("pet");
  setTimeout(() => hog.classList.remove("pet"), 140);

  if (hogPets <= 3) hogHint.textContent = CONFIG.hedgehog.afterEach[hogPets - 1];

  if (hogPets >= 3) {
    hogHint.textContent = CONFIG.hedgehog.afterDone;
    hogNext.classList.remove("hidden");
    hog.classList.add("happy");
    setTimeout(() => hog.classList.remove("happy"), 800);
  }
}

hog.addEventListener("click", () => {
  if (step !== 3) return;
  if (hogPets >= 3) return;
  petHog();
});

hog.addEventListener("keydown", (e) => {
  if (step !== 3) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (hogPets >= 3) return;
    petHog();
  }
});

hogNext.addEventListener("click", () => {
  step = 4;
  renderStep();
});

// Quiz
quizSubmit.addEventListener("click", () => {
  const ans = normalize(quizInput.value);
  const correct = normalize(CONFIG.quiz.accepted);

  if (ans === correct) {
    quizHint.textContent = CONFIG.quiz.correctMsg;
    step = 5;
    renderStep();
  } else {
    if (!quizHint.dataset.triedOnce) {
      quizHint.textContent = CONFIG.quiz.wrongMsg;
      quizHint.dataset.triedOnce = "1";
    } else {
      quizHint.textContent = CONFIG.quiz.wrongMsg2;
    }
  }
});

quizInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") quizSubmit.click();
});

// Final
function showFinalWithConfetti() {
  hideAllPanels();
  hide(controls);
  show(finalBox);

  finalTitle.textContent = CONFIG.final.title;
  finalText.textContent = CONFIG.final.message;
  emojiCloud.textContent = CONFIG.final.emojis.split("").join(" ");

  fireConfetti();
}

function fireConfetti() {
  confetti.classList.remove("hidden");
  confetti.innerHTML = "";

  const pieces = 90;
  for (let i = 0; i < pieces; i++) {
    const p = document.createElement("span");
    p.className = "confettiPiece";

    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const dur = 1.8 + Math.random() * 1.6;
    const rot = Math.random() * 360;

    p.style.left = `${left}%`;
    p.style.animationDelay = `${delay}s`;
    p.style.animationDuration = `${dur}s`;
    p.style.transform = `rotate(${rot}deg)`;

    confetti.appendChild(p);
  }
}

// Replay
replayBtn.addEventListener("click", () => {
  step = 0;
  renderStep();
});

// start
renderStep();

secretBtn.addEventListener("click", () => {
  if (step !== 0) return;
  step = 1;
  renderStep();
});

