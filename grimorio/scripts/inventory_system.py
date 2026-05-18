import json
import os

class InventorySystem:
    """ 
    Motor de Gerenciamento de Inventário (T20 Lotes 34 a 38)
    Lida com Peso (Carga), Passos de Dano Mútaveis, Forja Superior e Descanso Hospitalar.
    """
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        self.regras = self._load_json("t20_regras_inventario.json").get("regras_inventario", {})
        self.armas = self._load_json("t20_armas.json").get("armas", {})
        self.melhorias = self._load_json("t20_melhorias.json").get("customizacao", {})
        self.itens_gerais = self._load_json("t20_itens_gerais.json").get("itens_gerais", {})

    def _load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f: return json.load(f)
        return {}

    def calcular_carga(self, personagem):
        """ 
        Calcula os slots ocupados pelo inventário do personagem.
        Penaliza (-3m Desloc, -5 Perícias For/Des) se exceder (10 + 2*For).
        Moedas: cada 1000 = 1 espaço.
        """
        mod_for = personagem.get("atributos", {}).get("for", 0)
        carga_maxima = 10 + (2 * mod_for)
        
        # Penalidade por Força Negativa (-1 Slot por ponto)
        if mod_for < 0:
            carga_maxima += mod_for # Ex: For -2, -2 espaços
            
        espacos_ocupados = 0
        inventario = personagem.get("inventario", [])
        
        # Bônus Gerais Passivos do Inventário
        for item in inventario:
            if item.get("nome") == "Mochila de Aventureiro":
                carga_maxima += 2
            espacos_ocupados += item.get("espaco", 0)
            
        # Tratamento de Moedas
        tibares = personagem.get("tibares", 0)
        espacos_ocupados += (tibares // 1000)
        
        sobrecarga = espacos_ocupados > carga_maxima
        bloqueado = espacos_ocupados > (carga_maxima * 2)
        
        personagem["status_carga"] = {
            "usado": espacos_ocupados, "maximo": carga_maxima, 
            "sobrecarga": sobrecarga, "bloqueado": bloqueado
        }
        
        if sobrecarga:
            if not bloqueado:
                return False, f"Sobrecarga: {espacos_ocupados}/{carga_maxima}. Penalidade: -3m movimento e -5 nas perícias físicas aplicadas."
            else:
                return False, f"Sobrecarga Crítica (Dobro excedido). Personagem BLOQUEADO. Remova itens."
                
        return True, f"Carga Normal: {espacos_ocupados} de {carga_maxima} Espaços. Nenhuma penalidade."

    def ajustar_dano(self, dano_base, passos):
        """ 
        Escala os Passos de Dano baseados na Tabela 3-2 do Livro Básico. 
        Suporta Aumentos (+ Adamante) ou Reduções (- Criatura Pequena).
        """
        array_danos = self.armas.get("passos_dano", ["1", "1d2", "1d3", "1d4", "1d6", "1d8", "1d10", "1d12", "2d6", "2d8", "2d10", "2d12", "4d10", "4d12"])
        
        try:
            indice_atual = array_danos.index(dano_base)
        except ValueError:
            return dano_base # Se não houver mapeamento confiável (10d6 etc), ignora.
            
        novo_indice = indice_atual + passos
        
        # Travas Min Max
        if novo_indice < 0: novo_indice = 0
        if novo_indice >= len(array_danos): novo_indice = len(array_danos) - 1
            
        return array_danos[novo_indice]

    def aplicar_modificadores_arma(self, arma_padrao, lista_melhorias, personagem):
        """ Copia uma arma base do BD e Forja ela infundindo Adamante/Tamanho/Melhorias """
        dano_final = arma_padrao.get("dano", "1d4")
        passos_bonus = 0
        preco_base = open_arma = arma_padrao.get("preco", 0)
        
        # Ajuste de Tamanho Nativo da Raça (Pequeno cai 1 passo)
        if personagem.get("tamanho", "Médio") == "Pequeno":
            passos_bonus -= 1
        elif personagem.get("tamanho") == "Enorme": passos_bonus += 2
        
        for mel in lista_melhorias:
            if mel == "Adamante":
                passos_bonus += 1 # Adamante da Pág 166
            # O processamento de +atk (Certeira) e +dano (Cruel) já ocorre no core_engine.py
            
        # Computador Visual do Dano Ajustado
        if passos_bonus != 0:
            dano_final = self.ajustar_dano(dano_final, passos_bonus)
            
        # Calculadora de Preço de Crafting de Modificadores + Material
        preco_final = preco_base
        qnt_melhorias = len([m for m in lista_melhorias if m not in ["Aço-Rubi", "Adamante", "Gelo Eterno", "Mitral"]])
        
        if qnt_melhorias > 0:
            dict_precos = self.melhorias.get("tabela_melhorias_preco", {})
            preco_final += int(dict_precos.get(str(qnt_melhorias), 0))
            
        # Adicionar Preço do Material Especial se houver
        bd_materiais = self.melhorias.get("materiais_especiais", [])
        for mat in bd_materiais:
            if mat["nome"] in lista_melhorias:
                preco_final += mat.get("preco_arma", 0)

        arma_personalizada = arma_padrao.copy()
        arma_personalizada["dano"] = dano_final
        arma_personalizada["preco_craft"] = preco_final
        arma_personalizada["nome"] = f"{', '.join(lista_melhorias)} {arma_padrao.get('nome')}".strip()
        
        return arma_personalizada

    def consumir_esoterico(self, personagem, index_item):
        """ Catalizadores de Magia de Inventor/Alquimista Pág 158 """
        if index_item < 0 or index_item >= len(personagem.get("inventario", [])):
            return False, "Item não encontrado."
            
        item = personagem["inventario"][index_item]
        if item.get("categoria") not in ["Catalisadores", "Alquímico"]:
            return False, "O Item selecionado não é um consumível Alquímico ou Catalisador válido."
            
        efeito = item.get("efeito_pre_cast", "")
        # Remove do inventário da Array
        personagem["inventario"].pop(index_item)
        
        return True, f"Você estourou [{item['nome']}]. Bônus de Próxima Magia: {efeito}"

    def aplicar_descanso(self, personagem, tipo_hospedagem="Comum"):
        """ Multiplicadores Clínicos de PV/PM com base no Conforto escolhido """
        nivel = sum(niv for _, niv in personagem.get("classes", []))
        
        bd_hospedagem = self.itens_gerais.get("hospedagem_noite", {})
        config_descanso = bd_hospedagem.get(tipo_hospedagem, {"recuperacao": "1x Nível"})
        
        fator = 1
        if "2x" in config_descanso["recuperacao"]: fator = 2
        elif "3x" in config_descanso["recuperacao"]: fator = 3
        
        pv_curado = nivel * fator
        pm_curado = nivel * fator
        
        personagem["pv_atual"] = min(personagem.get("pv_atual", 0) + pv_curado, personagem.get("pv_maximo", 0))
        personagem["pm_atual"] = min(personagem.get("pm_atual", 0) + pm_curado, personagem.get("pm_maximo", 0))
        
        return f"Descanso ({tipo_hospedagem}). Recuperou {pv_curado} PV e {pm_curado} PM."

if __name__ == "__main__":
    inv_sys = InventorySystem(data_dir=os.path.join(os.path.dirname(__file__), '..', 'data'))
    
    # Simulação 1: Carga e Mochila Ingame
    pj1 = {
        "atributos": {"for": 3}, # Limite normal: 10 + 6 = 16.
        "inventario": [
            {"nome": "Mochila de Aventureiro", "espaco": 0}, # Dá +2 carga. Total Limite = 18.
            {"nome": "Armadura de Combate Pesada Extra", "espaco": 10},
            {"nome": "Bigorna", "espaco": 5}
        ], # Usando 15 T$
        "tibares": 4000 # 4000/1000 = 4 espaços extras
    }
    # Espaço = 10 + 5 + 4 = 19. (Como Limite é 18, ele deve estar ESBULHANDO 1 slot negativo)
    
    print("--- Teste de Carga de Inventário ---")
    status, msg = inv_sys.calcular_carga(pj1)
    print(msg)
    
    # Simulação 2: Forjar Espada Longa Certeira de Adamante
    print("\n--- Computador da Forja de Armas Ingame ---")
    espada_matriz = { "nome": "Espada Longa", "preco": 15, "dano": "1d8" }
    guerreiro_pequeno = {"tamanho": "Pequeno"} # Deveria perder -1 passo de dano. Cai de 1d8 pra 1d6.
    
    # Mas ele escolhe fazer ela de Adamante, que BUMP de +1 Passo de dano. Retorna pro 1d8.
    arma_forjada = inv_sys.aplicar_modificadores_arma(espada_matriz, ["Certeira", "Cruel", "Adamante"], guerreiro_pequeno)
    
    # Calculo de Grana: Espada (15) + Adamante Material (3000) + 2 Modificacoes Certeira/Cruel Tabela (3000) = 6015 T$
    print(f"Arma Pronta: {arma_forjada['nome']}")
    print(f"Dano Físico Calculado Final: {arma_forjada['dano']}")
    print(f"Preço Crafting Avaliado: T$ {arma_forjada['preco_craft']}")
    
    # Simulação 3: Catalizadores Alquímicos
    print("\n--- Gasto Alquímico em Batalha ---")
    pj1["inventario"].append({"nome": "Baga-de-Fogo", "categoria": "Catalisadores", "efeito_pre_cast": "+1d6 de Dano Massivo Rígido de Fogo"})
    sucesso, msg_cast = inv_sys.consumir_esoterico(pj1, len(pj1["inventario"]) - 1)
    print(msg_cast)
    
    # Simulação 4: Taverna Check (Level 5 de Luxo)
    print("\n--- Dormindo na Estalagem ---")
    pj_taverneiro = {"classes": [("Bardo", 5)], "pv_atual": 1, "pm_atual": 0, "pv_maximo": 50, "pm_maximo": 30}
    print(inv_sys.aplicar_descanso(pj_taverneiro, "Luxuosa")) # Level 5 * 3x (Luxo) = Curar 15 e 15.
