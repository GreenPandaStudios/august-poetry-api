const fs = require('fs');

// Read the input text document
const inputText = fs.readFileSync('rawData.txt', 'utf8');

// Split the text into sections
const sections = inputText.split('[title]\n');

// Process each section
var searchMap = {};
var bodySearchMap = {};

sections.forEach(section => {
    let title, date = null, body;

    // Check if the section includes an optional [date] tag
    if (section.includes('[date]\n')) {
        const [titlePart, rest] = section.split('[date]\n');
        title = titlePart;
        
        // Split the remainder to separate the date from the body
        const [datePart, bodyPart] = rest.split('[body]\n');
        date = datePart ? datePart.trim() : null;
        body = bodyPart;
    } else {
        // Fallback for entries that only have [title] and [body]
        const parts = section.split('[body]\n');
        title = parts[0];
        body = parts[1];
    }

    if (title != null && body != null) {
        const titleText = title.trim();
        const bodyText = body.split('\n');
        bodyText.pop(); // Remove the trailing empty line

        // Create JSON data
        const jsonData = {
            title: titleText,
            body: bodyText
        };

        // Add the date to the JSON output only if it was provided
        if (date) {
            jsonData.date = date;
        }

        // Generate the output filename
        var filename = titleText.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Handle filename collisions
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

// Write the search map files
fs.writeFileSync("searchMap.json", JSON.stringify(searchMap, null, 2));
fs.writeFileSync("bodySearchMap.json", JSON.stringify(bodySearchMap, null, 2));
console.log("Done");