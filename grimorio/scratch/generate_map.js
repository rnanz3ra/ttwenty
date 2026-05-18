const fs = require('fs');
const path = require('path');

const magias = require('../data/magias.json');
const brainDir = "C:\\Users\\Lourenço's Home\\.gemini\\antigravity\\brain\\e622e803-30de-47f8-a56b-e21fa67021fb";

const files = fs.readdirSync(brainDir);
const artifactNames = [...new Set(files
    .filter(f => f.endsWith('.png') && !f.startsWith('media__') && !f.startsWith('module_') && f.includes('_17'))
    .map(f => f.split('_').slice(0, -1).join('_'))
)].sort();

const spellIds = Object.values(magias).map(m => m.id);

const map = {};

artifactNames.forEach(art => {
    // Basic conversion: snake_case to kebab-case
    let slug = art.replace(/_/g, '-');
    
    // Check if it exists
    if (spellIds.includes(slug)) {
        map[art] = slug;
    } else {
        // Try some common variations
        const variations = [
            slug.replace(/-magica$/, ''),
            slug.replace(/-magico$/, ''),
            slug.replace(/^a-/, ''),
            slug.replace(/^o-/, ''),
        ];
        
        let found = false;
        for (const v of variations) {
            if (spellIds.includes(v)) {
                map[art] = v;
                found = true;
                break;
            }
        }
        
        if (!found) {
            // Manual overrides for known cases
            if (art === 'escuridao_magica') map[art] = 'escuridao';
            else if (art === 'estatua_magica') map[art] = 'estatua';
            else if (art === 'heroismo_magico') map[art] = 'heroismo';
            else if (art === 'hipnotismo_magico') map[art] = 'hipnotismo';
            else if (art === 'imobilizar_magico') map[art] = 'imobilizar';
            else if (art === 'infligir_ferimentos_magico') map[art] = 'infligir-ferimentos';
            else if (art === 'imagem_espelhada_magica') map[art] = 'imagem-espelhada';
        }
    }
});

console.log(JSON.stringify(map, null, 2));
