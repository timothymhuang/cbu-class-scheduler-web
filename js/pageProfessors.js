import {
    addKeys,
    getData,
    setData
} from './helpers.js';

import { HTML_PAGE_PROFESSORS_HEADER } from './const.js';

export function pageProfessors() {
    let data = getData();
    data = addKeys(data, [["professor",{}]]);

    let displayThis = "";

    displayThis += HTML_PAGE_PROFESSORS_HEADER;

    professor = Object.keys(data["professor"]);
    for (let i = 0 ; i < professor.length ; i++) {
        lastname = professor[i].split(", ")[0];
        firstname = professor[i].split(", ")[1].split(" ")[0];
        displayThis += `
        <div class="wrapper">
        <div class="item" style="width:200px"><a href="https://www.ratemyprofessors.com/search/professors/145?q=${firstname} ${lastname}" target="_blank">${professor[i]}</a></div>
        <div class="item" style="width:50px"><input type="text" value="${data['professor'][professor[i]]['score']}" style="width:50px" onchange="changeProfessorOption('overallScore','${professor[i]}',this)"></div>
        </div>
        `;
    }

    displayThis += `</div>`;

    document.getElementById("display").innerHTML = displayThis;

    setData(data);
}

function changeProfessorOption(option, name, value) {
    let data = getData();

    switch (option) {
        case "overallScore":
            data["professor"][name]["score"] = value.value;
            break;
        default:
    }

    setData(data);
}