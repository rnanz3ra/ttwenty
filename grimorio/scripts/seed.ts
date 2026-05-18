import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const dataDir = path.join(process.cwd(), 'data');

function readJson<T>(filename: string): T | null {
    const filepath = path.join(dataDir, filename);
    if (!fs.existsSync(filepath)) {
        console.warn(`⚠️  File not found: ${filename}`);
        return null;
    }
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T;
}

function slugify(text: string, suffix?: string): string {
    const base = text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-');
    return suffix ? `${base}-${suffix}` : base;
}

// ============================================================
async function seedRaces() {
    console.log('\n🧬 Seeding Races...');
    const fileData = readJson<any>('character_options.json');
    const data: any[] = fileData?.races ?? [];
    if (!data.length) { console.warn('  ⚠️  No races found in character_options.json'); return; }

    let count = 0;
    for (const r of data) {
        if (!r.nome && !r.name) continue;
        const slug = r.id || slugify(r.nome || r.name);
        try {
            await prisma.race.upsert({
                where: { slug },
                update: {
                    name: r.nome || r.name,
                    bonusFor: r.bonus_atributos?.for ?? 0,
                    bonusDes: r.bonus_atributos?.des ?? 0,
                    bonusCon: r.bonus_atributos?.con ?? 0,
                    bonusInt: r.bonus_atributos?.int ?? 0,
                    bonusSab: r.bonus_atributos?.sab ?? 0,
                    bonusCar: r.bonus_atributos?.car ?? 0,
                },
                create: {
                    slug,
                    name: r.nome || r.name,
                    bonusFor: r.bonus_atributos?.for ?? 0,
                    bonusDes: r.bonus_atributos?.des ?? 0,
                    bonusCon: r.bonus_atributos?.con ?? 0,
                    bonusInt: r.bonus_atributos?.int ?? 0,
                    bonusSab: r.bonus_atributos?.sab ?? 0,
                    bonusCar: r.bonus_atributos?.car ?? 0,
                    abilities: {
                        create: (r.habilidades || []).map((h: any) => ({
                            name: h.nome || 'Habilidade',
                            description: h.descricao || '',
                        })),
                    },
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Race "${r.nome}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} races seeded.`);
}

// ============================================================
async function seedClasses() {
    console.log('\n⚔️  Seeding Classes...');
    const fileData = readJson<any>('character_options.json');
    const data: any[] = fileData?.classes ?? [];
    if (!data.length) { console.warn('  ⚠️  No classes found in character_options.json'); return; }

    let count = 0;
    for (const c of data) {
        if (!c.nome && !c.name) continue;
        const slug = c.id || slugify(c.nome || 'classe');
        try {
            await prisma.t20Class.upsert({
                where: { slug },
                update: {
                    name: c.nome,
                    pvInicial: c.pv_inicial || 0,
                    pvNivel: c.pv_por_nivel || 0,
                    pmNivel: c.pm_por_nivel || 0,
                    atributoChave: c.atributo_chave || '',
                },
                create: {
                    slug,
                    name: c.nome,
                    pvInicial: c.pv_inicial || 0,
                    pvNivel: c.pv_por_nivel || 0,
                    pmNivel: c.pm_por_nivel || 0,
                    atributoChave: c.atributo_chave || '',
                    abilities: {
                        create: (c.habilidades || []).map((h: any) => ({
                            name: h.nome || 'Habilidade',
                            description: h.descricao || '',
                            level: h.nivel || 1,
                        })),
                    },
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Class "${c.nome}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} classes seeded.`);
}

// ============================================================
async function seedSpells() {
    console.log('\n✨ Seeding Spells...');
    const data = readJson<any[]>('magias.json');
    if (!data) return;

    let count = 0;
    for (const s of data) {
        const slug = slugify(s.name || s.id || 'magia', String(s.circle));
        try {
            await prisma.spell.upsert({
                where: { slug },
                update: {
                    name: s.name,
                    circle: s.circle || 0,
                    type: s.type || 'Universal',
                    school: s.school || '',
                    execution: (s.execution || s.execTime || '').replace(/;$/, '').trim(),
                    range: (s.range || '').replace(/;$/, '').trim(),
                    duration: (s.duration || '').replace(/;$/, '').trim(),
                    target: s.target || null,
                    description: s.description || '',
                    resistance: s.resistance || null,
                    area: s.area || null,
                    enhancements: s.enhancements || null,
                },
                create: {
                    slug,
                    name: s.name,
                    circle: s.circle || 0,
                    type: s.type || 'Universal',
                    school: s.school || '',
                    execution: (s.execution || s.execTime || '').replace(/;$/, '').trim(),
                    range: (s.range || '').replace(/;$/, '').trim(),
                    duration: (s.duration || '').replace(/;$/, '').trim(),
                    target: s.target || null,
                    description: s.description || '',
                    resistance: s.resistance || null,
                    area: s.area || null,
                    enhancements: s.enhancements || null,
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Spell "${s.name}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} spells seeded.`);
}

// ============================================================
async function seedPowers() {
    console.log('\n💪 Seeding Powers...');
    const fileData = readJson<any>('personagem.json');
    const data = fileData ? fileData.powers : null;
    if (!data) return;

    let count = 0;
    for (const p of data) {
        try {
            await prisma.power.upsert({
                where: { name_type: { name: p.name, type: p.type || 'Geral' } },
                update: {},
                create: {
                    name: p.name,
                    type: p.type || 'Geral',
                    group: p.group || p.grupo || null,
                    prerequisites: p.prerequisites || p.prerequisitos || null,
                    description: p.description || p.descricao || '',
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Power "${p.name}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} powers seeded.`);
}

// ============================================================
async function seedSkills() {
    console.log('\n📚 Seeding Skills...');
    const fileData = readJson<any>('system_rules.json');
    const data: any[] = fileData?.skills ?? [];
    if (!data.length) { console.warn('  ⚠️  No skills found in system_rules.json'); return; }

    let count = 0;
    for (const s of data) {
        const slug = s.id || slugify(s.nome || 'pericia');
        try {
            await prisma.skill.upsert({
                where: { slug },
                update: {
                    name: s.nome,
                    attribute: s.atributo || '',
                    trainedOnly: s.somente_treinada ?? false,
                    armorPenalty: s.penalidade_armadura ?? false,
                    description: s.descricao || null,
                },
                create: {
                    slug,
                    name: s.nome,
                    attribute: s.atributo || '',
                    trainedOnly: s.somente_treinada ?? false,
                    armorPenalty: s.penalidade_armadura ?? false,
                    description: s.descricao || null,
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Skill "${s.nome}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} skills seeded.`);
}

// ============================================================
async function seedOrigins() {
    console.log('\n🏡 Seeding Origins...');
    const fileData = readJson<any>('character_options.json');
    const data: any[] = fileData?.origins ?? [];
    if (!data.length) { console.warn('  ⚠️  No origins found in character_options.json'); return; }

    let count = 0;
    for (const o of data) {
        const slug = o.id || slugify(o.nome || 'origem');
        try {
            await prisma.origin.upsert({
                where: { slug },
                update: { name: o.nome, description: o.descricao || null },
                create: {
                    slug,
                    name: o.nome || slug,
                    description: o.descricao || null,
                    abilities: {
                        create: (o.beneficios || []).map((b: any) => ({
                            name: b.nome || b.tipo || 'Benefício',
                            description: b.descricao || '',
                        })),
                    },
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Origin "${o.nome}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} origins seeded.`);
}

// ============================================================
async function seedDivinities() {
    console.log('\n⛪ Seeding Divinities...');
    const fileData = readJson<any>('character_options.json');
    const data: any[] = fileData?.deities ?? [];
    if (!data.length) { console.warn('  ⚠️  No deities found in character_options.json'); return; }

    let count = 0;
    for (const d of data) {
        const slug = d.id || slugify(d.nome || 'divindade');
        try {
            await prisma.divinity.upsert({
                where: { slug },
                update: {
                    name: d.nome,
                    portfolio: d.crencas || d.titulo || null,
                    symbol: d.simbolo || null,
                    alignment: d.canalizacao || null,
                    grantedPower: Array.isArray(d.poderes_concedidos)
                        ? d.poderes_concedidos.join(', ')
                        : (d.poderes_concedidos || null),
                    description: [d.lore, d.obrigacoes ? `Obrigações: ${d.obrigacoes}` : ''].filter(Boolean).join('\n\n') || null,
                },
                create: {
                    slug,
                    name: d.nome,
                    portfolio: d.crencas || d.titulo || null,
                    symbol: d.simbolo || null,
                    alignment: d.canalizacao || null,
                    grantedPower: Array.isArray(d.poderes_concedidos)
                        ? d.poderes_concedidos.join(', ')
                        : (d.poderes_concedidos || null),
                    description: [d.lore, d.obrigacoes ? `Obrigações: ${d.obrigacoes}` : ''].filter(Boolean).join('\n\n') || null,
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Divinity "${d.nome}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} divinities seeded.`);
}

// ============================================================
async function seedThreats() {
    console.log('\n🐉 Seeding Threats...');
    const data = readJson<any[]>('bestiario.json');
    if (!data) return;

    let count = 0;
    for (const a of data) {
        const nd = a.nd ? String(a.nd).replace(/\//g, '') : '0';
        const slug = slugify(a.nome || 'ameaca', nd);
        try {
            const threat = await prisma.threat.upsert({
                where: { slug },
                update: {},
                create: {
                    slug,
                    name: a.nome || 'Ameaça Desconhecida',
                    nd: String(a.nd || '0'),
                    type: a.tipo || 'Monstro',
                    size: a.tamanho || 'Médio',
                    role: a.papel || null,
                    perception: a.percepcao ?? null,
                    initiative: a.iniciativa ?? null,
                    defense: a.defesa ?? null,
                    fortitude: a.fortitude ?? null,
                    reflexes: a.reflexos ?? null,
                    will: a.vontade ?? null,
                    hp: typeof a.pv === 'number' ? a.pv : (parseInt(a.pv) || null),
                    mp: a.pm != null ? String(a.pm) : null,
                    speed: a.deslocamento || null,
                    rd: a.rd != null ? String(a.rd) : null,
                    fastHealing: a.cura_acelerada ?? null,
                    skills: a.pericias || null,
                    book: a.fonte || 'Ameaças de Arton',
                },
            });

            // Atributos
            if (a.atributos) {
                await prisma.threatAttribute.upsert({
                    where: { threatId: threat.id },
                    update: {},
                    create: {
                        threatId: threat.id,
                        for: a.atributos.for ?? null,
                        des: a.atributos.des ?? null,
                        con: a.atributos.con ?? null,
                        int: a.atributos.int ?? null,
                        sab: a.atributos.sab ?? null,
                        car: a.atributos.car ?? null,
                    },
                });
            }

            // Ataques
            if (a.ataques?.length) {
                await prisma.threatAttack.createMany({
                    data: a.ataques.map((atk: any) => ({
                        threatId: threat.id,
                        name: atk.nome || 'Ataque',
                        bonus: atk.bonus ?? null,
                        damage: atk.dano || null,
                        type: atk.tipo || null,
                    })),
                });
            }

            // Habilidades
            if (a.habilidades?.length) {
                await prisma.threatAbility.createMany({
                    data: a.habilidades.map((h: any) => ({
                        threatId: threat.id,
                        name: typeof h === 'string' ? 'Habilidade' : (h.nome || 'Habilidade'),
                        description: typeof h === 'string' ? h : (h.descricao || null),
                        type: typeof h === 'string' ? 'Especial' : (h.tipo || null),
                    })),
                });
            }

            // Imunidades
            if (a.imunidades?.length) {
                await prisma.threatImmunity.createMany({
                    data: a.imunidades.map((imm: any) => ({
                        threatId: threat.id,
                        value: typeof imm === 'string' ? imm : String(imm),
                    })),
                });
            }

            count++;
        } catch (e: any) {
            console.error(`  ❌ Threat "${a.nome}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} threats seeded.`);
}

// ============================================================
async function seedEquipment() {
    console.log('\n🗡️  Seeding Equipment...');

    const fileData = readJson<any>('armory.json');
    if (!fileData) return;

    const sources = [
        { items: fileData.weapons,            category: 'Arma' },
        { items: fileData.armors,             category: 'Armadura' },
        { items: fileData.shields,            category: 'Escudo' },
        { items: fileData.general_items,      category: 'Item Geral' },
        { items: fileData.alchemical_items,   category: 'Item Alquímico' },
        { items: fileData.superior_modifications, category: 'Modificação Superior' },
    ];

    let count = 0;
    for (const { items, category } of sources) {
        if (!Array.isArray(items)) continue;

        for (const item of items) {
            const name = item.nome || item.name || 'Item';
            const slug = slugify(name, category.toLowerCase().replace(/\s+/g, '-'));
            try {
                await prisma.equipment.upsert({
                    where: { slug },
                    update: {
                        description: item.descricao || item.efeito || item.description || null,
                        price: item.preco_to != null ? parseFloat(String(item.preco_to)) : null,
                        damage: item.dano || null,
                        damageType: item.tipo_dano || null,
                        critical: item.critico || null,
                        range: item.alcance || null,
                        defense: item.bonus_ca != null ? parseInt(item.bonus_ca) : null,
                        penalty: item.penalidade != null ? parseInt(item.penalidade) : null,
                    },
                    create: {
                        slug,
                        name,
                        category,
                        type: item.categoria || item.tipo || null,
                        description: item.descricao || item.efeito || item.description || null,
                        price: item.preco_to != null ? parseFloat(String(item.preco_to)) : null,
                        weight: item.espacos != null ? parseFloat(String(item.espacos)) : null,
                        damage: item.dano || null,
                        damageType: item.tipo_dano || null,
                        critical: item.critico || null,
                        range: item.alcance || null,
                        defense: item.bonus_ca != null ? parseInt(item.bonus_ca) : null,
                        penalty: item.penalidade != null ? parseInt(item.penalidade) : null,
                    },
                });
                count++;
            } catch (e: any) {
                console.error(`  ❌ Equipment "${name}": ${e.message}`);
            }
        }
    }
    console.log(`  ✅ ${count} equipment items seeded.`);
}

// ============================================================
async function seedConditions() {
    console.log('\n🤒 Seeding Conditions...');
    const data = readJson<any[]>('condicoes.json');
    if (!data) return;

    let count = 0;
    for (const c of data) {
        const slug = slugify(c.name || c.id || 'condicao');
        try {
            await prisma.condition.upsert({
                where: { slug },
                update: {
                    name: c.name,
                    category: c.category || 'Geral',
                    effect: c.effect || '',
                    stackingRule: c.stacking_rule || null,
                },
                create: {
                    slug,
                    name: c.name,
                    category: c.category || 'Geral',
                    effect: c.effect || '',
                    stackingRule: c.stacking_rule || null,
                },
            });
            count++;
        } catch (e: any) {
            console.error(`  ❌ Condition "${c.name}": ${e.message}`);
        }
    }
    console.log(`  ✅ ${count} conditions seeded.`);
}

// ============================================================
async function main() {
    console.log('🌱 Starting full DB seed for Tormenta20 APP...');
    console.log('='.repeat(50));

    await seedRaces();
    await seedClasses();
    await seedSpells();
    await seedPowers();
    await seedSkills();
    await seedOrigins();
    await seedDivinities();
    await seedThreats();
    await seedEquipment();
    await seedConditions();

    // Summary
    console.log('\n' + '='.repeat(50));
    const counts = await Promise.all([
        prisma.race.count(),
        prisma.t20Class.count(),
        prisma.spell.count(),
        prisma.power.count(),
        prisma.skill.count(),
        prisma.origin.count(),
        prisma.divinity.count(),
        prisma.threat.count(),
        prisma.equipment.count(),
        prisma.condition.count(),
    ]);

    console.log('📊 Final counts:');
    console.log(`  • Races:      ${counts[0]}`);
    console.log(`  • Classes:    ${counts[1]}`);
    console.log(`  • Spells:     ${counts[2]}`);
    console.log(`  • Powers:     ${counts[3]}`);
    console.log(`  • Skills:     ${counts[4]}`);
    console.log(`  • Origins:    ${counts[5]}`);
    console.log(`  • Divinities: ${counts[6]}`);
    console.log(`  • Threats:    ${counts[7]}`);
    console.log(`  • Equipment:  ${counts[8]}`);
    console.log(`  • Conditions: ${counts[9]}`);
    console.log('\n✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('\n❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
