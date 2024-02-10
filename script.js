class Calculator {
    constructor() {
        const DECIMALS = 2;

        this.x = null;
        this.y = null;
        this.operator = null;

        const operations = {
            '+': (x, y) => x + y,
            '-': (x, y) => x - y,
            '*': (x, y) => x * y,
            '/': (x, y) => x / y,
            '^': (x, y) => x ** y,
            '%': (x, y) => x / 100
        };

        const display = document.querySelector('#calculator__display');

        this.calculate = function () {
            return operations[this.operator](this.x, this.y);
        };

        this.refreshDisplay = function (value = null) {
            // TODO: Allow more (i.e. 6) decimals,
            // but round the 0.(3) repeating/recurring decimals
            // Q: How would I detect repeating decimals in JS?
            display.value = Math.round(+value * 10**DECIMALS) / 10**DECIMALS;
        };

        this.unaliveDisplay = function () {
            display.value = '☠️☠️☠️';
        };

        this.trimX = function () {
            this.x = +this.x.toString().slice(0, -1);
        }
        
        this.trimY = function () {
            this.y = +this.y.toString().slice(0, -1);
        }

        this.setX = function (x, append = false) {
            if (append) this.x = +`${this.x}${x}`;
            else this.x = +x;
        };

        this.setY = function (y, append = false) {
            // TODO: Come up with a more elegant solution than literals
            if (append) this.y = +`${this.y}${y}`;
            else this.y = +y;
        };

        this.setOperator = function (operator) { this.operator = operator; };

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
            const operandValue = +click.target.textContent;

            // TODO!: Implement float (.)
            // Guardrails: one dot only (.contains()?), placed in the middle
            // Input handling: "." with no x appends it to "0."
            // ! I need a way to temporarily store 0.0 and 3.0000 etc.
            // SCENARIOS: 
            // . -> store as 0.
            // 123.
            // 0.3
            // 0.0004
            // 0.3. -> reject if value contains "." already
            // Now that I think of it, I will actually benefit from storing 
            // x & y as strings

            // TODO: Cap the number of digits

            // TODO: Add Backspace
            // Works on y if not null, then on x if not null
            // or is ignored. The presence of an operator doesn't matter
            // Will empty the equalsBuffer

            // TODO!: Implement negative numbers! ("-" allowed as x sign, too)
            // Consider a separate +/- button?
            // SCENARIOS:
            // 34 * 53 -> [+/-] pressed -> calculate (here: multiply), then negate
            // … -> [+/-] -> activate "-", display the negative prompt 
            //    (AGAIN, IN NEED FOR STORING NUMBER-IN-PROGRESS VALUES LIKE -, 0., 3.000)
            // 41.5 … … -> [+/-] -> just negate
            // 13 -/+ -> [+/-] -> just negate 13, nullify the operator

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
            } else if (operatorValue === 'BCKSPC') {
                // TODO!: It needs to handle NUMBER-IN-PROGRESS values (i.e. 0.4 -> 0.)
                if (typeof y === 'number') {
                    calculator.trimY();
                    calculator.refreshDisplay(calculator.getY());
                    // WIP: Remove one character of y
                } else if (typeof x === 'number') {
                    calculator.trimX();
                    calculator.refreshDisplay(calculator.getX());
                    calculator.clearOperator();
                    // WIP: Remove one character of x
                }

            } else if (typeof x === 'number' && typeof y != 'number' && operatorValue != '=') {
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
            } else if (typeof x === 'number' 
                    && typeof y === 'number'
                    && operator != null) {
                if (operatorValue === '=') {
                    // Just display results
                    const result = calculator.calculate();
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