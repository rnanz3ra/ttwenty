import json
import os
import random

class CharacterBuilder:
    """
    Construtor oficial Passo a Passo de Fichas (Tormenta 20 - Pág 13 a 87).
    Recebe os Core JSONs do Motor e devolve a Ficha pronta validada.
    """
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        self.regras_gerais = self._load_json("t20_regras_gerais.json")
        
        racas_lista = self._load_json("t20_racas.json")
        if isinstance(racas_lista, dict) and "racas" in racas_lista: racas_lista = racas_lista["racas"]
        self.racas = {r["nome"].lower(): r for r in racas_lista if "nome" in r}
        
        classes_lista = self._load_json("t20_classes.json").get("classes", [])
        self.classes = {c["nome"].lower(): c for c in classes_lista}
        
        origens_lista = self._load_json("t20_origens.json").get("origens", [])
        self.origens = {o["nome"].lower(): o for o in origens_lista}

    def _load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f: return json.load(f)
        return []

    def set_classe_inicial(self, personagem, nome_classe):
        """ Passo 1: Define a classe Lvl 1, treina perícias obrigatórias e calcula Vida Máxima Inicial """
        classe_data = self.classes.get(nome_classe.lower())
        if not classe_data: return False, "Classe não encontrada."
        
        personagem["classes"] = [(classe_data["nome"], 1)]
        personagem["pericias_treinadas_oficiais"] = classe_data.get("pericias_treinadas", [])
        
        # O Modificador de Atributo Chave precisa ser passado ao CoreEngine
        attr_chave_txt = classe_data.get("atributo_chave", "").lower()
        attr_chave_mod = 0
        if "for" in attr_chave_txt: attr_chave_mod = personagem.get("atributos", {}).get("for", 0)
        elif "des" in attr_chave_txt: attr_chave_mod = personagem.get("atributos", {}).get("des", 0)
        elif "int" in attr_chave_txt: attr_chave_mod = personagem.get("atributos", {}).get("int", 0)
        elif "sab" in attr_chave_txt: attr_chave_mod = personagem.get("atributos", {}).get("sab", 0)
        elif "car" in attr_chave_txt: attr_chave_mod = personagem.get("atributos", {}).get("car", 0)
        
        personagem["mod_atributo_chave"] = attr_chave_mod
        
        return True, f"Classe {classe_data['nome']} Nível 1 definida com Sucesso."

    def apply_origin(self, personagem, origem_nome, escolha_1, escolha_2):
        """ Aplica Origem (Pág 87): Adiciona Inventário Base e 2 Benefícios (Perícia ou Poder) """
        origem_data = self.origens.get(origem_nome.lower())
        if not origem_data: return False, "Origem inválida."
        
        beneficios = origem_data.get("beneficios", [])
        
        if escolha_1 not in beneficios or escolha_2 not in beneficios:
            return False, f"Escolhas de Benefício Inválidas. Opções: {beneficios}"
            
        personagem["origem"] = origem_data["nome"]
        personagem["inventario_origem"] = origem_data.get("itens", [])
        personagem["beneficios_origem"] = [escolha_1, escolha_2]
        
        return True, f"Origem {origem_data['nome']} aplicada."

    def calcular_idade_envelhecimento(self, personagem, idade):
        """ Calcula a mecânica de envelhecimento (Pág 13) se idade for fornecida. """
        raca = personagem.get("raca", "").lower()
        criacao = self.regras_gerais.get("criacao_personagem", {})
        env = criacao.get("envelhecimento", {})
        
        # Validador de Imortais
        longevidade = env.get("multiplicador_longevidade", {})
        for dict_key, multi in longevidade.items():
            if raca in dict_key.lower() and multi == 0:
                print(f"⚠️ AVISO: Raça {raca} não sofre efeitos de Envelhecimento mecânico.")
                return personagem
                
        # Validador de Idade Física
        if idade >= env.get("Velho", {}).get("idade_minima", 70):
            mods = env["Velho"]["mods"]
            for k, v in mods.items(): personagem["atributos"][k] += v
            personagem["faixa_etaria"] = "Velho"
        elif idade >= env.get("Maduro", {}).get("idade_minima", 45):
            mods = env["Maduro"]["mods"]
            for k, v in mods.items(): personagem["atributos"][k] += v
            personagem["faixa_etaria"] = "Maduro"
        else:
            personagem["faixa_etaria"] = "Adulto"
            
        return personagem

    def set_tamanho_criatura(self, personagem):
        """ Vincula as Reduções de Furtividade/Manobra da Tabela 1-21 ao Tamanho """
        tabelas = self.regras_gerais.get("tabelas_referencia", {})
        specs_tam = tabelas.get("tamanho", {}).get(personagem.get("tamanho", "Médio"))
        if specs_tam:
            personagem["modificadores_tamanho"] = {
                "furtividade": specs_tam["furtividade"],
                "manobra": specs_tam["manobra"]
            }
        return personagem

    def calcular_recuperacao_descanso(self, personagem, nivel, condicao="normal"):
        """ Retorna PVs/PMs curados em 1 noite T20 """
        if condicao == "ruim": return nivel
        elif condicao == "normal": return nivel * 2
        elif Condicao == "confortavel": return nivel * 3
        elif Condicao == "luxuosa": return nivel * 4
        return nivel

    def build_engenhocas(self, personagem, limit_int):
        """ Inventor: Registra engenhocas, valida limite de INT e calcula CD de ativação (15 + custo PM da magia) """
        engenhocas = personagem.get("engenhocas_fabricadas", [])
        if len(engenhocas) > max(1, limit_int):
            return False, f"Limite de engenhocas ({max(1, limit_int)}) excedido pela Inteligência."
            
        resultados = []
        for e in engenhocas:
            magia_nome = e.get("magia", "Magia Desconhecida")
            pm_custo = e.get("custo_pm_base", 1)
            cd_ativacao = 15 + pm_custo
            resultados.append({"engenhoca": e.get("nome"), "magia": magia_nome, "cd_oficio": cd_ativacao})
            
        personagem["engenhocas_ativas"] = resultados
        return True, "Engenhocas montadas."

    def build_golpe_pessoal(self, nome, efeitos):
        """ Montador de Golpe Pessoal do Guerreiro.
            Requisitos Pág 66 - Custo final do Golpe baseia-se na soma de Modificadores (Amplo +2 PM, Letal +1 PM etc)
        """
        mapa_efeitos = {
            "Amplo": 2, "Atordoante": 2, "Brutal": 1, "Conjurador": 1,
            "Destruidor": 2, "Direto": 2, "Distante": 1, "Elemental": 1,
            "Impactante": 1, "Lento": -1, "Letal": 2, "Penetrante": 1,
            "Perto": -1, "Preciso": 1, "Rápido": 2, "Sacrifício": -1,
            "Teleguiado": 1
        }
        
        custo_pm = 0
        efeitos_validos = []
        
        for e in efeitos:
            if e in mapa_efeitos:
                custo_pm += mapa_efeitos[e]
                efeitos_validos.append(e)
                
        # Regra: Se o custo for menor que 1 após "Lento/Sacrifício/Perto", o custo Mínimo de todo Golpe Pessoal é 1 PM
        custo_final = max(1, custo_pm)
        
        return {"nome": nome, "efeitos": efeitos_validos, "custo_pm": custo_final}

    def map_to_pdf(self, personagem, core_engine_instance):
        """ 
        Gera o Dicionário de Flat String exato para exportar as Caixas de Texto 
        da Ficha em PDF oficial da Jambô Editores.
        """
        personagem_calculado = core_engine_instance.iniciar_personagem(personagem)
        stats = personagem_calculado.get("stats_atualizados", {"pv": 0, "pm": 0, "defesa": 10})
        
        pdf_dict = {
            "Nome_Personagem": personagem_calculado.get("nome", "Anônimo"),
            "Raca": personagem_calculado.get("raca", "Humano"),
            "Classe_Nivel": " ".join([f"{cl} {niv}" for cl, niv in personagem_calculado.get("classes", [])]),
            "Origem": personagem_calculado.get("origem", "-"),
            "Idade": str(personagem_calculado.get("idade", "-")),
            
            # Attributes
            "Mod_FOR": str(personagem_calculado["atributos"].get("for", 0)),
            "Mod_DES": str(personagem_calculado["atributos"].get("des", 0)),
            "Mod_CON": str(personagem_calculado["atributos"].get("con", 0)),
            "Mod_INT": str(personagem_calculado["atributos"].get("int", 0)),
            "Mod_SAB": str(personagem_calculado["atributos"].get("sab", 0)),
            "Mod_CAR": str(personagem_calculado["atributos"].get("car", 0)),
            
            # Pools
            "PV_Max": str(stats.get("pv", 0)),
            "PM_Max": str(stats.get("pm", 0)),
            "Defesa": str(stats.get("defesa", 10)),
            
            # Text Fields
            "Equipamento_Inventario": ", ".join(personagem_calculado.get("inventario_origem", [])),
            "Habilidades_Origem_E_Raca": ", ".join(personagem_calculado.get("beneficios_origem", [])),
        }
        
        return pdf_dict

