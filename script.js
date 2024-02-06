const Calculator = function() {
    const DECIMALS = 2;
    
    this.x = null;
    this.y = null;
    this.operator = null;

    const operations = {
        '+': (x, y) => x + y,
        '-': (x, y) => x - y,
        '*': (x, y) => x * y,
        '/': (x, y) => x / y,
        // TODO: Add more operations
    };

    const display = document.querySelector('#calculator__display');

    // This seems excess, I prefered it without the wrapper methods
    // (nice practice, though)
    this.calculate = function(x, y, operator) {
        return operations[operator](x, y);
    }

    this.refreshDisplay = function(value = null) {
        display.value = Math.round(+value * 10**DECIMALS)/10**DECIMALS;
    }

    this.unaliveDisplay = function() {
        display.value = '☠️☠️☠️';
    }

    this.setX = function(x, append=false) {
        if (append) this.x = +`${this.x}${x}`;
        else this.x = +x;
    }

    this.setY = function(y, append=false) {
        // TODO: Come up with a more elegant solution than literals
        if (append) this.y = +`${this.y}${y}`;
        else this.y = +y;
    }

    this.setOperator = function(operator) { this.operator = operator; }
    this.getX = function() { return this.x; }
    this.getY = function() { return this.y; }
    this.getOperator = function() { return this.operator; }
    this.clearX = function() { return this.x = null; }
    this.clearY = function() { return this.y = null; }
    this.clearOperator = function() { return this.operator = null; }
}

document.addEventListener('DOMContentLoaded', () => {
    const APPEND = true;
    const calculatorGUI = document.querySelector('.calculator');
    const calculator = new Calculator(); 

    // Catch button events
    calculatorGUI.addEventListener('click', (click) => {
        let x = calculator.getX();
        let y = calculator.getY();
        let operator = calculator.getOperator();

        if (click.target.classList.contains('calculator__button--operand')) {
            // OPERAND CLICKED
            const operandValue = +click.target.textContent;

            // TODO!: Implement float (.)
            // Guardrails: one dot only (.contains()?), placed in the middle
            // Input handling: "." with no x appends it to "0."

            // TODO!: Implement negative numbers! ("-" allowed as x sign, too)
            // Consider a separate +/- button?

            // If x is empty -> set it
            if (x === null) {
                calculator.setX(operandValue);
                calculator.refreshDisplay(operandValue);
            } else if (typeof x === 'number' && operator === null) {
                // If there's no operator yet -> keep appending digits
                calculator.setX(operandValue, APPEND);
                calculator.refreshDisplay(calculator.getX());
            } else if (y === null) {
                calculator.setY(operandValue);
                calculator.refreshDisplay(operandValue);
            } else if (typeof y === 'number') {
                // If lOp & the operator are already there, set/replace the rOp
                calculator.setY(operandValue, APPEND);
                calculator.refreshDisplay(calculator.getY());
            }        
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            const operatorValue = click.target.textContent;

            if (operatorValue === 'CLR') {
                // TODO: Implement AC/C, too
                calculator.clearX();
                calculator.clearY();
                calculator.clearOperator();
                calculator.refreshDisplay();
            } else if (typeof x === 'number' && typeof y != 'number') {
                // If there's no "y" yet, set/replace the operator
                calculator.setOperator(operatorValue);
            } else if (typeof x === 'number' 
                    && typeof y === 'number'
                    && operator != null) {
                
                // If the user just pressed "="...
                if (operatorValue === '=') {
                    const result = calculator.calculate(x, y, operator);
                    calculator.setX(result);
                    calculator.clearY();
                    calculator.clearOperator();

                    calculator.refreshDisplay(result);
                } else if (y === 0 && operator === '/') {
                    // Handle division by 0
                    calculator.clearX();
                    calculator.clearY();
                    calculator.clearOperator();

                    calculator.unaliveDisplay();
                } else {
                    const result = calculator.calculate(x, y, operator);
                    calculator.setX(result);
                    calculator.clearY();
                    calculator.setOperator(operatorValue);

                    calculator.refreshDisplay(result);
                }
                        
                // TODO: Implement logic for multiple "="s pressed
                //   This would require applying the same operator & y multiple times
                //   Hence will likely require changes in 
                //   the operand/operator/result memory storage mechanism
             }
        }

        // TEMP: Log values to console
        console.table({lOperand: calculator.x, rOperand: calculator.y, operator: calculator.operator});
    })
});