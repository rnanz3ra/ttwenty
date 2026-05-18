const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'features', 'core', 'components'];

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
            
            content = content.replace(/@\/lib\/rules\//g, '@/core/lib/rules/');
            content = content.replace(/@\/lib\/t20_data/g, '@/core/lib/t20_data');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf-8');
                console.log(`Updated subfolder imports: ${fullPath}`);
            }
        }
    }
}

DIRECTORIES.forEach(dir => processDirectory(path.join(__dirname, dir)));
console.log('Done refactoring subfolders.');
