const Calculator = function() {
    // add methods

    this.calculate = function() {
        
    }
}

const operations = {
    '+': (x, y) => x + y,
    '-': (x, y) => x + y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
    // TODO: Add more operations
};

//
const leftOperandDOMInput = '3';
const rightOperandDOMInput = '8';
const operatorDOMInput = '+'; // Q: Will it be passed as string?

const leftOperand = +leftOperandDOMInput;
const rightOperand = +rightOperandDOMInput;
const operator = operatorDOMInput;

console.log(operations[operator](leftOperand, rightOperand)); // 11
console.log(operations['*'](3, 4)); // 12
console.log(operations['/'](20, 3)); // 6.66