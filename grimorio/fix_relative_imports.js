const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'features', 'components'];

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
            
            // Corrige imports relativos para o core/ui que ficaram quebrados
            content = content.replace(/['"](?:\.\.\/)+core\/ui\/([^'"]+)['"]/g, "'@/core/ui/$1'");
            
            // Conserta caminhos para lib e store que podem ter quebrado
            content = content.replace(/['"](?:\.\.\/)+lib\/([^'"]+)['"]/g, "'@/lib/$1'");
            content = content.replace(/['"](?:\.\.\/)+store\/([^'"]+)['"]/g, "'@/store/$1'");

            // Conserta referências ao antigo db prisma
            content = content.replace(/['"](?:\.\.\/)+lib\/db\/repositories([^'"]*)['"]/g, "'@/core/database/repositories$1'");

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf-8');
                console.log(`Updated relative imports: ${fullPath}`);
            }
        }
    }
}

DIRECTORIES.forEach(dir => processDirectory(path.join(__dirname, dir)));
console.log('Done fixing relative imports.');
