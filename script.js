// script.js
// Valentine flow: hidden answer, slider milestones, choices, hedgehog pet x3, quiz gate, final ask + confetti.

const CONFIG = {
  valentineName: "Lisa",
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
    teaseOnNo: "Nice try 😌"
  },

  slider: {
    question: "Okay, well how much do you love me?",
    subnote: "Be honest. I will be watching 👁️",
    nextText: "Next 💞",
    // purely for fun label while sliding
    labels: [
      { at: 0, text: "…hello??" },
      { at: 15, text: "okay, cute." },
      { at: 35, text: "mmmhm 😏" },
      { at: 55, text: "now we're talking" },
      { at: 75, text: "obsessed, I see" },
      { at: 100, text: "to Jupiter and back 🚀" }
    ]
  },

  withChoices: {
    question: "... with?",
    subnote: "Choose wisely. Your future depends on it.",
    options: [
      { id: "a", text: "A tiny picnic on Enceladus 🌙✨", correct: true },
      { id: "b", text: "A kebab at 3am behind the Bahnhof 🥙", correct: false },
      { id: "c", text: "A business lunch on Saturn (tax reasons) 💼🪐", correct: false }
    ],
    wrongTease: "Wrong universe 😭 try again."
  },

  hedgehog: {
    question: "Important interruption:",
    subnote: "",
    intro: "Oh look — a random hedgehog spawned 🦔✨\nGo and pet it 3 times.",
    afterEach: ["one pet 🥹", "two pets 😭", "THREE PETS!!! 💖"],
    afterDone: "He likes you. I like you. We all like you. Okay continue 😌"
  },

  quiz: {
    question: "Anyway, back to what I was saying: What kind of a picnic?",
    accepted: "romantic",
    correctMsg: "GOOOOOD 😍",
    wrongMsg: "Not quite 😄 Hint: it's only one word.",
    wrongMsg2: "Also… it starts with “r” 😉"
  },

  finalAsk: {
    question: "Since you passed the test, I can finally ask you now:\nDO YOU WANT TO BE MY VALENTINE ON THE 14th FEBRUARY 2026? 💘",
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

// --- helpers
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function resetButtons() {
  yesBtn.style.transform = "";
  noBtn.style.transform = "";
  yesBtn.disabled = false;
  noBtn.disabled = false;

  show(yesBtn);
  show(noBtn);
  hide(maybeBtn);
}

function setHeader() {
  titleEl.textContent = CONFIG.header.title;
  subtitleEl.textContent = CONFIG.header.subtitle;
}

function normalize(s) {
  return (s || "").trim().toLowerCase();
}

// --- state
let step = 0; // 0..5
let hogPets = 0;

// --- rendering per step
function hideAllPanels() {
  show(controls);
  hide(sliderBox);
  hide(hedgehogBox);
  hide(quizBox);
  hide(finalBox);
}

function renderStep() {
  setHeader();
  hideAllPanels();
  resetButtons();

  quizHint.textContent = "";
  quizInput.value = "";
  hogHint.textContent = "";
  hogNext.classList.add("hidden");
  confetti.classList.add("hidden");
  confetti.innerHTML = "";

  // default
  tinyTip.textContent = CONFIG.step1.subnote;

  if (step === 0) {
    qEl.textContent = CONFIG.step1.question;
    subEl.textContent = "";
    yesBtn.textContent = CONFIG.step1.yes;
    noBtn.textContent = CONFIG.step1.no;
    return;
  }

  if (step === 1) {
    qEl.textContent = CONFIG.slider.question;
    subEl.textContent = CONFIG.slider.subnote;
    hide(controls);
    show(sliderBox);

    // init slider
    loveRange.value = "10";
    updateSliderUI();
    return;
  }

  if (step === 2) {
    qEl.textContent = CONFIG.withChoices.question;
    subEl.textContent = CONFIG.withChoices.subnote;

    // Use 3 buttons: yes/no/maybe as options A/B/C
    yesBtn.textContent = CONFIG.withChoices.options[0].text;
    noBtn.textContent = CONFIG.withChoices.options[1].text;
    maybeBtn.textContent = CONFIG.withChoices.options[2].text;
    show(maybeBtn);

    // Make sure "No" is clickable here (it’s an option)
    // (we'll handle "not clickable" only in step 0 and step 5)
    return;
  }

  if (step === 3) {
    qEl.textContent = CONFIG.hedgehog.question;
    subEl.textContent = "";
    hide(controls);
    show(hedgehogBox);

    hogPets = 0;
    hogText.innerHTML = "Oh look — a random hedgehog spawned 🦔✨<br/>Go and pet it <b>3</b> times.";
    hogHint.textContent = "";
    hogNext.classList.add("hidden");
    return;
  }

  if (step === 4) {
    qEl.textContent = CONFIG.quiz.question;
    subEl.textContent = "";
    hide(controls);
    show(quizBox);

    quizTitle.textContent = `Remember: “to Jupiter and back”… with a tiny picnic on Enceladus. 🌙✨`;
    quizInput.focus();
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

// --- Step 0: No is not clickable (only for Step 0 and Step 5)
function noIsForbiddenNow() {
  return step === 0 || step === 5;
}

noBtn.addEventListener("click", (e) => {
  if (!noIsForbiddenNow()) return; // allow click as normal option on step 2
  e.preventDefault();
  e.stopPropagation();
  noBtn.blur();
  qEl.textContent = CONFIG.step1.teaseOnNo;
}, true);

// Dodge No on hover for forbidden steps
noBtn.addEventListener("mouseenter", () => {
  if (!noIsForbiddenNow()) return;
  const dx = Math.random() * 200 - 100;
  const dy = Math.random() * 150 - 75;
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});

// --- Yes flow (global)
yesBtn.addEventListener("click", () => {
  // Step 2 uses yes as option A
  if (step === 2) {
    const opt = CONFIG.withChoices.options[0];
    if (opt.correct) step = 3;
    renderStep();
    return;
  }

  // Normal advance: 0 -> 1
  if (step === 0) {
    step = 1;
    renderStep();
    return;
  }

  // Step 5 yes -> final celebration
  if (step === 5) {
    showFinalWithConfetti();
    return;
  }
});

// --- Step 2: option B (noBtn) and option C (maybeBtn)
noBtn.addEventListener("click", () => {
  if (step !== 2) return;
  qEl.textContent = CONFIG.
