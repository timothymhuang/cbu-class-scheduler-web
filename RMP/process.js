var fs = require('fs'); 

rmp = fs.readFile('RMP/ratemyprofessors.csv', function(err, data) {
    let output = {}
    rmp = data.toString().split("\n")
    for (let i = 0; i < rmp.length; i++) {
        thisline = rmp[i].slice(1, -2).split(`","`)
        let name = thisline[3]

        output[name] = {}
        output[name]["url"] = thisline[0]
        output[name]["quality"] = thisline[1]
        output[name]["ratings"] = thisline[2].split(" ")[0]
        output[name]["department"] = thisline[4]
        output[name]["repeat"] = thisline[5]
        output[name]["difficulty"] = thisline[6]
    }
    fs.appendFile('RMP/output.txt', JSON.stringify(output), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
});