document.addEventListener("DOMContentLoaded", () => {

const nato = {
A:"alfa",B:"bravo",C:"charlie",D:"delta",E:"echo",F:"foxtrot",
G:"golf",H:"hotel",I:"india",J:"juliett",K:"kilo",L:"lima",
M:"mike",N:"november",O:"oscar",P:"papa",Q:"quebec",R:"romeo",
S:"sierra",T:"tango",U:"uniform",V:"victor",W:"whiskey",
X:"x-ray",Y:"yankee",Z:"zulu"
};

const letters = Object.keys(nato);

/* STORAGE */
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

/* RANDOM */
function randomLetter(){
  return letters[Math.floor(Math.random()*letters.length)];
}

function randomNumber(len){
  return Math.floor(Math.random()*Math.pow(10,len-1) + Math.pow(10,len-1));
}

/* ================= QUIZ ================= */

if(document.getElementById("quiz")){

let currentAnswer = "";
let questionIndex = 0;
const totalQuestions = 25;

let sessionGood = 0;
let sessionWrong = 0;
let mistakes = 0;

let plateCount = 0;
const maxPlates = 10;

startSession();

/* SESSION */
function startSession(){
  questionIndex = 0;
  sessionGood = 0;
  sessionWrong = 0;
  mistakes = 0;
  plateCount = 0;
  nextQuestion();
}

/* UI */
function updateUI(){
  document.getElementById("progress").innerText = questionIndex;
  document.getElementById("sessionGood").innerText = sessionGood;
  document.getElementById("sessionWrong").innerText = sessionWrong;

  // 🔥 streak = aantal foutloze toetsen
  document.getElementById("streak").innerText = getStat("perfect");

  const percent = (questionIndex / totalQuestions) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

/* QUESTIONS */
window.nextQuestion = function(){

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
      <h2 class="text-lg opacity-80">Wat is ${letter}?</h2>

      <input id="input"
        class="w-full p-4 rounded-xl text-black text-lg"
        placeholder="Typ antwoord">

      <button onclick="check()"
        class="w-full bg-green-500 p-4 rounded-xl font-semibold active:scale-95 transition">
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
      <h2 class="text-lg opacity-80">Kenteken</h2>

      <h1 class="text-3xl font-bold tracking-widest">${plate}</h1>

      <input id="input"
        class="w-full p-4 rounded-xl text-black text-lg"
        placeholder="Bijv: alfa bravo 12">

      <button onclick="check()"
        class="w-full bg-green-500 p-4 rounded-xl font-semibold active:scale-95 transition">
        Check
      </button>
    `;
  }

  updateUI();
};

/* CHECK */
window.check = function(){
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
    <div class="p-4 rounded-xl mt-2 text-lg font-semibold
      ${correct ? "bg-green-500" : "bg-red-500"}">

      ${
        correct
          ? "Goed!"
          : `Fout, het goede antwoord is <strong>${currentAnswer}</strong>`
      }
    </div>

    <button onclick="nextQuestion()"
      class="w-full bg-slate-700 p-4 rounded-xl mt-2 active:scale-95 transition">
      Volgende
    </button>
  `;
};

/* END */
function endSession(){

  // 🔥 alleen verhogen als foutloos
  if(mistakes === 0){
    setStat("perfect", getStat("perfect")+1);
  }

  const box = document.getElementById("quiz");

  box.innerHTML = `
    <div class="bg-white/10 p-6 rounded-2xl text-center space-y-4">

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

  updateUI();
}

}

});
