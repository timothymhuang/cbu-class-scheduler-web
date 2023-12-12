//Load the local rate my professors database.
let rmp = {};
fetch('./rmp.json') // The URL of the JSON file
  .then((response) => response.json()) // Parse the response as JSON
  .then((data) => {
    rmp = data
  })
  .catch((error) => {
    console.error(error);
});

let currentPage = -1

//When menubar button clicked, do something
function menubar(option)
{
    if (option != "donate") {
        document.getElementById("navbar").innerHTML = prepNavbar(option)
    }
    switch(option) {
        case "home":
            pageHome()
            currentPage = 0
            break
        case "input":
            pageInput()
            currentPage = 1
            break
        case "render":
            pageRenderBackground()
            currentPage = 3
            break
        case "classes":
            pageManageClasses()
            currentPage = 2
            break
        case "settings":
            pageSettings()
            currentPage = 4
            break
        case "professors":
            pageProfessors()
            break
        case "donate":
            window.open("https://www.paypal.com/donate/?business=9ZCUEUSNY5B7Y&no_recurring=0&item_name=Hi%21+The+CBU+Class+Scheduler+was+made+entirely+by+me,+a+poor+college+student+that+would+appreciate+your+support.+Thank+you%21&currency_code=USD")
            break
        default:
            document.getElementById("display").innerHTML = `
            <h1>No Content</h1>
            `
    }
}

//Render the menubar with proper shading, every time option is clicked.
function prepNavbar(option) {
    return `
    <button ${(option == "home") ? 'class="thisPage"' : ''} type="button" onclick="menubar('home')">Home</button>
    <button ${(option == "input") ? 'class="thisPage"' : ''} type="button" onclick="menubar('input')">Input Classes</button>
    <button ${(option == "classes") ? 'class="thisPage"' : ''} type="button" onclick="menubar('classes')">Manage Classes</button>
    <button ${(option == "render") ? 'class="thisPage"' : ''} type="button" onclick="menubar('render')">View Schedules</button>
    <button ${(option == "settings") ? 'class="thisPage"' : ''} type="button" onclick="menubar('settings')">Settings</button>
    <button ${(option == "donate") ? 'class="thisPage"' : ''} type="button" onclick="menubar('donate')"><b>Donate<b></button>
    <!--<button ${(option == "professors") ? 'class="thisPage"' : ''} type="button" onclick="menubar('professors')">Manage Professors</button>-->`
}

