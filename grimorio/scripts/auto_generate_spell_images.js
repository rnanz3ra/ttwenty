/**
 * auto_generate_spell_images.js
 *
 * Gerador autônomo de imagens de magias usando a API Gemini.
 * Detecta quais magias ainda não têm imagem e gera em lotes.
 *
 * Uso:
 *   node scripts/auto_generate_spell_images.js
 *   node scripts/auto_generate_spell_images.js --batch 10
 *   node scripts/auto_generate_spell_images.js --start "Detectar Ameaças"
 *
 * Variável de ambiente necessária: GEMINI_API_KEY
 * Configure em grimorio/.env ou passe diretamente:
 *   GEMINI_API_KEY=sua_chave node scripts/auto_generate_spell_images.js
 */

const { GoogleGenAI } = require('@google/genai');
const fs   = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const API_KEY    = process.env.GEMINI_API_KEY;
const SPELLS_JSON = path.join(__dirname, '..', 'data', 'magias.json');
const DEST_DIR   = path.join(__dirname, '..', 'public', 'assets', 'spells');
const LOG_FILE   = path.join(__dirname, '..', 'logs', 'image_gen.log');

// Args
const args       = process.argv.slice(2);
const batchSize  = parseInt(args[args.indexOf('--batch') + 1] || '8', 10);
const startSpell = args[args.indexOf('--start') + 1] || null;
const dryRun     = args.includes('--dry-run');

// Delay entre gerações (ms) — evita rate limit
const DELAY_MS = 4000;

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch {}
}

function getExistingSlugs() {
  return new Set(
    fs.readdirSync(DEST_DIR)
      .filter(f => /\.(png|jpg|webp)$/i.test(f))
      .map(f => f.replace(/\.(png|jpg|webp)$/i, ''))
  );
}

function buildPrompt(spellName) {
  const prompts = {
    'Detectar Ameaças':     'a paladin with glowing golden eyes perceiving hidden enemies highlighted in red through walls, divine detection magic',
    'Dificultar Detecção':  'a wizard wrapping anti-scrying wards around an object, detection spells sliding off, magical interference aura',
    'Disfarce Ilusório':    'a rogue surrounded by shimmering illusion magic, appearance shifting into different person, dual phantom image',
    'Dominação':            'a dark enchanter with glowing eyes imposing their will on a victim who stares blankly, mind control tendrils',
    'Drenar Energia':       'a necromancer draining life force from a victim, dark energy flowing like smoke from the target to the caster',
    'Encantar':             'an enchantress weaving pink and gold magical threads around a mesmerized target, charm magic, hearts and stars',
    'Escudo de Aura':       'a warrior surrounded by a divine glowing shield of golden energy, spiritual protection barrier, holy aura',
    'Escudo de Força':      'an invisible force shield materializing to block an incoming sword strike, crackling blue energy barrier',
    'Escuridão':            'a circle of supernatural darkness spreading outward, smothering all light, tendrils of shadow',
    'Esfera de Energia':    'a mage launching a crackling sphere of pure arcane energy, ball lightning, electric and blue',
    'Estátua':              'a person being transformed into stone, petrification magic spreading from feet upward, grey stone texture',
    'Explosão de Chamas':   'a massive fireball explosion engulfing enemies, fire blast radius, scorching heat wave',
    'Falar com Animais':    'a ranger speaking gently to a wolf, golden speech aura connecting them, nature magic',
    'Falar com Mortos':     'a necromancer communing with a translucent ghost, spectral mist, undead spirit rising',
    'Falar com Plantas':    'a druid pressing hands to a tree that speaks back with glowing bark runes, nature communication',
    'Forma Bestial':        'a druid mid-transformation into a powerful beast, body shifting and morphing, wild shape magic',
    'Forma Etérea':         'a figure becoming translucent and ghostly, passing through solid walls, ethereal plane shifting',
    'Fosso':                'a magical pit opening in the earth, stone cracking and collapsing inward, dimensional rift into ground',
    'Garra de Energia':     'a spectral claw of pure magical energy slashing through armor, arcane force claw',
    'Golpe Relâmpago':      'a divine lightning bolt striking down from above onto a target, golden and white thunderbolt',
  };

  const detail = prompts[spellName] || `a dramatic fantasy spell called "${spellName}", magical energy, arcane power`;
  return `Fantasy RPG spell illustration, dark medieval aesthetic, dramatic lighting, rich oil painting style, no text, no letters, no words. Scene: ${detail}. Dark background with atmospheric fog.`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEY não configurada.');
    console.error('   Adicione em grimorio/.env:  GEMINI_API_KEY=sua_chave');
    console.error('   Obtenha em: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }

  const ai     = new GoogleGenAI({ apiKey: API_KEY });
  const spells = JSON.parse(fs.readFileSync(SPELLS_JSON, 'utf8'));
  const existing = getExistingSlugs();

  // Filter missing
  let missing = spells.filter(s => {
    const slug = slugify(s.name || '');
    return slug && !existing.has(slug);
  });

  // Start from specific spell if requested
  if (startSpell) {
    const idx = missing.findIndex(s => s.name === startSpell);
    if (idx > -1) missing = missing.slice(idx);
  }

  const batch = missing.slice(0, batchSize);

  log(`\n🎨 Auto-Gerador de Imagens — Tormenta 20`);
  log(`   Total magias: ${spells.length}`);
  log(`   Com imagem:   ${existing.size}`);
  log(`   Pendentes:    ${missing.length}`);
  log(`   Este lote:    ${batch.length} (--batch ${batchSize})`);
  if (dryRun) log('   [DRY RUN - nenhuma imagem será gerada]');
  log('');

  if (batch.length === 0) {
    log('✅ Todas as magias já têm imagem!');
    return;
  }

  let success = 0;
  let failed  = 0;

  for (const spell of batch) {
    const slug   = slugify(spell.name);
    const dest   = path.join(DEST_DIR, slug + '.png');
    const prompt = buildPrompt(spell.name);

    log(`🖼️  Gerando: "${spell.name}" → ${slug}.png`);

    if (dryRun) {
      log(`   [DRY RUN] Prompt: ${prompt.substring(0, 80)}...`);
      await sleep(100);
      continue;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: prompt,
        config: {
          responseModalities: ['Text', 'Image'],
          temperature: 1.0,
        },
      });

      // Extract image from response
      let imageData = null;
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          break;
        }
      }

      if (!imageData) throw new Error('Nenhuma imagem retornada pela API');

      const buffer = Buffer.from(imageData, 'base64');
      fs.writeFileSync(dest, buffer);
      log(`   ✅ Salvo: ${dest}`);
      success++;

    } catch (err) {
      const msg = err.message || String(err);
      log(`   ❌ Erro: ${msg}`);

      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        const resetMatch = msg.match(/(\d+h\d+m|\d+m\d+s)/);
        log(`\n⏸️  COTA ESGOTADA${resetMatch ? ` — Reset em ${resetMatch[1]}` : ''}. Abortando.`);
        break;
      }

      failed++;
    }

    if (batch.indexOf(spell) < batch.length - 1) {
      log(`   ⏳ Aguardando ${DELAY_MS / 1000}s...`);
      await sleep(DELAY_MS);
    }
  }

  log(`\n📊 Resultado: ${success} geradas, ${failed} erros`);
  log(`   Total na pasta: ${getExistingSlugs().size} imagens`);
}

main().catch(e => {
  log(`❌ FATAL: ${e.message}`);
  process.exit(1);
});
