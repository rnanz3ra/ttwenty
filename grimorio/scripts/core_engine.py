import math
import json
import os
import random

class AttributeManager:
    """ Gerenciador de Atributos T20: Compra por pontos, Rolagem e Bônus Raciais """
    def __init__(self, sistema_data):
        self.tabela_custo = {str(item["valor"]): item["custo"] for item in sistema_data.get("tabela_custo_atributos", [])}

    def compra_pontos(self, distribuicao):
        custo_total = 0
        for attr, valor in distribuicao.items():
            if valor < -1 or valor > 4:
                return False, "Valor de atributo fora dos limites permitidos (-1 a 4)."
            custo = self.tabela_custo.get(str(valor))
            if custo is None:
                return False, f"Custo inválido para o valor {valor}."
            custo_total += custo
            
        if custo_total > 10:
            return False, f"Custo total ({custo_total}) excede 10 pontos."
        return True, distribuicao

    def rolagem(self):
        atributos = ["for", "des", "con", "int", "sab", "car"]
        valores = {}
        for attr in atributos:
            rolagens = [random.randint(1, 6) for _ in range(4)]
            rolagens.remove(min(rolagens))
            soma = sum(rolagens)
            modificador = (soma - 10) // 2
            valores[attr] = modificador
        return True, valores

    def checar_penalidade_tormenta(self, personagem):
        raca = personagem.get("raca", "").lower()
        if raca != "lefou": return 0
        habilidades = personagem.get("habilidades_passivas", [])
        if "Linhagem Rubra" in habilidades:
            return 0
        poderes_tormenta = personagem.get("poderes_tormenta", [])
        return len(poderes_tormenta)

class CombatMechanics:
    """ Módulo de Ações Específicas de Classes (T20 Livro Básico) """
    @staticmethod
    def ataque_especial(personagem, tipo_bonus="ataque"):
        """ Guerreiro: Custa 1 PM; Dá +4 de ataque ou dano (+4 por escalonamento) """
        niv_guerreiro = next((niv for cl, niv in personagem.get("classes", []) if cl.lower() == "guerreiro"), 0)
        if niv_guerreiro == 0:
            return False, "Personagem não possui níveis de Guerreiro."
            
        if personagem.get("stats_atualizados", {}).get("pm", 0) < 1:
            return False, "PM Insuficiente."
            
        bonus_base = 4
        # Escalonamento T20
        if niv_guerreiro >= 17: bonus_base, custo = 20, 5
        elif niv_guerreiro >= 13: bonus_base, custo = 16, 4
        elif niv_guerreiro >= 9: bonus_base, custo = 12, 3
        elif niv_guerreiro >= 5: bonus_base, custo = 8, 2
        else: custo = 1
        
        personagem["stats_atualizados"]["pm"] -= custo
        return True, {tipo_bonus: bonus_base}

    @staticmethod
    def engenhosidade(personagem, nome_pericia_alvo):
        """ Inventor: Custa 2 PM; Soma Inteligência no bônus total """
        niv_inventor = next((niv for cl, niv in personagem.get("classes", []) if cl.lower() == "inventor"), 0)
        if niv_inventor == 0: return False, "Não possui Engenhosidade."
        if nome_pericia_alvo in ["Luta", "Pontaria"]: return False, "Engenhosidade não se aplica a testes de ataque."
        if personagem.get("stats_atualizados", {}).get("pm", 0) < 2: return False, "PM Insuficiente."
        
        personagem["stats_atualizados"]["pm"] -= 2
        mod_int = personagem.get("atributos", {}).get("int", 0)
        return True, {"bonus_engenhosidade": mod_int}

    @staticmethod
    def egide_sagrada(personagem):
        """ Paladino: 1 PM, Soma Carisma nas resistências """
        if next((niv for cl, niv in personagem.get("classes", []) if cl.lower() == "paladino"), 0) == 0:
            return False, "Não é Paladino."
        if personagem.get("stats_atualizados", {}).get("pm", 0) < 1:
            return False, "PM insuficiente para Égide Sagrada."
            
        personagem["stats_atualizados"]["pm"] -= 1
        mod_car = personagem.get("atributos", {}).get("car", 0)
        return True, {"bonus_resistencia": mod_car}

    @staticmethod
    def escalar_dano_lutador(personagem):
        """ Progressão Desarmada do Lutador (Lvl 1 a 20) """
        niv_lutador = next((niv for cl, niv in personagem.get("classes", []) if cl.lower() == "lutador"), 0)
        if niv_lutador == 0: return "1d3" # Dano desarmado normal
        
        if niv_lutador >= 20: return "4d8"
        if niv_lutador >= 17: return "2d12"
        if niv_lutador >= 13: return "2d10"
        if niv_lutador >= 9: return "2d8"
        if niv_lutador >= 7: return "2d6"
        if niv_lutador >= 5: return "1d10"
        if niv_lutador >= 3: return "1d8"
        return "1d6"

    @staticmethod
    def aplicar_item_superior(item):
        """ Avalia se a arma possui modificadores superiores de Inventor """
        modificadores = item.get("modificadores_superiores", [])
        bonus_ataque = 1 if "Certeira" in modificadores else 0
        bonus_dano = 2 if "Cruel" in modificadores else 0
        return bonus_ataque, bonus_dano