//Render home page
function pageHome() {
    document.getElementById("display").innerHTML = `
    <div class="margins">
        <h1>CBU Class Scheduler</h1>
        <p>Created by Timothy Huang.</p>
        <p>This program is in development and probably has a lot of bugs. It is in no way affiliated with or endorsed by California Baptist University.</p>
        <br>
        <p>This program looks through all the classes you need to take and creates every possible schedule, allowing you to look through them and choose the best one. You still need to know what classes you need to take and be familiar with how to register for classes normally. You can refresh yourself by watching these videos on <a href="https://youtu.be/VYoQPnrwxAk" target="_blank">Adding Classes</a>, <a href="https://youtu.be/Ny3le5uxQec" target="_blank">Dropping Classes</a>, and <a href="https://youtu.be/7KrpukYLkvU" target="_blank">Swapping Classes</a>.</p>
        <h2>General Instructions</h2>
        <div class="row" style="max-width: 1500px;">
            <div class="column">
                <img src="assets/tut.1.png" style="max-width:100%">
                <p>1. Go to <a href="https://insidecbu.calbaptist.edu/ICS/" target="_blank">InsideCBU</a> and click [Add / Drop Courses].</p>
            </div>
            <div style="padding-left: 10px;"></div>
            <div class="column">
                <img src="assets/tut.2.png" style="max-width:100%">
                <p>2. Set the [Term] to the correct semeseter (e.g. SP 2024).</p>
            </div>
        </div>
        <div style="padding-top: 10px;"></div>
        <div class="row" style="max-width: 1500px;">
            <div class="column">
                <img src="assets/tut.3.png" style="max-width:100%">
                <p>3. Enter the Course Code for the course you want to register for, then click [Search].</p>
            </div>
            <div style="padding-left: 10px;"></div>
            <div class="column">
                <img src="assets/tut.4.png" style="max-width:100%">
                <p>4. If there is a show all button, press it.</p>
            </div>
        </div>
        <div style="padding-top: 10px;"></div>
        <div class="row" style="max-width: 1500px;">
            <div class="column">
                <img src="assets/tut.5.png" style="max-width:100%">
                <p>5. Press [CTRL/CMD] + [A] to select all the text on the page, then [CTRL/CMD] + [C] to copy all the text. It doesn't matter that other random text is included, it will automatically be filtered out.</p>
            </div>
            <div style="padding-left: 10px;"></div>
            <div class="column">
                <img src="assets/tut.6.png" style="max-width:100%">
                <p>6. Go back to the CBU Class Scheduler. Switch to the [Input Classes] tab (on the top) and click inside the text box. Press [CTRL/CMD] + [V] to paste all the text. Then press [Submit].</p>
                <p>Repeat these steps for each class you want to register for. (Note: All information is stored locally on your browser.)</p>
            </div>
        </div>
        <div style="padding-top: 10px;"></div>
        <div class="row" style="max-width: 1500px;">
            <div class="column">
                <img src="assets/tut.7.png" style="max-width:100%">
                <p>7. Switch to the [Manage Classes] tab. Scroll down to check that all your classes are here. If you accidentally added an extra class, click the dropdown under the class code heading, then select [Delete].</p>
                <p>If you are already registered for a section, but there are no seats left in that section, the scheduler won't include it in the schedules it generates. To make sure it does include it, click on the override drowpdown next to that section, then click [Enable].</p>
                <p>You can also click [SOLO] in the override dropdown. This will force that specific class to be used, which is useful, for example, if you want to be in the same section as your friend.</p>
            </div>
            <div style="padding-left: 10px;"></div>
            <div class="column">
                <img src="assets/tut.8.png" style="max-width:100%">
                <p>8. Click on [Generate Schedules] on the top. The website will tell you how many possible schedules it generated.</p>
            </div>
        </div>
        <div style="padding-top: 10px;"></div>
        <div class="row" style="max-width: 1500px;">
            <div class="column">
                <img src="assets/tut.9.png" style="max-width:100%">
                <p>9. If you have a lot of possible schedules, try disabling classes that you don't want to take.</p>
                <p>The time of the class is listed, so if you don't want to take a 7 a.m. class, disable it. The Rate My Professors score is also displayed (if found, this feature is still buggy).</p>
            </div>
            <div style="padding-left: 10px;"></div>
            <div class="column">
                <img src="assets/tut.10.png" style="max-width:100%">
                <p>10. Click on [View Schedules] on the top. Use the [Back] and [Forward] buttons or arrow keys to view your possible schedules.</p>
            </div>
        </div>
        <h2>Bulk Input Instructions</h2>
        <div class="row" style="max-width: 1500px;">
        <div class="column">
            <img src="assets/tut.11.png" style="max-width:100%">
            <p>It may get tedious to transfer every class over to the class scheduler. To make this easier, you can add multiple classes at once. To do this, search for something broader for your classes on InsideCBU. For example, search "EGR" if you are taking multiple classes that start with "EGR." Then  [CTRL/CMD] + [A] and [CTRL/CMD] + [C] like normal.</p>
        </div>
        <div style="padding-left: 10px;"></div>
        <div class="column">
            <img src="assets/tut.12.png" style="max-width:100%">
            <p>Before you paste the class list into the class scheduler, write a filter list that contains all the classes you are trying to take. This will ensure that only these classes make it into your schedule, no matter what you may have copied from InsideCBU.</p>
        </div>
    </div>
    </div>`
}

/************
INPUT CLASSES
************/

