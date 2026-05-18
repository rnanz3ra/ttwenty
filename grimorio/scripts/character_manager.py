import json
import os
import random

class CharacterManager:
    """
    Controlador de Estado do Personagem (Lote Principal de Magias e Testes - T20 Lote 44 e 45)
    Gerencia Status Duradouros: Magias Sustentadas, Ações Extras, Buffs em Área e Testes de Concentração.
    """

    def __init__(self, character_data):
        # A API em Node/Next passará o payload atual do Personagem
        self.character = character_data
        
        # Estrutura de Buffs Temporários e Penalidades no Estado atual
        if "active_effects" not in self.character:
            self.character["active_effects"] = []
            
        if "sustained_spells" not in self.character:
            self.character["sustained_spells"] = []
            
        if "pm_maximo_reduzido" not in self.character:
            self.character["pm_maximo_reduzido"] = 0
            
        if "condicoes" not in self.character:
            self.character["condicoes"] = []

    def process_start_of_turn(self):
        """
        No início do turno, cobra o Custo das Magias Sustentadas.
        Magias de 2º Cir (Lote 44/45 como Oração, Velocidade) custam 1 PM base (T20 Jogo do Ano).
        """
        mensagens = []
        pms_descontados = 0
        
        magias_ativas = list(self.character["sustained_spells"])
        for spell in magias_ativas:
            # Em T20 JDA, sustentar magia em geral custa 1 PM por turno.
            if self.character.get("pm_atual", 0) >= 1:
                self.character["pm_atual"] -= 1
                pms_descontados += 1
                mensagens.append(f"Sustentou '{spell['nome']}' (-1 PM).")
            else:
                # Perde a Sustentação por Falta de PM
                self.character["sustained_spells"].remove(spell)
                self.remover_efeito(spell["nome"])
                mensagens.append(f"⚠ Magia '{spell['nome']}' cancelada por falta de PM.")
                
        return {"mensagens": mensagens, "pms_descontados": pms_descontados, "character": self.character}
        
    def check_concentration(self, damage_taken):
        """
        Se o Arcanista/Clérigo sofre dano enquanto sustenta Magia, 
        aciona Teste de Vontade (CD 15 + Dano).
        Retorna o Pop-up/Alert a ser renderizado na Ficha do React.
        """
        if not self.character.get("sustained_spells"):
            return None # Não tem Magia Sustentada rolando
            
        cd_vontade = 15 + (damage_taken // 2) # Exigência T20: Pode variar de mesa p/ mesa (Base: 15 + metade dano ou Dano total)
        # Vamos usar a regra comum: CD 15 ou dano sofrido (o que for maior) - Ajustando Regra JDA.
        cd_t20_jda = max(15, damage_taken)
        
        nomes_magias = [s['nome'] for s in self.character["sustained_spells"]]
        
        return {
            "is_concentrating": True,
            "magias_em_risco": nomes_magias,
            "dano_sofrido": damage_taken,
            "cd_vontade_exigida": cd_t20_jda,
            "mensagem": f"Você sofreu dano enquanto sustenta {len(nomes_magias)} magia(s)! Faça um Teste de Vontade CD {cd_t20_jda} ou perderá as magias."
        }
        
    def aplicar_fisico_divino(self, atributo_escolhido, bonus=2):
        """
        Lote 45: Físico Divino atualiza Form, Des ou Con dinamicamente.
        """
        if atributo_escolhido not in ["for", "des", "con"]:
            return False, "Atributo inválido para Físico Divino."
            
        efeito = {
            "nome": "Físico Divino",
            "modificador": atributo_escolhido,
            "valor": bonus,
            "tipo": "atributo"
        }
        self.character["active_effects"].append(efeito)
        return True, f"{atributo_escolhido.upper()} aumentado em +{bonus}."

    def sacrificar_pm_maximo(self, quantidade):
        """
        Para Lotes 49 e 50 (Desejo, Despertar Consciência, Intervenção Divina).
        Reduz PM MÁXIMO permanentemente conforme regras rústicas de T20 de Círculo 5.
        """
        self.character["pm_maximo_reduzido"] += quantidade
        if self.character.get("pm_atual", 0) > 0:
            self.character["pm_atual"] = max(0, self.character["pm_atual"] - quantidade)
        return True, f"Sacrifício Maior: -{quantidade} PM Máximo da Ficha."
        
    def aplicar_condicao_epica(self, condicao):
        """
        Trata condições de 4º e 5º Círculo.
        Exemplo: 'Incorpóreo' (Manto de Sombras), 'Petrificado' (Pele de Pedra L17), 'Inconsciente'.
        """
        condicoes_validas = ["Incorpóreo", "Petrificado", "Inconsciente", "Cego", "Atordoado"]
        if condicao in condicoes_validas:
            if condicao not in self.character["condicoes"]:
                self.character["condicoes"].append(condicao)
                return True, f"Condição Extrema aplicada: {condicao}."
            return False, f"Personagem já está {condicao}."
        return False, "Condição não reconhecida pelo Motor T20."

    def remover_efeito(self, nome_magia):
        self.character["active_effects"] = [ef for ef in self.character["active_effects"] if ef["nome"] != nome_magia]

if __name__ == "__main__":
    # Mock Testando as Mecânicas Lote 45
    jogador_clérigo = {
        "nome": "Kallyan",
        "classes": [("Clérigo", 5)],
        "pm_atual": 2, # PM muito baixo!
        "sustained_spells": [
            {"nome": "Oração"}, 
            {"nome": "Velocidade"}
        ],
        "active_effects": []
    }
    
    manager = CharacterManager(jogador_clérigo)
    print("--- Início do Turno de Combate ---")
    resultado = manager.process_start_of_turn()
    for msg in resultado["mensagens"]: print(msg)
    print(f"PM Restante: {manager.character['pm_atual']}")
    
    print("\n--- Inimigo ataca Clérigo e causa 20 de Dano ---")
    concentracao = manager.check_concentration(20)
    if concentracao:
        print(concentracao["mensagem"])
        print(f"Magia em Risco: {concentracao['magias_em_risco']}")
        
    print("\n--- Clérigo castando Físico Divino em Destreza ---")
    status, msg = manager.aplicar_fisico_divino("des", 4)
    print(msg)
