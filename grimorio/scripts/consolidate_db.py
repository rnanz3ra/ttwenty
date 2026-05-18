import json
import os
import glob

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            print(f"Erro ao decodificar {filepath}")
            return None

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def normalize_ameaca(ameaca):
    """Garante chaves mínimas: nome, nd, tipo, pv, pm, defesa, atributos, habilidades, fonte"""
    # Algumas ameaças podem vir com chaves diferentes
    return {
        "nome": ameaca.get("nome", "Desconhecido"),
        "nd": ameaca.get("nd", "0"),
        "tipo": ameaca.get("tipo", "Monstro"),
        "pv": ameaca.get("pv", 0),
        "pm": ameaca.get("pm", 0),
        "defesa": ameaca.get("defesa", 0),
        "atributos": ameaca.get("atributos", {}),
        "habilidades": ameaca.get("habilidades", []),
        "fonte": "Ameaças de Arton",
        **{k:v for k,v in ameaca.items() if k not in ["nome", "nd", "tipo", "pv", "pm", "defesa", "atributos", "habilidades", "fonte"]}
    }

def main():
    base_dir = "data"
    
    # DBs Finais
    ameacas_db = []
    opcoes_personagem_db = {"racas": [], "variantes": [], "poderes": []}
    equipamento_db = {"armas": [], "armaduras_e_escudos": [], "materiais_especiais": [], "itens_gerais": []}
    regras_e_perigos_db = {"tabelas_criacao": {}, "tabelas_encontros": {}, "doencas_e_maldicoes": {}, "perigos_complexos": []}
    
    # 1. Coletar Ameaças (Lotes 1 a final, 10a14, 15a18)
    lote_files = glob.glob(os.path.join(base_dir, "lote*_ameacas.json"))
    for file in lote_files:
        if "final" in file or "10a14" in file or "15a18" in file or any(str(i) in file for i in range(1, 6)):
            data = load_json(file)
            if data:
                if isinstance(data, list):
                    for item in data:
                        ameacas_db.append(normalize_ameaca(item))
                elif isinstance(data, dict) and "ameacas" in data:
                    for item in data["ameacas"]:
                        ameacas_db.append(normalize_ameaca(item))

    # Algumas raças ou outras coisas podem ter vindo misturadas, mas em lote_ é tudo monstro.
    
    # 2. Coletar Raças/Opções de Personagem (racas_ameacas.json, 2, 3, moreau)
    raca_files = glob.glob(os.path.join(base_dir, "racas_ameacas*.json")) + [os.path.join(base_dir, "racas_moreau.json")]
    for file in raca_files:
        data = load_json(file)
        if data:
            if isinstance(data, list):
                opcoes_personagem_db["racas"].extend(data)
            elif isinstance(data, dict):
                if data.get("tipo_objeto") in ["raca_jogador", "raca_moreau"]:
                    if "lista_racas" in data:
                        opcoes_personagem_db["racas"].extend(data["lista_racas"])
                    elif "herancas" in data:
                        opcoes_personagem_db["racas"].append(data)
                else:
                    opcoes_personagem_db["racas"].append(data)

    # 3. Equipamento (Bazar Monstruoso)
    bazar_data = load_json(os.path.join(base_dir, "bazar_ameacas.json"))
    if bazar_data:
        if "bazar" in bazar_data:
            b = bazar_data["bazar"]
            equipamento_db["armas"] = b.get("armas", [])
            equipamento_db["armaduras_e_escudos"] = b.get("armaduras_e_escudos", [])
            equipamento_db["materiais_especiais"] = b.get("materiais_especiais", [])
        if "tabelas_encontros" in bazar_data:
            regras_e_perigos_db["tabelas_encontros"] = bazar_data["tabelas_encontros"]

    # 4. Regras e Perigos (Tabelas de criação etc)
    tabelas_criacao = load_json(os.path.join(base_dir, "tabelas_criacao.json"))
    if tabelas_criacao and "tabelas_criacao" in tabelas_criacao:
        regras_e_perigos_db["tabelas_criacao"] = tabelas_criacao["tabelas_criacao"]
        
    # Salvar DataBases Modernizados
    save_json(os.path.join(base_dir, "ameacas_db_consolidado.json"), ameacas_db)
    save_json(os.path.join(base_dir, "opcoes_personagem_db.json"), opcoes_personagem_db)
    save_json(os.path.join(base_dir, "equipamento_db.json"), equipamento_db)
    save_json(os.path.join(base_dir, "regras_e_perigos_db.json"), regras_e_perigos_db)
    
    print(f"Consolidação Concluída!")
    print(f"- Total Ameacas: {len(ameacas_db)}")
    print(f"- Total Raças/Variantes: {len(opcoes_personagem_db['racas'])}")
    print(f"- Total Armas: {len(equipamento_db['armas'])}")
    print(f"- Total Biomas de Encontro: {len(regras_e_perigos_db['tabelas_encontros'])}")

if __name__ == "__main__":
    main()
