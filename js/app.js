const nato = {
A:"alfa",B:"bravo",C:"charlie",D:"delta",E:"echo",F:"foxtrot",
G:"golf",H:"hotel",I:"india",J:"juliett",K:"kilo",L:"lima",
M:"mike",N:"november",O:"oscar",P:"papa",Q:"quebec",R:"romeo",
S:"sierra",T:"tango",U:"uniform",V:"victor",W:"whiskey",
X:"x-ray",Y:"yankee",Z:"zulu"
};

const letters = Object.keys(nato);

let currentAnswer = "";
let mistakes = 0;

/* STORAGE */
function getStat(key){
  return parseInt(localStorage.getItem(key)) || 0;
}

function setStat(key,val){
  localStorage.setItem(key,val);
}

function updateStats(){
  document.getElementById("good").innerText = getStat("good");
  document.getElementById("wrong").innerText = getStat("wrong");
  document.getElementById("sessions").innerText = getStat("sessions");
  document.getElementById("perfect").innerText = getStat("perfect");
}

function resetStats(){
  localStorage.clear();
  updateStats();
}

/* RANDOM */
function randomLetter(){
  return letters[Math.floor(Math.random()*letters.length)];
}

function randomNumber(len){
  return Math.floor(Math.random()*Math.pow(10,len-1) + Math.pow(10,len-1));
}

/* QUIZ INIT */
if(document.getElementById("quiz")){
  setStat("sessions", getStat("sessions")+1);
  updateStats();
  newQuestion();
}

/* QUESTIONS */
function newQuestion(){
  const type = Math.floor(Math.random()*2);
  const box = document.getElementById("quiz");

  if(type === 0){
    let letter = randomLetter();
    currentAnswer = nato[letter];

    box.innerHTML = `
      <h2 class="text-lg opacity-80">Wat is ${letter}?</h2>

      <input id="input"
        class="w-full p-4 rounded-xl text-black text-lg"
        placeholder="Typ antwoord">

      <button onclick="check()"
        class="w-full bg-green-500 p-4 rounded-xl text-lg font-semibold">
        Check
      </button>
    `;
  }

  else {
    let parts = [
      randomLetter()+randomLetter(),
      randomNumber(2),
      randomLetter()+randomLetter()
    ];

    let plate = parts.join("-");

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
        class="w-full bg-green-500 p-4 rounded-xl text-lg font-semibold">
        Check
      </button>
    `;
  }
}

/* CHECK */
function check(){
  const input = document.getElementById("input");
  const val = input.value.toLowerCase().trim();
  const box = document.getElementById("quiz");

  let correct = val === currentAnswer;

  if(correct){
    setStat("good", getStat("good")+1);
  } else {
    setStat("wrong", getStat("wrong")+1);
    mistakes++;
  }

  updateStats();

  box.innerHTML += `
    <div class="p-4 rounded-xl text-lg font-semibold
      ${correct ? "bg-green-500" : "bg-red-500"}">

      ${correct ? "Goed!" : "Fout!"}<br>
      <span class="text-sm opacity-80">${currentAnswer}</span>
    </div>

    <button onclick="nextQuestion()"
      class="w-full bg-slate-700 p-4 rounded-xl">
      Volgende
    </button>
  `;
}

/* NEXT */
function nextQuestion(){
  if(getStat("good") + getStat("wrong") >= 10){
    // einde sessie
    if(mistakes === 0){
      setStat("perfect", getStat("perfect")+1);
    }
    mistakes = 0;
  }

  newQuestion();
}