//Render input page
function pageInput() {
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("settings")) {data["settings"] = {}}
    if (!data["settings"].hasOwnProperty("inputFilter")) {data["settings"]["inputFilter"] = []}
    document.getElementById("display").innerHTML = `
    <div class="margins">
    <p id="p1">Paste Class List Below</p>
    <textarea id="inputClasses" name="Text1" cols="40" rows="5" style="padding: 5px;"></textarea>
    <br>
    <button type="button" class="btn-sm" onclick="submitClasses()" value="Display">Submit</button>
    <button type="button" class="btn-sm" onclick="resetEverything()" value="Display">Reset Everything</button>
    <div style="padding-top: 5px"></div>
    <p id="p1">Filter List (Optional, only classes in this list will be accepted)</p>
    <textarea id="filterList" name="Text2" cols="6" rows="10" style="padding: 5px;" onChange="updateFilterList(this.value)">${data["settings"]["inputFilter"].join("\n")}</textarea>
    <div style="padding-top: 15px"></div>
    <p>Backup your work, or transfer it to another device:</p>
    <button type="button" class="btn-sm" onclick="upload('everything')">Import Everything</button>
    <button type="button" class="btn-sm" onclick="download('everything')">Export Everything</button>
    </div>
    `
    localStorage.setItem("data",JSON.stringify(data))
}

