/* ================= DATA ================= */

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

function resetStats(){
  localStorage.clear();
  location.reload();
}

/* ================= RANDOM ================= */

function randomLetter(){
  return letters[Math.floor(Math.random()*letters.length)];
}

function randomNumber(len){
  return Math.floor(Math.random()*Math.pow(10,len-1) + Math.pow(10,len-1));
}

/* ================= LEARN ================= */

function initLearn(){
  const el = document.getElementById("learn");
  if(!el) return;

  el.innerHTML = letters.map(l => `
    <button onclick="learnCheck('${l}')"
      class="w-full bg-white/10 p-4 rounded-xl text-left active:scale-95">
      <span class="font-bold text-lg">${l}</span>
    </button>
  `).join("");
}

function learnCheck(letter){
  const answer = prompt(`Wat is ${letter}?`);
  if(!answer) return;

  const correct = answer.toLowerCase().trim() === nato[letter];

  alert(
    correct
      ? "Goed!"
      : `Fout! Antwoord: ${nato[letter]}`
  );
}

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
let sessionGood = 0;
let sessionWrong = 0;
let mistakes = 0;

let plateCount = 0;
const totalQuestions = 25;
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
  plateCount = 0;

  nextQuestion();
}

function updateUI(){
  const progress = document.getElementById("progress");
  if(!progress) return;

  document.getElementById("progress").innerText = questionIndex;
  document.getElementById("sessionGood").innerText = sessionGood;
  document.getElementById("sessionWrong").innerText = sessionWrong;
  document.getElementById("streak").innerText = getStat("perfect");

  const percent = (questionIndex / totalQuestions) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function nextQuestion(){

  if(questionIndex >= totalQuestions){
    endSession();
    return;
  }

  questionIndex++;

  const box = document.getElementById("quiz");

  let type = (plateCount >= maxPlates)
    ? 0
    : (Math.random() < 0.5 ? 0 : 1);

  if(type === 0){
    const letter = randomLetter();
    currentAnswer = nato[letter];

    box.innerHTML = `
      <h2>Wat is ${letter}?</h2>

      <input id="input"
        class="w-full p-4 rounded-xl text-black"
        placeholder="Typ antwoord">

      <button onclick="check()"
        class="w-full bg-green-500 p-4 rounded-xl mt-2">
        Check
      </button>
    `;
  }

  else {
    plateCount++;

    const parts = [
      randomLetter()+randomLetter(),
      randomNumber(2),
      randomLetter()+randomLetter()
    ];

    const plate = parts.join("-");

    currentAnswer = parts.map(p =>
      isNaN(p)
        ? p.split("").map(l => nato[l]).join(" ")
        : p
    ).join(" ").toLowerCase();

    box.innerHTML = `
      <h2>Kenteken</h2>
      <h1>${plate}</h1>

      <input id="input"
        class="w-full p-4 rounded-xl text-black">

      <button onclick="check()"
        class="w-full bg-green-500 p-4 rounded-xl mt-2">
        Check
      </button>
    `;
  }

  updateUI();
}

function check(){
  const val = document.getElementById("input").value.toLowerCase().trim();
  const box = document.getElementById("quiz");

  const correct = val === currentAnswer;

  if(correct){
    sessionGood++;
  } else {
    sessionWrong++;
    mistakes++;
  }

  updateUI();

  box.innerHTML += `
    <div class="p-4 mt-2 ${correct ? "bg-green-500" : "bg-red-500"}">
      ${
        correct
          ? "Goed!"
          : `Fout, het goede antwoord is ${currentAnswer}`
      }
    </div>

    <button onclick="nextQuestion()"
      class="w-full bg-slate-700 p-4 rounded-xl mt-2">
      Volgende
    </button>
  `;
}

function endSession(){

  if(mistakes === 0){
    setStat("perfect", getStat("perfect")+1);
  }

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

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  initLearn();
  initList();
  initQuiz();
});
