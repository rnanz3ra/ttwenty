const fs = require('fs');
const path = require('path');

const filepath = path.join(process.cwd(), 'data', 'spells.json');
let spells = JSON.parse(fs.readFileSync(filepath, 'utf8'));

let fixed = 0;

spells.forEach(s => {
    if (s.duration && /resistência:/i.test(s.duration)) {
        // Find the index of "Resistência:" or "resistência:"
        const match = s.duration.match(/;\s*resistência:\s*/i);
        if (match) {
            const idx = match.index;
            const durationPart = s.duration.substring(0, idx).trim();
            const resistancePart = s.duration.substring(idx + match[0].length).trim();
            
            s.duration = durationPart;
            s.resistance = resistancePart;
            
            // Fix Missão Divina or similar where description leaked into resistance
            const extraTextMatch = s.resistance.match(/(.*?\([^)]+\)|.*?)(?:\s\s+|\. )([A-Z].*)/);
            if (extraTextMatch && s.resistance.length > 50) {
                 // For safety, only split if it's very long
                 s.resistance = extraTextMatch[1].trim();
                 s.description = extraTextMatch[2].trim() + " " + s.description;
            }
            fixed++;
        }
    }
});

fs.writeFileSync(filepath, JSON.stringify(spells, null, 2), 'utf8');
console.log(`Fixed ${fixed} spells with resistance embedded in duration.`);
