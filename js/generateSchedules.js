import {
    getData,
    setData,
    addKeys,
    checkRangeOverlap,
    largerDate,
    arrayOfTimesHasWeekends,
} from './helpers.js';

window.prepCallGenerateSchedules = prepCallGenerateSchedules;
export function prepCallGenerateSchedules() {
    document.getElementById("p1").innerHTML = "Generating schedules, please wait. The website may appear to be frozen.";
    setTimeout(function() {
        callGenerateSchedules();
      }, 0);
}

async function callGenerateSchedules()
{
    try {
        let result = await generateSchedules();
        document.getElementById("p1").innerHTML = result;
    }
    catch(err) {
        document.getElementById("p1").innerHTML = "ERROR: " + err;
    }
}

function generateSchedules()
{
    let data = getData();
    let sectionlist;
    let process = {};
    let open;
    let override;
    let classlist = Object.keys(data["class"]);
    let run;
    let theseTimes;
    let theseClasses;
    let log = "";
    let incThis;
    let thisTime;
    let startDate = "";
    let endDate = "";
    let hasDateMismatch = false;
    let weekendClasses = false;

    let totalSections = 0;

    // Generate Dictionary of Classes and Counters
    // for each class in the list
    for (let i = 0; i < classlist.length; i++) {
        sectionlist = Object.keys(data["class"][classlist[i]]["section"]);
        for (let j = 0; j < sectionlist.length; j++) {
            if (data["class"][classlist[i]]["section"][sectionlist[j]]["time"][0] != "online") {
                if (data["class"][classlist[i]]["section"][sectionlist[j]].hasOwnProperty("startDate") && data["class"][classlist[i]]["section"][sectionlist[j]].hasOwnProperty("endDate")) {
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
    }
    if (largerDate(startDate,endDate) == 0 && !hasDateMismatch) {
        log = " | Your list contains classes that are not at the same time." + log;
        hasDateMismatch = true;
    }

    for (let i = 0; i < classlist.length; i++) {
        // if it is disabled, exclude this class
        if (data["class"][classlist[i]]["enable"] == 0) {
            log += " | " + classlist[i] + " disabled.";
            delete classlist[i];
        } else {
            process[classlist[i]] = {};
            process[classlist[i]]["count"] = 0;
            process[classlist[i]]["max"] = -1;
            process[classlist[i]]["solo"] = 0;
            process[classlist[i]]["list"] = [];
            sectionlist = Object.keys(data["class"][classlist[i]]["section"]);
            for (let j = 0; j < sectionlist.length; j++) {
                open = data["class"][classlist[i]]["section"][sectionlist[j]]["open"];
                override = data["class"][classlist[i]]["section"][sectionlist[j]]["override"];
                if (override == 2) { //SOLO is selected
                    process[classlist[i]]["solo"] = 1;
                    process[classlist[i]]["list"] = [sectionlist[j]];
                    for (let k = j+1; k < sectionlist.length-j; k++) {
                        override = data["class"][classlist[i]]["section"][sectionlist[k]]["override"];
                        if (override == 2) {
                            process[classlist[i]]["list"].push(sectionlist[k]);
                        }
                    }
                    break;
                } else if (override == 1 || (override != 0 && open == 1)) {
                    process[classlist[i]]["list"].push(sectionlist[j]);
                }
            }
            process[classlist[i]]["max"] = process[classlist[i]]["list"].length-1;
            totalSections += process[classlist[i]]["list"].length;
            // If there are no sections open, exclude this class.
            if (process[classlist[i]]["max"] == -1) {
                log += " | " + classlist[i] + " full";
                delete process[classlist[i]];
                delete classlist[i];
            }
        }
    }
    classlist = classlist.filter(function(item) {
        return item != undefined;
    });

    //download("this",process)

    if (((totalSections >= 50) ? confirm("There are a lot of available sections, so it might take a little longer than normal to process. Are you sure you want to continue?") : true)) {
        data["schedule"] = [];
        run = 1;
        data = addKeys(data, [["render", {}], ["weekends", 0]])
        data["render"]["weekends"] = 0;
        while (run) {
            // Check Schedule Overlap
            theseTimes = [];
            theseClasses = [];
            for (let l = 0; l < classlist.length; l++) {
                if (process[classlist[l]]["solo"] == 1) {
                    for (let o = 0; o < process[classlist[l]]["list"].length ; o++) {
                        thisTime = data["class"][classlist[l]]["section"][process[classlist[l]]["list"][o]]["time"];
                        theseClasses.push(process[classlist[l]]["list"][o]);
                        for (let m = 0; m < thisTime.length; m++) {
                            theseTimes.push(thisTime[m]);
                        }
                    }
                } else {
                    thisTime = data["class"][classlist[l]]["section"][process[classlist[l]]["list"][process[classlist[l]]["count"]]]["time"];
                    theseClasses.push(process[classlist[l]]["list"][process[classlist[l]]["count"]]);
                    for (let m = 0; m < thisTime.length; m++) {
                        theseTimes.push(thisTime[m]);
                    }
                }
            }

            if (!checkRangeOverlap(theseTimes)) {
                data["schedule"].push(theseClasses);
                console.log(theseTimes);
                if(arrayOfTimesHasWeekends(theseTimes) && !weekendClasses) {
                    log += " | Contains weekend classes";
                    data = addKeys(data, [["render", {}], ["weekends", 1]])
                    data["render"]["weekends"] = 1;
                    console.log(data);
                    weekendClasses = true;
                }
            }



            // Increment the Counters
            incThis = 0;
            while (1) {
                if (incThis >= classlist.length) {
                    run = 0;
                    break;
                }
                if (process[classlist[incThis]]["solo"] == 1) {
                    incThis++;
                } else if (process[classlist[incThis]]["count"] >= process[classlist[incThis]]["max"]) {
                    process[classlist[incThis]]["count"] = 0;
                    incThis++;
                } else {
                    process[classlist[incThis]]["count"]++;
                    break;
                }

            }

        }

        setData(data);
        log = `<b>${data["schedule"].length} Schedules Generated</b>${log}`;
        return log;
    } else {
        return "";
    }
}