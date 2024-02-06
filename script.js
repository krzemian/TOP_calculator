const Calculator = function() {
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

    // This seems excess, I prefered it without the wrapper methods
    // (nice practice, though)
    this.calculate = function(x, y, operator) {
        return operations[operator](x, y);
    }

    this.setX = function(x) {
        this.x = x;
    }

    this.setY = function(y) {
        this.y = y;
    }

    this.setOperator = function(operator) {
        this.operator = operator;
    }

    this.getX = function() {
        return this.x;
    }

    this.getY = function() {
        return this.y;
    }

    this.getOperator = function() {
        return this.operator;
    }

    this.clearX = function() {
        return this.x = null;
    }

    this.clearY = function() {
        return this.y = null;
    }

    this.clearOperator = function() {
        return this.operator = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
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
            } else if (typeof x === 'number' && operator === null) {
                // If there's no operator yet -> append digits to lOp
                // TODO: Come up with a more elegant solution
                calculator.setX(+`${x}${operandValue}`);
            } else if (y === null) {
                calculator.setY(operandValue);
            } else if (typeof y === 'number') {
                // If lOp & the operator are already there, set/replace the rOp
                calculator.setY(+`${y}${operandValue}`);
            }        
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            const operatorValue = click.target.textContent;

            if (operatorValue === 'CLR') {
                // TODO: Implement AC/C, too
                calculator.clearX();
                calculator.clearY();
                calculator.clearOperator();
            } else if (typeof x === 'number' && typeof y != 'number') {
                // If there's no "y" yet, set/replace the operator
                calculator.setOperator(operatorValue);
            } else if (typeof x === 'number' 
                    && typeof y === 'number'
                    && operator != null) {
                const result = calculator.calculate(x, y, operator);
                calculator.setX(result);
                calculator.clearY();
                calculator.setOperator(operatorValue);
                        
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