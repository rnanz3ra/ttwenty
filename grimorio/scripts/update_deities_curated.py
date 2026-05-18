import json

lote51_path = r'c:\PROJETOS\tormenta20APP\grimorio\data\deities_lote51.json'

lote52 = [
  {
    "nome": "Azgher",
    "titulo": "Deus do Sol e da Vigilância",
    "lore": "Azgher é o vigilante incansável que cruza os céus em sua carruagem de fogo. Ele é o inimigo mortal das trevas e de Tenebra. Seus devotos são os olhos do sol no mundo, protegendo os viajantes e combatendo o mal oculto nas sombras.",
    "crenças": "A luz revela a verdade. A escuridão deve ser combatida. A coragem é a maior das virtudes sob o sol.",
    "simbolo": "Um sol dourado com rosto humano.",
    "canalizacao": "Positiva",
    "arma": "Cimitarra",
    "devotos": "Guerreiros, Cavaleiros, Clérigos, Paladinos, Qareen.",
    "poderes": ["Espada Solar", "Fulgor Arcaico", "Habitante do Deserto", "Inimigo de Tenebra"],
    "obrigacoes": "Proibido mostrar o rosto em público (deve usar máscara). Proibido possuir mais dinheiro do que o necessário para o próximo mês (o excesso deve ser doado ao templo)."
  },
  {
    "nome": "Hyninn",
    "titulo": "Deus da Trapaça e da Astúcia",
    "lore": "O deus de mil faces. Hyninn não busca a destruição, mas o entretenimento e o lucro através da esperteza. Ele é o patrono dos ladrões, mas também dos diplomatas e daqueles que usam a mente para vencer a força bruta.",
    "crenças": "Nada é o que parece. A força é estúpida; a inteligência é soberana. Uma boa mentira vale mais que uma espada afiada.",
    "simbolo": "Uma máscara sorridente branca e preta.",
    "canalizacao": "Positiva ou Negativa",
    "arma": "Adaga",
    "devotos": "Ladinos, Bardos, Inventores, Goblins, Hynne.",
    "poderes": ["Farsa Infalível", "Forma de Macaco", "Malandragem", "Paparazzo"],
    "obrigacoes": "Nunca recusar um convite para um jogo de azar. Sempre realizar uma trapaça ou peça em uma autoridade uma vez por mês."
  },
  {
    "nome": "Kallyadranoch",
    "titulo": "Deus dos Dragões e do Poder",
    "lore": "O Terceiro, o Deus caído que retornou ao Panteão. Kallyadranoch representa o poder absoluto, a tirania e a herança dracônica. Ele exige respeito e oferece força descomunal àqueles que provam ser dignos de seu sangue.",
    "crenças": "O poder é o único direito. Os fracos servem aos fortes. A herança dos dragões é a herança do mundo.",
    "simbolo": "Uma cabeça de dragão estilizada.",
    "canalizacao": "Negativa",
    "arma": "Lança",
    "devotos": "Arcanistas, Guerreiros, Nobres, Kallyanach.",
    "poderes": ["Aura de Medo", "Escamas Dracônicas", "Servos do Dragão", "Sopro de Kally"],
    "obrigacoes": "Nunca permitir que um insulto a um dragão ou ao próprio Kally passe sem punição. Buscar sempre aumentar seu poder pessoal acima de tudo."
  },
  {
    "nome": "Khalmyr",
    "titulo": "Deus da Justiça e da Ordem",
    "lore": "Líder do Panteão por eras, Khalmyr é o juiz supremo. Ele acredita no cumprimento estrito da lei e na moralidade inabalável. Suas decisões são justas, mas muitas vezes vistas como rígidas demais pelos povos livres.",
    "crenças": "A lei é a base da civilização. A verdade deve prevalecer sobre a conveniência. O crime deve ser sempre punido.",
    "simbolo": "Uma balança sobre uma espada de prata.",
    "canalizacao": "Positiva",
    "arma": "Espada Longa",
    "devotos": "Cavaleiros, Paladinos, Juízes, Clérigos da Ordem, Anões.",
    "poderes": ["Coragem Total", "Dom da Verdade", "Espada Justiceira", "Reparar Injustiça"],
    "obrigacoes": "Proibido mentir. Proibido desobedecer às leis locais ou ordens de superiores hierárquicos legítimos."
  },
  {
    "nome": "Lena",
    "titulo": "Deusa da Vida e da Fertilidade",
    "lore": "Lena é a alegria do nascimento e a preservação da existência. Ela é a única divindade que proíbe terminantemente a violência, pois cada vida é uma centelha divina que ela mesma soprou no mundo.",
    "crenças": "A vida é sagrada. A cura é o maior dos atos. A violência é a negação da existência.",
    "simbolo": "Uma mulher grávida cercada por flores.",
    "canalizacao": "Positiva",
    "arma": "Nenhuma (Ataque Desarmado)",
    "devotos": "Clérigos, Médicos, Parteiras, Sereias.",
    "poderes": ["Aura de Paz", "Cura Extraordinária", "Frutos da Vida", "Sopro de Vida"],
    "obrigacoes": "Proibido causar dano a qualquer criatura viva (incluindo monstros). Proibido usar armas de qualquer tipo."
  }
]

