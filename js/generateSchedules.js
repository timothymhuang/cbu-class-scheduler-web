import {
    getData,
    setData,
    addKeys,
    checkRangeOverlap,
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

    let totalSections = 0;

    // Generate Dictionary of Classes and Counters
    // for each class in the list
    console.log(classlist)
    for (let i = 0; i < classlist.length; i++) {
        sectionlist = Object.keys(data["class"][classlist[i]]["section"]);

        if (i == 0) {
            startDate = data["class"][classlist[0]]["section"][sectionlist[0]]["startDate"];
            endDate = data["class"][classlist[0]]["section"][sectionlist[0]]["endDate"];
            console.log(classlist[0])
            console.log(startDate)
            console.log(endDate)
            console.log("init")
        } else {
            console.log(startDate)
            console.log(data["class"][classlist[i]]["section"][sectionlist[0]]["startDate"])
            if (startDate != data["class"][classlist[i]]["section"][sectionlist[0]]["startDate"] || endDate != data["class"][classlist[i]]["section"][sectionlist[0]]["endDate"]) {
                if (!hasDateMismatch) {
                    log = "Warning: Classes have mismatching start and end dates. Make sure all classes are from the same semester. Click \"Reset Everying\" on the Input Classes page if you need to clear out the old stuff.<br>" + log;
                    hasDateMismatch = true;
                }
                console.log("not fine")
            } else {
                console.log("Fine")
            }
        }
    }

    for (let i = 0; i < classlist.length; i++) {
        // if it is disabled, exclude this class
        if (data["class"][classlist[i]]["enable"] == 0) {
            log += classlist[i] + " excluded because it is disabled.<br>";
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
                log += classlist[i] + " excluded because no sections are available.<br>";
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
        log = `<b>${data["schedule"].length} Schedules Generated</b><br>${log}`;
        return log;
    } else {
        return "";
    }
}