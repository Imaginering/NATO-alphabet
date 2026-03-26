const nato = {
A:"alfa",B:"bravo",C:"charlie",D:"delta",E:"echo",F:"foxtrot",
G:"golf",H:"hotel",I:"india",J:"juliett",K:"kilo",L:"lima",
M:"mike",N:"november",O:"oscar",P:"papa",Q:"quebec",R:"romeo",
S:"sierra",T:"tango",U:"uniform",V:"victor",W:"whiskey",
X:"x-ray",Y:"yankee",Z:"zulu"
};

const letters = Object.keys(nato);

function randomLetter(){
  return letters[Math.floor(Math.random()*letters.length)];
}

function randomNumber(len){
  return Math.floor(Math.random()*Math.pow(10,len-1) + Math.pow(10,len-1));
}

/* LEARN */
if(document.getElementById("learn")){
  document.getElementById("learn").innerHTML =
    letters.map(l => `
      <button onclick="learnCheck('${l}')" 
        class="w-full bg-white/10 p-3 rounded-xl text-left">
        ${l}
      </button>
    `).join("");
}

function learnCheck(letter){
  let answer = prompt("Wat is deze letter?");
  if(!answer) return;

  alert(
    answer.toLowerCase() === nato[letter]
    ? "✅ Goed!"
    : "❌ " + nato[letter]
  );
}

/* LIST */
if(document.getElementById("list")){
  document.getElementById("list").innerHTML =
    letters.map(l => `
      <div class="bg-white/10 p-3 rounded-xl">
        ${l} = ${nato[l]}
      </div>
    `).join("");
}

/* QUIZ */
let currentAnswer = "";

if(document.getElementById("quiz")){
  newQuestion();
}

function newQuestion(){
  const type = Math.floor(Math.random()*2);
  const box = document.getElementById("quiz");

  if(type === 0){
    // Letter → woord
    let letter = randomLetter();
    currentAnswer = nato[letter];

    box.innerHTML = `
      <h2 class="text-lg">Wat is ${letter}?</h2>
      <input id="input" class="w-full p-4 rounded-xl text-black" placeholder="Typ antwoord">
      <button onclick="check()" class="bg-slate-700 p-3 rounded-xl">Check</button>
    `;
  }

  else {
    // Kenteken
    const formatType = Math.floor(Math.random()*3);
    let parts;

    if(formatType === 0){
      parts = [randomLetter()+randomLetter(), randomNumber(2), randomLetter()+randomLetter()];
    }
    else if(formatType === 1){
      parts = [randomNumber(2), randomLetter()+randomLetter(), randomNumber(2)];
    }
    else {
      parts = [randomNumber(1), randomLetter()+randomLetter()+randomLetter(), randomNumber(3)];
    }

    let plate = parts.join("-");

    currentAnswer = parts.map(p =>
      isNaN(p)
      ? p.split("").map(l => nato[l]).join(" ")
      : p
    ).join(" ").toLowerCase();

    box.innerHTML = `
      <h2 class="text-lg">Kenteken</h2>
      <h1 class="text-2xl font-bold">${plate}</h1>
      <input id="input" class="w-full p-4 rounded-xl text-black" placeholder="Bijv: alfa bravo 12">
      <button onclick="check()" class="bg-slate-700 p-3 rounded-xl">Check</button>
    `;
  }
}

function check(){
  let val = document.getElementById("input").value.toLowerCase();
  let box = document.getElementById("quiz");

  box.innerHTML += `
    <div class="mt-4 p-3 rounded-xl ${val === currentAnswer ? 'bg-green-600' : 'bg-red-600'}">
      ${val === currentAnswer ? "✅ Goed!" : "❌ " + currentAnswer}
    </div>
    <button onclick="newQuestion()" class="bg-slate-700 p-3 rounded-xl mt-2 w-full">
      Volgende
    </button>
  `;
}