class CoreEngine:
    """ Motor Principal T20 Integrado as Mecânicas Marciais e Paladinas """
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        self.sistema = self._load_json("t20_sistema.json").get("sistema", {})
        
        racas_lista = self._load_json("t20_racas.json")
        self.racas = {r["nome"].lower(): r for r in racas_lista if "nome" in r}
        
        classes_lista = self._load_json("t20_classes.json").get("classes", [])
        self.classes = {c["nome"].lower(): c for c in classes_lista}
        
        self.attr_manager = AttributeManager(self.sistema)

    def _load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f: return json.load(f)
        return []

    def checar_codigo_conduta(self, personagem):
        """ Ougras e Paladinos perdem todo o PM se quebrarem o Juramento """
        classes_pjd = [cl.lower() for cl, _ in personagem.get("classes", [])]
        if "cavaleiro" in classes_pjd or "paladino" in classes_pjd:
            if personagem.get("codigo_violado", False):
                return True
        return False

    def sync_atributos(self, personagem):
        penalidade_car = self.attr_manager.checar_penalidade_tormenta(personagem)
        if penalidade_car > 0:
            personagem["atributos"]["car"] -= penalidade_car
        return personagem

    def calcular_pv(self, personagem):
        if not personagem.get("classes"): return 0
        mod_con = personagem.get("atributos", {}).get("con", 0)
        raca = personagem.get("raca", "").lower()
        bonus_raca_ini = 3 if raca in ["anão", "anao"] else 0
        bonus_raca_niv = 1 if raca in ["anão", "anao"] else 0
        
        pv_total = 0
        primeira_classe = True
        
        for cl, nivel in personagem["classes"]:
            classe_data = self.classes.get(cl.lower(), {"pv_inicial": 12, "pv_nivel": 3})
            pv_ini = classe_data.get("pv_inicial", 12)
            pv_niv = classe_data.get("pv_nivel", 3)
            
            if primeira_classe:
                pv_total += pv_ini + mod_con + bonus_raca_ini
                if nivel > 1:
                    pv_total += (pv_niv + mod_con + bonus_raca_niv) * (nivel - 1)
                primeira_classe = False
            else:
                pv_total += (pv_niv + mod_con + bonus_raca_niv) * nivel
                
        return pv_total + personagem.get("bonus_extra", {}).get("pv", 0)

    def calcular_pm(self, personagem):
        # Validador de Conduta Paladino / Cavaleiro
        if self.checar_codigo_conduta(personagem):
            return 0
            
        if not personagem.get("classes"): return 0
            
        pm_total = 0
        nivel_total = sum(niv for _, niv in personagem.get("classes", []))
        attr_chave_soma = personagem.get("mod_atributo_chave", 0)
        raca = personagem.get("raca", "").lower()
        
        for cl, nivel in personagem["classes"]:
            classe_data = self.classes.get(cl.lower(), {"pm_nivel": 3})
            pm_total += (classe_data.get("pm_nivel", 3) * nivel)
            
        if raca == "elfo":
            pm_total += nivel_total
                
        return pm_total + attr_chave_soma + personagem.get("bonus_extra", {}).get("pm", 0)

    def calcular_defesa(self, personagem):
        nivel_total = sum(niv for _, niv in personagem.get("classes", []))
        metade_nivel = math.floor(nivel_total / 2)
        
        mod_des = personagem.get("atributos", {}).get("des", 0)
        equipamentos = personagem.get("equipamentos", {})
        bonus_armadura = equipamentos.get("bonus_defesa", 0)
        tipo_armadura = equipamentos.get("tipo_armadura", "Nenhuma")
        
        defesa_base = 10 + metade_nivel + mod_des + bonus_armadura

        raca = personagem.get("raca", "").lower()
        if raca == "golem":
            defesa_base += equipamentos.get("bonus_chassi", 2)
            
        habilidades = personagem.get("habilidades_passivas", [])
        
        # Bucaneiro Insolência
        if "Insolência" in habilidades and tipo_armadura in ["Leve", "Nenhuma"]:
            niv_buc = next((niv for cl, niv in personagem["classes"] if cl.lower() == "bucaneiro"), 0)
            mod_car = personagem.get("atributos", {}).get("car", 0)
            if mod_car > 0: defesa_base += min(mod_car, niv_buc)
            
        # Nobre Autoconfiança
        if "Autoconfiança" in habilidades and tipo_armadura != "Pesada":
            niv_nobre = next((niv for cl, niv in personagem["classes"] if cl.lower() == "nobre"), 0)
            mod_car = personagem.get("atributos", {}).get("car", 0)
            if mod_car > 0: defesa_base += min(mod_car, niv_nobre)
                
        return defesa_base + personagem.get("bonus_extra", {}).get("defesa", 0)

    def calcular_pericia(self, personagem, nome_pericia):
        nivel_total = sum(niv for _, niv in personagem.get("classes", []))
        metade_nivel = math.floor(nivel_total / 2)
        
        pericia_data = personagem.get("pericias", {}).get(nome_pericia)
        if not pericia_data: return metade_nivel
            
        is_treinada = pericia_data.get("treinada", False)
        atributo = pericia_data.get("atributo", "for")
        mod_attr = personagem.get("atributos", {}).get(atributo, 0)
        
        bonus_treinamento = 0
        if is_treinada:
            if nivel_total >= 15: bonus_treinamento = 6
            elif nivel_total >= 7: bonus_treinamento = 4
            else: bonus_treinamento = 2
                
        outros_bonus = pericia_data.get("outros_bonus", 0)
        return metade_nivel + mod_attr + bonus_treinamento + outros_bonus

    def iniciar_personagem(self, personagem):
        self.sync_atributos(personagem)
        personagem["stats_atualizados"] = {
            "pv": self.calcular_pv(personagem),
            "pm": self.calcular_pm(personagem),
            "defesa": self.calcular_defesa(personagem)
        }
        return personagem