function submitClasses() {
    // Prepare Storage
    let input = document.getElementById("inputClasses").value.split("\n")
    document.getElementById("inputClasses").value = ""
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("class")) {
        data["class"] = {}
    }
    if (!data.hasOwnProperty("settings")) {data["settings"] = {}}
    if (!data["settings"].hasOwnProperty("inputFilter")) {data["settings"]["inputFilter"] = []}

    localStorage.setItem("data",JSON.stringify(data))
    data = JSON.parse(localStorage.getItem("data"))

    // Prepare variables
    const DoW = ["M","T","W","R","F"]
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("class")) {
        data["class"] = {}
    }
    let columns
    let section
    let name
    let note
    let status
    let professor
    let dayTime
    let location
    let type
    let units
    let startDate
    let endDate
    let iterator

    let logIgnore = []
    let logSuccess = []
    

    // Start Processing

    // "input" is a list with the use inputted text split by \n
    for (let i = 0 ; i < input.length ; i++) {
        // Each important lines has tab character or " / " so ignore this line if it doesn't.
        if (!input[i].includes("\t") && !input[i].includes(' / ')) {continue}

        // The top row is not important but has tab characters, so ignore it.
        if (input[i].includes("End Date")) {
            continue
        } else if ((input[i].includes("Open") || input[i].includes("Closed") || input[i].includes("Reopened"))) {
            columns = input[i].split("\t")
            while(columns[0] == '') {
                columns.shift()
            }
            section = columns[0]
            name = columns[1]
            note = columns[2]
            seatsOpen = columns[3].split(" ∕ ")[0]
            seatsTotal = columns[3].split(" ∕ ")[1]
            status = columns[4]

            if (!/[A-Za-z0-9]+-[A-Za-z0-9]+/i.test(section)) {
                console.log(`Improper Format: "${section}" is not section.`)
                continue
            } else if (!/[0-9]+/i.test(seatsOpen)) {
                console.log(`Improper Format: "${seatsOpen}" is not seatsOpen.`)
                continue
            } else if (!/[0-9]+/i.test(seatsTotal)) {
                console.log(`Improper Format: "${seatsTotal}" is not seatsTotal.`)
                continue
            } else if (!/^(open|closed|reopened)$/i.test(status)) {
                console.log(`Improper Format: "${status}" is not status.`)
                continue
            }

            code = section.substring(0,section.indexOf("-"))
            if (!data["settings"]["inputFilter"].includes(code) && data["settings"]["inputFilter"].length != 0) {
                if (!logIgnore.includes(code)) {
                    logIgnore.push(code)
                }
                console.log(data["settings"]["inputFilter"].join() + " does not include " + code)
                continue
            }

            if (!data.class.hasOwnProperty(code)) {data["class"][code] = {}}
            if (!data["class"][code].hasOwnProperty("enable")) {data["class"][code]["enable"] = 1}
            if (!data["class"][code].hasOwnProperty("section")) {data["class"][code]["section"] = {}}
            if (!data["class"][code]["section"].hasOwnProperty(section)) {data["class"][code]["section"][section] = {}}
            data["class"][code]["section"][section]["open"] = ((status == "Closed") ? 0 : 1)
            data["class"][code]["section"][section]["seatsOpen"] = seatsOpen
            data["class"][code]["section"][section]["seatsTotal"] = seatsTotal

            //Prep variables for next section
            data["class"][code]["section"][section]["professors"] = []
            data["class"][code]["section"][section]["time"] = []
            data["class"][code]["section"][section]["location"] = []
            data["class"][code]["section"][section]["meetings"] = []
            iterator = 0
            

        } else if (input[i].includes(" / ")) {
            if (!data["settings"]["inputFilter"].includes(code) && data["settings"]["inputFilter"].length != 0) {
                if (!logIgnore.includes(code)) {
                    logIgnore.push(code)
                }
                console.log(data["settings"]["inputFilter"].join() + " does not include " + code)
                continue
            }
            columns = input[i].split(/ \/ |; /)
            professor = columns[0]
            dayTime = columns[1]
            location = columns[2]
            type = columns[3]

            data["class"][code]["section"][section]["meetings"].push({"time":[]})
            console.log(data)

            // WRITE TIME
            if (/[A-Za-z0-9]+\s+[A-Za-z0-9]+:[A-Za-z0-9]+-[A-Za-z0-9]+:[A-Za-z0-9]+/i.test(dayTime)) {
                timeDay = dayTime.split(' ')
                if (!data["class"][code]["section"][section].hasOwnProperty("time")) {
                    data["class"][code]["section"][section]["time"] = []
                }
                if (!data["class"][code]["section"][section]["meetings"][iterator].hasOwnProperty("time")) {
                    data["class"][code]["section"][section]["meetings"][iterator]["time"] = []
                }
                if (timeDay.length <= 1) {
                    data["class"][code]["section"][section]["time"].push("online")
                    data["class"][code]["section"][section]["meetings"][iterator]["time"].push("online")

                    // AUTO DISABLE ONLINE CLASSES
                    if (!data["class"][code]["section"][section].hasOwnProperty("override")) {
                        data["class"][code]["section"][section]["override"] = 0
                    }
                } else {
                    // DO NOT OVERRIDE CLASSES WITH TIME
                    if (!data["class"][code]["section"][section].hasOwnProperty("override")) {
                        data["class"][code]["section"][section]["override"] = -1
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
                        if ((JSON.stringify(data["class"][code]["section"][section]["time"]).indexOf(JSON.stringify([timeNum + "." + startTime,timeNum + "." + endTime])) >= 0)) {
                        } else {
                            data["class"][code]["section"][section]["time"].push([timeNum + "." + startTime,timeNum + "." + endTime])
                            data["class"][code]["section"][section]["meetings"][iterator]["time"].push([timeNum + "." + startTime,timeNum + "." + endTime])
                        }
                    }
                }

                if (!logSuccess.includes(code)) {
                    logSuccess.push(code)
                }
            } else if (dayTime == "00:00-00:00AM") {
                data["class"][code]["section"][section]["time"].push("online")

                // AUTO DISABLE ONLINE CLASSES
                if (!data["class"][code]["section"][section].hasOwnProperty("override")) {
                    data["class"][code]["section"][section]["override"] = 0
                }

                if (!logSuccess.includes(code)) {
                    logSuccess.push(code)
                }
            } else {
                console.log(`Improper Format: "${dayTime}" is not dayTime.`)
            }

            if (/[\s\S]+,[\s\S]+/i.test(professor)) {
                // WRITE PROFESSOR NAME
                if (!data["class"][code]["section"][section].hasOwnProperty("professors")) {data["class"][code]["section"][section]["professors"] = []}
                //if (!data["class"][code]["section"][section]["professors"].includes(professor)) {
                    data["class"][code]["section"][section]["professors"].push(professor)
                //}

                /* We are not storing professors like this anymore
                if (!data.hasOwnProperty("professor")) {data["professor"] = {}}
                if (!data["professor"].hasOwnProperty(professor)) {data["professor"][professor] = {}}
                if (!data["professor"][professor].hasOwnProperty("score")) {data["professor"][professor]["score"] = -1}
                */
            } else {
                console.log(`Improper Format: "${professor}" is not professor.`)
            }

            data["class"][code]["section"][section]["location"].push(location)
            //console.log(section, location)
            iterator++
        } else if (input[i].includes("\t")) {
            if (!data["settings"]["inputFilter"].includes(code) && data["settings"]["inputFilter"].length != 0) {
                console.log(data["settings"]["inputFilter"].join() + " does not include " + code)
                continue
            }
            columns = input[i].split("\t")
            units = columns[0]
            startDate = columns[1]
            endDate = columns[2]
        }

    }

    localStorage.setItem("data",JSON.stringify(data))
    if (logIgnore.length > 3) {
        tempLen = logIgnore.length-3
        logIgnore = logIgnore.splice(0,3)
        logIgnore.push("plus " + tempLen + " more")
    }
    document.getElementById("p1").innerHTML = ((logSuccess.length != 0) ? "Classes Added: <b>" + logSuccess.join(", ") + "</b> " : "") + ((logIgnore.length != 0) ? "Classes Filtered Out: " + logIgnore.join(", ") : "") + ((logSuccess.length == 0 && logIgnore.length == 0) ? "Nothing to do with your input." : "")
}

