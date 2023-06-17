function submitClasses()
{
    let input = document.getElementById("inputClasses").value.split("\n")
    document.getElementById("inputClasses").value = ""
    const DoW = ["M","T","W","R","F"]
    let columns
    let section
    let name
    let timeDay
    let dayArray
    let timeArray
    let startTime
    let endTime
    let timeNum
    
    if (localStorage.getItem("data") == null) {
        localStorage.setItem("data","{}")
    }
    data = JSON.parse(localStorage.getItem("data"))
    if (!data.hasOwnProperty("class")) {
        data["class"] = {}
    }

    for (let i = 0 ; i < input.length ; i++) {
        // WRITE CLASS NAME AND SECTION NAME
        if (input[i].includes("Open") || input[i].includes("Closed") || input[i].includes("Reopened")) {
            columns = input[i].split("\t").filter(function(item){return item != ""})

            section = columns[0]
            name = section.substring(0,section.indexOf("-"))

            if (!data.class.hasOwnProperty(name)) {data["class"][name] = {}}
            if (!data["class"][name].hasOwnProperty("section")) {data["class"][name]["section"] = {}}
            if (!data["class"][name]["section"].hasOwnProperty(section)) {data["class"][name]["section"][section] = {}}

            data["class"][name]["section"][section]["open"] = ((columns[3] == "Closed") ? 0 : 1)


        } else if (input[i].includes(" / ")) {
            columns = input[i].split(" / ")

            // WRITE PROFESSOR NAME
            if (!data["class"][name]["section"][section].hasOwnProperty("professors")) {data["class"][name]["section"][section]["professors"] = []}
            if (!data["class"][name]["section"][section]["professors"].some(e => e.name == columns[0])) {
                data["class"][name]["section"][section]["professors"].push({"name":columns[0],"score":'Unsearched'})
            }

            // WRITE TIME
            timeDay = columns[1].split("; ")[0].split(' ')
            if (!data["class"][name]["section"][section].hasOwnProperty("time")) {
                data["class"][name]["section"][section]["time"] = []
            }
            if (timeDay.length <= 1) {
                data["class"][name]["section"][section]["time"].push("online")
            } else {
                dayArray = timeDay[0].split("")
                timeArray = timeDay[1].split('-')
                startTime = timeArray[0].substring(0,2) + timeArray[0].substring(3,5)
                endTime = timeArray[1].substring(0,2) + timeArray[1].substring(3,5)
                if (timeArray[1].substring(5,6) == "P") {
                    if (parseInt(endTime) < 1200) {
                        endTime = (parseInt(endTime) + 1200).toString().padStart(4,"0")
                    }
                    if (timeArray[0].substring(5,6) != "A" && parseInt(startTime) < 1200) {
                        startTime = (parseInt(startTime) + 1200).toString().padStart(4, "0")
                    }
                }
                for (let j = 0 ; j < dayArray.length ; j++) {
                    timeNum = DoW.indexOf(dayArray[j]).toString()
                    data["class"][name]["section"][section]["time"].push([timeNum + "." + startTime,timeNum + "." + endTime])
                }
            }


        }
    }



    localStorage.setItem("data",JSON.stringify(data))
    console.log(data)
}

function generateSchedules()
{
    data = JSON.parse(localStorage.getItem("data"))

    a = data["class"]
    console.log(a)

    localStorage.setItem("data",JSON.stringify(data))
}

function testFunction()
{
    data = JSON.parse(localStorage.getItem("data"))


    
    localStorage.setItem("data",JSON.stringify(data))
}