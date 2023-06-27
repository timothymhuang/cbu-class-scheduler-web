console.log(checkRangeOverlap([["4.0930","4.1100"],["0.0815","0.0915"],["2.0815","2.0915"],["4.0815","4.0915"],["0.0700","0.0800"],["2.0700","2.0800"],["4.0700","4.0800"],["0.1930","0.2030"],["5","7"],["6","8"]]))

function checkRangeOverlap (ranges) {
    // convert the string ranges to numbers
    ranges = ranges.map (range => range.map (num => Number (num)));
    // loop through all the ranges
    for (let i = 0; i < ranges.length; i++) {
      // get the start and end of the current range
      let [startA, endA] = ranges [i];
      // loop through the rest of the ranges
      for (let j = i + 1; j < ranges.length; j++) {
        // get the start and end of the other range
        let [startB, endB] = ranges [j];
        // check if the ranges overlap using the condition: startA <= endB && startB <= endA
        if (startA < endB && startB < endA) {
          // return true if there is an overlap
          return true;
        }
      }
    }
    // return false if there is no overlap
    return false;
  }
  