function resetEverything() {
    if (confirm("Are you sure you want to delete everything?")) {
        localStorage.clear()
        document.getElementById("filterList").value = ""
    }
}

function updateFilterList(input) {
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("settings")) {data["settings"] = {}}
    data["settings"]["inputFilter"] = input.toUpperCase().split("\n")
    if (isWhitespaceOrEmpty(data["settings"]["inputFilter"])) {
        data["settings"]["inputFilter"] = []
    }
    localStorage.setItem("data",JSON.stringify(data))

}

function prepCallGenerateSchedules() {
    document.getElementById("p1").innerHTML = "Generating schedules, please wait. The website may appear to be frozen."
    setTimeout(function() {
        callGenerateSchedules()
      }, 0);
}

async function callGenerateSchedules()
{
    try {
        let result = await generateSchedules()
        document.getElementById("p1").innerHTML = result
    }
    catch(err) {
        document.getElementById("p1").innerHTML = "ERROR: " + err
    }
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
    let log = ""

    let totalSections = 0

    // Generate Dictionary of Classes and Counters
    // for each class in the list
    for (let i = 0; i < classlist.length; i++) {
        // if it is disabled, exclude this class
        if (data["class"][classlist[i]]["enable"] == 0) {
            log += classlist[i] + " excluded because it is disabled.<br>"
            delete classlist[i]
        } else {
            process[classlist[i]] = {}
            process[classlist[i]]["count"] = 0
            process[classlist[i]]["max"] = -1
            process[classlist[i]]["solo"] = 0
            process[classlist[i]]["list"] = []
            sectionlist = Object.keys(data["class"][classlist[i]]["section"])
            for (let j = 0; j < sectionlist.length; j++) {
                open = data["class"][classlist[i]]["section"][sectionlist[j]]["open"]
                override = data["class"][classlist[i]]["section"][sectionlist[j]]["override"]
                if (override == 2) { //SOLO is selected
                    process[classlist[i]]["solo"] = 1
                    process[classlist[i]]["list"] = [sectionlist[j]]
                    for (let k = j+1; k < sectionlist.length-j; k++) {
                        override = data["class"][classlist[i]]["section"][sectionlist[k]]["override"]
                        if (override == 2) {
                            process[classlist[i]]["list"].push(sectionlist[k])
                        }
                    }
                    break
                } else if (override == 1 || (override != 0 && open == 1)) {
                    process[classlist[i]]["list"].push(sectionlist[j])
                }
            }
            process[classlist[i]]["max"] = process[classlist[i]]["list"].length-1
            totalSections += process[classlist[i]]["list"].length
            // If there are no sections open, exclude this class.
            if (process[classlist[i]]["max"] == -1) {
                log += classlist[i] + " excluded because no sections are available.<br>"
                delete process[classlist[i]]
                delete classlist[i]
            }
        }
    }
    classlist = classlist.filter(function(item) {
        return item != undefined
    });

    //download("this",process)

    if (((totalSections >= 50) ? confirm("There are a lot of available sections, so it might take a little longer than normal to process. Are you sure you want to continue?") : true)) {
        data["schedule"] = []
        run = 1
        while (run) {
            // Check Schedule Overlap
            theseTimes = []
            theseClasses = []
            for (let l = 0; l < classlist.length; l++) {
                if (process[classlist[l]]["solo"] == 1) {
                    for (let o = 0; o < process[classlist[l]]["list"].length ; o++) {
                        thisTime = data["class"][classlist[l]]["section"][process[classlist[l]]["list"][o]]["time"]
                        theseClasses.push(process[classlist[l]]["list"][o])
                        for (let m = 0; m < thisTime.length; m++) {
                            theseTimes.push(thisTime[m])
                        }
                    }
                } else {
                    thisTime = data["class"][classlist[l]]["section"][process[classlist[l]]["list"][process[classlist[l]]["count"]]]["time"]
                    theseClasses.push(process[classlist[l]]["list"][process[classlist[l]]["count"]])
                    for (let m = 0; m < thisTime.length; m++) {
                        theseTimes.push(thisTime[m])
                    }
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
                if (process[classlist[incThis]]["solo"] == 1) {
                    incThis++
                } else if (process[classlist[incThis]]["count"] >= process[classlist[incThis]]["max"]) {
                    process[classlist[incThis]]["count"] = 0
                    incThis++
                } else {
                    process[classlist[incThis]]["count"]++
                    break
                }

            }

        }

        localStorage.setItem("data",JSON.stringify(data))
        log = `<b>${data["schedule"].length} Schedules Generated</b><br>${log}`
        return log
    } else {
        return ""
    }
}

/*************
MANAGE CLASSES
*************/

function pageManageClasses() {
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("class")) {
        data["class"] = {}
    }

    let displayThis = `
    <div style="height:35px"></div>
    <div class="wrapper secondarybar">
        <button type="button" class="btn-sm" onclick="prepCallGenerateSchedules()" value="Display">Generate Schedules</button>
        <div class="item" style="width:20px;"></div>
        <label id="p1"></label>
    </div>
    <div class="margins">
    `
    let professors = []
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    classes = Object.keys(data.class)
    for (let i = 0 ; i < classes.length ; i++) {

        if (data["class"][classes[i]]["enable"] == 1) {
            overrideAllColor = "Green"
        } else if (data["class"][classes[i]]["enable"] == 0) {
            overrideAllColor = "#FFAA00"
        } else {
            overrideAllColor = ""
        }
        displayThis += `<h1 style="margin-bottom:5px">${classes[i]}</h1>
        <select style="margin-bottom:5px; color:${overrideAllColor}" id="dropdown" onchange="changeClassOption('overrideAll', '${classes[i]}', null, this)">
                <option style="color:green" value="1" ${(data["class"][classes[i]]["enable"] == 1) ? "selected" : ""}>Enable</option>
                <option style="color:#FFAA00" value="0" ${(data["class"][classes[i]]["enable"] == 0) ? "selected" : ""}>Disable</option>
                <option style="color:red" value="-1">Delete</option>
        </select>
            `
        sections = Object.keys(data["class"][classes[i]]["section"])

        displayThis += `
        <div class="wrapper">
        <div class="item" style="width:100px;"><label><b>Section</b></label></div>
        <div class="item" style="width:70px;"><label><b>Status</b></label></div>
        <div class="item" style="width:100px;"><label><b>Override</b></label></div>
        <div class="item" style="width:275px;"><label><b>Time</b></label></div>
        <div class="item" style="width:50px;"><label><b>Score</b></label></div>
        <div class="item" style="width:200px;"><label><b>Professor</b></label></div>
        <div class="item" style="width:100px;"><label><b>Seats</b></label></div>
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
                lastname = professors[l].split(", ")[0]
                firstname = professors[l].split(", ")[1].split(" ")[0]
                if (rmp.hasOwnProperty(`${firstname} ${lastname}`)) {
                    theScore = rmp[`${firstname} ${lastname}`]["quality"]
                } else {
                    theScore = 0
                }
                
                //theScore = data["professor"][professors[l]]["score"]
                if (theScore >= 4) {
                    scoreColor = "#009000"
                } else if (theScore >= 3) {
                    scoreColor = "#FF8000"
                } else if (theScore >= 1) {
                    scoreColor = "#FF0000"
                } else {
                    scoreColor = "#000000"
                }
                displayThisScore += `<label style="color:${scoreColor}">${theScore}</label><br>`
            }
            
            if (sectionInfo.override == 1) {
                overrideColor = "Green"
            } else if (sectionInfo.override == 0) {
                overrideColor = "Red"
            } else if (sectionInfo.override == 2) {
                overrideColor = "#FFAA00"
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
                <option style="color:#FFAA00" value="2" ${(sectionInfo.override == 2) ? "selected" : ""}>SOLO</option>
            </select></div>

            <div class="item" style="width:275px;"><label>${displayThisTime}</label></div>

            <div class="item" style="width:50px;">${displayThisScore}</div>

            <div class="item" style="width:200px;"><label>${displayThisProfessors}</label></div>

            <div class="item" style="width:100px;"><label>${((sectionInfo.seatsOpen != null) ? sectionInfo.seatsOpen : '')}</label></div>

            </div>
            <div class="manageClassItem"></div>
            `
        }
    }
    displayThis += "</div> <!--Final Closing Div Tag-->"


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
            break
        case "overrideAll":
            if (value.value == -1) {
                deleteClass(thisClass)
            } else if (value.value == 0) {
                data["class"][thisClass]["enable"] = 0
            } else if (value.value == 1) {
                data["class"][thisClass]["enable"] = 1
            }
            localStorage.setItem("data",JSON.stringify(data))
            menubar('classes')
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

