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

/* ================= SLIMME LETTER KEUZE ================= */

function getNextLetter(){
  const remaining = letters.filter(l => !usedLetters.includes(l));

  // hogere kans op ontbrekende letters
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

  /* ================= LETTER VRAAG ================= */

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

  /* ================= KENTEKEN ================= */

  else {

    plateCount++;

    const l1 = getNextLetter();
    const l2 = getNextLetter();
    const l3 = getNextLetter();

    [l1,l2,l3].forEach(l => {
      if(!usedLetters.includes(l)){
        usedLetters.push(l);
      }
    });

    const num = randomNumber(2);

    const plate = `${l1}${l2}-${num}-${l3}`;

    currentAnswer = `${nato[l1]} ${nato[l2]} ${num} ${nato[l3]}`;

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

  const val = input.value.toLowerCase().trim();
  const correct = val === currentAnswer;

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
