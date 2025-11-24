const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'myApp/data/stands_2025.json');
const outputPath = path.join(__dirname, 'myApp/data/stands_2025.js');

try {
    const data = fs.readFileSync(inputPath, 'utf8');
    const jsContent = `const stands = ${data};\n\nexport default stands;`;
    fs.writeFileSync(outputPath, jsContent);
    console.log('Conversion successful!');
} catch (err) {
    console.error('Error:', err);
}
