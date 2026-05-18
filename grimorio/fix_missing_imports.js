const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    for (const { from, to } of replacements) {
        if (content.includes(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    }
    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

replaceInFile('core/lib/t20_data.ts', [
    { from: '"@/data/t20_racas.json"', to: '"@/data/lotes_legado/personagem/t20_racas.json"' },
    { from: '"@/data/racas_ameacas.json"', to: '"@/data/lotes_legado/bestiario/racas_ameacas.json"' },
    { from: '"@/data/racas_ameacas_2.json"', to: '"@/data/lotes_legado/bestiario/racas_ameacas_2.json"' },
    { from: '"@/data/racas_ameacas_3.json"', to: '"@/data/lotes_legado/bestiario/racas_ameacas_3.json"' },
    { from: '"@/data/racas_moreau.json"', to: '"@/data/lotes_legado/personagem/racas_moreau.json"' },
    { from: '"@/data/t20_classes.json"', to: '"@/data/lotes_legado/personagem/t20_classes.json"' },
    { from: '"@/data/t20_origens.json"', to: '"@/data/lotes_legado/personagem/t20_origens.json"' }
]);

replaceInFile('features/monsters/services/monster-rules.ts', [
    { from: "'@/data/monster-rules.json'", to: "'@/data/lotes_legado/bestiario/monster-rules.json'" }
]);

replaceInFile('core/lib/data.ts', [
    { from: '"@/data/powers.json"', to: '"@/data/lotes_legado/personagem/powers.json"' },
    { from: '"@/data/skills.json"', to: '"@/data/lotes_legado/personagem/skills.json"' },
    { from: '"@/data/actions.json"', to: '"@/data/lotes_legado/regras_e_itens/actions.json"' },
    { from: '"@/data/divindades.json"', to: '"@/data/lotes_legado/personagem/divindades.json"' },
    { from: '"@/data/origens.json"', to: '"@/data/lotes_legado/personagem/origens.json"' },
    { from: '"@/data/deities_lote51.json"', to: '"@/data/lotes_legado/deities_lote51.json"' },
    { from: '"@/data/lote60_poderes_concedidos.json"', to: '"@/data/lotes_legado/lote60_poderes_concedidos.json"' },
    { from: '"@/data/lote61_condicoes.json"', to: '"@/data/lotes_legado/lote61_condicoes.json"' },
    { from: '"@/data/lote62_manobras.json"', to: '"@/data/lotes_legado/lote62_manobras.json"' },
    { from: '"@/data/lote71_aventuras.json"', to: '"@/data/lotes_legado/lote71_aventuras.json"' },
    { from: '"@/data/lote72_npcs.json"', to: '"@/data/lotes_legado/lote72_npcs.json"' },
    { from: '"@/data/lote73_parceiros.json"', to: '"@/data/lotes_legado/lote73_parceiros.json"' },
    { from: '"@/data/lote74_viagens.json"', to: '"@/data/lotes_legado/lote74_viagens.json"' },
    { from: '"@/data/lote75_downtime.json"', to: '"@/data/lotes_legado/lote75_downtime.json"' },
    { from: '"@/data/lote76_regras_nd.json"', to: '"@/data/lotes_legado/regras_e_itens/lote76_regras_nd.json"' },
    { from: '"@/data/lote77_npc_stats.json"', to: '"@/data/lotes_legado/lote77_npc_stats.json"' },
    { from: '"@/data/lote78_perigos.json"', to: '"@/data/lotes_legado/lote78_perigos.json"' },
    { from: '"@/data/lote79_xp.json"', to: '"@/data/lotes_legado/lote79_xp.json"' },
    { from: '"@/data/lote80_tesouros.json"', to: '"@/data/lotes_legado/lote80_tesouros.json"' },
    { from: '"@/data/lote81_encantos.json"', to: '"@/data/lotes_legado/lote81_encantos.json"' },
    { from: '"@/data/lote82_artefatos.json"', to: '"@/data/lotes_legado/lote82_artefatos.json"' },
    { from: '"@/data/lote83_cronologia.json"', to: '"@/data/lotes_legado/lote83_cronologia.json"' },
    { from: '"@/data/lote84_atlas.json"', to: '"@/data/lotes_legado/lote84_atlas.json"' },
    { from: '"@/data/lote85_nomes.json"', to: '"@/data/lotes_legado/lote85_nomes.json"' }
]);
