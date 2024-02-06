// PSEUDOCODE (remaining stuff) //

// When user hits the CLEAR button
    // Delete lOp, rOp, operator
    // Clear the display (display 0?)

// TODO: Value parsing, though that would not be needed if the user clicks buttons only
// TODO: Make keyboard, but disregard any other keys except for the ones that make sense for calculating (+, -, /, *, 0–9 – what about pwr and sqrt?)
// TODO: Float rounding (for the view layer only -> keep precise data)
// TODO: Better float multiplication [ (*100 + *100)/10000 ]

// TODO: How should I handle additional user input after some initial operations? Should I keep updating the operands? If so, which one, x or y?
// TODO: Handle multiple = (repeat the last operation) -> will require changes in operand/operator/result memory storage