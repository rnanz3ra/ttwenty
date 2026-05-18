const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalFixed = 0;
const regex = /([a-zA-ZÀ-ÿ])- ([a-zA-ZÀ-ÿ])/g;

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // First, let's fix word hyphens: "manei- ra" -> "maneira"
    let newContent = content.replace(regex, '$1$2');
    
    // Some lines might just be "- " or have line breaks. We can also clean up multiple spaces.
    // Let's just do the hyphenation fix for now.
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        const matches = content.match(regex);
        const count = matches ? matches.length : 0;
        totalFixed += count;
        console.log(`✅ Fixed ${count} hyphens in ${file}`);
    }
});

console.log(`\n🎉 Total hyphenations fixed: ${totalFixed}`);
