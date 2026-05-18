const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'features', 'core', 'components'];

const REPLACEMENTS = [
    // Tipos
    { from: /@\/types/g, to: '@/core/types' },
    
    // Store
    { from: /@\/store\/character-store/g, to: '@/core/store/character-store' },
    { from: /@\/store\/ui-store/g, to: '@/core/store/ui-store' },
    
    // Lib Data/Rules/Utils genéricos
    { from: /@\/lib\/data/g, to: '@/core/lib/data' },
    { from: /@\/lib\/rules/g, to: '@/core/lib/rules' },
    { from: /@\/lib\/utils/g, to: '@/core/lib/utils' },
    
    // Lib específicos que foram para features
    { from: /@\/lib\/monster-rules/g, to: '@/features/monsters/services/monster-rules' },
    { from: /@\/lib\/character-utils/g, to: '@/features/character/services/character-utils' },
    { from: /@\/lib\/item-utils/g, to: '@/features/character/services/item-utils' },
    { from: /@\/lib\/pdf-generator/g, to: '@/features/character/services/pdf-generator' },
    { from: /@\/lib\/visual-pdf/g, to: '@/features/character/services/visual-pdf' }
];

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let originalContent = content;
            
            for (const {from, to} of REPLACEMENTS) {
                content = content.replace(from, to);
            }

            // Conserta relativas de store, types, e lib caso tenham ficado pendentes
            content = content.replace(/['"](?:\.\.\/)+store\/([^'"]+)['"]/g, "'@/core/store/$1'");
            content = content.replace(/['"](?:\.\.\/)+types([^'"]*)['"]/g, "'@/core/types$1'");
            content = content.replace(/['"](?:\.\.\/)+lib\/utils['"]/g, "'@/core/lib/utils'");
            content = content.replace(/['"](?:\.\.\/)+lib\/data['"]/g, "'@/core/lib/data'");
            content = content.replace(/['"](?:\.\.\/)+lib\/rules['"]/g, "'@/core/lib/rules'");
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf-8');
                console.log(`Updated imports: ${fullPath}`);
            }
        }
    }
}

DIRECTORIES.forEach(dir => processDirectory(path.join(__dirname, dir)));
console.log('Done refactoring deep architecture imports.');
