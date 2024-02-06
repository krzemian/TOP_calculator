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
                console.log('calculate stuff');
                console.log(operations[operator](x, y));
        // if two -> 
            // act as "="
            // move the new sum to x, empty y
            // [this should then proceed to #ONE above]
                // replace the operator with the new one (same as #ONE)

// When user hits "="
    // if two operands and an operand are declared
        // Calculate:
            // Find the dedicated arrow function (based on the operand)
            // Once calculated, store value in x, #CLEAR clear operator & y
            // TODO: Implement logic for multiple = (that would require applying the same operator & y multiple times, so I would not be clearing it in #CLEAR above)
    // else -> do nothing

                // TODO: Implement a slightly different logic for reg. operators vs =
             }
        }

        // TEMP: Show variable values
        console.table({lOperand: x, rOperand: y, operator: operator});
    })
});