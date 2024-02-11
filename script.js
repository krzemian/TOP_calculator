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

        // Declare a buffer for storing values in case 
        // multiple '=' are pressed in a row
        // Effectively, this allows to repeat the last calculation
        this.multiEqualBuffer = { x: null, y: null, operator: null };

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
            // TODO: Need to handle '6.' * '7.' edge cases
            // i.e. 6., 3.000
            // How about introducing a partialNumber/
            // numberInProgress state flag?
            // This would centralize the handling logic,
            // thus avoiding code duplication/dispersion
            // (and be likely much cleaner)

            if (operatorValue === 'A/C') {
                this.clearX();
                this.clearY();
                this.clearOperator();
                this.clearBuffer();
                this.refreshDisplay('0');
            } else if (operatorValue === 'DEL') {
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

                this.clearBuffer();
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

                this.clearBuffer();
            } else if (operatorValue === '=' && this.multiEqualBuffer.operator != null) {
                // Overwrite y & operator with stored buffer values
                this.setX(this.multiEqualBuffer.x);
                this.setY(this.multiEqualBuffer.y);
                this.setOperator(this.multiEqualBuffer.operator);

                const result = this.calculate();

                // Update the x value in both places
                this.setX(result);
                this.setBuffer(result)

                // Clean up after the '=' event
                this.clearY();
                this.clearOperator();

                this.refreshDisplay(result);
            } else if (this.getX() != null 
                    && this.getY() != null
                    && this.getOperator() != null) {
                if (operatorValue === '=' && this.getY() != '0') {
                    // Just display results
                    const result = this.calculate();
                    this.setX(result);

                    // Set the buffer for potential multiple '=' events
                    this.setBuffer(result, this.getY(), this.getOperator())
                    
                    this.clearY();
                    this.clearOperator();

                    this.refreshDisplay(result);
                } else if (this.getY() === '0' && this.getOperator() === '/') {
                    // Handle division by 0
                    this.clearX();
                    this.clearY();
                    this.clearOperator();
                   this.clearBuffer();

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
                    this.clearBuffer();

                    this.refreshDisplay(result);
                } else {
                    // Finally, just calculate it
                    const result = this.calculate();
                    this.setX(result);
                    this.setOperator(operatorValue);
                    this.clearY();
                    this.clearBuffer();

                    this.refreshDisplay(result);
                }
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

        this.setBuffer = function (x, y = null, operator = null) {
            // No need to refresh  & operator since it's just a '='
            // pressed multiple times, so they stay the same
            if (y === null && operator === null) {
                this.multiEqualBuffer.x = x.toString();
            } else {
                this.multiEqualBuffer.x = x.toString();
                this.multiEqualBuffer.y = y.toString();
                this.multiEqualBuffer.operator = operator.toString();
            }
        };

        this.clearBuffer = function () {
            // This method is called every time an operator
            // other than '=' is called.
            // Effectively keeping the buffer only for the '=' operations
            this.multiEqualBuffer.x = null;
            this.multiEqualBuffer.y = null;
            this.multiEqualBuffer.operator = null;
        }

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
            console.table({
                BufferL: this.multiEqualBuffer.x,
                BufferR: this.multiEqualBuffer.y,
                BufferOP: this.multiEqualBuffer.operator,
            });
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const APPEND = true;
    const calculatorGUI = document.querySelector('.calculator');
    const calculator = new Calculator(); 
    const isPressed = {}; // Prevent multiple events when holding a key

    // All this just to trigger active button states for keyboard events
    const buttonSelectorMap = {
        '=': '#btnEqual',
        'Backspace': '#btnDel',
        'c': '#btnClr',
        'r': '#btnClr',
        '+': '#btnPlus',
        '-': '#btnMinus',
        '*': '#btnMulti',
        'x': '#btnMulti',
        '/': '#btnDivide',
        '^': '#btnPower',
        '%': '#btnPercent',
        '+/-': '#btnNeg',
        '1': '#btn1',
        '2': '#btn2',
        '3': '#btn3',
        '4': '#btn4',
        '5': '#btn5',
        '6': '#btn6',
        '7': '#btn7',
        '8': '#btn8',
        '9': '#btn9',
        '0': '#btn0',
        '.': '#btnDot',
    }

    // Catch button events
    calculatorGUI.addEventListener('click', (click) => {
        if (click.target.classList.contains('calculator__button--operand')) {
            // OPERAND CLICKED
            calculator.pushOperand(click.target.textContent); 
        } else if (click.target.classList.contains('calculator__button--operator')) {
            // OPERATOR CLICKED
            calculator.pushOperator(click.target.textContent);
        }
    });

    window.addEventListener('keydown', (e) => {
        if(!isPressed[e.key]) {
            // OPERANDS
            if ('0123456789.'.includes(e.key)) {
                // TODO: DRY! This needs to get encapsulated in a function
                if (buttonSelectorMap[e.key] != undefined) {
                    const btn = document.querySelector(buttonSelectorMap[e.key]);
                    btn.classList.toggle('active');
                }

                calculator.pushOperand(e.key);
            }
            // OPERATORS
            else if (calculator.hasOperator(e.key) || e.key === '=' || e.key === 'x') {
                if (buttonSelectorMap[e.key] != undefined) {
                    const btn = document.querySelector(buttonSelectorMap[e.key]);
                    btn.classList.toggle('active');
                }

                // * alias, kinda implementation ugly though
                if (e.key === 'x') calculator.pushOperator('*');
                else calculator.pushOperator(e.key);
            }
            else if (e.key === 'Backspace') {
                if (buttonSelectorMap[e.key] != undefined) {
                    const btn = document.querySelector(buttonSelectorMap[e.key]);
                    btn.classList.toggle('active');
                }

                calculator.pushOperator('DEL');
            }
            else if (e.key === 'c' || e.key === 'r') {
                if (buttonSelectorMap[e.key] != undefined) {
                    const btn = document.querySelector(buttonSelectorMap[e.key]);
                    btn.classList.toggle('active');
                }

                calculator.pushOperator('A/C');
            }
        }
        console.log('down: ' + e.key);

        isPressed[e.key] = true;
        console.log(isPressed);
    });

    window.addEventListener('keyup', (e) => {
        console.log('up: ' + e.key);
        isPressed[e.key] = false;

        if (e.key === 'Meta') {
            // macOS bug prevents keyup events of regular keys 
            // when Meta (opt) is pressed, too 
            // As a workaround, I release all keys when Meta keyup is detected
            for (key in buttonSelectorMap) {
                const btn = document.querySelector(buttonSelectorMap[key]);
                btn.classList.remove('active');
            }

            for (key in isPressed) {
                isPressed[key] = false;
            }
        }
        if (buttonSelectorMap[e.key] != undefined) {
            const btn = document.querySelector(buttonSelectorMap[e.key]);
            btn.classList.toggle('active');
        }
    })
});