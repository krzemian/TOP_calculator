const Calculator = function() {
    // add methods

    this.calculate = function() {
        
    }
}

const methods = {
    '+': (x, y) => x + y,
    '-': (x, y) => x + y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
};

const leftOperandDOMInput = '3';
const rightOperandDOMInput = '8';
const operatorDOMInput = '+'; // Q: Will it be passed as string?

const leftOperand = +leftOperandDOMInput;
const rightOperand = +rightOperandDOMInput;
const operator = operatorDOMInput;

console.log(methods[operator](leftOperand, rightOperand)); // 11
console.log(methods['*'](3, 4)); // 12
console.log(methods['/'](20, 3)); // 6.66