if __name__ == "__main__":
    engine = CoreEngine(data_dir=os.path.join(os.path.dirname(__file__), '..', 'data'))
    
    # Simulação 1: Paladino Caído vs Paladino Honrado
    pj_paladino = {
        "nome": "Arthas", "raca": "Humano", "classes": [("Paladino", 5)],
        "atributos": {"for": 4, "des": 0, "con": 2, "int": 1, "sab": 2, "car": 4},
        "mod_atributo_chave": 4, "codigo_violado": False,
        "equipamentos": {"bonus_defesa": 10, "tipo_armadura": "Pesada"}
    }
    engine.iniciar_personagem(pj_paladino)
    
    print("--- Teste Paladino ---")
    print(f"PM Original: {pj_paladino['stats_atualizados']['pm']}")
    sucesso, r = CombatMechanics.egide_sagrada(pj_paladino)
    if sucesso:
        print(f"Égide ativada! Bônus +{r['bonus_resistencia']} em resistências. PM restante: {pj_paladino['stats_atualizados']['pm']}")
    
    pj_paladino["codigo_violado"] = True
    pj_paladino = engine.iniciar_personagem(pj_paladino)
    print(f"Paladino violou o código! PM atual: {pj_paladino['stats_atualizados']['pm']}")

    # Simulação 2: Inventor com Engenhosidade e Itens
    pj_inv = {
        "nome": "Tonny", "raca": "Humano", "classes": [("Inventor", 8)],
        "atributos": {"for": 0, "des": 2, "con": 1, "int": 6, "sab": 0, "car": 0},
        "mod_atributo_chave": 6, "equipamentos": {"bonus_defesa": 0, "tipo_armadura": "Nenhuma"},
        "pericias": {"Ladinagem": {"treinada": True, "atributo": "des"}}
    }
    engine.iniciar_personagem(pj_inv)
    
    print("\n--- Teste Inventor ---")
    sucesso, r = CombatMechanics.engenhosidade(pj_inv, "Ladinagem")
    if sucesso:
        print(f"Usou Engenhosidade! Somou INT (+{r['bonus_engenhosidade']}) em Ladinagem. PM restante: {pj_inv['stats_atualizados']['pm']}")
    
    arma_superior = {"nome": "Mosquete", "modificadores_superiores": ["Certeira", "Cruel"]}
    b_atq, b_dan = CombatMechanics.aplicar_item_superior(arma_superior)
    print(f"Mosquete do Inventor -> Ataque: +{b_atq} | Dano: +{b_dan}")

    # Simulação 3: Lutador e o Progressão de Dano
    pj_lutador = {"classes": [("Lutador", 13)]}
    print(f"\n--- Teste Lutador Level 13 ---")
    print(f"Dano Desarmado: {CombatMechanics.escalar_dano_lutador(pj_lutador)}")
