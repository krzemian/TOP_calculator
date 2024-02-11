class Calculator {
    constructor() {
        const APPEND = true;

        const operations = {
            '+': (x, y) => +x + +y,
            '-': (x, y) => +x - +y,
            '*': (x, y) => +x * +y,
            '/': (x, y) => +x / +y,
            '^': (x, y) => (+x) ** +y,
            '%': (x) => +x / 100,
            '+/-': (x) => -(+x)
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

        this.hasOperator = function(operator) {
            return (operator in operations);
        }

        this.pushOperator = function(operatorValue) {
            if (operatorValue === 'CLR') {
                this.clearX();
                this.clearY();
                this.clearOperator();
                this.refreshDisplay('0');
            } else if (operatorValue === 'BCKSPC') {
                if (this.getY() != null) {
                    this.trimY();
                    // This actually requires getting y
                    // via getY() due to value parsing 
                    this.refreshDisplay(this.getY());
                } else if (this.getX() != null) {
                    this.trimX();
                    // See refreshDisplay() above for rationale
                    this.refreshDisplay(this.getX());
                    this.clearOperator();
                }

            } else if (this.getX() != null && this.getY() === null && operatorValue != '=') {
                // Implementing logic for unary operators (%, +/-)
                if (operatorValue === '%' || operatorValue === '+/-') {
                    // TODO: This violates DRY (see below), should be cleaner
                    this.setOperator(operatorValue);
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
                if (operatorValue === '=' && this.getY() != '0') {
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
                } else if (operatorValue === '%' || operatorValue === '+/-') {
                    // Logic for operations followed by a unary operator
                    // I went for the following logic:
                    // 1. Calculate whatever is in the memory, then
                    // 2. Apply the unary operator (%, +/-) to the result

                    // Calculate whatever's in memory and put results in x
                    this.setX(this.calculate());

                    // Perform the unary operation
                    this.setOperator(operatorValue);
                    const result = this.calculate();

                    // Set x again
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

                    // Avoid appending digits to 0 (i.e. 00, 07)
                    // Allow appending '.' to 0 (for '0.' floats)
                    if (this[operand] != '0' ||
                        (this[operand] === '0' && value === '.')) {
                        this[operand] = `${this[operand]}${value}`;
                    } else {
                        this[operand] = value;
                    }
                }
            }
            else {
                // If it's the first digit and it's '.', add it as '0.'
                if (this[operand] === null && value === '.') {
                    this[operand] = '0.';
                    // TODO!: Fix 0. when provided verbatim by the user 
                    // (currently the 0 digit disappears)
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

        this.logValues = function () {
            console.table({
                L: this.getX(), 
                R: this.getY(), 
                OP: this.getOperator()
            });
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const APPEND = true;
    const calculatorGUI = document.querySelector('.calculator');
    const calculator = new Calculator(); 

    // Catch button events
    calculatorGUI.addEventListener('click', (click) => {
        if (click.target.classList.contains('calculator__button--operand')) {
            // OPERAND CLICKED
            calculator.pushOperand(click.target.textContent); 
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            calculator.pushOperator(click.target.textContent);
        }

        // TEMP: Log values to console
        calculator.logValues();
    });

    window.addEventListener('keydown', (e) => {
        if(e.key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'] || 
            // Register digits and . as operands
            // For some reason e.key in '.' does not work, 
            // using e.code === 'Period' as fallback
           e.code === 'Period') {
            console.log('hej');
            calculator.pushOperand(e.key);
        }
        else if (calculator.hasOperator(e.key) || e.key === '=') {
            // Register operators
            calculator.pushOperator(e.key);
        }
        else if (e.key === 'Backspace') calculator.pushOperator('BCKSPC');
        else if (e.key === 'c') calculator.pushOperator('CLR');

        // TEMP: Log values to console
        calculator.logValues();
    });
});