lote53 = [
  {
    "nome": "Lin-Wu",
    "titulo": "Deus da Honra e da Coragem",
    "lore": "O deus do povo tamuraniano. Lin-Wu personifica o código do guerreiro: lealdade, disciplina e respeito. Ele não aceita desvios morais e exige que seus devotos sejam exemplos de conduta, mesmo diante da morte.",
    "crenças": "A honra é mais pesada que uma montanha. A morte é mais leve que uma pena. A palavra dada é uma dívida eterna.",
    "simbolo": "Um dragão serpenteando verticalmente.",
    "canalizacao": "Positiva",
    "arma": "Katana",
    "devotos": "Samurais, Guerreiros, Nobres, Tamuranianos.",
    "poderes": ["Caminho do Guerreiro", "Coragem Total", "Kiai Divino", "Mente Vazia"],
    "obrigacoes": "Seguir o código do Bushido. Nunca atacar um oponente desprevenido ou pelas costas."
  },
  {
    "nome": "Marah",
    "titulo": "Deusa da Paz e do Amor",
    "lore": "Enquanto Lena foca na vida biológica, Marah foca na harmonia entre as mentes. Ela é a diplomata do Panteão, buscando sempre a solução sem conflito e o fim de todas as guerras através da empatia.",
    "crenças": "A paz é o estado natural. O amor vence todas as barreiras. A alegria deve ser espalhada por Arton.",
    "simbolo": "Uma pomba branca ou um coração rosa.",
    "canalizacao": "Positiva",
    "arma": "Nenhuma",
    "devotos": "Bardos, Diplomatas, Clérigos da Paz, Hynne.",
    "poderes": ["Aura de Paz", "Canto da Alegria", "Palavras de Bondade", "Talento Diplomático"],
    "obrigacoes": "Proibido causar dano físico ou mental. Proibido portar armas ou usar magias de ataque."
  },
  {
    "nome": "Megalokk",
    "titulo": "Deus dos Monstros",
    "lore": "O pai das feras. Megalokk acredita que a civilização é uma doença que enfraquece os seres. Ele celebra a selvageria, a predação e a mutação. Para ele, Arton deve ser um lugar de caça eterna.",
    "crenças": "O caçador devora a presa. A força física é a única verdade. A civilização deve ser derrubada.",
    "simbolo": "Uma bocarra monstruosa aberta.",
    "canalizacao": "Negativa",
    "arma": "Machado de Batalha",
    "devotos": "Bárbaros, Druidas, Monstros, Nagahs, Trogs.",
    "poderes": ["Garras do Predador", "Olhar Aterrorizante", "Urro Primal", "Voz dos Monstros"],
    "obrigacoes": "Proibido viver em cidades. Proibido usar itens alquímicos ou tecnológicos (incluindo armas de fogo)."
  },
  {
    "nome": "Nimb",
    "titulo": "Deus do Caos e da Sorte",
    "lore": "Incompreensível e errático, Nimb é o senhor da aleatoriedade. Ele não possui planos, apenas dados que rolam pelo cosmos. Seus devotos são tão imprevisíveis quanto o próprio deus.",
    "crenças": "O caos é a ordem que não entendemos. A sorte é a única mestra. Nada é permanente.",
    "simbolo": "Um dado de seis faces equilibrado em uma quina.",
    "canalizacao": "Positiva ou Negativa",
    "arma": "Maça",
    "devotos": "Bardos, Ladinos, Loucos, Sortudos.",
    "poderes": ["Sorte dos Loucos", "Poder Oculto", "Transmissão da Loucura", "Êxtase da Loucura"],
    "obrigacoes": "Sempre agir de forma errática (o mestre pode exigir que você role um dado para tomar decisões cruciais)."
  }
]

with open(lote51_path, 'r', encoding='utf-8') as f:
    current_data = json.load(f)

# Update map
update_map = {d['nome']: d for d in lote52 + lote53}

final_data = []
for d in current_data:
    if d['nome'] in update_map:
        final_data.append(update_map[d['nome']])
    else:
        final_data.append(d)

with open(lote51_path, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=4)

print(f"Update completed. {len(lote52 + lote53)} deities updated.")
