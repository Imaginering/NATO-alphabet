const nato = {
A:"alfa",B:"bravo",C:"charlie",D:"delta",E:"echo",F:"foxtrot",
G:"golf",H:"hotel",I:"india",J:"juliett",K:"kilo",L:"lima",
M:"mike",N:"november",O:"oscar",P:"papa",Q:"quebec",R:"romeo",
S:"sierra",T:"tango",U:"uniform",V:"victor",W:"whiskey",
X:"x-ray",Y:"yankee",Z:"zulu"
};

const letters = Object.keys(nato);

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", function(){
  initList();
  initQuiz();
});

/* ================= LIST ================= */

function initList(){
  const el = document.getElementById("list");
  if(!el) return;

  el.innerHTML = letters.map(l => `
    <div class="bg-white/10 p-4 rounded-xl flex justify-between">
      <span class="font-bold">${l}</span>
      <span>${nato[l]}</span>
    </div>
  `).join("");
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
      <h2 class="text-lg">Wat is ${letter}?</h2>

      <input id="input"
        class="w-full p-4 rounded-xl text-black"
        placeholder="Typ antwoord">

      <button id="checkBtn" onclick="check()"
        class="w-full bg-green-500 p-4 rounded-xl mt-2">
        Check
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
      <h2>Kenteken</h2>
      <h1 class="text-2xl font-bold tracking-widest">${plate}</h1>

      <input id="input"
        class="w-full p-4 rounded-xl text-black"
        placeholder="Bijv: alfa bravo 12">

      <button id="checkBtn" onclick="check()"
        class="w-full bg-green-500 p-4 rounded-xl mt-2">
        Check
      </button>
    `;
  }

  updateUI();
};

/* ================= CHECK ================= */

window.check = function(){

  const input = document.getElementById("input");
  const button = document.getElementById("checkBtn");

  if(!input || !button) return;

  const val = normalizeAnswer(input.value);
  const correctAnswer = normalizeAnswer(currentAnswer);

  const correct = val === correctAnswer;

  input.disabled = true;
  button.disabled = true;

  if(correct){
    sessionGood++;
    button.innerHTML = "Goed!";
    button.classList.remove("bg-green-500");
    button.classList.add("bg-green-600");
  } else {
    sessionWrong++;
    mistakes++;
    button.innerHTML = `Fout — juiste antwoord: ${currentAnswer}`;
    button.classList.remove("bg-green-500");
    button.classList.add("bg-red-500");
  }

  updateUI();

  setTimeout(() => {
    const box = document.getElementById("quiz");

    box.innerHTML += `
      <button onclick="nextQuestion()"
        class="w-full bg-slate-700 p-4 rounded-xl mt-2">
        Volgende
      </button>
    `;
  }, 300);
};

/* ================= END ================= */

function endSession(){

  const box = document.getElementById("quiz");

  box.innerHTML = `
    <h2>Klaar!</h2>
    <p>${sessionGood} / ${totalQuestions}</p>

    <button onclick="startSession()"
      class="w-full bg-green-500 p-4 rounded-xl mt-2">
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
