function menubar(option)
{
    switch(option) {
        case "home":
            document.getElementById("display").innerHTML = `
            <h1>Class Scheduler</h1>
            <p>Created by Timothy Huang. All rights reserved.</p>
            `
            break
        case "input":
            showInput()
            break
        case "render":
            renderBackground()
            break
        case "classes":
            manageClasses()
            break
        case "settings":
            displaySettings()
            break
        case "professors":
            manageProfessors()
            break
        default:
            document.getElementById("display").innerHTML = `
            <h1>No Content</h1>
            `
    }
}

/************
INPUT CLASSES
************/

function showInput() {
    document.getElementById("display").innerHTML = `
    <p id="p1">Do Something</p>
    <textarea id="inputClasses" name="Text1" cols="40" rows="5"></textarea>
    <br><br>
    <button type="button" onclick="submitClasses()" value="Display">Submit</button>
    <button type="button" onclick="localStorage.clear()" value="Display">Clear Local Storage</button>
    <button type="button" onclick="testFunction()" value="Display">Test Button</button>
    <br><br>
    <button type="button" onclick="upload('everything')">Import Everything</button>
    <button type="button" onclick="download('everything')">Export Everything</button>
    `
}

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
            if (!data["class"][name]["section"][section].hasOwnProperty("time")) {
                data["class"][name]["section"][section]["time"] = []
            }
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
                    if ((JSON.stringify(data["class"][name]["section"][section]["time"]).indexOf(JSON.stringify([timeNum + "." + startTime,timeNum + "." + endTime])) >= 0)) {
                    } else {
                        data["class"][name]["section"][section]["time"].push([timeNum + "." + startTime,timeNum + "." + endTime])
                    }
                }
            }


        }
    }



    localStorage.setItem("data",JSON.stringify(data))
    document.getElementById("p1").innerHTML = "Classes Inputed"

}

async function callGenerateSchedules()
{
    document.getElementById("p1").innerHTML = "Please Wait"
    try {
        let result = await generateSchedules()
        document.getElementById("p1").innerHTML = result
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
    let log = ""

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
        if (process[classlist[i]]["max"] == -1) {
            log += classlist[i] + " excluded because no sections are available.<br>"
            console.log(classlist[i] + " excluded because no sections are available.")
            delete process[classlist[i]]
            delete classlist[i]
        }
    }
    classlist = classlist.filter(function(item) {
        return item != undefined
    });

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

    localStorage.setItem("data",JSON.stringify(data))
    log = "<b>Schedules Generated</b><br>" + log
    return log
}

/*************
MANAGE CLASSES
*************/

function manageClasses() {
    data = JSON.parse(localStorage.getItem("data"))
    let displayThis = `
    <div class="wrapper">
    <button type="button" onclick="callGenerateSchedules()" value="Display">Generate Schedules</button>
    <div class="item" style="width:20px;"></div>
    <label id="p1"></label>
    </div>
    `
    let professors = []
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    classes = Object.keys(data.class)
    for (let i = 0 ; i < classes.length ; i++) {
        displayThis += `<h1 style="margin-bottom:5px">${classes[i]}</h1><button type="button" style="margin-bottom:10px" onclick="deleteClass('${classes[i]}')" value="Display">Delete This Class</button>`
        sections = Object.keys(data["class"][classes[i]]["section"])

        displayThis += `
        <div class="wrapper">
        <div class="item" style="width:100px;"><label><b>Section</b></label></div>
        <div class="item" style="width:70px;"><label><b>Status</b></label></div>
        <div class="item" style="width:100px;"><label><b>Override</b></label></div>
        <div class="item" style="width:275px;"><label><b>Time</b></label></div>
        <div class="item" style="width:50px;"><label><b>Score</b></label></div>
        <div class="item" style="width:200px;"><label><b>Professor</b></label></div>
        </div>
        <div class="manageClassItem"></div>
        `

        for (let j = 0 ; j < sections.length ; j++) {
            sectionInfo = data["class"][classes[i]]["section"][sections[j]]

            thisSection = sections[j]
            thisClass = thisSection.substring (0, thisSection.indexOf("-"))
            thisTime = data["class"][thisClass]["section"][thisSection]["time"]
            displayThisTime = ""
            for (let k = 0; k < thisTime.length; k++) {
                if (thisTime[k] == ["online"]) {
                    displayThisTime += "Online"
                    break
                }
                thisDay = parseInt(thisTime[k][0].substring(0, thisTime[k][0].indexOf(".")))
                thisStartTime = thisTime[k][0].substring(thisTime[k][0].indexOf(".")+1)
                thisEndTime = thisTime[k][1].substring(thisTime[k][1].indexOf(".")+1)

                displayThisTime += daysOfWeek[thisDay] + ", " + beautifyTime(thisStartTime) + " - " + beautifyTime(thisEndTime) + "<br>"
            }
            professors = data["class"][thisClass]["section"][thisSection]["professors"]
            displayThisProfessors = ""
            displayThisScore = ""
            for (l = 0; l < professors.length ; l++) {
                displayThisProfessors += `${professors[l]}<br>`
                theScore = data["professor"][professors[l]]["score"]
                if (theScore >= 4) {
                    scoreColor = "#009000"
                } else if (theScore >= 3) {
                    scoreColor = "#FF8000"
                } else {
                    scoreColor = "#FF0000"
                }
                displayThisScore += `<label style="color:${scoreColor}">${theScore}</label><br>`
            }
            
            if (sectionInfo.override == 1) {
                overrideColor = "Green"
            } else if (sectionInfo.override == 0) {
                overrideColor = "Red"
            } else {
                overrideColor = ""
            }

            displayThis += `
            <div class="wrapper">
            <div class="item" style="width:100px;"><label>${sections[j]}</label></div>

            <div class="item" style="width:70px;"><label style="color:${(sectionInfo.open == 1) ? "Green" : "Red"}">${(sectionInfo.open == 1) ? "Open" : "Closed"}</label></div>

            <div class="item" style="width:100px;"><select id="dropdown" style="color:${overrideColor}" onchange="changeClassOption('override','${[classes[i]]}','${[sections[j]]}',this)">
                <option value="-1" ${(sectionInfo.override == -1) ? "selected" : ""}></option>
                <option style="color:green" value="1" ${(sectionInfo.override == 1) ? "selected" : ""}>Enable</option>
                <option style="color:red" value="0" ${(sectionInfo.override == 0) ? "selected" : ""}>Disable</option>
            </select></div>

            <div class="item" style="width:275px;"><label>${displayThisTime}</label></div>

            <div class="item" style="width:50px;">${displayThisScore}</div>

            <div class="item" style="width:200px;"><label>${displayThisProfessors}</label></div>

            </div>
            <div class="manageClassItem"></div>
            `
        }
    }


    document.getElementById("display").innerHTML = displayThis

    localStorage.setItem("data",JSON.stringify(data))
}

