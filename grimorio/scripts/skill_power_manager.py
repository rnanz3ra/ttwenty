import json
import os
import random
import math

class SkillPowerManager:
    """ 
    Motor de Perícias (Págs 114-122) e Poderes (Combate, Destino, Magia, Tormenta e Concedidos)
    Calcula bônus dinâmicos, checa travas de treino, penalidade de armadura e mutações Lefou.
    """
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        
        pericias_db = self._load_json("t20_pericias.json").get("pericias", {})
        self.lista_pericias = {p["nome"].lower(): p for p in pericias_db.get("lista", [])}
        self.bonus_treino = pericias_db.get("bonus_treinamento", {"1-6": 2, "7-14": 4, "15-20": 6})
        
        poderes_db = self._load_json("t20_poderes.json")
        self.poderes_gerais = poderes_db.get("poderes_gerais", {})
        self.poderes_especiais = poderes_db.get("poderes_especiais", {})

    def _load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f: return json.load(f)
        return {}

    def get_bonus_treinamento(self, nivel):
        if nivel >= 15: return self.bonus_treino.get("15-20", 6)
        elif nivel >= 7: return self.bonus_treino.get("7-14", 4)
        else: return self.bonus_treino.get("1-6", 2)

    def calcular_pericia(self, personagem, nome_pericia):
        """ Retorna o bônus, validando a Trava 'Somente Treinada' e 'Penalidade de Armadura' """
        pericia_sys = self.lista_pericias.get(nome_pericia.lower())
        if not pericia_sys: return False, 0, "Perícia Inexistente."

        # Trava: Somente Treinada
        pericias_pj = personagem.get("pericias", {})
        pj_treinada = pericias_pj.get(nome_pericia, {}).get("treinada", False)
        
        if pericia_sys.get("treinada") and not pj_treinada:
            return False, 0, f"Perícia '{nome_pericia}' bloqueada. É classificada como 'Somente Treinada'."

        nivel_total = sum(niv for _, niv in personagem.get("classes", []))
        metade_nivel = math.floor(nivel_total / 2)
        
        attr = pericia_sys.get("atributo", "for")
        mod_attr = personagem.get("atributos", {}).get(attr, 0)
        
        bonus_treino = self.get_bonus_treinamento(nivel_total) if pj_treinada else 0
        
        # Penalidade de Armadura
        penalidade_armadura = 0
        if pericia_sys.get("penalidade_armadura"):
            equip = personagem.get("equipamentos", {})
            penalidade_armadura = equip.get("penalidade_armadura", 0)
            
        bonus_total = metade_nivel + mod_attr + bonus_treino + penalidade_armadura
        outros_bonus = pericias_pj.get(nome_pericia, {}).get("outros_bonus", 0)
        
        return True, bonus_total + outros_bonus, "Calculado com sucesso."

    def rolar_teste(self, personagem, nome_pericia):
        """ Executa uma rolagem física 1d20 + Modificador de Perícia completo """
        sucesso, bonus, msg = self.calcular_pericia(personagem, nome_pericia)
        if not sucesso: return False, None, msg
        
        d20 = random.randint(1, 20)
        total = d20 + bonus
        return True, {"d20": d20, "bonus": bonus, "total": total}, "Rolagem efetuada."

    def minigame_jogatina(self, personagem, aposta):
        """ App T20 - Pág 120 (Apostar) = Rolagem de Jogatina 
            Tabela adaptada (1 a 9 = Perde tudo, 10 a 39 = Recupera com Lucro, 40+ = 5x Aposta)
        """
        if aposta <= 0: return False, "Aposta inválida."
        
        sucesso, res, msg = self.rolar_teste(personagem, "Jogatina")
        if not sucesso: return False, f"Travado: {msg}"
        
        total = res["total"]
        if total <= 9: return True, f"Tirou {total}. Você PERDEU os T$ {aposta} da Aposta."
        elif total >= 40: return True, f"Tirou {total}!! JACKPOT! Você ganhou T$ {aposta * 5}!"
        else: return True, f"Tirou {total}. Vitória média, recebeu T$ {aposta * 2}."

    def observar_poderes_tormenta(self, personagem):
        """ Escala o Redutor de Carisma (-1 no 1º, -1 a cada 2 novos). Causa Morte Social (NPC) no Carisma -5. """
        poderes = personagem.get("poderes_tormenta", [])
        qntd = len(poderes)
        if qntd == 0: return False, 0, "Sem poderes da Tormenta."
        
        # Ex: 1=(-1), 2=(-1), 3=(-2), 4=(-2), 5=(-3)
        reducao = 1 + ((qntd - 1) // 2)
        
        personagem["atributos"]["car"] -= reducao
        
        if personagem["atributos"]["car"] <= -5:
            return True, reducao, "🚨 ALERTA CRÍTICO: Carisma caiu a -5. O Personagem enlouqueceu para a Tormenta e tornou-se um NPC sob controle do Mestre! 🚨"
            
        return True, reducao, "Redutor aplicado."

    def validar_poderes_concedidos(self, deus_escolhido, poder_desejado):
        """ O devoto só pode comprar poderes listados no array de sua Divindade """
        lista_deuses = self.poderes_especiais.get("Concedidos", [])
        
        poderes_liberados = []
        for d in lista_deuses:
            if d.get("deus", "").lower() == deus_escolhido.lower():
                poderes_liberados = d.get("poderes", [])
                break
                
        if not poderes_liberados:
            return False, f"Deus '{deus_escolhido}' não encontrado."
            
        if poder_desejado not in poderes_liberados:
            return False, f"Poder Inválido. {deus_escolhido} só concede: {poderes_liberados}"
            
        return True, f"Poder Concedido {poder_desejado} autorizado."

if __name__ == "__main__":
    manager = SkillPowerManager(data_dir=os.path.join(os.path.dirname(__file__), '..', 'data'))
    
    # Simulação 1: Ladrão Furtivo de Armadura de Placas (Perícia com Penalidade de Armadura)
    ladino = {
        "classes": [("Ladino", 5)],
        "atributos": {"des": 4},
        "equipamentos": {"penalidade_armadura": -5},
        "pericias": {"Furtividade": {"treinada": True}} 
    }
    # Furtividade Lvl 5 (Des 4, +2 Treino (lvl 5), Metade_Nivel +2, Penalidade -5) = 4 + 2 + 2 - 5 = +3
    _, bonus, _ = manager.calcular_pericia(ladino, "Furtividade")
    print(f"Bônus de Furtividade do Ladino de Placas: +{bonus}")
    
    # Simulação 2: Trava de Somente Treinada
    print("\nLadino tenta desarmar armadilha (Ladinagem) sem ter a perícia...")
    sucesso, _, msg = manager.calcular_pericia(ladino, "Ladinagem") # Ladinagem = Somente Treinada
    print(f"Resultado: {msg}")
    
    # Simulação 3: Mutação da Tormenta
    guerreiro_rubro = {
        "nome": "Cyrus",
        "atributos": {"car": 1},
        "poderes_tormenta": ["Anatomia Insana", "Corpo Aberrante", "Visão no Escuro", "Membros Extras", "Asas", "Sangue Ácido", "Carapaça"]
    } # 7 Poderes (1 = -1 | 2-3 = -2 | 4-5 = -3 | 6-7 = -4). Cai 4 pontos. Car base: 1. Cai pra -3.  Se tivesse 9 poderes, cairia pra -5
    print(f"\nCyrus (CarBase 1) pega {len(guerreiro_rubro['poderes_tormenta'])} Poderes da Tormenta.")
    
    # Adicionando poderes 8 e 9 para provocar Game Over:
    guerreiro_rubro["poderes_tormenta"].extend(["Dentes de Sabre", "Fervor"]) # 9 poderes (Redutor -5. 1(Base) - 5 = -4) -> Espera, para chegar a -5 com Car 1 (1 - 6 = -5). Precisa 6 Redutor. (6 = 11 poderes)
    guerreiro_rubro["poderes_tormenta"].extend(["Poder 10", "Poder 11"]) # Redutor -6.
    
    _, _, msg_mutacao = manager.observar_poderes_tormenta(guerreiro_rubro)
    print(f"Status Mental de Cyrus (Car atual: {guerreiro_rubro['atributos']['car']}): {msg_mutacao}")
    
    # Simulação 4: Alerta Deus
    print("\nClérigo tenta pegar 'Poder Oculto' jurando devoção a Khalmyr.")
    _, msg_deus = manager.validar_poderes_concedidos("Khalmyr", "Poder Oculto")
    print(f"Resultado: {msg_deus}")
    
    # Simulação 5: Minigame Cassino
    nobre_apostador = {
        "classes": [("Nobre", 16)], # +8 Nível, +6 Treino
        "atributos": {"car": 5}, # Mod Car 5, Total: +19 Bonus
        "pericias": {"Jogatina": {"treinada": True}}
    }
    print(f"\nNobre aposta T$ 1000 no Cassino de Valkaria...")
    _, msg_jogo = manager.minigame_jogatina(nobre_apostador, 1000)
    print(msg_jogo)
