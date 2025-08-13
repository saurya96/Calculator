// let display= document.getElementById('display');
// let historyBox = document.getElementById('history');

// function appendValue(value){
//     display.value +=value;
// }

// function clearDisplay(){
//     display.value='';
// }

// function calculate(){
//   try{
//     let expression= display.value;
//     let result=eval(expression);
//     display.value=result;

//     // history
//     let historyItem = document.createElement('div');
//     historyItem.textContent = `${expression} = ${result}`;
//     historyBox.appendChild(historyItem);


//     // scroll  button
//     historyBox.scrollTop = historyBox.scrollHeight;

//   } catch{
//     display.value='Error';
//   }
// }



const exprEl = document.getElementById('expression');
const resEl = document.getElementById('result');
const keys = document.querySelector('.keys');
const historyContainer = document.getElementById('historyContainer');

let expression = '';
let history = [];

function updateScreen() {
  exprEl.textContent = expression || '0';
  try {
    const safe = sanitize(expression);
    resEl.textContent = safe ? evaluate(safe) : '0';
  } catch {
    resEl.textContent = 'Error';
  }
}

function sanitize(input) {
  const allowed = /^[0-9+\-*/().%\s]+$/;
  return allowed.test(input) ? input : '';
}

function evaluate(expr) {
  const withPercent = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
  const fn = new Function('return ' + withPercent);
  const result = fn();
  return Number.isFinite(result) ? +(+result).toPrecision(12) : result;
}

function updateHistory() {
  historyContainer.innerHTML = history
    .map(item => `<div class="history-item">${item.expr} = <strong>${item.result}</strong></div>`)
    .join('');
}

function compute() {
  try {
    const safe = sanitize(expression);
    const result = evaluate(safe);
    history.unshift({ expr: expression || '0', result: String(result) });
    if (history.length > 10) history.pop();
    expression = String(result);
    updateScreen();
    updateHistory();
  } catch {
    resEl.textContent = 'Error';
  }
}

keys.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const val = btn.getAttribute('data-value');
  const action = btn.getAttribute('data-action');

  if (action === 'clear') {
    expression = '';
    updateScreen();
    return;
  }
  if (action === 'delete') {
    expression = expression.slice(0, -1);
    updateScreen();
    return;
  }
  if (action === 'equals') {
    compute();
    return;
  }

  expression += val;
  updateScreen();
});

window.addEventListener('keydown', e => {
  const key = e.key;
  if (/^[0-9.+\-*/()%]$/.test(key)) {
    expression += key;
    updateScreen();
  } else if (key === 'Enter') {
    compute();
  } else if (key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateScreen();
  } else if (key === 'Escape') {
    expression = '';
    updateScreen();
  }
});

updateScreen();
