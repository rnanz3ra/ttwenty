const fs = require('fs');
const path = require('path');

// Configurações
const INPUT_JSON = path.join(__dirname, '../data/magias.json');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/spells');
const PROMPT_TEMPLATE = "Ilustração épica de fantasia para a magia [NOME], onde [DESCRIÇÃO]. Estilo arte de livro de RPG de luxo, pintura digital, cores saturadas e mágicas, iluminação dramática, alta definição, estilo Tormenta 20, sem texto na imagem, proporção 16:9. consistencia artística: manual de regras de fantasia";

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function summarizeDescription(description) {
    if (!description) return "poderosos efeitos mágicos acontecem";
    // Pega a primeira frase ou os primeiros 150 caracteres
    const firstSentence = description.split(/[.!?]/)[0];
    return firstSentence.length > 150 ? firstSentence.substring(0, 147) + "..." : firstSentence;
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const rawData = fs.readFileSync(INPUT_JSON);
    const magias = JSON.parse(rawData);

    console.log(`--- Iniciando Pipeline de Imagens (${magias.length} magias) ---`);

    const taskList = magias.map(magia => {
        const nome = magia.name || magia.nome;
        const filename = `${slugify(nome)}.jpg`;
        const filepath = path.join(OUTPUT_DIR, filename);
        
        // Verifica se a imagem já existe
        const exists = fs.existsSync(filepath);

        const summary = summarizeDescription(magia.description || magia.descricao);
        const prompt = PROMPT_TEMPLATE
            .replace('[NOME]', nome)
            .replace('[DESCRIÇÃO]', summary);

        return {
            nome,
            filename,
            exists,
            prompt
        };
    });

    // Filtra apenas as que não existem
    const pending = taskList.filter(t => !t.exists);

    console.log(`Total: ${taskList.length}`);
    console.log(`Já existentes: ${taskList.length - pending.length}`);
    console.log(`Pendentes: ${pending.length}`);

    // Salva um relatório de tarefas para o assistente processar
    const reportPath = path.join(__dirname, 'spell_image_tasks.json');
    fs.writeFileSync(reportPath, JSON.stringify(pending, null, 2));

    console.log(`\nRelatório de tarefas gerado em: ${reportPath}`);
    console.log(`Aguardando processamento do assistente AI para gerar as imagens via ferramenta generate_image.`);
}

main().catch(console.error);
