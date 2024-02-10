class Calculator {
    constructor() {
        this.x = null;
        this.y = null;
        this.operator = null;

        const operations = {
            '+': (x, y) => +x + +y,
            '-': (x, y) => +x - +y,
            '*': (x, y) => +x * +y,
            '/': (x, y) => +x / +y,
            '^': (x, y) => (+x) ** +y,
            '%': (x, y) => +x / 100
        };

        const display = document.querySelector('#calculator__display');

        this.calculate = function () {
            return operations[this.operator](this.x, this.y);
        };

        this.refreshDisplay = function (value = null) {
            display.value = value;
        };

        this.unaliveDisplay = function () {
            display.value = '☠️☠️☠️';
        };

        this.trimX = function () {
            this.x = this.x.slice(0, -1);
        }
        
        this.trimY = function () {
            this.y = this.y.slice(0, -1);
        }

        this.setX = function (x, append = false) {
            if (append) {
                // Reject multiple '.'
                if (x != '.' || 
                    (x === '.' && !this.x.includes('.'))) {
                    this.x = `${this.x}${x}`;
                }
            }
            else {
                // If it's the first digit and it's '.', add it as '0.'
                if (this.x === null && x === '.') {
                    this.x = '0.';
                } else {
                    this.x = x.toString();
                }
            }
        };

        this.setY = function (y, append = false) {
            if (append) {
                // Reject multiple '.'
                if (y != '.' || 
                    (y === '.' && !this.y.includes('.'))) {
                    this.y = `${this.y}${y}`;
                }
            }
            else {
                // If it's the first digit and it's '.', add it as '0.'
                if (this.y === null && y === '.') {
                    this.y = '0.';
                } else {
                    this.y = y.toString();
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
    }
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
            const operandValue = click.target.textContent;

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
            if (x === null) {
                calculator.setX(operandValue);
                calculator.refreshDisplay(calculator.getX());
            } else if (x != null && operator === null) {
                // If there's no operator yet -> keep appending digits
                calculator.setX(operandValue, APPEND);
                calculator.refreshDisplay(calculator.getX());
            } else if (y === null) {
                calculator.setY(operandValue);
                calculator.refreshDisplay(calculator.getY());
            } else if (y != null) {
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
            } else if (operatorValue === 'BCKSPC') {
                if (y != null) {
                    calculator.trimY();
                    calculator.refreshDisplay(calculator.getY());
                } else if (x != null) {
                    calculator.trimX();
                    calculator.refreshDisplay(calculator.getX());
                    calculator.clearOperator();
                }

            } else if (x != null && y === null && operatorValue != '=') {
                // If it's number + %, calculate it
                if (operatorValue === '%') {
                    // TODO: This violates DRY (see below), should be cleaner
                    const result = calculator.calculate();
                    calculator.setX(result);
                    calculator.clearY();
                    calculator.clearOperator();

                    calculator.refreshDisplay(result);
                } else {
                    // If there's no "y" yet, set/replace the operator
                    // (unless it's '=', then ignore it)
                    calculator.setOperator(operatorValue);
                }
            } else if (x != null 
                    && y != null
                    && operator != null) {
                if (operatorValue === '=') {
                    // Just display results
                    const result = calculator.calculate();
                    calculator.setX(result);
                    calculator.clearY();
                    calculator.clearOperator();

                    calculator.refreshDisplay(result);
                } else if (y === '0' && operator === '/') {
                    // Handle division by 0
                    calculator.clearX();
                    calculator.clearY();
                    calculator.clearOperator();

                    calculator.unaliveDisplay();
                } else if (operatorValue === '%') {
                    // This is a weird scenario, but I went for the logic:
                    // Calculate whatever is in the memory, then
                    // calculate x 100% (aka divide by 100), again
                    const result = calculator.calculate(calculator.calculate(), 0, operatorValue);
                    calculator.setX(result);
                    calculator.clearY();
                    calculator.clearOperator();

                    calculator.refreshDisplay(result);
                } else {
                    // Finally, just calculate it
                    const result = calculator.calculate();
                    calculator.setX(result);
                    calculator.clearY();
                    calculator.setOperator(operatorValue);

                    calculator.refreshDisplay(result);
                }
                        
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
        }

        // TEMP: Log values to console
        console.table({
            L: calculator.x, 
            R: calculator.y, 
            OP: calculator.operator
        });
    })
});