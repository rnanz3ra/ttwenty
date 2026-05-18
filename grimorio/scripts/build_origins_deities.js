// Transforms legacy personagem.json origins + divindades.json into character_options.json
const fs = require('fs');
const path = require('path');

const src = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/personagem.json'),'utf8'));
const divi = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/divindades.json'),'utf8'));
const dest = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/character_options.json'),'utf8'));

// ── Origens ──────────────────────────────────────────────────────────────────
const origins = [];
for (const [key, orig] of Object.entries(src.origens || {})) {
  const itens = Object.values(orig.itens || {});
  const beneficios = Object.entries(orig.beneficios || {}).map(([, b]) => ({
    tipo: b.tipo || 'pericia',
    nome: b.nome || b,
    descricao: b.descricao || ''
  }));
  origins.push({
    id: key,
    nome: orig.nome || key,
    descricao: orig.descricao || '',
    itens,
    beneficios
  });
}

// ── Divindades ───────────────────────────────────────────────────────────────
const deities = divi.map(d => ({
  id: d.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^\w-]/g,''),
  nome: d.nome,
  titulo: d.titulo || '',
  lore: d.lore || '',
  crencas: d.crenças || d.crencas || '',
  simbolo: d.simbolo || '',
  canalizacao: d.canalizacao || '',
  arma_favorita: d.arma || '',
  devotos: d.devotos || '',
  poderes_concedidos: d.poderes || [],
  obrigacoes: d.obrigacoes || ''
}));

dest.origins = origins;
dest.deities = deities;

fs.writeFileSync(path.join(__dirname,'../data/character_options.json'), JSON.stringify(dest, null, 2), 'utf8');
console.log('Origens:', origins.length);
console.log('Divindades:', deities.length);
