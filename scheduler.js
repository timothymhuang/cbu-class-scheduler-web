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

                // AUTO DISABLE ONLINE CLASSES
                if (!data["class"][name]["section"][section].hasOwnProperty("override")) {
                    data["class"][name]["section"][section]["override"] = 0
                }
            } else {
                // DO NOT OVERRIDE CLASSES WITH TIME
                if (!data["class"][name]["section"][section].hasOwnProperty("override")) {
                    data["class"][name]["section"][section]["override"] = -1
                }

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
    console.log(JSON.stringify(data))
    document.getElementById("p1").innerHTML = "Classes Inputed"

}

async function callGenerateSchedules()
{
    document.getElementById("p1").innerHTML = "Please Wait"
    try {
        let result = await generateSchedules()
        document.getElementById("p1").innerHTML = "Schedules Generated"
    }
    catch(err) {
        document.getElementById("p1").innerHTML = "ERROR: " + err
    }
}

async function generateSchedules()
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

    console.log(JSON.stringify(process))


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
    
    return "done"
}

function renderBackground()
{
    data = JSON.parse(localStorage.getItem("data"))

    if (!data.hasOwnProperty("render")) {data["render"] = {}}
    data["render"]["current"] = 0
    //Below are in HOURS
    data["render"]["startTime"] = 0
    data["render"]["endTime"] = 24
    //Each pixel verticaly is 1 minute unless adjusted by timeScale.
    data["render"]["columnWidth"] = 100
    data["render"]["columnPad"] = 1
    data["render"]["timeScale"] = 0.5


    let startTime = data["render"]["startTime"]
    let endTime = data["render"]["endTime"]
    let columnWidth = ["render"]["columnWidth"]
    let columnPad = data["render"]["columnPad"]
    let timeScale = data["render"]["timeScale"]
    let totalTime = endTime-startTime
    let displayBackground = ""
    let displaySideTime = ""
    let width = (7*columnWidth)+(8*columnPad)
    let height = (htm(totalTime))*timeScale

    //Prepare DIV's in display html
    document.getElementById("display").innerHTML = `
    <div id="controls"><button onClick="scheduleAdv(-1)">Back</button><button onClick="scheduleAdv(1)">Forward</button></div><br>

    <div class="grid-container" style="display: grid;grid-template-columns: 40px auto;">
        <div class="grid-item" style="height: 20px;">1</div>
        <div class="grid-item">2</div>
        <div class="grid-item" id="sideTime" style="position:relative;text-align-last: right;"></div>
        <div class="grid-item" style="position:relative;height:${height}px;"><div id="background"></div><div id="content"></div></div>
    </div>



    </div>`

    //Edit Background
    for (let i = 0; i < (Math.ceil(totalTime)) ; i++) {
        displayBackground = displayBackground + `<div class="minorLine" style="top:${i*60*timeScale}px"></div>`
        displaySideTime = displaySideTime + `<p class="timeLabel" style="text-align:right;top:${i*60*timeScale-7}px">${i+startTime}:00</p>`
    }



    document.getElementById("sideTime").innerHTML = displaySideTime
    document.getElementById("background").innerHTML = displayBackground

    localStorage.setItem("data",JSON.stringify(data))

    renderSchedule()
}


function renderSchedule()
{
    data = JSON.parse(localStorage.getItem("data"))

    let startTime = data["render"]["startTime"]
    let endTime = data["render"]["endTime"]
    let columnWidth = ["render"]["columnWidth"]
    let columnPad = data["render"]["columnPad"]
    let timeScale = data["render"]["timeScale"]
    let displayContent = ""
    let columnFraction = 100/7

    let colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF", "#FF00FF", "#FF1493", "#FF69B4", "#FFC0CB", "#FFE4E1", "#FFEBCD", "#FFFACD", "#F0FFF0", "#E0FFFF", "#ADD8E6", "#87CEFA", "#B0E0E6", "#F0F8FF"]


    //Add Content Squares
    console.log(data["schedule"],data["render"]["current"])
    for (let i = 0; i < data["schedule"][data["render"]["current"]].length; i++) {
        thisSection = data["schedule"][data["render"]["current"]][i]
        thisClass = thisSection.substring (0, thisSection.indexOf("-"))
        thisTime = data["class"][thisClass]["section"][thisSection]["time"]
        for (let j = 0; j < thisTime.length; j++) {
            if (thisTime[j] == ["online"]) {break}
            thisDay = parseInt(thisTime[j][0].substring(0, thisTime[j][0].indexOf(".")))
            thisStartTime = thisTime[j][0].substring(thisTime[j][0].indexOf(".")+1)
            thisEndTime = thisTime[j][1].substring(thisTime[j][1].indexOf(".")+1)

            startMinutes = htm(thisStartTime.substring(0,2)) + parseInt(thisStartTime.substring(2))
            endMinutes = htm(thisEndTime.substring(0,2)) + parseInt(thisEndTime.substring(2))

            displayContent = displayContent + `<div style="position:absolute;left:${Math.round(thisDay*columnFraction+columnPad)}%;top:${(startMinutes-htm(startTime))*timeScale}px;right:${Math.round(100-((thisDay+1)*columnFraction-columnPad))}%;height:${(endMinutes-startMinutes)*timeScale}px;background:${colors[i]}">${thisSection}</div>`

            //<p class="timeLabel" style="top:${(startMinutes-htm(startTime))*timeScale}px;left:${thisDay*columnFraction+columnPad}%">${thisSection}</p>

            //console.log(Math.round((thisDay+1)*columnFraction+columnPad))
            //console.log(thisDay, startMinutes, thisEndTime)
        }


        //console.log(thisSection, thisClass, JSON.stringify(thisTime))
    }

    document.getElementById("content").innerHTML = displayContent

    localStorage.setItem("data",JSON.stringify(data))
}


function scheduleAdv(moveByThis) {
    data = JSON.parse(localStorage.getItem("data"))

    temp = data["render"]["current"]

    data["render"]["current"] = data["render"]["current"] + moveByThis

    if (data["render"]["current"] >= data["schedule"].length || data["render"]["current"]<0) {
        data["render"]["current"] = temp
    }


    document.getElementById("p1").innerHTML = "Page " + data["render"]["current"]


    localStorage.setItem("data",JSON.stringify(data))

    renderSchedule()
}



function testFunction()
{
    data = JSON.parse(localStorage.getItem("data"))

    console.log(JSON.stringify(data))


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

function htm (hours) {
    return hours*60
}

function mth (minutes) {
    return minutes/60
}