const fs = require('fs');

// Read the input text document
const inputText = fs.readFileSync('rawData.txt', 'utf8');

// Split the text into sections
const sections = inputText.split('[title]\r\n');

// Process each section

var searchMap = {};
var bodySearchMap = {};

sections.forEach(section => {
    const [title, body] = section.split('[body]\r\n');
    if (title != null && body != null) {
        const titleText = title.trim();
        const bodyText = body.split('\r\n');
        
        // Create JSON data
        const jsonData = {
            title: titleText,
            body: bodyText
        };

        // Generate the output filename

        var filename = titleText.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        while (searchMap[filename + '.json'] != null) {
            filename = filename + "-2";
        }

        filename = filename + '.json';

        searchMap[filename] = titleText;
        bodySearchMap[filename] = bodyText;
        // Write the JSON data to a file
        fs.writeFileSync("./data/" + filename, JSON.stringify(jsonData, null, 2));
    }
});

//write the search map file
fs.writeFileSync("searchMap.json", JSON.stringify(searchMap));
fs.writeFileSync("bodySearchMap.json", JSON.stringify(bodySearchMap));
console.log("Done");