function pageRenderBackground()
{
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("schedule")) {
        data["schedule"] = [[]]
    }
    

    if (!data.hasOwnProperty("render")) {data["render"] = {}}
    data["render"]["current"] = 0
    //Below are in HOURS
    data["render"]["startTime"] = 0
    data["render"]["endTime"] = 24
    //Each pixel verticaly is 1 minute unless adjusted by timeScale.
    data["render"]["columnWidth"] = 100
    data["render"]["columnPad"] = 1
    data["render"]["timeScale"] = 0.6
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
    <div style="height:35px"></div>
    <div class="wrapper secondarybar">
        <div class="item" style="width:10px;"></div>
        <button class="btn-sm" onClick="scheduleAdv(-1)">Back</button>
        <div class="item" style="width:10px;"></div>
        <button class="btn-sm" onClick="scheduleAdv(1)">Forward</button>
        <div class="item" style="width:10px;"></div>
        <p id="p1" style="font-size: 20px;">${"Page " + (data["render"]["current"]+1) + " / " + (data["schedule"].length)}</p>
        <div class="item" style="width:20px;"></div>
        <label id="p1"></label>
    </div>
    <div class="margins">

        <div style="padding-top: 10px"></div>

        <div class="grid-container" style="display: grid;grid-template-columns: 40px auto;">
            <div class="grid-item" style="height: 10px;"></div>
            <div class="grid-item" id="dayLabel"><p>test</p></div>
            <div class="grid-item" id="sideTime" style="position:relative;text-align-last: right;"></div>
            <div class="grid-item" style="position:relative;height:${height}px;"><div id="background"></div><div id="content"></div></div>
        </div>
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
        sectionInfo = data["class"][thisClass]["section"][thisSection]
        thisTime = sectionInfo["time"]

        for (let j = 0; j < thisTime.length; j++) {
            if (thisTime[j] == ["online"]) {break}
            thisDay = parseInt(thisTime[j][0].substring(0, thisTime[j][0].indexOf(".")))
            thisStartTime = thisTime[j][0].substring(thisTime[j][0].indexOf(".")+1)
            thisEndTime = thisTime[j][1].substring(thisTime[j][1].indexOf(".")+1)

            startMinutes = htm(thisStartTime.substring(0,2)) + parseInt(thisStartTime.substring(2))
            endMinutes = htm(thisEndTime.substring(0,2)) + parseInt(thisEndTime.substring(2))

            displayThisProfessors = ""
            for (let k = 0; k < sectionInfo["professors"].length; k++) {
                if (k != 0) {
                    displayThisProfessors += ", "
                }
                displayThisProfessors += sectionInfo["professors"][k].substring(0,sectionInfo["professors"][k].indexOf(","))
            }

            displayContent = displayContent + `<div style="position:absolute;left:${Math.round(thisDay*columnFraction+columnPad)}%;top:${(startMinutes-htm(startTime))*timeScale}px;right:${Math.round(100-((thisDay+1)*columnFraction-columnPad))}%;height:${(endMinutes-startMinutes)*timeScale}px;background:${colors[i]}">${thisSection}${((sectionInfo["open"] == 0) ? ' | Full':'')}<br>${displayThisProfessors}</div>`
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


    document.getElementById("p1").innerHTML = "Page " + (data["render"]["current"]+1) + " / " + (data["schedule"].length)


    localStorage.setItem("data",JSON.stringify(data))

    renderSchedule()
}

