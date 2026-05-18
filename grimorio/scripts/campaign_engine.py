import random

class CampaignEngine:
    """
    Motor de Gerenciamento de Logística de Campanha (3º Círculo - T20 Lote 46 e 47)
    Lida com PM Sacrificado, Teletransporte e Regras Visuais de Identificação.
    """
    def __init__(self, character_data):
        self.character = character_data
        
        # Cria campos se não existirem
        if "pm_sacrificado" not in self.character:
            self.character["pm_sacrificado"] = 0
            
        if "parceiros" not in self.character:
            self.character["parceiros"] = []
            
        if "rd_dinamica" not in self.character:
            self.character["rd_dinamica"] = 0

    def sacrificar_pm(self, quantidade):
        """
        Move PM da barra atual para 'PM Bloqueados'. Esse PM não se regenera com descanso.
        Usado para magias como Convocação Instantânea e Teletransporte permanente.
        """
        if self.character.get("pm_atual", 0) >= quantidade:
            self.character["pm_atual"] -= quantidade
            self.character["pm_sacrificado"] += quantidade
            return True, f"{quantidade} PM(s) foram Sacrificados e movidos para bloqueio."
        return False, "PM Insuficiente para Sacrifício."

    def recuperar_pm_sacrificado(self, quantidade):
        if self.character["pm_sacrificado"] >= quantidade:
            self.character["pm_sacrificado"] -= quantidade
            self.character["pm_atual"] += quantidade
            return True, "Magia desfeita: PM Sacrificado devolvido."
        return False, "Quantidade inválida."

    def calcular_teletransporte(self, grau_familiaridade, bonus_misticismo=0):
        """
        Rola Teste de Misticismo baseado no grau de familiaridade.
        Graus: 'Familiar' (20), 'Conhecido' (30), 'Nunca visto' (40).
        Retorna o resultado, o desvio (se houver) e direção.
        """
        cds = {"Familiar": 20, "Conhecido": 30, "Nunca visto": 40}
        cd = cds.get(grau_familiaridade, 30)
        
        rolagem_dado = random.randint(1, 20)
        resultado_teste = rolagem_dado + bonus_misticismo
        
        sucesso = resultado_teste >= cd
        desvio_km = 0
        direcao = ""
        
        if not sucesso:
             desvio_km = random.randint(1, 10) * 10
             direcao = random.choice(["Norte", "Sul", "Leste", "Oeste"])
             
        return {
            "sucesso": sucesso,
            "rolagem": rolagem_dado,
            "total": resultado_teste,
            "cd": cd,
            "desvio_km": desvio_km,
            "direcao": direcao,
            "mensagem": f"Sucesso no Teletransporte! Destino alcançado." if sucesso else f"Falha no Teletransporte (Rolou {resultado_teste} vs CD {cd}). Desvio de {desvio_km}km na direção {direcao}."
        }
        
    def convocar_servo_morto_vivo(self, tipo_parceiro="Iniciante", custo_material=100):
        """
        Pode criar Esqueleto/Zumbi (Iniciante), Carniçal/Sombra (Veterano) ou Múmia (Mestre).
        """
        parceiro = {
            "nome": "Servo Morto-Vivo",
            "tipo": "Parceiro",
            "nivel": tipo_parceiro,
            "sacrificavel": True
        }
        # Em um app real abateria dinheiro
        self.character["parceiros"].append(parceiro)
        return True, f"Servo Morto-Vivo ({tipo_parceiro}) erguido (Custo {custo_material} T$). Adicionado à base."
        
    def sacrificar_servo(self):
        """
        Anula o último dano recebido e remove o parceiro.
        """
        for p in self.character.get("parceiros", []):
            if p.get("nome") == "Servo Morto-Vivo" and p.get("sacrificavel"):
                self.character["parceiros"].remove(p)
                return True, "Servo Morto-Vivo sacrificado! Dano anulado."
        return False, "Nenhum Servo Morto-Vivo disponível."
        
    def ativar_pele_de_pedra(self, rd_bonus=5):
        """
        Soma RD à resistência da ficha.
        """
        self.character["rd_dinamica"] += rd_bonus
        return True, f"Pele de Pedra ativada. RD+{rd_bonus} injetada na ficha."

    def checar_lendas_historia(self, rodadas_concentracao):
        """
        Iterativa para Identificar Alvos / Ameaças.
        """
        secrecy_levels = [
            "ND, Nível e Tipo da Criatura.",
            "Resistências, Imunidades e Vulnerabilidades.",
            "Lista de Magias ativas e Valores de Atributo.",
            "Modo Tático Habilidades Completas do Monstro."
        ]
        
        if rodadas_concentracao < 1: return "Nenhuma informação extraída ainda."
        index = min(rodadas_concentracao - 1, len(secrecy_levels) - 1)
        
        revelado = "\n".join(secrecy_levels[:index+1])
        return f"--- Info Revelada ({rodadas_concentracao} rodadas) ---\n" + revelado

if __name__ == "__main__":
    bardo = {"nome": "Nimb", "pm_atual": 15}
    engine = CampaignEngine(bardo)
    
    print("--- Testando Lógicas de Campanha T20 Lote 46/47 ---")
    _, msg_pm = engine.sacrificar_pm(1)
    print(msg_pm)
    print(f"PM Atual: {engine.character['pm_atual']} | PM Sacrificado: {engine.character['pm_sacrificado']}")
    
    print("\n>>> Rolando Teletransporte para Destino 'Conhecido' (Bônus Misticismo +12)")
    res_tele = engine.calcular_teletransporte("Conhecido", 12)
    print(res_tele["mensagem"])
    
    print("\n>>> Erguendo Carniçal de Servo Morto-Vivo (Veterano)")
    _, msg_servo = engine.convocar_servo_morto_vivo("Veterano", 500)
    print(msg_servo)
    print("Tomou ataque letal! Redirecionando...")
    _, msg_sac = engine.sacrificar_servo()
    print(msg_sac)
    
    print("\n>>> Pele de Pedra +10 RD Ativada")
    _, msg_pele = engine.ativar_pele_de_pedra(10)
    print(msg_pele)
    print(f"RD Dinâmica na Ficha: {engine.character['rd_dinamica']}")
    
    print("\n>>> Lendas e Histórias em Demônio Lorde (3 Rodadas analisando)")
    print(engine.checar_lendas_historia(3))
