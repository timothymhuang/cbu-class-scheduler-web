import { PAYPAL_URL } from "./const.js";

export function getData() { // Get the data from local storage, if it doesn't exist, create it
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}");
    }
    let theData = JSON.parse(localStorage.getItem("data"));
    return theData;
}

export function setData(theData) { // Store the data to local storage
    localStorage.setItem("data",JSON.stringify(theData));
}

export function isWhitespaceOrEmpty(array) { // Check if an array is empty or contains only whitespace
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

/* This function is not used
export function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            document.getElementById("ReadResult").innerHTML = contents;
        };
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}
*/

export function beautifyTime(time) { // Beautify the time for display
    let hours = time.substring(0,2);
    let minutes = time.substring(2);
    if (parseInt(hours) >= 12) {
        if (parseInt(hours) >= 13) {
            return (hours-12) + ":" + minutes + " PM";
        } else {
            return hours + ":" + minutes + " PM";
        }
    } else {
        return hours + ":" + minutes + " AM";
    }
}

export function htm(hours) { // Convert hours to minutes
    return hours*60;
}

export function mth(minutes) { // Convert minutes to hours
    return minutes/60;
}

export function addKeys(json, arr) { // Add keys to a JSON object, creating the path up to the key if it doesn't exist
    let keyList = "";
    for (let i = 0 ; i < arr.length ; i++) {
        if (!eval("json" + keyList + ".hasOwnProperty(arr[i][0])")) {
            eval("json" + keyList + "[arr[i][0]] = arr[i][1]");
        }
        keyList += "[\"" + arr[i][0] + "\"]";
    }
    return json;
}

export function checkRangeOverlap(ranges) { // Check if number ranges overlap, used for checking if class times overlaps
    ranges = ranges.filter(item => item !== "online");
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

window.download = download; // Export the JSON data to a file for the user to keep
export function download(what, payload) {
    let data = getData();

    switch (what) {
        case "professors":
            var json = `{"type":"professor","data":${JSON.stringify(data["professor"])}}`;
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], {type:"application/json"}));
            a.download = "Class Scheduler - Professors.json";
            a.click();
            break;
        case "everything":
            var json = `{"type":"everything","data":${JSON.stringify(data)}}`;
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], {type:"application/json"}));
            a.download = "Class Scheduler - All Data.json";
            a.click();
            break;
        case "this":
            var json = `{"type":"test","data":${JSON.stringify(payload)}}`;
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], {type:"application/json"}));
            a.download = "Class Scheduler - Test.json";
            a.click();
            break;
        default:
            break;
    }

    setData(data);
}

window.upload = upload; // Allow the user to upload a JSON file to import the data
export function upload(what) {
    let data = getData();

    switch (what) {
        case "professors":
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function (event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                var newdata = JSON.parse(reader.result);
                // do something with the data
                if (newdata["type"] != "professor") {
                    alert("Invalid File");
                } else {
                    professors = Object.keys(newdata["data"]);
                    for (i = 0; i < professors.length; i++) {
                        if (data["professor"].hasOwnProperty(professors[i])) {
                            data["professor"][professors[i]]["score"] = newdata["data"][professors[i]]["score"];
                        }
                    }

                    setData(data);
                    menubar('professors');
                }
                };
                reader.readAsText(file);
            };
            input.click();
            break;
        case "everything":
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function (event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                var newdata = JSON.parse(reader.result);
                // do something with the data
                if (newdata["type"] != "everything") {
                    alert("Invalid File");
                } else {
                    data = newdata["data"];
                    setData(data);
                }
                };
                reader.readAsText(file);
            };
            input.click();
            break;
        default:
            break;
    }

}

window.openPaypal = openPaypal; // Open the donation page. It is named paypal, but it is not necessarily paypal
export function openPaypal() {
    window.open(PAYPAL_URL, '_blank').focus();
}

export function largerDate(date1, date2) { // Compare two dates and indicate which date is larger
    // IF date1 is undefined
    if (date1 === undefined || date2 === undefined) {
        return -2;
    }
    const [month1, day1, year1] = date1.split('/');
    const [month2, day2, year2] = date2.split('/');

    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);

    if (d1 > d2) {
        return 0;
    } else if (d1 < d2) {
        return 1;
    } else {
        return -1;
    }
}

export function arrayOfTimesHasWeekends(arr) { // Check if an array of times has weekends
    for (let subArray of arr) {
        for (let numStr of subArray) {
            if (parseFloat(numStr) >= 5) {
                return true;
            }
        }
    }
    return false;
}