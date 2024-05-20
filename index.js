const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON and urlencoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function openSVG(svgpath, pngFileName) {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(svgpath, { waitUntil: 'networkidle0' });
    
    
    // Get SVG dimensions
    const dimensions = await page.evaluate(() => {
        const svgElement = document.querySelector('svg');
        return {
            width: svgElement.width.baseVal.value, 
            height: svgElement.height.baseVal.value
        };
    });

    // Set viewport to SVG dimensions
    await page.setViewport(dimensions);

    // Take screenshot
    await page.screenshot({ path: (pngFileName + '.png') });

    await browser.close();
}

app.post('/' , (req, res) => {
    const svgData = req.body; // Assuming SVG data is sent in the request body
    const fileName = 'saved_svg.svg'; // You can change the file name here

    // Write SVG data to a file
    fs.writeFile(fileName, svgData, (err) => {
        if (err) {
            console.error('Error saving SVG:', err);
            res.status(500).send('Error saving SVG');
        } else {
            console.log('SVG saved successfully');
            res.send('SVG saved successfully');
        }
    });

    // open SVG file
    openSVG('file://' + __dirname + '/' + svgFileName + '.svg', svgFileName);

    
    res.sendFile(__dirname + '/' + svgFileName + '.png');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

