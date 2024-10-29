export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const SCHEDULE_COLORS = ["#E0BBE4", "#957DAD", "#D291BC", "#FEC8D8", "#FFDFD3", "#CCF1FF", "#E0D7FF", "#FFCCE1", "#D7EEFF", "#FAFFC7", "#B4CFEC", "#F9E4AD", "#F6A6FF", "#A7FFEB", "#F8B195", "#A8E6CF", "#FFEFD5", "#F0E68C", "#FFB6C1", "#ADD8E6"];

export const HTML_HOME_PAGE = `
    <div class="margins">
        <h1>CBU Class Scheduler</h1>
        <p>Created by Timothy Huang.</p>
        <p>This program is in development and probably has a lot of bugs. It is in no way affiliated with or endorsed by California Baptist University.</p>
        <p><b>Rate My Professors data is outdated and may not be accurate.</b></p>
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
    </div>
`;

export const HTML_INPUT_PAGE = `
    <div class="margins">
    <p id="p1">Paste Class List Below</p>
    <textarea id="inputClasses" name="Text1" cols="40" rows="5" style="padding: 5px;"></textarea>
    <br>
    <button type="button" class="btn-sm" onclick="submitClasses()" value="Display">Submit</button>
    <button type="button" class="btn-sm" onclick="resetEverything()" value="Display">Reset Everything</button>
    <div style="padding-top: 5px"></div>
    <p id="p1">Filter List (Optional, only classes in this list will be accepted)</p>
    <textarea id="filterList" name="Text2" cols="6" rows="10" style="padding: 5px;" onChange="updateFilterList(this.value)"></textarea>
    <div style="padding-top: 15px"></div>
    <button type="button" class="btn-sm" id="addChapelButton" onclick="addChapel()">Add Chapel to Schedule</button>
    <div style="padding-top: 15px"></div>
    <p>Backup your work, or transfer it to another device:</p>
    <button type="button" class="btn-sm" onclick="upload('everything')">Import Everything</button>
    <button type="button" class="btn-sm" onclick="download('everything')">Export Everything</button>
    </div>
`;

export const PAYPAL_URL = "https://ko-fi.com/timothyhuang";

export const HTML_PAGE_MANAGE_HEADER = `
    <div style="height:35px"></div>
        <div class="wrapper secondarybar" id="secondarybar">
            <button type="button" class="btn-sm" onclick="prepCallGenerateSchedules()" value="Display">Generate Schedules</button>
            <label id="p1" style="padding-left:20px;"></label>
        </div>
    <div class="margins">
`

export const HTML_PAGE_MANAGE_COLUMNS = `
    <div class="wrapper">
    <div class="item" style="width:100px;"><label><b>Section</b></label></div>
    <div class="item" style="width:70px;"><label><b>Status</b></label></div>
    <div class="item" style="width:100px;"><label><b>Override</b></label></div>
    <div class="item" style="width:275px;"><label><b>Time</b></label></div>
    <div class="item" style="width:50px;"><label><b>Score</b></label></div>
    <div class="item" style="width:200px;"><label><b>Professor</b></label></div>
    <div class="item" style="width:70px;"><label><b>Seats</b></label></div>
    <div class="item" style="width:200px;"><label><b>Date Range</b></label></div>
    </div>
    <div class="manageClassItem"></div>
`;

export const HTML_PAGE_PROFESSORS_HEADER = `
    <div class="margins">
    <button type="button" onclick="upload('professors')">Import Professor Scores</button>
    <button type="button" onclick="download('professors')">Export Professor Scores</button>
    <div class="wrapper">
    <div class="item" style="width:200px;"><label><b>Name</b></label></div>
    <div class="item" style="width:50px;"><label><b>Score</b></label></div>
    </div>
    <hr style="height:0px; margin-top:0px">
`;

export const CHAPEL_JSON = {
    "enable": 1,
    "section": {
        "GST050-A": {
            "open": 1,
            "seatsOpen": "3400",
            "seatsTotal": "3400",
            "professors": [
                "Vowell, Andy B."
            ],
            "time": [
                [
                    "1.0900",
                    "1.1000"
                ]
            ],
            "location": [
                "MAIN Campus, Events Center"
            ],
            "override": -1,
            "units": "0.00"
        },
        "GST050-B": {
            "open": 1,
            "seatsOpen": "3400",
            "seatsTotal": "3400",
            "professors": [
                "Vowell, Andy B."
            ],
            "time": [
                [
                    "1.1045",
                    "1.1145"
                ]
            ],
            "location": [
                "MAIN Campus, Events Center"
            ],
            "override": -1,
            "units": "0.00"
        }
    }
}