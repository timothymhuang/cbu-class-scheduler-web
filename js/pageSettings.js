import {
    addKeys,
    getData,
    setData
} from './helpers.js';

export function pageSettings() {
    let data = getData();
    data = addKeys(data, [["render",{}],["weekends",0]]);

    document.getElementById("display").innerHTML = `
    <div class="margins">
    <h1>Settings</h1>
    <input type="checkbox" id="weekend" onclick="changeSetting('weekends', this.checked)" ${(data["render"]["weekends"]) ? 'checked' : ''}>
    <label for="weekend">Include Weekends</label>
    </div>
    `;

    setData(data);
}

window.changeSetting = changeSetting;
export function changeSetting(name, value) {
    let data = getData();

    switch(name) {
        case "weekends":
            data["render"]["weekends"] = value;
            break;
        default:
    }

    setData(data);
}