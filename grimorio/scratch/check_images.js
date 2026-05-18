const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\Lourenço's Home\\.gemini\\antigravity\\brain\\e622e803-30de-47f8-a56b-e21fa67021fb";

try {
    const files = fs.readdirSync(brainDir);
    const spellImages = files.filter(f => 
        f.endsWith('.png') && 
        !f.startsWith('media__') && 
        !f.startsWith('module_') &&
        f.includes('_17') // Most artifacts have this timestamp
    );

    const keys = spellImages.map(f => {
        // Remove the timestamp and extension
        // Example: acalmar_animal_1777180062508.png -> acalmar_animal
        const parts = f.split('_');
        parts.pop(); // Remove timestamp
        return parts.join('_');
    });

    const uniqueKeys = [...new Set(keys)].sort();
    console.log(JSON.stringify(uniqueKeys, null, 2));
} catch (e) {
    console.error(e);
}
