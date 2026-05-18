import json
import os

divindades_path = r'c:\PROJETOS\tormenta20APP\grimorio\data\divindades.json'
lote51_path = r'c:\PROJETOS\tormenta20APP\grimorio\data\deities_lote51.json'

titulos = {
    "azgher": "Deus do Sol",
    "hyninn": "Deus da Trapaça",
    "kallyadranoch": "Deus dos Dragões",
    "khalmyr": "Deus da Justiça",
    "lena": "Deusa da Vida",
    "lin-wu": "Deus da Honra",
    "marah": "Deusa da Paz",
    "megalokk": "Deus dos Monstros",
    "nimb": "Deus do Caos",
    "oceano": "Deus dos Mares",
    "sszzaas": "Deus da Traição",
    "tanna-toh": "Deusa do Conhecimento",
    "tenebra": "Deusa da Noite",
    "thwor": "Deus da Destruição",
    "thyatis": "Deus da Ressurreição",
    "valkaria": "Deusa da Ambição",
    "wynna": "Deusa da Magia"
}

with open(divindades_path, 'r', encoding='utf-8') as f:
    originais = json.load(f)

with open(lote51_path, 'r', encoding='utf-8') as f:
    lote51 = json.load(f)

# Nomes já no Lote 51
nobres_lote51 = [d['nome'].lower() for d in lote51]

final_deities = lote51.copy()

for key, d in originais.items():
    if d['nome'].lower() in nobres_lote51:
        continue
    
    # Converter obrigações
    obrigacoes = ""
    if isinstance(d.get('obrigacoes_restricoes'), dict):
        obrigacoes = " ".join(d['obrigacoes_restricoes'].values())
    else:
        obrigacoes = str(d.get('obrigacoes_restricoes', ''))

    # Converter poderes
    poderes = [p['nome'] for p in d.get('poderes_concedidos', [])]

    # Criar novo objeto
    new_deity = {
        "nome": d['nome'],
        "titulo": titulos.get(key, "Divindade do Panteão"),
        "lore": d.get('crencas_objetivos', "Uma das vinte divindades maiores de Arton, que governa aspectos fundamentais do mundo."),
        "crenças": d.get('crencas_objetivos', ""),
        "simbolo": d.get('simbolo_sagrado', ""),
        "canalizacao": d.get('canalizar_energia', ""),
        "arma": d.get('arma_preferida', ""),
        "devotos": d.get('devotos_permitidos', ""),
        "poderes": poderes,
        "obrigacoes": obrigacoes
    }
    final_deities.append(new_deity)

with open(lote51_path, 'w', encoding='utf-8') as f:
    json.dump(final_deities, f, ensure_ascii=False, indent=4)

print(f"Consolidação concluída. Total de deuses: {len(final_deities)}")
