import { beautifyTime } from "./helpers.js";

import { RMP } from "./rmp.js";

import {
    HTML_PAGE_MANAGE_HEADER,
    HTML_PAGE_MANAGE_COLUMNS,
    DAYS_OF_WEEK
} from "./const.js";

import {
    addKeys,
    getData,
    setData
} from './helpers.js';

export function pageManageClasses() {
    let data = getData();
    data = addKeys(data,[["class",{}]])

    let displayThis = HTML_PAGE_MANAGE_HEADER;
    let professors = [];

    let classes = Object.keys(data.class);

    let overrideAllColor;
    let sections;
    let sectionInfo;
    let thisSection;
    let thisClass;
    let thisTime;
    let displayThisTime;
    let thisDay;
    let thisStartTime;
    let thisEndTime;
    let displayThisProfessors;
    let displayThisScore;
    let scoreColor;
    let lastname;
    let firstname;
    let theScore;
    let overrideColor;

    for (let i = 0 ; i < classes.length ; i++) {

        if (data["class"][classes[i]]["enable"] == 1) {
            overrideAllColor = "Green";
        } else if (data["class"][classes[i]]["enable"] == 0) {
            overrideAllColor = "#FFAA00";
        } else {
            overrideAllColor = "";
        }
        displayThis += `<h1 style="margin-bottom:5px">${classes[i]}</h1>
        <select style="margin-bottom:5px; color:${overrideAllColor}" id="dropdown" onchange="changeClassOption('overrideAll', '${classes[i]}', null, this)">
                <option style="color:green" value="1" ${(data["class"][classes[i]]["enable"] == 1) ? "selected" : ""}>Enable</option>
                <option style="color:#FFAA00" value="0" ${(data["class"][classes[i]]["enable"] == 0) ? "selected" : ""}>Disable</option>
                <option style="color:red" value="-1">Delete</option>
        </select>
            `;
        sections = Object.keys(data["class"][classes[i]]["section"]);

        displayThis += HTML_PAGE_MANAGE_COLUMNS;

        for (let j = 0 ; j < sections.length ; j++) {
            sectionInfo = data["class"][classes[i]]["section"][sections[j]];

            thisSection = sections[j];
            thisClass = thisSection.substring (0, thisSection.indexOf("-"));
            thisTime = data["class"][thisClass]["section"][thisSection]["time"];
            displayThisTime = "";
            for (let k = 0; k < thisTime.length; k++) {
                if (thisTime[k] == ["online"]) {
                    displayThisTime += "Online";
                    break;
                }
                thisDay = parseInt(thisTime[k][0].substring(0, thisTime[k][0].indexOf(".")));
                thisStartTime = thisTime[k][0].substring(thisTime[k][0].indexOf(".")+1);
                thisEndTime = thisTime[k][1].substring(thisTime[k][1].indexOf(".")+1);

                displayThisTime += DAYS_OF_WEEK[thisDay] + ", " + beautifyTime(thisStartTime) + " - " + beautifyTime(thisEndTime) + "<br>";
            }
            professors = data["class"][thisClass]["section"][thisSection]["professors"];
            displayThisProfessors = "";
            displayThisScore = "";
            for (let l = 0; l < professors.length ; l++) {
                displayThisProfessors += `${professors[l]}<br>`;
                lastname = professors[l].split(", ")[0];
                firstname = professors[l].split(", ")[1].split(" ")[0];
                if (RMP.hasOwnProperty(`${firstname} ${lastname}`)) {
                    theScore = RMP[`${firstname} ${lastname}`]["quality"];
                } else {
                    theScore = 0;
                }
                
                //theScore = data["professor"][professors[l]]["score"]
                if (theScore >= 4) {
                    scoreColor = "#009000";
                } else if (theScore >= 3) {
                    scoreColor = "#FF8000";
                } else if (theScore >= 1) {
                    scoreColor = "#FF0000";
                } else {
                    scoreColor = "#000000";
                }
                displayThisScore += `<label style="color:${scoreColor}">${theScore}</label><br>`;
            }
            
            if (sectionInfo.override == 1) {
                overrideColor = "Green";
            } else if (sectionInfo.override == 0) {
                overrideColor = "Red";
            } else if (sectionInfo.override == 2) {
                overrideColor = "#FFAA00";
            } else {
                overrideColor = "";
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
            `;
        }
    }
    displayThis += "</div> <!--Final Closing Div Tag-->";


    document.getElementById("display").innerHTML = displayThis;

    setData(data);
}

window.changeClassOption = changeClassOption;
function changeClassOption(type, thisClass, thisSection, value) {
    let data = getData();

    switch (type) {
        case "override":
            data["class"][thisClass]["section"][thisSection]["override"] = value.value;
            setData(data);
            menubar('classes');
            break;
        case "overrideAll":
            if (value.value == -1) {
                deleteClass(thisClass);
                return;
            } else if (value.value == 0) {
                data["class"][thisClass]["enable"] = 0;
            } else if (value.value == 1) {
                data["class"][thisClass]["enable"] = 1;
            }
            setData(data);
            menubar('classes');
            break;
        default:
            break;
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

    setData(data);
    return;
}

function deleteClass(thisClass) {
    let data = getData();

    if (confirm("Are you sure you want to delete " + thisClass + "?")) {
        delete data["class"][thisClass];
        console.log("Deleted " + thisClass);
    }

    setData(data);

    menubar('classes');
}