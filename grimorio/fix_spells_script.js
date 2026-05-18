const fs = require('fs');
let spells = require('./data/spells.json');

const fixes = {
  'Abençoar Alimentos': 'dano nem efeitos negativos) e você recebe 5 PV temporários adicionais.',
  'Acalmar Animal': 'A magia falha se o alvo for atacado.',
  'Adaga Mental': 'be a origem da magia.',
  'Alarme': 'té o limite do alcance da magia.',
  'Aliado Animal': 'ral.',
  'Alterar Tamanho': 'vo para você.',
  'Amarras Etéreas': 's Grandes ou menores.',
  'Âncora Dimensional': 'e teste de resistência.',
  'Animar Objetos': 'nimados de forma permanente.',
  'Anular a Luz': 'não se acumula).',
  'Aparência Perfeita': ' de luz precárias.',
  'Aprisionamento': ' preso na área e não pode sair (Vontade anula).',
  'Arma Espiritual': 'dano da arma em um passo.',
  'Arma Mágica': 'do a magia é lançada.',
  'Armamento da Natureza': 'ma em dois passos.',
  'Assassino Fantasmagórico': 'tua livremente.',
  'Aura Divina': 'e de Vontade falha.',
  'Aviso': ').',
  'Banimento': 'ntervalo de círculos).',
  'Barragem elemental de Vectorius': 'plosão.',
  'Bola de Fogo': 'o.',
  'Buraco Negro': 'o 10d6 pontos de dano de esmagamento.',
  'Campo Antimagia': 'mpo Antimagia.',
  'Campo de Força': ' de sustentada, a magia dura 1 rodada.',
  'Chuva de Meteoros': 'sa a ser sustentada.',
  'Círculo da Justiça': 'ção completa.',
  'Círculo da Restauração': 'a ou curativa.',
  'Comando': 'es.',
  'Compreensão': 'ireito a um teste de Vontade para anular o efeito.',
  'Comunhão com a Natureza': ' minuto.',
  'Conceder Milagre': '.',
  'Concentração de Combate': 'uer 2º círculo.',
  'Conjurar Elemental': ' elemental obedece aos seus comandos (ação livre).',
  'Conjurar Monstro': ' conforme suas ordens.',
  'Vivos': ' de Fortitude reduz à metade.',
  'Consagrar': 'difica a área para abençoada.',
  'Contato Extraplanar': 'o alvo pode mentir.',
  'Controlar a Gravidade': 'mo teto ou parede) interceptar a queda, o alvo sofre dano de queda normal.',
  'Controlar Água': 'ua na área evapora.',
  'Controlar Fogo': ' dissipá-lo (ação padrão).',
  'Controlar Madeira': ' objeto (Vontade anula).',
  'Controlar o Tempo': 'a magia.',
  'Controlar Plantas': 'turas vegetais na área de alcance médio (Vontade anula).',
  'Controlar Terra': 'nismos) e de até 10kg.',
  'Convocação Instantânea': 'bjeto para suas mãos.',
  'Criar Elementos': 'a.',
  'Criar Ilusão': 'pada se você se afastar da área de efeito.',
  'Cúpula de Repulsão': 'po, a magia oferece cobertura e +4 na Defesa.',
  'Desejo': 'o a circunstâncias além do seu controle.',
  'Despedaçar': 'M: muda a resistência para Vontade reduz à metade.',
  'Despertar Consciência': 'adquirindo Inteligência 3.',
  'Detectar Ameaças': 'cie do alvo.',
  'Dificultar Detecção': 'jeto na área.',
  'Disfarce Ilusório': ' e muda a duração para 1 dia.',
  'Dispersar as Trevas': 'gos na área sofrem 2d8 pontos de dano de luz.',
  'Dissipar Magia': 'M: dissipa qualquer magia, sem teste de misticismo.',
  'Duplicata Ilusória': 'z de você.',
  'Enfeitiçar': ' um precipício).',
  'Engenho de Mana': ' magias como se fosse seu.',
  'Enxame de Pestes': ' e a Força das criaturas afetadas diminui em 1.',
  'Enxame Rubro de Ichabod': ' se move com a criatura).',
  'Erupção Glacial': 'er dano de fogo.',
  'Escudo da Fé': 'ano.',
  'Esculpir Sons': 'úmero de alvos.',
  'Escuridão': 'scuridão.',
  'Explosão Caleidoscópica': 'o alvo falhar, fica cego.',
  'Ferver Sangue': ' de testes de Fortitude.',
  'Flecha Ácida': 'alvo.',
  'Forma Etérea': 'ce normal.',
  'Fúria do Panteão': 'da cena.',
  'Globo de Invulnerabilidade': 'ime a magia.',
  'Guardião Divino': ', apavorado, confuso, fascinado ou pasmo).',
  'Heroísmo': 'r uma ação padrão, você percebe todas as criaturas furtivas na área.',
  'Ilusão Lacerante': 'e está em chamas.',
  'Imagem Espelhada': 'nta o número de cópias em +1.',
  'Infligir Ferimentos': ' PM: aumenta o dano em +2d8.',
  'Intervenção Divina': 'o o mestre permita.',
  'Invisibilidade': 'dendo uma tocha).',
  'Invulnerabilidade': 'e atordoado.',
  'Lágrimas de Wynna': 'çar magias arcanas.',
  'Lança Ígnea de Aleph': 'turas na linha.',
  'Lendas e Histórias': 'm item mágico, você descobre suas propriedades.',
  'Libertação': 'l, você dissipa efeitos que restrinjam o movimento.',
  'Ligação Telepática': 'ria tem direito a um teste de Vontade para negar.',
  'Luz': 'l.',
  'Manto de Sombras': 'o, você se teletransporta para qualquer lugar dentro do alcance.',
  'Manto do Cruzado': 'egro que causa 1d6 de dano de trevas a quem atacar corpo-a-corpo.',
  'Mão Poderosa de Talude': ' (ação de movimento).',
  'Mapear': 'al você está.',
  'Marca da Obediência': 'le obedecer, sofre o dano.',
  'Marionete': 'ma pode fazer um teste de Vontade ao final do seu turno para anular.',
  'Mente Divina': 'culo.',
  'Metamorfose': 'a forma de uma criatura do mesmo tamanho.',
  'Miragem': 'dem não acreditar se passarem num teste de Vontade).',
  'Montaria Arcana': 'a duração da magia.',
  'Muralha de Ossos': 'ão para erguer uma seção de 1,5m de lado.',
  'Muralha Elemental': 'om uma ação de movimento.',
  'Oração': 'ias em +1.',
  'Orientação': 'l.',
  'Palavra Primordial': 'te de Vontade para evitar o atordoamento.',
  'Pele de Pedra': ' vida.',
  'Possessão': 'ra possessa recebe +4 na Força e Constituição.',
  'Premonição': 'turas que te atacarem rolam 2 dados e ficam com o pior.',
  'Primor Atlético': 'o alcance para pessoal.',
  'Profanar': '+4.',
  'Projetar Consciência': 'reo, tem imunidade a dano não mágico.',
  'Proteção Divina': 'orna a criatura imune ao tipo de energia.',
  'Purificação': 'dição de uma arma maldita.',
  'Queda Suave': 'ar seu deslocamento horizontal.',
  'Raio Polar': ' para evitar ficar paralisado.',
  'Reanimação Impura': 'uras mortas-vivas.',
  'Refúgio': ' local.',
  'Relâmpago Flamejante de Reynard': 'ma ação livre, causar metade do dano original aos mesmos alvos.',
  'Réquiem': 'plo, causar dano em área não quebra a magia.',
  'Resistência a Energia': 'do.',
  'Rogar Maldição': ' impede o alvo de falar.',
  'Roubar a Alma': ' seu nível.',
  'Runa de Proteção': ' dano à metade.',
  'Salto Dimensional': 'ance para médio.',
  'Santuário': 'le não pode ser alvo de magias de alvo individual.',
  'Segunda Chance': ' no combate.',
  'Semiplano': 'ar ao plano original.',
  'Servo Divino': 'fa.',
  'Servos Invisíveis': 'orteira ou varrer o chão.',
  'Seta Infalível de Talude': 'quer 3º círculo.',
  'Silêncio': 'ra involuntária, ela tem direito a um teste de Vontade.',
  'Soco de Arsenal': 'ques causam +1d8 de dano de essência.',
  'Sombra Assassina': ' a magia acaba.',
  'Sonho': 'o recebe a mensagem.',
  'Sopro da Salvação': ' a menos de 0, ele estabiliza.',
  'Talho Invisível de Edauros': 'ar um ataque extra com a arma mágica.',
  'Teia': 'cam enredadas.',
  'Telecinesia': 'strutura de objetos pode ser quebrada.',
  'Teletransporte': 'o sofre chance de erro se viajar para um círculo de teletransporte.',
  'Tempestade Divina': 'bre um inimigo.',
  'Tentáculos de Trevas': 'fícil.',
  'Terremoto': 'r um teste de Reflexos para não cair e sofrer 2d6 de dano de impacto.',
  'Toque Chocante': ' raio.',
  'Toque da Morte': ' (Reflexos reduz à metade).',
  'Toque Vampírico': ' magia causa +2d6 de dano de trevas.',
  'Tranca Arcana': 'ta itens mágicos.',
  'Tranquilidade': 'a duração passa a ser cena.',
  'Transformação de Guerra': 'stenta o efeito.',
  'Transmutar Objetos': 'os tem a duração de 1 dia.',
  'Velocidade': ' corpo.',
  'Viagem Arbórea': 'ntrar em outra árvore.',
  'Viagem Planar': 'eja tocando.',
  'Vidência': 'ode ser usada se a área for escura.',
  'Visão da Verdade': ' do normal, enxerga seres invisíveis.',
  'Visão Mística': 'isão no escuro.',
  'Vitalidade Fantasma': 'emporários iguais à metade do dano causado.',
  'Voz Divina': ' algumas perguntas.'
};

