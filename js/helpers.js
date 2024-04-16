export function isWhitespaceOrEmpty(array) {
    // Check if the array is empty
    if (array.length === 0) {
      return true;
    }
    // Check if every element is a whitespace or an empty string
    return array.every(function(element) {
      // Convert the element to a string and trim it
      var str = String(element).trim();
      // Return true if the string is empty
      return str.length === 0;
    });
}

export function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            document.getElementById("ReadResult").innerHTML = contents;
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}

export function beautifyTime(time) {
    let hours = time.substring(0,2)
    let minutes = time.substring(2)
    if (parseInt(hours) >= 12) {
        if (parseInt(hours) >= 13) {
            return (hours-12) + ":" + minutes + " PM"
        } else {
            return hours + ":" + minutes + " PM"
        }
    } else {
        return hours + ":" + minutes + " AM"
    }
}

export function htm(hours) {
    return hours*60
}

export function mth(minutes) {
    return minutes/60
}