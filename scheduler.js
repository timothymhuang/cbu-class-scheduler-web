function submitClasses()
{
    let input = document.getElementById("inputClasses").value.split("\n")
    document.getElementById("inputClasses").value = ""
    const DoW = ["M","T","W","R","F"]
    let columns
    let section
    let name
    let timeDay
    let dayArray
    let timeArray
    let startTime
    let endTime
    let timeNum
    
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("class")) {
        data["class"] = {}
    }

    for (let i = 0 ; i < input.length ; i++) {
        // WRITE CLASS NAME AND SECTION NAME
        if (input[i].includes("Open") || input[i].includes("Closed") || input[i].includes("Reopened")) {
            columns = input[i].split("\t").filter(function(item){return item != ""})

            section = columns[0]
            name = section.substring(0,section.indexOf("-"))

            if (!data.class.hasOwnProperty(name)) {data["class"][name] = {}}
            if (!data["class"][name].hasOwnProperty("section")) {data["class"][name]["section"] = {}}
            if (!data["class"][name]["section"].hasOwnProperty(section)) {data["class"][name]["section"][section] = {}}

            data["class"][name]["section"][section]["open"] = ((columns[3] == "Closed") ? 0 : 1)
            if (!data["class"][name]["section"][section].hasOwnProperty("override")) {
                data["class"][name]["section"][section]["override"] = -1
            }


        } else if (input[i].includes(" / ")) {
            columns = input[i].split(" / ")

            // WRITE PROFESSOR NAME
            if (!data["class"][name]["section"][section].hasOwnProperty("professors")) {data["class"][name]["section"][section]["professors"] = []}
            if (!data["class"][name]["section"][section]["professors"].includes(columns[0])) {
                data["class"][name]["section"][section]["professors"].push(columns[0])
            }
            if (!data.hasOwnProperty("professor")) {data["professor"] = {}}
            if (!data["professor"].hasOwnProperty(columns[0])) {data["professor"][columns[0]] = {}}
            if (!data["professor"][columns[0]].hasOwnProperty("score")) {data["professor"][columns[0]]["score"] = -1}

            // WRITE TIME
            timeDay = columns[1].split("; ")[0].split(' ')
            //if (!data["class"][name]["section"][section].hasOwnProperty("time")) {
                data["class"][name]["section"][section]["time"] = []
            //}
            if (timeDay.length <= 1) {
                data["class"][name]["section"][section]["time"].push("online")
            } else {
                dayArray = timeDay[0].split("")
                timeArray = timeDay[1].split('-')
                startTime = timeArray[0].substring(0,2) + timeArray[0].substring(3,5)
                endTime = timeArray[1].substring(0,2) + timeArray[1].substring(3,5)
                if (timeArray[1].substring(5,6) == "P") {
                    if (parseInt(endTime) < 1200) {
                        endTime = (parseInt(endTime) + 1200).toString().padStart(4,"0")
                    }
                    if (timeArray[0].substring(5,6) != "A" && parseInt(startTime) < 1200) {
                        startTime = (parseInt(startTime) + 1200).toString().padStart(4, "0")
                    }
                }
                for (let j = 0 ; j < dayArray.length ; j++) {
                    timeNum = DoW.indexOf(dayArray[j]).toString()
                    data["class"][name]["section"][section]["time"].push([timeNum + "." + startTime,timeNum + "." + endTime])
                }
            }


        }
    }



    localStorage.setItem("data",JSON.stringify(data))
    console.log(data)
    document.getElementById("p1").innerHTML = "Classes Inputed"

}

function generateSchedules()
{
    data = JSON.parse(localStorage.getItem("data"))
    let sectionlist
    let process = {}
    let open
    let override
    let classlist = Object.keys(data["class"])
    let run
    let theseTimes
    let theseClasses

    // Generate Dictionary of Classes and Counters
    for (let i = 0; i < classlist.length; i++) {
        process[classlist[i]] = {}
        process[classlist[i]]["count"] = 0
        process[classlist[i]]["max"] = -1
        process[classlist[i]]["list"] = []
        sectionlist = Object.keys(data["class"][classlist[i]]["section"])
        for (let j = 0; j < sectionlist.length; j++) {
            open = data["class"][classlist[i]]["section"][sectionlist[j]]["open"]
            override = data["class"][classlist[i]]["section"][sectionlist[j]]["override"]
            if (override == 1 || (override != 0 && open == 1)) {
                process[classlist[i]]["list"].push(sectionlist[j])
            }
        }
        process[classlist[i]]["max"] = process[classlist[i]]["list"].length-1
    }


    data["schedule"] = []
    run = 1
    while (run) {
        // Check Schedule Overlap
        theseTimes = []
        theseClasses = []
        for (let l = 0; l < classlist.length; l++) {
            thisTime = data["class"][classlist[l]]["section"][process[classlist[l]]["list"][process[classlist[l]]["count"]]]["time"]
            theseClasses.push(process[classlist[l]]["list"][process[classlist[l]]["count"]])
            for (let m = 0; m < thisTime.length; m++) {
                theseTimes.push(thisTime[m])
            }
        }

        if (!checkRangeOverlap(theseTimes)) {
            data["schedule"].push(theseClasses)
        }



        // Increment the Counters
        incThis = 0
        while (1) {
            if (incThis >= classlist.length) {
                run = 0
                break
            }
            if (process[classlist[incThis]]["count"] >= process[classlist[incThis]]["max"]) {
                process[classlist[incThis]]["count"] = 0
                incThis++
            } else {
                process[classlist[incThis]]["count"]++
                break
            }

        }

    }

    console.log(JSON.stringify(data["schedule"]))
    localStorage.setItem("data",JSON.stringify(data))
    document.getElementById("p1").innerHTML = "Schedules Generated"
}

function renderSchedules()
{
    
}





function testFunction()
{
    data = JSON.parse(localStorage.getItem("data"))

    //document.write('<html><body><h2>HTML</h2></body></html>');

    /*
    var tag_id = document.getElementById('display');
    var newNode = document.createElement('p');
    newNode.appendChild(document.createTextNode('html string'));
    */

    let exampletext = `
    <div class="container">
      <div class="box1">W3Docs</div>
      <div class="box2">Learn programming</div>
    </div>
    `
    var tag_id = document.getElementById('display');
    tag_id.innerHTML = exampletext;

    localStorage.setItem("data",JSON.stringify(data))
    //console.log(localStorage.getItem("data"))
}

function checkRangeOverlap (ranges) {
    ranges = ranges.filter(item => item !== "online")
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