let fixesCount = 0;
spells = spells.map(spell => {
    let origName = spell.name;
    spell.name = spell.name.replace(/.*(?:Capítulo Quatro|Magia|Conjurações e).*?\\s+(.*)/gi, '$1').trim();
    if(spell.name !== origName) fixesCount++;

    let patchName = Object.keys(fixes).find(n => spell.name.includes(n));
    if(patchName && spell.description && !spell.description.endsWith('.')) {
        spell.description = spell.description.trim() + fixes[patchName];
        fixesCount++;
    }
    
    // Fix spaces and hyphens
    if(spell.description) {
        spell.description = spell.description.replace(/\\s{2,}/g, ' ');
        spell.description = spell.description.replace(/([a-zçáéíóúâêôãõ])-\\s+([a-zçáéíóúâêôãõ])/gi, '$1$2');
    }
    
    return spell;
});

// Also fix the merge error "Conjurar Monstro" and "Vivos"
let conjMonstroIdx = spells.findIndex(s => s.name === 'Conjurar Monstro');
let vivosIdx = spells.findIndex(s => s.name === 'Vivos');
if (conjMonstroIdx >= 0 && vivosIdx >= 0 && vivosIdx === conjMonstroIdx + 1) {
    spells.splice(vivosIdx, 1);
    console.log("Merged split spells");
}

let servoDivinoIdx = spells.findIndex(s => s.name === 'Servo Divino');
let vivoIdx = spells.findIndex(s => s.name === 'Vivo');
if (servoDivinoIdx >= 0 && vivoIdx >= 0 && vivoIdx === servoDivinoIdx + 1) {
    spells.splice(vivoIdx, 1);
    console.log("Merged split spells 2");
}

fs.writeFileSync('./data/spells.json', JSON.stringify(spells, null, 2));
console.log('Fixed names and suffixes. Modified total operations: ' + fixesCount);
