const subsetFont = require('../index');
const fs = require('fs');
const path = require('path');

(async() => {
    const mySfntFontBuffer = fs.readFileSync(path.resolve(__dirname, 'FluentSystemIcons-Filled.ttf'));

    // Create a new font with only the characters required to render "Hello, world!" in WOFF2 format:
    const subsetBuffer = await subsetFont(mySfntFontBuffer, '\u{1074d}\u{ffff}', {
        targetFormat: 'sfnt',
    });

    fs.writeFileSync(path.resolve(__dirname, 'subsetFont.ttf'), subsetBuffer);
})()