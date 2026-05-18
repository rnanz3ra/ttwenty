import json
import math
import os

class FichaPersonagem:
    """
    Representação abstrata de uma Ficha no App Web/PDF do Tormenta20.
    """
    def __init__(self, nome):
        self.nome = nome
        self.raca = None
        self.atributos = {
            "for": 0, "des": 0, "con": 0,
            "int": 0, "sab": 0, "car": 0
        }
        self.qualidades = []
        
    def aplicar_raca(self, raca_data, escolhas_livres=None):
        """
        Aplica os modificadores de atributo e adiciona as strings de habilidades
        ao campo de qualidades da ficha.
        """
        self.raca = raca_data.get("nome", "Desconhecido")
        mods = raca_data.get("mods_atributo", {})
        
        # Módulo Diferenciação de Raças Customizadas
        self.tamanho = raca_data.get("tamanho", "Médio")
        
        # Atributos Base Fixos
        for attr in self.atributos.keys():
            if attr in mods:
                self.atributos[attr] += mods[attr]
                
        # Lidando com Escolhas Livres via App
        if escolhas_livres:
            for attr, val in escolhas_livres.items():
                if attr in self.atributos:
                    self.atributos[attr] += val
                    
        # Array de Qualidades (Habilidades da Raça)
        habilidades_raca = raca_data.get("habilidades", [])
        for hab in habilidades_raca:
            self.qualidades.append(f"[Raça] {hab}")
            
            # Análise de strings para limitações (Ex: Pteros, Ceratops)
            if "Mãos Rudimentares" in hab or "Pés Rapinantes" in hab:
                self.qualidades.append("[Atenção: Penalidade de Mãos Rudimentares ativada]")
            if "Paquidérmico" in hab or "Tamanho Grande" in hab:
                self.tamanho = "Grande"