function changeClassOption(type, thisClass, thisSection, value) {
    data = JSON.parse(localStorage.getItem("data"))

    switch (type) {
        case "override":
                    data["class"][thisClass]["section"][thisSection]["override"] = value.value
                    localStorage.setItem("data",JSON.stringify(data))
                    menubar('classes')
                    return
            break
        default:
            break
    }

    /*
        if (value.value == 1) {
            data["class"][thisClass]["section"][thisSection]["override"] = -1
        } else if (value.value == 2) {
            data["class"][thisClass]["section"][thisSection]["override"] = 1
        } else if (value.value == 3) {
            data["class"][thisClass]["section"][thisSection]["override"] = 0
        }
    }
    */

    localStorage.setItem("data",JSON.stringify(data))
    return
}

function deleteClass(thisClass) {
    data = JSON.parse(localStorage.getItem("data"))

    if (confirm("Are you sure you want to delete " + thisClass + "?")) {
        delete data["class"][thisClass]
    }

    localStorage.setItem("data",JSON.stringify(data))

    menubar('classes')
}

/***************
RENDER SCHEDULES
***************/

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
    if (!data["render"].hasOwnProperty("weekends")) {data["render"]["weekends"] = 0}

    let weekends = data["render"]["weekends"]
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    let days = ((weekends) ? 7 : 5)



    let startTime = data["render"]["startTime"]
    let endTime = data["render"]["endTime"]
    let columnWidth = ["render"]["columnWidth"]
    let columnPad = data["render"]["columnPad"]
    let timeScale = data["render"]["timeScale"]
    let totalTime = endTime-startTime
    let displayBackground = ""
    let displaySideTime = ""
    let displayDayLabel = ""
    let width = (7*columnWidth)+(8*columnPad)
    let height = (htm(totalTime))*timeScale

    //Prepare DIV's in display html
    document.getElementById("display").innerHTML = `
    <p id="p1">${"Page " + data["render"]["current"] + " / " + (data["schedule"].length-1)}</p>
    <div id="controls"><button onClick="scheduleAdv(-1)">Back</button><button onClick="scheduleAdv(1)">Forward</button></div><br>

    <div class="grid-container" style="display: grid;grid-template-columns: 40px auto;">
        <div class="grid-item" style="height: 10px;"></div>
        <div class="grid-item" id="dayLabel"><p>test</p></div>
        <div class="grid-item" id="sideTime" style="position:relative;text-align-last: right;"></div>
        <div class="grid-item" style="position:relative;height:${height}px;"><div id="background"></div><div id="content"></div></div>
    </div>
    </div>`


    //Edit Background
    for (let i = 0; i < (Math.ceil(totalTime)) ; i++) {
        displayBackground = displayBackground + `<div class="minorLine" style="top:${i*60*timeScale}px"></div>`
        displaySideTime = displaySideTime + `<p class="timeLabel" style="text-align:right;top:${i*60*timeScale-7}px">${((i+startTime>12) ? i+startTime-12 : i+startTime)}:00</p>`
    }


    for (let i = 0; i < days; i++) {
        displayDayLabel = displayDayLabel + `<div style="float:left;width:${100/days}%;padding;10px"><p style="text-align:center">${daysOfWeek[i]}</p></div>`
    }

    document.getElementById("sideTime").innerHTML = displaySideTime
    document.getElementById("background").innerHTML = displayBackground
    document.getElementById("dayLabel").innerHTML = displayDayLabel

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
    let weekends = data["render"]["weekends"]
    let displayContent = ""
    let columnFraction = 0

    if (weekends) {
        columnFraction = 100/7
    } else {
        columnFraction = 100/5
    }
    let colors = ["#E0BBE4", "#957DAD", "#D291BC", "#FEC8D8", "#FFDFD3", "#CCF1FF", "#E0D7FF", "#FFCCE1", "#D7EEFF", "#FAFFC7", "#B4CFEC", "#F9E4AD", "#F6A6FF", "#A7FFEB", "#F8B195", "#A8E6CF", "#FFEFD5", "#F0E68C", "#FFB6C1", "#ADD8E6"]


    //Add Content Squares
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
        }

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


    document.getElementById("p1").innerHTML = "Page " + data["render"]["current"] + " / " + (data["schedule"].length-1)


    localStorage.setItem("data",JSON.stringify(data))

    renderSchedule()
}

