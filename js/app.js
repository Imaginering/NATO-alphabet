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
    letters.map(l => `<button onclick="learnCheck('${l}')">${l}</button>`).join("");
}

function learnCheck(letter){
  let answer = prompt("Wat is deze letter?");
  alert(answer?.toLowerCase() === nato[letter] ? "Goed!" : nato[letter]);
}

/* LIST */
if(document.getElementById("list")){
  document.getElementById("list").innerHTML =
    letters.map(l => `<div>${l} = ${nato[l]}</div>`).join("");
}

/* QUIZ */
let currentAnswer = "";

if(document.getElementById("quiz")){
  newQuestion();
}

function newQuestion(){
  const type = Math.floor(Math.random()*4);
  const box = document.getElementById("quiz");

  if(type < 3){
    let letter = randomLetter();
    let word = nato[letter];

    if(type === 0){
      currentAnswer = word;
      box.innerHTML = `
        <h2>Wat is ${letter}?</h2>
        <input id="input">
        <button onclick="check()">Check</button>
      `;
    } else {
      currentAnswer = letter.toLowerCase();
      box.innerHTML = `
        <h2>Welke letter hoort bij "${word}"?</h2>
        <input id="input">
        <button onclick="check()">Check</button>
      `;
    }
  } else {
    let parts = [randomLetter(), randomLetter(), randomNumber(2)];
    let plate = parts.join("-");
    currentAnswer = parts.map(p => isNaN(p) ? nato[p] : p).join(" ").toLowerCase();

    box.innerHTML = `
      <h2>${plate}</h2>
      <input id="input">
      <button onclick="check()">Check</button>
    `;
  }
}

function check(){
  let val = document.getElementById("input").value.toLowerCase();
  let box = document.getElementById("quiz");

  box.innerHTML += `
    <p>${val === currentAnswer ? "✅ Goed" : "❌ " + currentAnswer}</p>
    <button onclick="newQuestion()">Volgende</button>
  `;
}
