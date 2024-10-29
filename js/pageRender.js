import { htm } from "./helpers.js";
import { getCurrentpage } from "./navigation.js";

import {
    addKeys,
    getData,
    setData
} from './helpers.js';

import { DAYS_OF_WEEK, SCHEDULE_COLORS } from "./const.js";

export function pageRenderBackground()
{
    let data = getData();
    data = addKeys(data, [["schedule",[[]]]]);
    data = addKeys(data, [["render",{}]]);

    data["render"]["current"] = 0;
    //Below are in HOURS
    data["render"]["startTime"] = 0;
    data["render"]["endTime"] = 24;
    //Each pixel verticaly is 1 minute unless adjusted by timeScale.
    data["render"]["columnWidth"] = 100;
    data["render"]["columnPad"] = 1;
    data["render"]["timeScale"] = 0.6;
    if (!data["render"].hasOwnProperty("weekends")) {data["render"]["weekends"] = 1;}

    let weekends = data["render"]["weekends"];
    let days = ((weekends) ? 7 : 5);



    let startTime = data["render"]["startTime"];
    let endTime = data["render"]["endTime"];
    let columnWidth = ["render"]["columnWidth"];
    let columnPad = data["render"]["columnPad"];
    let timeScale = data["render"]["timeScale"];
    let totalTime = endTime-startTime;
    let displayBackground = "";
    let displaySideTime = "";
    let displayDayLabel = "";
    let width = (7*columnWidth)+(8*columnPad);
    let height = (htm(totalTime))*timeScale;

    //Prepare DIV's in display html
    document.getElementById("display").innerHTML = `
    <div style="height:35px"></div>
    <div class="wrapper secondarybar">
        <!--<div class="item" style="width:10px;"></div>
        <button type="button" class="btn-sm" onclick="prepCallGenerateSchedules()" value="Display">Regenerate Schedules</button>-->
        <div class="item" style="width:10px;"></div>
        <button class="btn-sm" onClick="scheduleAdv(-1)">Back</button>
        <div class="item" style="width:10px;"></div>
        <button class="btn-sm" onClick="scheduleAdv(1)">Forward</button>
        <div class="item" style="width:10px;"></div>
        <p id="p2" style="font-size: 20px;">${"Page " + (data["render"]["current"]+1) + " / " + (data["schedule"].length)}</p>
        <div class="item" style="width:20px;"></div>
        <label id="p2"></label>
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
    </div>`;


    //Edit Background
    for (let i = 0; i < (Math.ceil(totalTime)) ; i++) {
        displayBackground = displayBackground + `<div class="minorLine" style="top:${i*60*timeScale}px"></div>`;
        displaySideTime = displaySideTime + `<p class="timeLabel" style="text-align:right;top:${i*60*timeScale-7}px">${((i+startTime>12) ? i+startTime-12 : i+startTime)}:00</p>`;
    }


    for (let i = 0; i < days; i++) {
        displayDayLabel = displayDayLabel + `<div style="float:left;width:${100/days}%;padding;10px"><p style="text-align:center">${DAYS_OF_WEEK[i]}</p></div>`;
    }

    document.getElementById("sideTime").innerHTML = displaySideTime;
    document.getElementById("background").innerHTML = displayBackground;
    document.getElementById("dayLabel").innerHTML = displayDayLabel;

    setData(data);

    renderSchedule();
}

export function renderSchedule()
{
    let data = getData();

    let startTime = data["render"]["startTime"];
    let endTime = data["render"]["endTime"];
    let columnWidth = ["render"]["columnWidth"];
    let columnPad = data["render"]["columnPad"];
    let timeScale = data["render"]["timeScale"];
    let weekends = data["render"]["weekends"];
    let displayContent = "";
    let columnFraction = 0;
    let thisTime;
    let thisSection;
    let thisClass;
    let sectionInfo;
    let thisDay;
    let thisStartTime;
    let thisEndTime;
    let startMinutes;
    let endMinutes;
    let displayThisProfessors;

    if (weekends) {
        columnFraction = 100/7;
    } else {
        columnFraction = 100/5;
    }

    //Add Content Squares
    for (let i = 0; i < data["schedule"][data["render"]["current"]].length; i++) {
        thisSection = data["schedule"][data["render"]["current"]][i];
        thisClass = thisSection.substring (0, thisSection.indexOf("-"));
        sectionInfo = data["class"][thisClass]["section"][thisSection];
        thisTime = sectionInfo["time"];

        for (let j = 0; j < thisTime.length; j++) {
            if (thisTime[j] == ["online"]) {break;}
            thisDay = parseInt(thisTime[j][0].substring(0, thisTime[j][0].indexOf(".")));
            thisStartTime = thisTime[j][0].substring(thisTime[j][0].indexOf(".")+1);
            thisEndTime = thisTime[j][1].substring(thisTime[j][1].indexOf(".")+1);

            startMinutes = htm(thisStartTime.substring(0,2)) + parseInt(thisStartTime.substring(2));
            endMinutes = htm(thisEndTime.substring(0,2)) + parseInt(thisEndTime.substring(2));

            displayThisProfessors = "";
            for (let k = 0; k < sectionInfo["professors"].length; k++) {
                if (k != 0) {
                    displayThisProfessors += ", ";
                }
                displayThisProfessors += sectionInfo["professors"][k].substring(0,sectionInfo["professors"][k].indexOf(","));
            }

            displayContent = displayContent + `<div style="position:absolute;left:${Math.round(thisDay*columnFraction+columnPad)}%;top:${(startMinutes-htm(startTime))*timeScale}px;right:${Math.round(100-((thisDay+1)*columnFraction-columnPad))}%;height:${(endMinutes-startMinutes)*timeScale}px;background:${SCHEDULE_COLORS[i]}">${thisSection}${((sectionInfo["open"] == 0) ? ' | Full':'')}<br>${displayThisProfessors}</div>`;
        }

    }

    document.getElementById("content").innerHTML = displayContent;

    setData(data);
}

window.scheduleAdv = scheduleAdv;
function scheduleAdv(moveByThis) {
    let data = getData();

    let temp = data["render"]["current"];

    data["render"]["current"] = data["render"]["current"] + moveByThis;

    if (data["render"]["current"] >= data["schedule"].length || data["render"]["current"]<0) {
        data["render"]["current"] = temp;
    }


    document.getElementById("p2").innerHTML = "Page " + (data["render"]["current"]+1) + " / " + (data["schedule"].length);


    setData(data);

    renderSchedule();
}

document.onkeydown = checkKey;

function checkKey(e) {

    if (getCurrentpage() != 3) {return;}

    e = e || window.event;

    if (e.keyCode == '37') {
        scheduleAdv(-1);
    }
    else if (e.keyCode == '39') {
        scheduleAdv(1);
    }

}