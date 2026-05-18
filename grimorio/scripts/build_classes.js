// Transforms legacy personagem.json classes into canonical character_options.json schema
const fs = require('fs');
const path = require('path');

const src = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/personagem.json'),'utf8'));
const dest = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/character_options.json'),'utf8'));

const classes = [];
for (const [key, cls] of Object.entries(src.classes || {})) {
  const habilidades = Object.entries(cls.habilidades || {}).map(([, h]) => ({
    id: (h.nome||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^\w-]/g,''),
    nome: h.nome || '',
    descricao: typeof h.descricao === 'object' ? Object.values(h.descricao).join('\n\n') : (h.descricao || '')
  }));

  const progressao = Object.entries(cls.tabela || {}).map(([idx, ganhos]) => ({
    nivel: parseInt(idx) + 1,
    ganhos: ganhos
  }));

  const pericias_opcoes = Object.values(cls.pericias?.opcoes || {});

  classes.push({
    id: key,
    nome: cls.nome || key,
    pv_inicial: cls.pv?.base || 0,
    pv_por_nivel: cls.pv?.bonus || 0,
    pm_por_nivel: cls.pm || 0,
    num_pericias: cls.pericias?.qnt || 0,
    pericias_opcoes,
    proficiencias: (cls.proeficiencias || cls.proficiencias || '').split(',').map(s=>s.trim()).filter(Boolean),
    habilidades,
    progressao
  });
}

dest.classes = classes;
fs.writeFileSync(path.join(__dirname,'../data/character_options.json'), JSON.stringify(dest, null, 2), 'utf8');
console.log('Classes inseridas:', classes.length);
classes.forEach(c => console.log(' -', c.nome, '| PV:', c.pv_inicial, '| PM/nv:', c.pm_por_nivel));