/*******
SETTINGS
*******/

function displaySettings() {
    data = JSON.parse(localStorage.getItem("data"))

    if (!data["render"].hasOwnProperty("weekends")) {data["render"]["weekends"] = 0}

    document.getElementById("display").innerHTML = `
    <h1>Settings</h1>
    <input type="checkbox" id="weekend" onclick="changeSetting('weekends', this.checked)" ${(data["render"]["weekends"]) ? 'checked' : ''}>
    <label for="weekend">Include Weekends</label>
    `

    localStorage.setItem("data",JSON.stringify(data))
}

function changeSetting(name, value) {
    data = JSON.parse(localStorage.getItem("data"))

    switch(name) {
        case "weekends":
            data["render"]["weekends"] = value
            break
        default:
    }

    localStorage.setItem("data",JSON.stringify(data))
}

/****************
MANAGE PROFESSORS
****************/

function manageProfessors() {
    data = JSON.parse(localStorage.getItem("data"))
    let displayThis = ""

    displayThis += `
    <button type="button" onclick="upload('professors')">Import Professor Scores</button>
    <button type="button" onclick="download('professors')">Export Professor Scores</button>
    <div class="wrapper">
    <div class="item" style="width:200px;"><label><b>Name</b></label></div>
    <div class="item" style="width:50px;"><label><b>Score</b></label></div>
    </div>
    <hr style="height:0px; margin-top:0px">
    `

    professor = Object.keys(data["professor"])
    for (let i = 0 ; i < professor.length ; i++) {
        displayThis += `
        <div class="wrapper">
        <div class="item" style="width:200px"><label>${professor[i]}</label></div>
        <div class="item" style="width:50px"><input type="text" value="${data['professor'][professor[i]]['score']}" style="width:50px" onchange="changeProfessorOption('overallScore','${professor[i]}',this)"></div>
        </div>
        `
    }

    document.getElementById("display").innerHTML = displayThis

    localStorage.setItem("data",JSON.stringify(data))
}

function changeProfessorOption(option, name, value) {
    data = JSON.parse(localStorage.getItem("data"))

    switch (option) {
        case "overallScore":
            data["professor"][name]["score"] = value.value
            break
        default:
    }

    localStorage.setItem("data",JSON.stringify(data))
}

/**************
Other Functions
**************/

function download(what) {
    data = JSON.parse(localStorage.getItem("data"))

    switch (what) {
        case "professors":
            var json = `{"type":"professor","data":${JSON.stringify(data["professor"])}}`
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], {type:"application/json"}));
            a.download = "Class Scheduler - Professors.json";
            a.click();
            break
        case "everything":
            var json = `{"type":"everything","data":${JSON.stringify(data)}}`
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], {type:"application/json"}));
            a.download = "Class Scheduler - All Data.json";
            a.click();
            break
        default:
            break
    }

    localStorage.setItem("data",JSON.stringify(data))
}

function upload(what) {
    data = JSON.parse(localStorage.getItem("data"))

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
                    alert("Invalid File")
                } else {
                    professors = Object.keys(newdata["data"])
                    for (i = 0; i < professors.length; i++) {
                        if (data["professor"].hasOwnProperty(professors[i])) {
                            data["professor"][professors[i]]["score"] = newdata["data"][professors[i]]["score"]
                        }
                    }

                    localStorage.setItem("data",JSON.stringify(data))
                    menubar('professors')
                }
                };
                reader.readAsText(file);
            };
            input.click();
            break
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
                    alert("Invalid File")
                } else {
                    data = newdata["data"]
                    localStorage.setItem("data",JSON.stringify(data))
                }
                };
                reader.readAsText(file);
            };
            input.click();
            break
        default:
            break
    }

}

function testFunction()
{
    data = JSON.parse(localStorage.getItem("data"))

    console.log(JSON.stringify(data))

    localStorage.setItem("data",JSON.stringify(data))
}

function checkRangeOverlap(ranges) {
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

function htm(hours) {
    return hours*60
}

function mth(minutes) {
    return minutes/60
}

function beautifyTime(time) {
    hours = time.substring(0,2)
    minutes = time.substring(2)
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