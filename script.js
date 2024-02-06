const Calculator = function() {
    // add methods

    this.calculate = function() {
        
    }
}

const operations = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
    // TODO: Add more operations
};

document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.querySelector('.calculator');

    let x = null;
    let y = null;
    let operator = null;

    // Catch button events
    calculator.addEventListener('click', (click) => {
        if (click.target.classList.contains('calculator__button--operand')) {
            // OPERAND CLICKED
            const operandValue = +click.target.textContent;

            // If x is empty -> set it
            if (x === null) {
                x = operandValue;
            } else if (typeof x === 'number' && operator === null) {
                // If there's no operator yet -> append digits to lOp
                // TODO: Come up with a more elegant solution
                x = +`${x}${operandValue}`;
            } else if (y === null) {
                y = operandValue;
                console.log('trzy');
            } else if (typeof y === 'number') {
                // If lOp & the operator are already there, set/replace the rOp
                console.log('cztery');
                y = +`${y}${operandValue}`;
            }        
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            const operatorValue = click.target.textContent;

            if (typeof x != 'number' && typeof y != 'number') {
                // If no digits yet, do nothing
            } else if (typeof x === 'number' && typeof y != 'number') {
                // If there's no y yet, set/replace the operator
                operator = operatorValue;
            } else if (typeof x === 'number' 
                    && typeof y === 'number'
                    && operator != null) {
                const result = operations[operator](x, y);
                x = result;
                y = null;
                operator = operatorValue;
                        
                // TODO: Implement logic for multiple = 
                // That would require applying the same operator & y multiple times
                // Hence will likely require changes in 
                // the operand/operator/result memory storage mechanism
             }
        }

        // TEMP: Show variable values
        console.table({lOperand: x, rOperand: y, operator: operator});
    })
});