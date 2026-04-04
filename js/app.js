const nato = {
A:"alfa",B:"bravo",C:"charlie",D:"delta",E:"echo",F:"foxtrot",
G:"golf",H:"hotel",I:"india",J:"juliett",K:"kilo",L:"lima",
M:"mike",N:"november",O:"oscar",P:"papa",Q:"quebec",R:"romeo",
S:"sierra",T:"tango",U:"uniform",V:"victor",W:"whiskey",
X:"x-ray",Y:"yankee",Z:"zulu"
};

const letters = Object.keys(nato);
const INPUT_CLASS = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-[hsl(207.69_100%_25.5%)] outline-none transition placeholder:text-slate-400 focus:border-[hsl(207.69_100%_25.5%)] focus:ring-2 focus:ring-[hsl(207.69_75%_93%)]";
const BUTTON_BASE = "w-full rounded-xl px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-80";
const BUTTON_PRIMARY = `${BUTTON_BASE} bg-[hsl(207.69_100%_25.5%)] text-white hover:bg-[hsl(207.69_100%_20%)]`;

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", function(){
  initList();
  initQuiz();
});

/* ================= LIST ================= */

function initList(){
  const el = document.getElementById("list");
  if(!el) return;

  el.innerHTML = `
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between gap-6 bg-[hsl(207.69_75%_93%)] px-4 py-3 text-xs font-bold uppercase tracking-wide text-[hsl(207.69_100%_25.5%)] sm:grid sm:grid-cols-[96px_1fr] sm:gap-3">
        <span>Letter</span>
        <span class="text-right sm:text-left">Codewoord</span>
      </div>
      ${letters.map((l, index) => `
      <div class="flex items-center justify-between gap-6 px-4 py-3 sm:grid sm:grid-cols-[96px_1fr] sm:gap-3 ${index < letters.length - 1 ? "border-b border-slate-200" : ""}">
        <span class="text-lg font-extrabold text-[hsl(207.69_100%_25.5%)]">${l}</span>
        <span class="text-right text-sm font-semibold capitalize text-[hsl(207.69_100%_25.5%)] sm:text-left">${nato[l]}</span>
      </div>
      `).join("")}
    </div>
  `;
}

/* ================= QUIZ ================= */

let currentAnswer = "";
let questionIndex = 0;
const totalQuestions = 25;

let sessionGood = 0;
let sessionWrong = 0;
let mistakes = 0;

let usedLetters = [];
let plateCount = 0;
const maxPlates = 10;

function initQuiz(){
  if(!document.getElementById("quiz")) return;
  startSession();
}

function startSession(){
  questionIndex = 0;
  sessionGood = 0;
  sessionWrong = 0;
  mistakes = 0;
  usedLetters = [];
  plateCount = 0;

  nextQuestion();
}

/* ================= UI ================= */

