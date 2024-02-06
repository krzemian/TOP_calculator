const Calculator = function() {
    this.x = null;
    this.y = null;
    this.operator = null;

    const operations = {
        '+': (x, y) => x + y,
        '-': (x, y) => x - y,
        '*': (x, y) => x * y,
        '/': (x, y) => x / y
        // TODO: Add more operations
    };

    let calculate = function(x, y, operator) {
        return operations[operator](x, y);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculatorGUI = document.querySelector('.calculator');
    const calculator = new Calculator(); 

    // Catch button events
    calculatorGUI.addEventListener('click', (click) => {
        let x = calculator.x;
        let y = calculator.y;
        let operator = calculator.operator;

        if (click.target.classList.contains('calculator__button--operand')) {
            // OPERAND CLICKED
            const operandValue = +click.target.textContent;

            // TODO!: Implement float (.)
            // Guardrails: one dot only (.contains()?), placed in the middle
            // Input handling: "." with no x appends it to "0."

            // TODO!: Implement negative numbers! ("-" allowed as x sign, too)

            // If x is empty -> set it
            if (calculator.x === null) {
                calculator.x = operandValue;
            } else if (typeof calculator.x === 'number' && calculator.operator === null) {
                // If there's no operator yet -> append digits to lOp
                // TODO: Come up with a more elegant solution
                calculator.x = +`${calculator.x}${operandValue}`;
            } else if (calculator.y === null) {
                calculator.y = operandValue;
            } else if (typeof calculator.y === 'number') {
                // If lOp & the operator are already there, set/replace the rOp
                calculator.y = +`${calculator.y}${operandValue}`;
            }        
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            const operatorValue = click.target.textContent;

            if (operatorValue === 'CLR') {
                calculator.x = null;
                calculator.y = null;
                calculator.operator = null;
            } else if (typeof calculator.x === 'number' && typeof calculator.y != 'number') {
                // If there's no "y" yet, set/replace the operator
                calculator.operator = operatorValue;
            } else if (typeof calculator.x === 'number' 
                    && typeof calculator.y === 'number'
                    && calculator.operator != null) {
                const result = calculator.calculate(x, y, operator);
                calculator.x = result;
                calculator.y = null;
                calculator.operator = operatorValue;
                        
                // TODO: Implement logic for multiple "="s
                // This would require applying the same operator & y multiple times
                // Hence will likely require changes in 
                // the operand/operator/result memory storage mechanism
             }
        }

        // TEMP: Show variable values
        console.table({lOperand: calculator.x, rOperand: calculator.y, operator: calculator.operator});
    })
});