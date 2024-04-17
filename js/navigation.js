import { pageHome } from "./pageHome.js";
import { pageInput } from "./pageInput.js";
import { pageManageClasses } from "./pageManage.js";
import { pageRenderBackground } from './pageRender.js';
import { pageSettings } from './pageSettings.js';
import { pageProfessors } from './pageProfessors.js';
import { openPaypal } from "./helpers.js";

let currentPage = -1;

export function getCurrentpage() {
    return currentPage;
}

//When menubar button clicked, do something
window.menubar = menubar;
export function menubar(option)
{
    if (option != "donate") {
        document.getElementById("navbar").innerHTML = prepNavbar(option);
    }
    switch(option) {
        case "home":
            pageHome();
            currentPage = 0;
            break;
        case "input":
            pageInput();
            currentPage = 1;
            break;
        case "render":
            pageRenderBackground();
            currentPage = 3;
            break;
        case "classes":
            pageManageClasses();
            currentPage = 2;
            break;
        case "settings":
            pageSettings();
            currentPage = 4;
            break;
        case "professors":
            pageProfessors();
            break;
        case "donate":
            openPaypal();
            break;
        default:
            document.getElementById("display").innerHTML = `
            <h1>No Content</h1>
            `;
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
    <!--<button ${(option == "professors") ? 'class="thisPage"' : ''} type="button" onclick="menubar('professors')">Manage Professors</button>-->`;
}