document.onkeydown = checkKey;

function checkKey(e) {

    if (currentPage != 3) {return}

    e = e || window.event;

    if (e.keyCode == '37') {
        scheduleAdv(-1)
    }
    else if (e.keyCode == '39') {
        scheduleAdv(1)
    }

}

/*******
SETTINGS
*******/

function pageSettings() {
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("render")) {
        data["render"] = {}
    }

    if (!data["render"].hasOwnProperty("weekends")) {data["render"]["weekends"] = 0}

    document.getElementById("display").innerHTML = `
    <div class="margins">
    <h1>Settings</h1>
    <input type="checkbox" id="weekend" onclick="changeSetting('weekends', this.checked)" ${(data["render"]["weekends"]) ? 'checked' : ''}>
    <label for="weekend">Include Weekends</label>
    </div>
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

function pageProfessors() {
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("professor")) {
        data["professor"] = {}
    }

    let displayThis = ""

    displayThis += `
    <div class="margins">
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
        lastname = professor[i].split(", ")[0]
        firstname = professor[i].split(", ")[1].split(" ")[0]
        displayThis += `
        <div class="wrapper">
        <div class="item" style="width:200px"><a href="https://www.ratemyprofessors.com/search/professors/145?q=${firstname} ${lastname}" target="_blank">${professor[i]}</a></div>
        <div class="item" style="width:50px"><input type="text" value="${data['professor'][professor[i]]['score']}" style="width:50px" onchange="changeProfessorOption('overallScore','${professor[i]}',this)"></div>
        </div>
        `
    }

    displayThis += `</div>`

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

function download(what, payload) {
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
        case "this":
            var json = `{"type":"test","data":${JSON.stringify(payload)}}`
            var a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], {type:"application/json"}));
            a.download = "Class Scheduler - Test.json";
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
    console.log(rmp)

    return
    var mydata = JSON.parse(rmp);
    console.log(mydata)
    return
    data = JSON.parse(localStorage.getItem("data"))

    let input = document.getElementById("inputClasses").value.split("\n")
    document.getElementById("inputClasses").value = ""

    
    

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

function isWhitespaceOrEmpty(array) {
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