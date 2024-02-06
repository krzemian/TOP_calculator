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

    let leftOperand = null;
    let rightOperand = null;
    let operator = null;

    // Catch button events
    calculator.addEventListener('click', (click) => {
        if (click.target.classList.contains('calculator__button--operand')) {
            // OPERAND CLICKED
            const operandValue = +click.target.textContent;

            // If leftOperand is empty -> set it
            if (leftOperand === null) {
                leftOperand = operandValue;
            } else if (typeof leftOperand === 'number' && operator === null) {
                // If there's no operator yet -> append digits to lOp
                // TODO: Come up with a more elegant solution
                leftOperand = +`${leftOperand}${operandValue}`;
            } else if (rightOperand === null) {
                rightOperand = operandValue;
                console.log('trzy');
            } else if (typeof rightOperand === 'number') {
                // If lOp & the operator are already there, set/replace the rOp
                console.log('cztery');
                rightOperand = +`${rightOperand}${operandValue}`;
            }        
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            const operatorValue = click.target.textContent;

            if (typeof leftOperand != 'number' && typeof rightOperand != 'number') {
                // If no digits yet, do nothing
            } else if (typeof leftOperand === 'number' && typeof rightOperand != 'number') {
                // If there's no rightOperand yet, set/replace the operator
                operator = operatorValue;
            } else if (typeof leftOperand === 'number' 
                    && typeof rightOperand === 'number'
                    && operator != null) {
                console.log('calculate stuff');
                console.log(operations[operator](leftOperand, rightOperand));
        // if two -> 
            // act as "="
            // move the new sum to leftOperand, empty rightOperand
            // [this should then proceed to #ONE above]
                // replace the operator with the new one (same as #ONE)

// When user hits "="
    // if two operands and an operand are declared
        // Calculate:
            // Find the dedicated arrow function (based on the operand)
            // Once calculated, store value in leftOperand, #CLEAR clear operator & rightOperand
            // TODO: Implement logic for multiple = (that would require applying the same operator & rightOperand multiple times, so I would not be clearing it in #CLEAR above)
    // else -> do nothing

                // TODO: Implement a slightly different logic for reg. operators vs =
             }
        }

        // TEMP: Show variable values
        console.table({lOperand: leftOperand, rOperand: rightOperand, operator: operator});
    })
});