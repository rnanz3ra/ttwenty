import json
import random
import os

class InventoryManager:
    """
    Gerenciador do Bazar Monstruoso e Motor de Itens Especiais de Tormenta 20
    """
    def __init__(self, data_path="data/bazar_ameacas.json"):
        # Calculadora Universal de Passos de Dano T20
        self.passos_dano = [
            "1", "1d2", "1d3", "1d4", "1d6", "1d8", "1d10", "1d12", 
            "2d6", "2d8", "2d10", "2d12", "4d6", "4d8", "4d10", "4d12"
        ]
        
        self.bazar_data = {}
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                self.bazar_data = json.load(f).get("bazar", {})
        except FileNotFoundError:
            pass
            
    def aumentar_passo_dano(self, dano_atual, passos=1):
        """ Eleva o dano da arma matematicamente de acordo com a tabela. """
        # Extrai primeiro caso de dano se for arma hibrida (ex: 1d10/2d8 -> testa com 1d10)
        dano_str = dano_atual.split("/")[0].strip()
        
        if dano_str not in self.passos_dano:
            return dano_atual # fallback nativo
            
        index = self.passos_dano.index(dano_str)
        novo_index = min(len(self.passos_dano) - 1, index + passos)
        return self.passos_dano[novo_index]

    def processar_arma_hibrida(self, arma):
        """ Retorna lista dividida se for arma híbrida, ou a própria se unica """
        if "Híbrida" in arma.get("especial", ""):
            modos = []
            danos = arma.get("dano", "1d4").split("/")
            criticos = arma.get("critico", "x2").split("/")
            
            for i in range(len(danos)):
                modo = dict(arma)
                modo["dano"] = danos[i] if i < len(danos) else danos[-1]
                modo["critico"] = criticos[i] if i < len(criticos) else criticos[-1]
                modo["nota_melhoria"] = "Custo de modificações é dobrado (Arma Híbrida)."
                modos.append(modo)
            return modos
        return [arma]

    def aplicar_material_especial(self, arma, nome_material):
        """ Acopla Couraça de Kaiju, Casco de Monstro, etc """
        materiais = self.bazar_data.get("materiais_especiais", [])
        material_obj = next((m for m in materiais if m["nome"] == nome_material), None)
        
        if not material_obj: return arma
        
        armas_processadas = self.processar_arma_hibrida(arma)
        resultado = []
        
        for a in armas_processadas:
            a["nome"] = f"{a['nome']} de {nome_material}"
            
            # Motor T20: Couraça de Kaiju
            if nome_material == "Couraça de Kaiju":
                a["dano"] = self.aumentar_passo_dano(a["dano"], 1)
                a["magia_imbutida"] = "Gasta 2 PM para ignorar redução de dano (não RD)."
                
            # Motor T20: Pena de Kraken
            if nome_material == "Pena de Kraken":
                a["especial_kraken"] = "Ao confirmar crítico, dano aumenta +2 passos em vez do multiplicador."
                
            a["propriedade_material"] = material_obj.get("efeito_arma", "")
            resultado.append(a)
            
        return resultado if len(resultado) > 1 else resultado[0]


class EncounterRoller:
    """
    Roleta d100 de Mestre automatizada para Encontros Aleatórios
    com calculo de Patamar (Iniciante, Veterano, Campeão, Lenda).
    """
    def __init__(self, data_path="data/bazar_ameacas.json"):
        self.tabelas = {}
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                self.tabelas = json.load(f).get("tabelas_encontros", {})
        except FileNotFoundError:
            pass

    def roll_encounter(self, bioma, patamar="Iniciante"):
        """
        Sorteia 1d100 e soma modificador de Patamar da Ficha de Ameaça Pág 14-16
        (Isso empurra a rolagem para as ameaças de níveis super altos na tabela)
        """
        modificadores = {
            "Iniciante": 0,
            "Veterano": 30,
            "Campeão": 70,
            "Lenda": 110
        }
        
        mod_patamar = modificadores.get(patamar, 0)
        
        # d100 Natural
        d100 = random.randint(1, 100)
        
        # O terrível Titã do Caos Rhandomm tem chance fixa
        if d100 == 100:
            confirma = random.randint(1, 4)
            if confirma == 1:
                return "⚠️ CRÍTICO SUPREMO DO CAOS: RHANDOMM, TITÃ DO CAOS (Ameaça Suprema)!"

        resultado_final = d100 + mod_patamar
        
        # Busca no JSON
        encontros = self.tabelas.get(bioma.lower(), [])
        
        # Fallback de Tabela Menor
        maior_possivel = encontros[-1] if encontros else None

        for evento in encontros:
            if evento.get("d_min", 0) <= resultado_final <= evento.get("d_max", 0):
                dado_natural = f"[d100: {d100} + Patamar: {mod_patamar}]"
                return f"🎲 {dado_natural} -> Encontro em {bioma.capitalize()}: {evento['encontro']}"
                
        # Estourou pro limite máximo da tabela (Ameaça mais mortal que tem)
        if maior_possivel:
            dado_natural = f"[d100: {d100} + Patamar: {mod_patamar}]"
            return f"🔥 {dado_natural} -> Encontro Mortal em {bioma.capitalize()}: {maior_possivel['encontro']}"
            
        return "Bioma não encontrado ou tabela vazia."


if __name__ == "__main__":
    # Teste de InventoryManager
    inv = InventoryManager()
    
    macete = { "nome": "Lança de Fogo", "dano": "1d10/2d8", "critico": "x3/19x3", "especial": "Híbrida" }
    print("--- Teste de Material e Passo de Dano ---")
    kaiju_lance = inv.aplicar_material_especial(macete, "Couraça de Kaiju")
    print(json.dumps(kaiju_lance, indent=2, ensure_ascii=False))
    
    print("\n--- Teste Encounter Roller ---")
    rolador = EncounterRoller()
    print(rolador.roll_encounter("tormenta", "Lenda"))
    print(rolador.roll_encounter("artico", "Iniciante"))
