import {
    addKeys,
    getData,
    setData,
    largerDate,
} from './helpers.js';

import { HTML_INPUT_PAGE } from './const.js';

//Render input pages
export function pageInput() {
    let data = getData();

    if (!data.hasOwnProperty("settings")) {data["settings"] = {};}
    if (!data["settings"].hasOwnProperty("inputFilter")) {data["settings"]["inputFilter"] = [];}
    document.getElementById("display").innerHTML = HTML_INPUT_PAGE;
    document.getElementById("filterList").innerHTML = data["settings"]["inputFilter"].join("\n");
    setData(data);
}

window.submitClasses = submitClasses;
export function submitClasses() {
    let data = getData();

    // Prepare Storage
    let input = document.getElementById("inputClasses").value.split("\n");
    document.getElementById("inputClasses").value = "";

    data = addKeys(data, [["settings", {}],["inputFilter", []]]);

    // Prepare variables
    const DoW = ["M","T","W","R","F"];
    let columns;
    let section;
    let name;
    let note;
    let status;
    let professor;
    let dayTime;
    let location;
    let type;
    let units;
    let startDate;
    let endDate;
    let iterator;
    let code;
    let seatsOpen;
    let seatsTotal;
    let logIgnore = [];
    let logSuccess = [];
    let multiDateAlertShown = false;
    

    // Start Processing

    // "input" is a list with the use inputted text split by \n
    for (let i = 0 ; i < input.length ; i++) {
        // Each important lines has tab character or " / " so ignore this line if it doesn't.
        if (!input[i].includes("\t") && !input[i].includes(' / ')) {continue;}

        // The top row is not important but has tab characters, so ignore it.
        if (input[i].includes("End Date")) {
            continue;
        } else if ((input[i].includes("Open") || input[i].includes("Closed") || input[i].includes("Reopened"))) {
            columns = input[i].split("\t");
            while(columns[0] == '') {
                columns.shift();
            }
            section = columns[0];
            name = columns[1];
            note = columns[2];
            seatsOpen = columns[3].split(" ∕ ")[0];
            seatsTotal = columns[3].split(" ∕ ")[1];
            status = columns[4];

            if (!/[A-Za-z0-9]+-[A-Za-z0-9]+/i.test(section)) {
                console.log(`Improper Format: "${section}" is not section.`);
                continue;
            } else if (!/[0-9]+/i.test(seatsOpen)) {
                console.log(`Improper Format: "${seatsOpen}" is not seatsOpen.`);
                continue;
            } else if (!/[0-9]+/i.test(seatsTotal)) {
                console.log(`Improper Format: "${seatsTotal}" is not seatsTotal.`);
                continue;
            } else if (!/^(open|closed|reopened)$/i.test(status)) {
                console.log(`Improper Format: "${status}" is not status.`);
                continue;
            }

            code = section.substring(0,section.indexOf("-"));
            if (!data["settings"]["inputFilter"].includes(code) && data["settings"]["inputFilter"].length != 0) {
                if (!logIgnore.includes(code)) {
                    logIgnore.push(code);
                }
                console.log(data["settings"]["inputFilter"].join() + " does not include " + code);
                continue;
            }

            data = addKeys(data, [["class", {}], [code, {}],["enable",1]]);
            data = addKeys(data, [["class", {}], [code, {}],["section", {}], [section, {}]]);

            data["class"][code]["section"][section]["open"] = ((status == "Closed") ? 0 : 1);
            data["class"][code]["section"][section]["seatsOpen"] = seatsOpen;
            data["class"][code]["section"][section]["seatsTotal"] = seatsTotal;

            //Prep variables for next section
            data["class"][code]["section"][section]["professors"] = [];
            data["class"][code]["section"][section]["time"] = [];
            data["class"][code]["section"][section]["location"] = [];
            //data["class"][code]["section"][section]["meetings"] = [];
            iterator = 0;
            

        } else if (input[i].includes(" / ")) {
            if (!data["settings"]["inputFilter"].includes(code) && data["settings"]["inputFilter"].length != 0) {
                if (!logIgnore.includes(code)) {
                    logIgnore.push(code);
                }
                console.log(data["settings"]["inputFilter"].join() + " does not include " + code);
                continue;
            }
            let columns = input[i].split(/ \/ |; /);
            let professor = columns[0];
            let dayTime = columns[1];
            let location = columns[2];
            let type = columns[3];
            
            if (!data["class"][code]["section"].hasOwnProperty(section)) {data["class"][code]["section"][section] = {};}
            //if (!data["class"][code]["section"][section].hasOwnProperty("meetings")) {data["class"][code]["section"][section]["meetings"] = [];}

            //data["class"][code]["section"][section]["meetings"].push({"time":[]});

            // WRITE TIME
            if (/[A-Za-z0-9]+\s+[A-Za-z0-9]+:[A-Za-z0-9]+-[A-Za-z0-9]+:[A-Za-z0-9]+/i.test(dayTime)) {
                let timeDay = dayTime.split(' ');
                if (!data["class"][code]["section"][section].hasOwnProperty("time")) {
                    data["class"][code]["section"][section]["time"] = [];
                }
                /*
                if (!data["class"][code]["section"][section]["meetings"][iterator].hasOwnProperty("time")) {
                    data["class"][code]["section"][section]["meetings"][iterator]["time"] = [];
                }
                */
                if (timeDay.length <= 1) {
                    data["class"][code]["section"][section]["time"].push("online");
                    //data["class"][code]["section"][section]["meetings"][iterator]["time"].push("online");

                    // AUTO DISABLE ONLINE CLASSES
                    if (!data["class"][code]["section"][section].hasOwnProperty("override")) {
                        data["class"][code]["section"][section]["override"] = 0;
                    }
                } else {
                    // DO NOT OVERRIDE CLASSES WITH TIME
                    if (!data["class"][code]["section"][section].hasOwnProperty("override")) {
                        data["class"][code]["section"][section]["override"] = -1;
                    }

                    let dayArray = timeDay[0].split("");
                    let timeArray = timeDay[1].split('-');
                    let startTime = timeArray[0].substring(0,2) + timeArray[0].substring(3,5);
                    let endTime = timeArray[1].substring(0,2) + timeArray[1].substring(3,5);
                    if (timeArray[1].substring(5,6) == "P") {
                        if (parseInt(endTime) < 1200) {
                            endTime = (parseInt(endTime) + 1200).toString().padStart(4,"0");
                        }
                        if (timeArray[0].substring(5,6) != "A" && parseInt(startTime) < 1200) {
                            startTime = (parseInt(startTime) + 1200).toString().padStart(4, "0");
                        }
                    }
                    for (let j = 0 ; j < dayArray.length ; j++) {
                        let timeNum = DoW.indexOf(dayArray[j]).toString();
                        if ((JSON.stringify(data["class"][code]["section"][section]["time"]).indexOf(JSON.stringify([timeNum + "." + startTime,timeNum + "." + endTime])) >= 0)) {
                        } else {
                            data["class"][code]["section"][section]["time"].push([timeNum + "." + startTime,timeNum + "." + endTime]);
                            //data["class"][code]["section"][section]["meetings"][iterator]["time"].push([timeNum + "." + startTime,timeNum + "." + endTime]);
                        }
                    }
                }

                if (!logSuccess.includes(code)) {
                    logSuccess.push(code);
                }
            } else if (dayTime == "00:00-00:00AM") {
                data["class"][code]["section"][section]["time"].push("online");

                // AUTO DISABLE ONLINE CLASSES
                if (!data["class"][code]["section"][section].hasOwnProperty("override")) {
                    data["class"][code]["section"][section]["override"] = 0;
                }

                if (!logSuccess.includes(code)) {
                    logSuccess.push(code);
                }
            } else {
                console.log(`Improper Format: "${dayTime}" is not dayTime.`);
            }

            if (/[\s\S]+,[\s\S]+/i.test(professor)) {
                // WRITE PROFESSOR NAME
                if (!data["class"][code]["section"][section].hasOwnProperty("professors")) {
                    data["class"][code]["section"][section]["professors"] = [];
                }
                data["class"][code]["section"][section]["professors"].push(professor);

            } else {
                console.log(`Improper Format: "${professor}" is not professor.`);
            }
            
            if (!data["class"][code]["section"][section].hasOwnProperty("location")) {data["class"][code]["section"][section]["location"] = [];}
            data["class"][code]["section"][section]["location"].push(location);
            //console.log(section, location)
            iterator++;
        } else if (input[i].includes("\t")) {
            if (!data["settings"]["inputFilter"].includes(code) && data["settings"]["inputFilter"].length != 0) {
                console.log(data["settings"]["inputFilter"].join() + " does not include " + code);
                continue;
            }
            columns = input[i].split("\t");
            units = columns[0];
            startDate = columns[1];
            endDate = columns[2];

            data["class"][code]["section"][section]["units"] = units;
            data["class"][code]["section"][section]["startDate"] = startDate;
            data["class"][code]["section"][section]["endDate"] = endDate;
        }
    }

    let classlist = Object.keys(data["class"]);
    startDate = "";
    endDate = "";
    for (let i = 0; i < classlist.length; i++) {
        sectionlist = Object.keys(data["class"][classlist[i]]["section"]);
        for (let j = 0; j < sectionlist.length; j++) {
            if (data["class"][classlist[i]]["section"][sectionlist[j]]["time"][0] != "online") {
                if (startDate == "") {
                    startDate = data["class"][classlist[i]]["section"][sectionlist[j]]["startDate"];
                    endDate = data["class"][classlist[i]]["section"][sectionlist[j]]["endDate"];
                } else {
                    if (largerDate(data["class"][classlist[i]]["section"][sectionlist[j]]["startDate"], startDate) == 0) {
                        startDate = data["class"][classlist[i]]["section"][sectionlist[j]]["startDate"];
                    }
                    if (largerDate(data["class"][classlist[i]]["section"][sectionlist[j]]["endDate"],endDate) == 1) {
                        endDate = data["class"][classlist[i]]["section"][sectionlist[j]]["endDate"];
                    }
                    console.log(startDate,endDate)
                }
            }
        }
    }
    if (largerDate(startDate,endDate) == 0 && !multiDateAlertShown) {
        alert("Your class list contains classes that do not overlap. You may have forgotten to clear last semester's classes. Click \"Reset Everything\" to clear your classes and start over. If you are sure your class list is correct, you can ignore this message.");
        multiDateAlertShown = true;
    }

    if (logIgnore.length > 3) {
        tempLen = logIgnore.length-3;
        logIgnore = logIgnore.splice(0,3);
        logIgnore.push("plus " + tempLen + " more");
    }
    document.getElementById("p1").innerHTML = ((logSuccess.length != 0) ? "Classes Added: <b>" + logSuccess.join(", ") + "</b> " : "") + ((logIgnore.length != 0) ? "Classes Filtered Out: " + logIgnore.join(", ") : "") + ((logSuccess.length == 0 && logIgnore.length == 0) ? "Nothing to do with your input." : "");

    setData(data);
}

window.resetEverything = resetEverything;
function resetEverything() {
    if (confirm("Are you sure you want to delete everything?")) {
        localStorage.clear();
        document.getElementById("filterList").value = "";
    }
}

window.updateFilterList = updateFilterList;
function updateFilterList(input) {
    let data = getData();
    if (!data.hasOwnProperty("settings")) {data["settings"] = {};}
    data["settings"]["inputFilter"] = input.toUpperCase().split("\n");
    if (isWhitespaceOrEmpty(data["settings"]["inputFilter"])) {
        data["settings"]["inputFilter"] = [];
    }
    setData(data);

}

window.addChapel = addChapel;
function addChapel() {
    let data = getData();
    
    

    setData(data);
}