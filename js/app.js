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
let questionIndex = 0;
const totalQuestions = 25;

/* STORAGE */
function getStat(key){
  return parseInt(localStorage.getItem(key)) || 0;
}
function setStat(key,val){
  localStorage.setItem(key,val);
}

/* INIT */
if(document.getElementById("quiz")){
  setStat("sessions", getStat("sessions")+1);
  startSession();
}

/* SESSION */
function startSession(){
  questionIndex = 0;
  mistakes = 0;
  nextQuestion();
}

/* UI */
function updateHeader(){
  document.getElementById("quiz").insertAdjacentHTML("afterbegin", `
    <div class="text-sm opacity-80 mb-2">
      Vraag ${questionIndex} / ${totalQuestions}
    </div>
  `);
}

/* RANDOM */
function randomLetter(){
  return letters[Math.floor(Math.random()*letters.length)];
}
function randomNumber(len){
  return Math.floor(Math.random()*Math.pow(10,len-1) + Math.pow(10,len-1));
}

/* QUESTIONS */
function nextQuestion(){
  if(questionIndex >= totalQuestions){
    endSession();
    return;
  }

  questionIndex++;

  const type = Math.floor(Math.random()*2);
  const box = document.getElementById("quiz");

  let content = "";

  if(type === 0){
    let letter = randomLetter();
    currentAnswer = nato[letter];

    content = `
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

    content = `
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

  box.innerHTML = `
    <div class="bg-white/10 p-6 rounded-2xl space-y-4">
      <div class="text-sm opacity-70">
        Vraag ${questionIndex} van ${totalQuestions}
      </div>
      ${content}
    </div>
  `;
}

/* CHECK */
function check(){
  const val = document.getElementById("input").value.toLowerCase().trim();
  const box = document.getElementById("quiz");

  let correct = val === currentAnswer;

  if(correct){
    setStat("good", getStat("good")+1);
  } else {
    setStat("wrong", getStat("wrong")+1);
    mistakes++;
  }

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

/* END */
function endSession(){
  if(mistakes === 0){
    setStat("perfect", getStat("perfect")+1);
  }

  const box = document.getElementById("quiz");

  box.innerHTML = `
    <div class="bg-white/10 p-6 rounded-2xl space-y-4 text-center">

      <h2 class="text-2xl font-bold">Klaar!</h2>

      <p>
        Fouten: ${mistakes}<br>
        Score: ${totalQuestions - mistakes} / ${totalQuestions}
      </p>

      <button onclick="startSession()"
        class="w-full bg-green-500 p-4 rounded-xl">
        Nieuwe toets
      </button>

    </div>
  `;
}
