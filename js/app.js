document.addEventListener("DOMContentLoaded", () => {

const nato = {
A:"alfa",B:"bravo",C:"charlie",D:"delta",E:"echo",F:"foxtrot",
G:"golf",H:"hotel",I:"india",J:"juliett",K:"kilo",L:"lima",
M:"mike",N:"november",O:"oscar",P:"papa",Q:"quebec",R:"romeo",
S:"sierra",T:"tango",U:"uniform",V:"victor",W:"whiskey",
X:"x-ray",Y:"yankee",Z:"zulu"
};

const letters = Object.keys(nato);

/* ================= STORAGE ================= */

function getStat(key){
  return parseInt(localStorage.getItem(key)) || 0;
}

function setStat(key,val){
  localStorage.setItem(key,val);
}

window.resetStats = function(){
  localStorage.clear();
  location.reload();
};

/* ================= LIST ================= */

const listEl = document.getElementById("list");
if(listEl){
  listEl.innerHTML = letters.map(l => `
    <div class="bg-white/10 p-4 rounded-xl flex justify-between">
      <span class="font-bold">${l}</span>
      <span>${nato[l]}</span>
    </div>
  `).join("");
}

/* ================= QUIZ ================= */

const quizEl = document.getElementById("quiz");
if(!quizEl) return;

/* STATE */
let currentAnswer = "";
let questionIndex = 0;
const totalQuestions = 25;

let sessionGood = 0;
let sessionWrong = 0;
let mistakes = 0;

let plateCount = 0;
const maxPlates = 10;

// 🔥 belangrijk: tracking letters
let usedLetters = new Set();

/* START */
startSession();

function startSession(){
  questionIndex = 0;
  sessionGood = 0;
  sessionWrong = 0;
  mistakes = 0;
  plateCount = 0;
  usedLetters.clear();

  nextQuestion();
}

/* UI */
function updateUI(){
  document.getElementById("progress").innerText = questionIndex;
  document.getElementById("sessionGood").innerText = sessionGood;
  document.getElementById("sessionWrong").innerText = sessionWrong;
  document.getElementById("streak").innerText = getStat("perfect");

  const percent = (questionIndex / totalQuestions) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

/* LETTER PICK (GARANTIE) */
function getNextLetter(){
  // nog niet gebruikte letters eerst
  const remaining = letters.filter(l => !usedLetters.has(l));

  if(remaining.length > 0){
    return remaining[Math.floor(Math.random()*remaining.length)];
  }

  return letters[Math.floor(Math.random()*letters.length)];
}

/* QUESTIONS */
window.nextQuestion = function(){

  if(questionIndex >= totalQuestions){
    endSession();
    return;
  }

  questionIndex++;

  let type = (plateCount >= maxPlates)
    ? 0
    : (Math.random() < 0.5 ? 0 : 1);

  // 🔥 als nog niet alle letters gehad → forceer letter vraag
  if(usedLetters.size < letters.length){
    type = 0;
  }

  if(type === 0){
    const letter = getNextLetter();
    usedLetters.add(letter);

    currentAnswer = nato[letter];

    quizEl.innerHTML = `
      <div class="animate-[fadeIn_0.3s] space-y-4">

        <h2 class="text-lg opacity-80">Wat is ${letter}?</h2>

        <input id="input"
          class="w-full p-4 rounded-xl text-black text-lg"
          placeholder="Typ antwoord">

        <button id="checkBtn"
          onclick="check()"
          class="w-full bg-green-500 p-4 rounded-xl font-semibold active:scale-95 transition">
          Check
        </button>

      </div>
    `;
  }

  else {
    plateCount++;

    const parts = [
      randomLetter(),
      randomLetter(),
      randomNumber(2),
      randomLetter()
    ];

    parts.forEach(p => {
      if(typeof p === "string"){
        p.split("").forEach(l => usedLetters.add(l));
      }
    });

    const plate = parts.join("-");

    currentAnswer = parts.map(p =>
      isNaN(p)
        ? p.split("").map(l => nato[l]).join(" ")
        : p
    ).join(" ").toLowerCase();

    quizEl.innerHTML = `
      <div class="animate-[fadeIn_0.3s] space-y-4">

        <h2 class="text-lg opacity-80">Kenteken</h2>

        <h1 class="text-3xl font-bold tracking-widest">${plate}</h1>

        <input id="input"
          class="w-full p-4 rounded-xl text-black text-lg">

        <button id="checkBtn"
          onclick="check()"
          class="w-full bg-green-500 p-4 rounded-xl font-semibold active:scale-95 transition">
          Check
        </button>

      </div>
    `;
  }

  updateUI();
};

/* CHECK */
window.check = function(){
  const input = document.getElementById("input");
  const button = document.getElementById("checkBtn");

  const val = input.value.toLowerCase().trim();
  const correct = val === currentAnswer;

  input.disabled = true;
  button.disabled = true;

  if(correct){
    sessionGood++;
  } else {
    sessionWrong++;
    mistakes++;
  }

  updateUI();

  button.innerHTML = correct
    ? "Goed!"
    : `Fout — juiste antwoord: ${currentAnswer}`;

  button.classList.remove("bg-green-500");
  button.classList.add(correct ? "bg-green-600" : "bg-red-500");

  button.classList.add("scale-105");

  setTimeout(() => {
    quizEl.innerHTML += `
      <button onclick="nextQuestion()"
        class="w-full bg-slate-700 p-4 rounded-xl mt-2 animate-[fadeIn_0.3s]">
        Volgende
      </button>
    `;
  }, 500);
};

/* END */
function endSession(){

  if(mistakes === 0){
    setStat("perfect", getStat("perfect")+1);
  }

  quizEl.innerHTML = `
    <div class="bg-white/10 p-6 rounded-2xl text-center space-y-4 animate-[fadeIn_0.4s]">

      <h2 class="text-2xl font-bold">Klaar!</h2>

      <p>
        Score: ${sessionGood} / ${totalQuestions}<br>
        Fouten: ${mistakes}
      </p>

      <button onclick="startSession()"
        class="w-full bg-green-500 p-4 rounded-xl">
        Nieuwe toets
      </button>

    </div>
  `;
}

/* HELPERS */
function randomLetter(){
  return letters[Math.floor(Math.random()*letters.length)];
}

function randomNumber(len){
  return Math.floor(Math.random()*Math.pow(10,len-1) + Math.pow(10,len-1));
}

});
