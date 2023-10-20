var professors = [
    {
        "name": "Nalbandian, Michael J.",
        "score": "Unsearched"
    },
    {
        "name": "Oyanader, Mario A.",
        "score": "Unsearched"
    }
];

if (professors.some(e => e.name == "Unsearched")) {
    console.log('yay')
}