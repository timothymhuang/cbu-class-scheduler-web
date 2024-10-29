import { menubar } from './navigation.js';
import { navbarDrag } from './navigation.js';

//Needed for javascript functions that are called directly by HTML onClick.
import { prepCallGenerateSchedules } from './generateSchedules.js';

window.onLoad = onLoad;
function onLoad() {
    menubar('home');
    navbarDrag();
}