// PSEUDOCODE //
// When user hits a number
    // If leftOperand is empty -> store in leftOperand
    // If leftOperand is declared, but there's no operator -> store in leftOperand (replace it)
    // If leftOperand is declared & operator s declared -> store in rightOperand (this replaces the current rOp if needed)

// When user hits "="
    // if two operands and an operand are declared
        // Calculate:
            // Find the dedicated arrow function (based on the operand)
            // Once calculated, store value in leftOperand, #CLEAR clear operator & rightOperand
            // TODO: Implement logic for multiple = (that would require applying the same operator & rightOperand multiple times, so I would not be clearing it in #CLEAR above)
    // else -> do nothing

// When user hits an operator button
    // check how many numbers do we have stored in the memory
        // if none -> do nothing (don't even register the operator)
        // #ONE if one -> register the operator (replace the current one, if needed), but don't compute 
        // if two -> 
            // act as "="
            // move the new sum to leftOperand, empty rightOperand
            // [this should then proceed to #ONE above]
                // replace the operator with the new one (same as #ONE)

// When user hits the CLEAR button
    // Delete lOp, rOp, operator
    // Clear the display (display 0?)

// TODO: Value parsing, though that would not be needed if the user clicks buttons only
// TODO: Make keyboard, but disregard any other keys except for the ones that make sense for calculating (+, -, /, *, 0–9 – what about pwr and sqrt?)
// TODO: Float rounding (for the view layer only -> keep precise data)
// TODO: Better float multiplication [ (*100 + *100)/10000 ]