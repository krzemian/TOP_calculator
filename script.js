class Calculator {
    constructor() {
        const APPEND = true;

        const operations = {
            '+': (x, y) => +x + +y,
            '-': (x, y) => +x - +y,
            '*': (x, y) => +x * +y,
            '/': (x, y) => +x / +y,
            '^': (x, y) => (+x) ** +y,
            '%': (x, y) => +x / 100
        };
        const display = document.querySelector('#calculator__display');

        this.x = null;
        this.y = null;
        this.operator = null;

        this.calculate = function () {
            return operations[this.operator](this.x, this.y);
        };

        this.refreshDisplay = function (value = null) {
            display.value = value;
        };

        this.unaliveDisplay = function () {
            display.value = '☠️☠️☠️';
        };

        this.pushOperand = function(operandValue) {
            // TODO!: Implement negative numbers! ("-" allowed as x sign, too)
            // Consider a separate +/- button?
            // SCENARIOS:
            // 34 * 53 -> [+/-] pressed -> calculate (here: multiply), then negate
            // … -> [+/-] -> activate "-", display the negative prompt 
            //    (AGAIN, IN NEED FOR STORING NUMBER-IN-PROGRESS VALUES LIKE -, 0., 3.000)
            // 41.5 … … -> [+/-] -> just negate
            // 13 -/+ -> [+/-] -> just negate 13, nullify the operator

            // TODO: Cap the number of digits allowed
            // If x is empty -> set it
            if (this.getX() === null) {
                this.setX(operandValue);
                this.refreshDisplay(this.getX());
            } else if (this.getX() != null && this.getOperator() === null) {
                // If there's no operator yet -> keep appending digits
                this.setX(operandValue, APPEND);
                this.refreshDisplay(this.getX());
            } else if (this.getY() === null) {
                this.setY(operandValue);
                this.refreshDisplay(this.getY());
            } else if (this.getY() != null) {
                // If lOp & the operator are already there, set/replace the rOp
                this.setY(operandValue, APPEND);
                this.refreshDisplay(this.getY());
            }       
        };

        this.pushOperator = function(operatorValue) {
            if (operatorValue === 'CLR') {
                // TODO: Implement AC/C, too
                this.clearX();
                this.clearY();
                this.clearOperator();
                this.refreshDisplay('0');
            } else if (operatorValue === 'BCKSPC') {
                if (this.getY() != null) {
                    this.trimY();
                    this.refreshDisplay(this.getY());
                } else if (x != null) {
                    this.trimX();
                    this.refreshDisplay(this.getX());
                    this.clearOperator();
                }

            } else if (this.getX() != null && this.getY() === null && operatorValue != '=') {
                // If it's number + %, calculate it
                if (operatorValue === '%') {
                    // TODO: This violates DRY (see below), should be cleaner
                    const result = this.calculate();
                    this.setX(result);
                    this.clearY();
                    this.clearOperator();

                    this.refreshDisplay(result);
                } else {
                    // If there's no "y" yet, set/replace the operator
                    // (unless it's '=', then ignore it)
                    this.setOperator(operatorValue);
                }
            } else if (this.getX() != null 
                    && this.getY() != null
                    && this.getOperator() != null) {
                if (operatorValue === '=') {
                    // Just display results
                    const result = this.calculate();
                    this.setX(result);
                    this.clearY();
                    this.clearOperator();

                    this.refreshDisplay(result);
                } else if (this.getY() === '0' && this.getOperator() === '/') {
                    // Handle division by 0
                    this.clearX();
                    this.clearY();
                    this.clearOperator();

                    this.unaliveDisplay();
                } else if (operatorValue === '%') {
                    // This is a weird scenario, but I went for the logic:
                    // Calculate whatever is in the memory, then
                    // calculate x 100% (aka divide by 100), again
                    const result = this.calculate(this.calculate(), 0, operatorValue);
                    this.setX(result);
                    this.clearY();
                    this.clearOperator();

                    this.refreshDisplay(result);
                } else {
                    // Finally, just calculate it
                    const result = this.calculate();
                    this.setX(result);
                    this.clearY();
                    this.setOperator(operatorValue);

                    this.refreshDisplay(result);
                }

                // TODO: Make keyboard, but disregard any other keys except for the ones that make sense for calculating (+, -, /, *, 0–9 – what about pwr and sqrt?)
                // You might run into an issue where keys such as (/) might cause you some trouble. Read the MDN documentation for event.preventDefault to help solve this problem.
                        
                // TODO!: Implement logic for multiple "="s pressed
                //   This would require applying the same operator & y multiple times
                //   Hence will likely require changes in 
                //   the operand/operator/result memory storage mechanism
                // CURRENT BEHAVIOR: operator and y are cleared after "="
                // DESIRED BEHAVIOR: 
                //  Keep operator (not "=") and y in place, so that multiple "=" can be triggered
                //    QUESTION: What would happen if I then press a different operator?
                //      I'd have x y and a previous operator AND a new (just clicked) operatorValue
                //      Currently, this would calculate x [prevOp] y, then replace prevOp with operatorValue
                //      But that shouldn't be happening (it should treat it as if there was no operator)
                //          !!!SOLUTION IDEA 1: after "=", clear x and operator, but store it in a special equalBuffer (name tbd)
                //          So that as long as the "=" is getting pressed, execute that
                //          HOWEVER! As soon as anything other than "=" is pressed, the equalBuffer MUST be wiped clean
                //          (so basically, whenever you perform any operation on numbers, wipe equalBuffer clean; whenever you perform
                //          any operation on non-"=" operands, wipe equalBuffer clean). Names: multiEqualsBuffer
                // IDEA: Make it a rule to never store "=" as an operator (use it as a special trigger)
                // IDEA: Perhaps I could implement a stack structure and push elements onto it

                // TODO: Keep buttons as active (or otherwise indicate that a given operator is being applied)
             }
        };

        this.trimX = function () {
            this.x = this.x.slice(0, -1);
        };
        
        this.trimY = function () {
            this.y = this.y.slice(0, -1);
        };

        this.setX = function (x, append = false) {
            this.setOperand('x', x, append);
        };

        this.setY = function (y, append = false) {
            this.setOperand('y', y, append);
        };

        this.setOperand = function (operand, value, append = false) {
            if (operand != 'x' && operand != 'y') return undefined;
            
            if (append) {
                // Reject multiple '.'
                if (value != '.' || 
                    (value === '.' && !this[operand].includes('.'))) {
                    this[operand] = `${this[operand]}${value}`;
                }
            }
            else {
                // If it's the first digit and it's '.', add it as '0.'
                if (this[operand] === null && value === '.') {
                    this[operand] = '0.';
                } else {
                    this[operand] = value.toString();
                }
            }
        };

        this.setOperator = function (operator) { this.operator = operator; };

        // x and y are stored as strings now to allow 
        // easy storage of unfinished numbers, like 3.000 or 0.
        this.getX = function () { return this.x; };
        this.getY = function () { return this.y; };
        this.getOperator = function () { return this.operator; };

        this.clearX = function () { return this.x = null; };
        this.clearY = function () { return this.y = null; };
        this.clearOperator = function () { return this.operator = null; };
    };
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
            calculator.pushOperand(click.target.textContent); 
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            calculator.pushOperator(click.target.textContent);
        }

        // TEMP: Log values to console
        console.table({
            L: calculator.x, 
            R: calculator.y, 
            OP: calculator.operator
        });
    })
});