class DatabaseManager:
    def __init__(self):
        self.ameacas = []
        self.racas_jogadores = []
        
        # Módulo de Arenas e Recursos
        self.arenas = {
            "Lodaçal Contaminado": {"Efeito": "Terreno difícil, teste de Fortitude no início do turno ou doente."},
            "Vórtice Místico": {"Efeito": "Magias custam +1 PM. Ameaças recuperam 5 PV/turno."},
            "Trono de Ossos": {"Efeito": "Mortos-vivos recebem +2 de Defesa e RD 5."}
        }
        
        # Módulo de Doenças e Maldições Rápidas
        self.aflicoes = {
            "Praga Coral": {"CD": 20, "Efeito": "Transformação lenta em coral (dano de Destreza)", "Cura": "Remover Doença, magia divina 3º ciclo"},
            "Infecção Escarlate": {"CD": 25, "Efeito": "Enfurecimento perigoso, não distingue amigos", "Cura": "Curar Ferimentos + Cura da Natureza"},
            "Fúria de Allihanna": {"CD": 30, "Efeito": "Animais atacam o alvo, impossível descanso natural", "Cura": "Expiação na selva selvagem"},
            "Toque de Tibar": {"CD": 22, "Efeito": "Tudo que o alvo toca vira Ouro/Prata, mas ele passa fome", "Cura": "Dedo da Morte (Falha proposital) + Cura"}
        }
        
    def _parse_nd(self, nd_str):
        """
        Lida com segurança contra divisões por string (1/2, 1/4) e monstros S/S+
        O Motor de ND Especial atua aqui para repassar status 'Lendário'.
        """
        nd_str = str(nd_str).strip().upper()
        if nd_str == "S": return ("Lendario_S", 20)
        if nd_str == "S+": return ("Lendario_S+", 20)
        
        try:
            if "/" in nd_str:
                num, den = list(map(float, nd_str.split("/")))
                return ("Normal", num / den)
            return ("Normal", float(nd_str))
        except ValueError:
            return ("Normal", 0)

    def calcular_cd_tesouro(self, nd_str):
        """ Retorna 15 + ND, detectando Tesouros Especiais para Lendários """
        tipo, nd_val = self._parse_nd(nd_str)
        if tipo == "Lendario_S": return "Dobro do Tesouro (Lendário)"
        if tipo == "Lendario_S+": return "Triplo do Tesouro (Lendário)"
        
        return 15 + math.floor(nd_val)
        
    def calcular_bonus_pericia_nao_treinada(self, nd_str, bonus_atributo=0):
        """ Metade do ND + Atributo Base; +30 para monstros Lendários """
        tipo, nd_val = self._parse_nd(nd_str)
        if tipo.startswith("Lendario"):
            return 30 + bonus_atributo
            
        return math.floor(nd_val / 2) + bonus_atributo

    def processar_json(self, caminho_arquivo):
        """
        Analisa a estrutura do JSON. Separa monstros em self.ameacas e raças em self.racas_jogadores.
        """
        if not os.path.exists(caminho_arquivo):
            print(f"Erro: O arquivo {caminho_arquivo} não foi encontrado.")
            return

        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            dados = json.load(f)
            
        # Trata wrapper externo se existir
        if isinstance(dados, dict):
            if "lista_racas" in dados:
                dados = dados["lista_racas"]
            elif "ameacas" in dados:
                dados = dados["ameacas"]
            else:
                # Se for dict com outras keys, apenas encapsula
                dados = [dados]
                
        for item in dados:
            # Check Ameaças do Mestre
            if 'nd' in item or item.get("tipo_objeto") == "ameaca":
                self.ameacas.append(item)
            # Check Raças Jogáveis do Livro Base / Ameaças
            elif 'mods_atributo' in item or item.get("tipo_objeto") == "raca_jogador"\
                 or 'escolhas_obrigatorias' in item:
                self.racas_jogadores.append(item)
        
        if not self.ameacas and not self.racas_jogadores:
             print("Nenhum dado carregado. Lembre de rodar processar_json()")

    def build_perigo_complexo(self, nome, objetivo, efeito, acoes):
        """ Cria a estrutura para lidar com Perigos (Ciclone Arcano, Grama Carnívora, etc) """
        return f"### 🌪️ Perigo Complexo: {nome}\n- **Objetivo**: {objetivo}\n- **Efeito por Rodada**: {efeito}\n- **Ações Possíveis**: {acoes}\n"

    def make_boss(self, criatura_base):
        """
        Aplica as regras Pág 368: Dobre os PV, adicione PM (+2/ND),
        adicione 'Maior que a Morte', aplique RD baseada no patamar e aumente ND em +2.
        """
        import copy
        chefe = copy.deepcopy(criatura_base)
        
        chefe['nome'] = f"[CHEFE FINAL] {chefe.get('nome', 'Sem Nome')}"
        tipo, nd_val = self._parse_nd(chefe.get('nd', '0'))
        
        novo_nd = nd_val + 2
        
        # Atualiza PV e PM
        try:
            chefe['pv'] = int(chefe.get('pv', 0)) * 2
        except:
            pass # PV especial (Letras)
        
        try:
            pm_base = int(chefe.get('pm', 0))
            chefe['pm'] = pm_base + (2 * math.floor(nd_val))
        except:
            chefe['pm'] = 2 * math.floor(nd_val)

        # Atualiza ND String
        if tipo.startswith("Lendario"):
            chefe['nd'] = "S++"
        else:
            chefe['nd'] = str(math.floor(novo_nd))
            
        # Adiciona Qualidades de Chefe
        habilidades = chefe.get('habilidades', [])
        habilidades.append("Regra: Maior que a Morte (Imunidade a instakill/efeitos cumulativos graves)")
        
        rd_bonus = "RD 10" if novo_nd > 10 else "RD 5"
        habilidades.append(f"Regra: Resistência de Chefe ({rd_bonus})")
        chefe['habilidades'] = habilidades
        
        return chefe
        
    def acoplar_arena(self, chefe, nome_arena):
        if nome_arena in self.arenas:
            chefe['habilidades'].append(f"Arena Viva ({nome_arena}): {self.arenas[nome_arena]['Efeito']}")
        return chefe

    def get_full_threat(self, nome):
        """ Exportação unificada completa (Get Info Aprimorado) """
        return self.get_info(nome)

    def get_info(self, nome):
        """
        Formata dados extraídos para View de FrontEnd (Markdown ou HTML)
        buscando em ambas matrizes.
        """
        # 1. Procura como Monstro Mestre (Ameaças)
        for am in self.ameacas:
            if am.get("nome", "").lower() == nome.lower():
                nd_str = str(am.get("nd", "0"))
                cd_tesouro = self.calcular_cd_tesouro(nd_str)
                # Teste base (Assume mod de atributo neutro +0 para pericias variadas nesse relatório)
                bonus_bruto = self.calcular_bonus_pericia_nao_treinada(nd_str, 0) 
                
                md = f"### 🐉 Ficha de Ameaça: {am['nome']}\n"
                md += f"- **ND**: {nd_str} ({am.get('tipo', 'Desconhecido')})\n"
                md += f"- **CD de Extração de Tesouro/Identificação**: {cd_tesouro}\n"
                md += f"- **Bônus Base de Perícia (Não Treinada)**: +{bonus_bruto} (+ Modificador de Atributo)\n"
                
                # Módulo Mortos-Vivos
                if am.get("tipo", "") and "morto-vivo" in am.get("tipo", "").lower():
                    md += "- **Imunidades de Morto-Vivo (Auto)**: Doenças, Fadiga, Sangramento, Sono, Venenos, Paralisia, etc.\n"
                    
                md += "\n**Habilidades Principais**:\n"
                for hab in am.get('habilidades', []):
                    # Se fosse dict: md += f"- *{hab.get('nome')}*: {hab.get('descricao')}\n"
                    # Se for direto array basico (Lotes Brutos):
                    md += f"- {hab}\n"
                    
                    # Módulo Parceiros/Montarias
                    if "Parceiro" in str(hab):
                        md += "  - **Sistema de Parceiro Identificado**:\n"
                        md += "    - *Iniciante*: Benefício básico da regra.\n"
                        md += "    - *Veterano*: Benefício aprimorado de parceiro veterano.\n"
                        md += "    - *Mestre*: Status supremo de companheiro.\n"

                return md
                
        # 2. Procura como Raça de Player
        for raca in self.racas_jogadores:
            if raca.get("nome", "").lower() == nome.lower():
                md = f"### 🛡️ Raça Jogável: {raca['nome']}\n"
                mods = raca.get('mods_atributo', {})
                md += f"**Modificadores de Atributo**:\n"
                for m_k, m_v in mods.items():
                    md += f"- {m_k.upper()}: {m_v if isinstance(m_v, str) else ('+' + str(m_v) if m_v > 0 else m_v)}\n"
                
                md += "\n**Habilidades Místicas/Ecológicas**:\n"
                for hab in raca.get('habilidades', []):
                     md += f"- {hab}\n"
                return md
                
        return f"<h1>404</h1>\nRegistro não encontrado para a busca '{nome}' na database."