function updateUI(){
  if(!document.getElementById("progress")) return;

  document.getElementById("progress").innerText = questionIndex;
  document.getElementById("sessionGood").innerText = sessionGood;
  document.getElementById("sessionWrong").innerText = sessionWrong;

  const percent = (questionIndex / totalQuestions) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

/* ================= NORMALIZE ================= */

function normalizeAnswer(str){
  return str
    .toLowerCase()
    .replace(/xray/g, "x-ray")        // xray → x-ray
    .replace(/\s+/g, " ")             // dubbele spaties weg
    .replace(/(\d)\s+(?=\d)/g, "$1")  // 3 0 1 → 301
    .trim();
}

/* ================= SLIMME LETTER KEUZE ================= */

function getNextLetter(){
  const remaining = letters.filter(l => !usedLetters.includes(l));

  if(remaining.length > 0 && Math.random() < 0.7){
    return remaining[Math.floor(Math.random()*remaining.length)];
  }

  return letters[Math.floor(Math.random()*letters.length)];
}

/* ================= QUESTIONS ================= */

window.nextQuestion = function(){

  if(questionIndex >= totalQuestions){
    endSession();
    return;
  }

  questionIndex++;

  const box = document.getElementById("quiz");
  box.className = "flex flex-col gap-3";

  let type = Math.random() < 0.5 ? 0 : 1;

  if(plateCount >= maxPlates){
    type = 0;
  }

  /* LETTER */
  if(type === 0){

    const letter = getNextLetter();

    if(!usedLetters.includes(letter)){
      usedLetters.push(letter);
    }

    currentAnswer = nato[letter];

    box.innerHTML = `
      <h2 class="text-lg font-bold text-[hsl(207.69_100%_25.5%)]">Wat is ${letter}?</h2>

      <div class="relative">
        <input id="input"
          class="${INPUT_CLASS}"
          placeholder="Typ antwoord">
        <span id="inputStateIcon" class="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-lg font-bold"></span>
      </div>

      <div id="feedback" class="hidden rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"></div>

      <button id="checkBtn" onclick="check()"
        class="${BUTTON_PRIMARY}">
        Controleer
      </button>
    `;
  }

  /* KENTEKEN */
  else {

    plateCount++;

    const formats = [
      "LL-NN-LL",
      "NN-LL-LL",
      "NN-LLL-N",
      "N-LLL-NN",
      "LL-NNN-L",
      "L-NNN-LL"
    ];

    const format = formats[Math.floor(Math.random() * formats.length)];

    let plateParts = [];
    let answerParts = [];

    for (let char of format) {

      if (char === "L") {
        const l = getNextLetter();

        if (!usedLetters.includes(l)) {
          usedLetters.push(l);
        }

        plateParts.push(l);
        answerParts.push(nato[l]);
      }

      else if (char === "N") {
        const n = Math.floor(Math.random() * 10);
        plateParts.push(n);
        answerParts.push(n);
      }

      else if (char === "-") {
        plateParts.push("-");
      }
    }

    const plate = plateParts.join("");
    currentAnswer = answerParts.join(" ").toLowerCase();

    box.innerHTML = `
      <h2 class="text-sm font-semibold uppercase tracking-wide text-[hsl(207.69_100%_25.5%/.75)]">Kenteken</h2>
      <h1 class="text-2xl font-extrabold tracking-widest text-[hsl(207.69_100%_25.5%)]">${plate}</h1>

      <div class="relative">
        <input id="input"
          class="${INPUT_CLASS}"
          placeholder="Bijv: alfa bravo 12">
        <span id="inputStateIcon" class="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-lg font-bold"></span>
      </div>

      <div id="feedback" class="hidden rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"></div>

      <button id="checkBtn" onclick="check()"
        class="${BUTTON_PRIMARY}">
        Controleer
      </button>
    `;
  }

  updateUI();
};

/* ================= CHECK ================= */

window.check = function(){

  const input = document.getElementById("input");
  const button = document.getElementById("checkBtn");
  const feedback = document.getElementById("feedback");
  const inputStateIcon = document.getElementById("inputStateIcon");

  if(!input || !button || !feedback || !inputStateIcon) return;

  const val = normalizeAnswer(input.value);
  const correctAnswer = normalizeAnswer(currentAnswer);

  const correct = val === correctAnswer;

  input.disabled = true;
  button.disabled = true;

  if(correct){
    sessionGood++;
    button.className = `${BUTTON_PRIMARY} opacity-70`;
    input.classList.remove("border-slate-300", "border-red-500", "focus:border-[hsl(207.69_100%_25.5%)]", "focus:ring-[hsl(207.69_75%_93%)]", "focus:border-red-500", "focus:ring-red-100");
    input.classList.add("border-emerald-500", "focus:border-emerald-500", "focus:ring-emerald-100");
    inputStateIcon.classList.remove("hidden");
    inputStateIcon.classList.add("flex", "text-emerald-600");
    inputStateIcon.classList.remove("text-red-600");
    inputStateIcon.textContent = "✓";
    feedback.className = "hidden rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700";
    feedback.innerHTML = "";
  } else {
    sessionWrong++;
    mistakes++;
    button.className = `${BUTTON_PRIMARY} opacity-70`;
    input.classList.remove("border-slate-300", "border-emerald-500", "focus:border-[hsl(207.69_100%_25.5%)]", "focus:ring-[hsl(207.69_75%_93%)]", "focus:border-emerald-500", "focus:ring-emerald-100");
    input.classList.add("border-red-500", "focus:border-red-500", "focus:ring-red-100");
    inputStateIcon.classList.remove("hidden");
    inputStateIcon.classList.add("flex", "text-red-600");
    inputStateIcon.classList.remove("text-emerald-600");
    inputStateIcon.textContent = "✕";
    feedback.className = "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700";
    feedback.innerHTML = `Onjuist, het juiste antwoord is: <span class="font-bold">${currentAnswer}</span>`;
  }

  button.disabled = false;
  button.innerHTML = "Volgende";
  button.className = BUTTON_PRIMARY;
  button.onclick = nextQuestion;
  updateUI();
};

/* ================= END ================= */

function endSession(){

  const box = document.getElementById("quiz");

  box.innerHTML = `
    <h2 class="text-xl font-bold text-[hsl(207.69_100%_25.5%)]">Klaar!</h2>
    <p class="mt-1 text-sm text-[hsl(207.69_100%_25.5%/.85)]">${sessionGood} / ${totalQuestions} correct</p>

    <button onclick="startSession()"
      class="${BUTTON_PRIMARY} mt-3">
      Nieuwe toets
    </button>
  `;
}

/* ================= HELPERS ================= */

function randomLetter(){
  return letters[Math.floor(Math.random()*letters.length)];
}

function randomNumber(len){
  return Math.floor(Math.random()*Math.pow(10,len-1) + Math.pow(10,len-1));
}
