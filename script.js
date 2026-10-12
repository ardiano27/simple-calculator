const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const buttons = document.querySelectorAll('.btn');

let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  previousOperandElement.textContent = previousOperand
    ? `${previousOperand} ${operation ?? ''}`
    : '0';
}

function clearCalculator() {
  currentOperand = '0';
  previousOperand = '';
  operation = null;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (currentOperand === '0' || currentOperand.length <= 1) {
    currentOperand = '0';
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
  updateDisplay();
}

function appendNumber(number) {
  if (number === '.' && currentOperand.includes('.')) return;

  if (shouldResetScreen) {
    currentOperand = '';
    shouldResetScreen = false;
  }

  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand += number;
  }

  updateDisplay();
}

function chooseOperation(nextOperation) {
  if (currentOperand === '') return;

  if (previousOperand !== '' && operation !== null) {
    compute();
  }

  previousOperand = currentOperand;
  operation = nextOperation;
  shouldResetScreen = true;
  updateDisplay();
}

function compute() {
  if (previousOperand === '' || operation === null) return;

  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let result;

  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        result = 'Error';
        break;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  currentOperand = result.toString();
  previousOperand = '';
  operation = null;
  shouldResetScreen = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'number') {
      appendNumber(value);
      return;
    }

    if (action === 'operator') {
      chooseOperation(value);
      return;
    }

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'delete') {
      deleteLastCharacter();
      return;
    }

    if (action === 'equals') {
      compute();
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
    return;
  }

  if (key === '.') {
    appendNumber('.');
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    chooseOperation(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    compute();
    return;
  }

  if (key === 'Backspace') {
    deleteLastCharacter();
    return;
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