if __name__ == "__main__":
    from core_engine import CoreEngine
    
    # 1. Start Engine and Builder Path to 'data/' folder
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data')
    core = CoreEngine(data_dir=data_path)
    builder = CharacterBuilder(data_dir=data_path)
    
    # 2. Criar Personagem Novo a partir dos JSONs
    p_novo = {
        "nome": "Tharrok Silva",
        "raca": "Anão",
        "idade": 75, # Idoso (Penalidades)
        "tamanho": "Médio",
        "atributos": {"for": 4, "des": 1, "con": 3, "int": 0, "sab": 2, "car": -1} # Attrs Brutos
    }
    
    print(f"--- Ficha Gênese Rápida ({p_novo['nome']}) ---")
    
    # Processa Envelhecimento (Velho = -2 Fisicos, +1 Mentais)
    builder.calcular_idade_envelhecimento(p_novo, p_novo["idade"])
    print(f"Stats após Envelhecimento (75 anos): {p_novo['atributos']}")
    
    # Atribui Nível 1 Guerreiro T20 (20 Vida + Atributo Chave For)
    builder.set_classe_inicial(p_novo, "Guerreiro")
    print(f"Classe inicial setada. Perícias automáticas de treino: {p_novo['pericias_treinadas_oficiais']}")
    
    # Origem Mateiro -> 20 Flechas, Arco, Furtividade Treinada e Lobo Solitário
    sucesso_origem, msg = builder.apply_origin(p_novo, "Mateiro", "Furtividade", "Lobo Solitário")
    print(msg)
    
    # Builder cria a Magia do Guerreiro Golpe Pessoal "Amplo e Letal" e mostra que custará 4 de PM
    golpe = builder.build_golpe_pessoal("Giro do Trovão", ["Amplo", "Letal"])
    print(f"Golpe Pessoal Customizado: {golpe['nome']} - Custa {golpe['custo_pm']} PM")
    
    # Formata Saída Exata PDF com Todos os Cálculos Dinâmicos processados pelo Motor Python
    print("\n--- INJEÇÃO PDF DA JAMBÔ EDITORES ---")
    pdf_pronto = builder.map_to_pdf(p_novo, core)
    for chave, valor in pdf_pronto.items():
        print(f"[{chave}]: {valor}")