if __name__ == "__main__":
    # Testando o Script
    db = DatabaseManager()
    
    # Processa as Raças dos novos arquivos JSON
    db.processar_json("data/racas_ameacas.json")
    db.processar_json("data/racas_ameacas_2.json")
    db.processar_json("data/racas_ameacas_3.json")
    
    # Processa Lotes Extras P2
    db.processar_json("data/lote_10a14_ameacas.json")
    db.processar_json("data/lote_15a18_ameacas.json")
    
    print("----- RESULTADO WEB (MARKDOWN) -----\n")
    print(db.get_full_threat("Pteros (Povo-Trovão)"))          
    print("-" * 40)
    print(db.get_full_threat("Tarso, Dragão-Rei dos Mortos")) 
    print("-" * 40)
    
    # Demonstração Gerador de Chefe Final e Arena
    alzeras_base = next((a for a in db.ameacas if a["nome"] == "Alzeras"), None)
    if alzeras_base:
        alzeras_chefe = db.make_boss(alzeras_base)
        alzeras_na_arena = db.acoplar_arena(alzeras_chefe, "Vórtice Místico")
        
        # Sobrescreve tempo real p/ teste de visualização
        db.ameacas.append(alzeras_na_arena)
        print(db.get_full_threat("[CHEFE FINAL] Alzeras"))
    print("-" * 40)
    
    # Demonstração de Perigo
    print(db.build_perigo_complexo(
        "Ciclone Arcano",
        "Sobreviver 5 rodadas ou dissipar magias nos pilares.",
        "6d6 dano de força em área todo turno, Reflexos CD 22 metade.",
        "Teste de Atletismo para ancorar aliados; Dissipar Magia CD 25 em cada Pilar."
    ))

