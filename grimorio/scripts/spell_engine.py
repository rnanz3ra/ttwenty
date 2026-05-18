import json
import os
import re

# Importação condicional do Inventário para Magias de Passo de Dano
try:
    from scripts.inventory_system import InventorySystem
except ImportError:
    pass

class ConjuredMonstro:
    """ Token dinâmico gerado pela magia Conjurar Monstro """
    def __init__(self, conjurador_defesa=10):
        self.tamanho = "Pequeno"
        self.pv = 20
        self.defesa = conjurador_defesa
        self.forca = 2
        self.deslocamento = "9m"
        self.ataque = "2d4+2"
        self.tipo_dano = "Básico (Corte/Frio/Impacto)"
        self.resistencias = []
        self.extras = []

    def gerar_token(self):
        return {
            "Tamanho": self.tamanho,
            "PV": self.pv,
            "Defesa (Herdada)": self.defesa,
            "Força": self.forca,
            "Deslocamento": self.deslocamento,
            "Ataque": self.ataque,
            "Tipo de Dano": self.tipo_dano,
            "Resistências": self.resistencias,
            "Habilidades Extras": self.extras
        }

class SpellEngine:
    """
    Motor Central de Conjuração Arcano/Divina (T20 Lote 39 e 40)
    Lida com Injeção de Efeitos Visuais na UI, Cálculo de Custo (PM) Dinâmico em tempo real,
    e Geração de Resistência Matemática Baseada na Ficha (CD de Magia).
    """

    COUNTER_SPELLS = {
        "Luz": ["Escuridão"],
        "Escuridão": ["Luz"],
        "Bênção": ["Perdição"],
        "Perdição": ["Bênção"],
        "Consagrar": ["Profanar"],
        "Profanar": ["Consagrar"],
        "Curar Ferimentos": ["Infligir Ferimentos"],
        "Infligir Ferimentos": ["Curar Ferimentos"],
        "Amedrontar": ["Remover Medo"],
        "Remover Medo": ["Amedrontar"]
    }

    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        self.regras_magia = self._load_json("t20_regras_magia.json").get("regras_magia", {})
        self.bd_magias = self._load_json("t20_magias.json").get("magias", [])

    def _load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f: return json.load(f)
        return {}

    def get_spell_by_name(self, name):
        for spell in self.bd_magias:
            if spell.get("nome").lower() == name.lower():
                return spell
        return None

    def calcular_pm_transmutar_objetos(self, valor_alvo):
        """
        Cálculo Exponencial Lote 43: Transmutar Objetos. Preço MAX = 25 * (10 ** (Enh/3))
        Retorna a quantidade de PMs (Aprimoramentos de 3 PM) necessários para Forjar.
        """
        import math
        if valor_alvo <= 25: return 0
        pm_multiplicadores = math.ceil(math.log10(valor_alvo / 25.0))
        return pm_multiplicadores * 3

    def calculate_spell_cost(self, character_level, spell_obj, chosen_enhancements_indices, fonte_magia="Arcana"):
        """
        Calcula o PM Dinamico.
        Regra T20: Truque = 0. Limite Max de PM gasto por Magia = Nível do Personagem.
        Bloqueia se Custo final passar do Nível.
        Avalia a 'condicao' do aprimoramento (Arcana/Divina).
        """
        tipo_str = spell_obj.get("tipo", "1")
        circulo = 1
        match = re.search(r'\d+', tipo_str)
        if match:
            circulo = int(match.group())

        custo_base_tabela = self.regras_magia.get("custo_por_circulo", {})
        custo_PM = custo_base_tabela.get(str(circulo), circulo)
        
        possui_truque = False
        custo_adicional = 0
        aprimoramentos_ativos = []

        lista_apr = spell_obj.get("aprimoramentos", [])
        
        # 1º Passo: Verifica se há TRUQUE nos aprimoramentos selecionados
        for idx in chosen_enhancements_indices:
            if idx < 0 or idx >= len(lista_apr): continue
            apr = lista_apr[idx]
            if apr.get("custo", 0) == 0 and "Truque" in apr.get("efeito", ""):
                possui_truque = True
                break
                
        # Truque substitui o custo TOTAL por ZERO e bloqueia outros aprimoramentos que custam PM
        if possui_truque:
            return 0, True, "Magia lançada como Truque (0 PM). Outros aprimoramentos com custo de PM foram anulados."

        valid_indices = []
        for idx in chosen_enhancements_indices:
            if idx < 0 or idx >= len(lista_apr): continue
            
            aprimoramento = lista_apr[idx]
            condicao = aprimoramento.get("condicao")
            if condicao and condicao.lower() != fonte_magia.lower():
                continue # Ignora aprimoramentos que não pertencem à fonte de magia conjurada
                
            # Validador de Círculo Magico de Aprimoramentos (Ex: Nível 9 libera 3º Círculo)
            match_circulo = re.search(r'Requer (\d+)º círculo', aprimoramento.get("efeito", ""))
            if match_circulo:
                req_circulo = int(match_circulo.group(1))
                lvl_necessario = 4 * (req_circulo - 1) + 1 # Fórmula Base do T20 (Nv5 = 2ºCir, Nv9 = 3ºCir)
                if character_level < lvl_necessario:
                    return 0, False, f"Aprimoramento bloqueado: Requer {req_circulo}º Círculo (Personagem precisa de Nível {lvl_necessario}+).", []

            custo_apr = aprimoramento.get("custo", 0)
            custo_adicional += custo_apr
            valid_indices.append(idx)
            aprimoramentos_ativos.append(aprimoramento)

        custo_final = custo_PM + custo_adicional

        if custo_final > character_level:
            return custo_final, False, f"⚠ Limite de PM Excedido! Custo ({custo_final} PM) é maior que seu Nível ({character_level})."

        return custo_final, True, "Custo dentro do limite.", valid_indices

    def get_spell_dc(self, character_obj, spell_obj):
        """
        Cálculo de Dificuldade da Magia (CD)
        CD = 10 + Metade do Nível + Modificador do Atributo Chave (Int, Sab ou Car).
        """
        nivel = sum(niv for _, niv in character_obj.get("classes", []))
        metade_nivel = max(1, nivel // 2)
        
        # Determine qual classe está castando para puxar o Atributo Certo do Lote 39
        # Simplificando para pegar a Principal por agora
        classe_principal = character_obj.get("classes", [])[0][0] if character_obj.get("classes") else "Mago"
        
        mapa_atributos = self.regras_magia.get("atributos_chave", {})
        
        atributo_string = "Inteligência"
        for key, value in mapa_atributos.items():
            if classe_principal in key:
                atributo_string = value
                break
                
        # Converte String (ex: Inteligência) pra Chave do Obj (ex: int)
        mapa_chaves_json = {"Inteligência": "int", "Sabedoria": "sab", "Carisma": "car"}
        chave_mod = mapa_chaves_json.get(atributo_string, "int")
        
        modificador = character_obj.get("atributos", {}).get(chave_mod, 0)
        
        cd_final = 10 + metade_nivel + modificador
        
        resistencia_base = spell_obj.get("resistencia", "Nenhuma")
        if resistencia_base != "Nenhuma":
            resistencia_formatada = f"Tentar resistir: {resistencia_base} (CD {cd_final})"
        else:
            resistencia_formatada = "Sem teste de resistência."
            
        return cd_final, resistencia_formatada

    def format_spell_interface(self, character_obj, spell_name, chosen_indices):
        """
        Gera a saída final pronta para a Ficha Digital, processando 
        a 'Injeção Textual' dos aprimoramentos que sobrescrevem Área/Duração/etc.
        """
        spell = self.get_spell_by_name(spell_name)
        if not spell: return None, "Magia desconhecida no Volume de Grimório."

        nivel = sum(niv for _, niv in character_obj.get("classes", []))
        
        # Determina a Fonte da Magia baseada no tipo ou classe atual
        fonte_base = "Divina" if "Divina" in spell.get("tipo", "") else "Arcana"
        
        # Trava Absoluta de Círculo Base
        tipo_magia = spell.get("tipo", "")
        match_circulo_base = re.search(r'(\d+)', tipo_magia)
        if match_circulo_base:
            circulo = int(match_circulo_base.group(1))
            lvl_necessario_base = 4 * (circulo - 1) + 1
            if nivel < lvl_necessario_base:
                 return None, f"Feitiço Bloqueado: Magia de {circulo}º Círculo. Personagem requer Nível {lvl_necessario_base}+."

        # Truque substitui o valid_indices pro payload visual focar só no que passou
        retorno = self.calculate_spell_cost(nivel, spell, chosen_indices, fonte_magia=fonte_base)
        if len(retorno) == 3:
            cost, valid, msg = retorno
            valid_indices = [] if cost == 0 else chosen_indices
        else:
            cost, valid, msg, valid_indices = retorno
            
        if not valid:
            return None, msg

        cd, res_text = self.get_spell_dc(character_obj, spell)

        # Clonar o Base para Não poluir o BD de Instância Global
        spell_output = dict(spell)
        spell_output["custo_final"] = cost
        spell_output["cd_formatada"] = res_text
        
        # Flag Counter-Spell
        if spell["nome"] in self.COUNTER_SPELLS:
            spell_output["anula_magias"] = self.COUNTER_SPELLS[spell["nome"]]
            
        # Flag de Dano Especial (Botões Passou/Falhou)
        res_base = spell.get("resistencia", "").lower()
        if "parcial" in res_base or "metade" in res_base:
            spell_output["resistencia_parcial"] = True
            
        # Calculadora de Transmutar
        if spell["nome"] == "Transmutar Objetos":
             spell_output["calculadora_exponencial"] = { "enabled": True, "base_preco_ts": 25, "pm_step": 3 }

        aprimoramentos_selecionados = []
        texto_injetado = "\n--- Efeitos Modificados ---\n"
        
        has_changes = False

        # Modificações Específicas do Lote 41 ao 50 (EpicGrimoire Completo)
        token_monstro = None
        passos_bonus = 0
        armadura_arcana_bonus = 5
        camuflagem = None
        pv_temporario = 2 # 2d10 (Vitalidade Fantasma Base)
        
        # Injeções Logísticas e Épicas
        is_sustained = "Sustentada" in spell.get("duracao", "")
        buff_area_alvos = False
        fisico_divino_ativo = False
        acao_extra_velocidade = False

        if spell["nome"] == "Conjurar Monstro":
            defesa_conjurador = character_obj.get("defesa_total", 10)
            token_monstro = ConjuredMonstro(defesa_conjurador)
            
        if spell["nome"] == "Escuridão" or spell["nome"] == "Névoa":
            camuflagem = "Leve (20%)"

        for idx in valid_indices:
            if idx < len(spell["aprimoramentos"]):
                apr = spell["aprimoramentos"][idx]
                aprimoramentos_selecionados.append(apr["efeito"])
                
                efeito = apr["efeito"].lower()
                
                if "camuflagem total" in efeito:
                    camuflagem = "Total (50%)"
                    has_changes = True
                    
                if "muda alcance para" in efeito:
                    novo_alcance = apr["efeito"][apr["efeito"].lower().find("muda alcance para ") + 18:].split(".")[0]
                    spell_output["alcance"] = novo_alcance.capitalize()
                    has_changes = True
                    
                if "muda duração para" in efeito:
                    nova_duracao = apr["efeito"][apr["efeito"].lower().find("muda a duração para ") + 20:].split(" e ")[0].split(".")[0] if "muda a duração para" in efeito else apr["efeito"][apr["efeito"].lower().find("muda duração para ") + 18:].split(" e ")[0].split(".")[0]
                    spell_output["duracao"] = nova_duracao.capitalize()
                    has_changes = True

                if "duração sustentada" in efeito:
                    spell_output["duracao"] = "Sustentada"
                    has_changes = True

                if "muda execução para" in efeito or "muda a execução para" in efeito:
                    nova_exec = apr["efeito"][apr["efeito"].lower().find("execução para ") + 14:].split()[0].replace(".", "")
                    spell_output["execucao"] = nova_exec.capitalize()
                    has_changes = True
                    
                    if "reação" in efeito:
                        spell_output["is_reaction"] = True 

                if "aumenta o dano da arma em mais um passo" in efeito or "aumenta em um passo" in efeito:
                    passos_bonus += 1
                    
                if "aumenta os pv temporários em" in efeito:
                    pv_temporario += int(re.search(r'\+?(\d+)d\d+', apr["efeito"]).group(1))
                    has_changes = True
                    
                if "aumenta o bônus na defesa em" in efeito:
                    armadura_arcana_bonus += int(re.search(r'\+?\d+', apr["efeito"]).group().replace("+", ""))
                    has_changes = True

                if "sacrifício" in efeito or "sacrificio" in efeito:
                    spell_output["exige_sacrificio_pm"] = True
                    has_changes = True

                if "aumenta o dano em" in efeito or "dano +" in efeito and spell["nome"] != "Armadura Arcana":
                    texto_injetado += f"• Dano/Efeito Base Amplificado ({apr['efeito']}).\n"
                    has_changes = True
                    
                if token_monstro:
                    if "natação ou escalada" in efeito:
                        token_monstro.extras.append("Natação/Escalada")
                    if "muda dano para" in efeito:
                        token_monstro.tipo_dano = apr["efeito"].split("para ")[1].replace(".", "")
                    if "muda tamanho para" in efeito:
                        tam = apr["efeito"].split("para ")[1].split(" ")[0].capitalize().replace("(", "")
                        token_monstro.tamanho = tam
                        if tam == "Médio":
                            token_monstro.pv, token_monstro.ataque, token_monstro.forca, token_monstro.deslocamento = 45, "2d6+6", 4, "12m"
                        elif tam == "Grande":
                            token_monstro.pv, token_monstro.ataque, token_monstro.forca = 75, "4d6+10", 7
                        elif tam == "Enorme":
                            token_monstro.pv, token_monstro.ataque, token_monstro.forca = 110, "4d8+15", 11
                        elif tam == "Colossal":
                            token_monstro.pv, token_monstro.ataque, token_monstro.forca = 180, "4d12+20", 15
                        has_changes = True
                    if "resistência" in efeito:
                        token_monstro.resistencias.append("Resistência 5 (x2 Tipos)")
                    if "arma de sopro" in efeito:
                        token_monstro.extras.append("Arma de Sopro (1 PM Cone)")
                        
        if spell["nome"] in ["Escuridão", "Névoa"]:
             spell_output["efeito_camuflagem"] = camuflagem
             texto_injetado += f"• Modificador Ambiental: Camuflagem {camuflagem}.\n"
             has_changes = True
             
        if spell["nome"] == "Vitalidade Fantasma":
             spell_output["pv_temporario"] = f"{pv_temporario}d10"
             texto_injetado += f"• Modificador Corporal: Você adquire {pv_temporario}d10 PV Temporários. Acabam na Cena.\n"
             has_changes = True
             
        if spell["nome"] == "Oração" or spell["nome"] == "Bênção":
             spell_output["requer_selecao_grupo"] = True
             texto_injetado += f"• Buff de Grupo (Interface): O sistema solicitará que você marque os aliados/inimigos presentes na Batalha para aplicar os efeitos numéricos.\n"
             has_changes = True
             
        if spell["nome"] == "Velocidade":
             spell_output["concede_acao_extra"] = True
             texto_injetado += f"• Relógio de Combate (UI): Um botão 'Ação de Velocidade' ficará disponível no seu Turno enquanto esta magia durar.\n"
             has_changes = True
             
        if spell["nome"] == "Físico Divino" or spell["nome"] == "Mente Divina":
             spell_output["seletor_atributo_dinamico"] = True
             texto_injetado += f"• Atributo Variável: A Interface Gráfica abrirá um dropdown pedindo qual Atributo Físico turbinar no alvo.\n"
             has_changes = True
             
        if spell["nome"] == "Pele de Pedra":
             spell_output["concede_rd_dinamica"] = True
             texto_injetado += f"• Defesa Aprimorada: Seu personagem adquire Resistência a Dano adicional dinâmica na ficha.\n"
             has_changes = True
             
        if spell["nome"] == "Servo Morto-Vivo":
             spell_output["pode_convocar_parceiro"] = True
             texto_injetado += f"• Lacaio Invocado: Um parceiro será atrelado à ficha e poderá ser sacrificado como Reação letal.\n"
             has_changes = True
             
        if spell["nome"] == "Teletransporte":
             spell_output["teste_teletransporte_ui"] = True
             texto_injetado += f"• Lançar Teletransporte: O sistema abrirá um painel com CD dinâmica baseada na Familiaridade do local.\n"
             has_changes = True
             
        if spell["nome"] == "Lendas e Histórias":
             spell_output["painel_identificacao"] = True
             texto_injetado += f"• Scanner Tático: Uma UI progressiva extrairá informações do JSON base da Ameaça alvo por rodada.\n"
             has_changes = True
             
        # EpicGrimoire (4º e 5º Círculos) Injections
        if spell["nome"] == "Mata-Dragão":
             spell_output["dano_recursivo_explosivo"] = { "dado_base": "d12", "gatilho": 12 }
             texto_injetado += f"• 🎲 Dano Supremo (Mata-Dragão): Na rolagem de Fogo no Motor (20d12), cada dado que tirar '12' rolará +1d12 adicional. A cadeia segue enquanto o máximo cair.\n"
             has_changes = True
             
        if spell["nome"] in ["Controlar a Gravidade", "Palavra Primordial", "Rogar Maldição", "Desejo", "Intervenção Divina"]:
             spell_output["selecao_multipla_ui"] = True
             texto_injetado += f"• Propósito Dinâmico (Dropdown): Lançar esta magia forçará o Frontend a exibir uma janela de Dropdown para escolher o traço do feitiço desejado.\n"
             has_changes = True
             
        if spell["nome"] in ["Desejo", "Intervenção Divina", "Despertar Consciência", "Teletransporte"]:
             spell_output["reduz_pm_maximo"] = True
             texto_injetado += f"• Sacrifício Absoluto: Em certos efeitos ou atordoamentos divinos, esta magia consumirá MÁXIMO DE PM do Conjurador irreversivelmente.\n"
             has_changes = True
             
        if spell["nome"] in ["Manto de Sombras", "Pele de Pedra", "Palavra Primordial", "Raio Polar"]:
             spell_output["aplica_condicao_epica"] = True
             texto_injetado += f"• Ameaça Condicional Gênese: Pode impingir status de Petrificado, Incorpóreo, Paralisado ou Morte Instantânea pelo Character Manager.\n"
             has_changes = True
        if spell_output.get("exige_sacrificio_pm"):
             texto_injetado += f"• ⚠ GASTO ABSOLUTO: Esta alteração exige sacrifício de Mármore Mágico (PM) - o custo em PM é isolado na barra de 'Bloqueados' e não se regenera ao Cenas/Descanso enquanto estiver ativo.\n"
             
        if is_sustained or spell_output.get("duracao", "") == "Sustentada":
             spell_output["cobrar_pm_turno"] = True
             texto_injetado += f"• Sustentação Contínua: Esta magia abaterá 1 PM do Conjurador ao início de cada turno ou será desfeita.\n"
             has_changes = True
                    
        # Concatena a Descrição Original com os Efeitos Injetados p/ o Frontend ler de 1 bloco de texto apenas
        if has_changes:
            # Se for token de monstro, adicionamos a "Fichinha" no texto visual tbm
            if token_monstro:
                texto_injetado += f"\n[TOKEN DE INVOCADOR GERADO]\n{json.dumps(token_monstro.gerar_token(), indent=2, ensure_ascii=False)}\n"
            spell_output["descricao_expandida"] = spell["descricao"] + "\n\n" + texto_injetado
        else:
            spell_output["descricao_expandida"] = spell["descricao"]

        # Limpeza para UX
        del spell_output['aprimoramentos']

        return spell_output, "Conjuração Formatada com Sucesso."
        
    def filtrar_magias_por_escola(self, nome_escola):
        """
        Retorna uma lista de Magias baseadas puramente na Escola para Buffs Mágicos Otimizados.
        """
        return [m for m in self.bd_magias if m.get("escola", "").lower() == nome_escola.lower()]

if __name__ == "__main__":
    import os
    diretorio_dados = os.path.join(os.path.dirname(__file__), "..", "data")
    engine = SpellEngine(data_dir=diretorio_dados)

    print("\\n--- Grimório do Arcanista: Batalha ---")
    
    pj_mago = {
        "classes": [("Mago", 4)],
        "atributos": {"int": 3, "sab": 0, "car": -1} 
    }
    
    print(">>> Castando: Resistência a Energia (Testando Injeção de Punição de Círculo Superior)")
    # 'Muda duração para um dia' Requer 2º círculo (Nível 5). Ele é nível 4, deve barrar.
    resultado_bloqueado, valid_bk = engine.format_spell_interface(pj_mago, "Resistência a Energia", [1])
    if not resultado_bloqueado:
        print(valid_bk) # String de erro
        
    print("\n>>> Calculadora Transmutar - Forjando Item Lenda 2.500 T$")
    pm_extras = engine.calcular_pm_transmutar_objetos(2500)
    print(f"Para Transmutar algo de T$ 2.500 (Base 25), Gastarei +{pm_extras} PM no Terceiro Aprimoramento.")
    
    print("\n>>> Castando: Oração (Injeção de Seleção de Grupo e Sustentação)")
    resultado_oracao, _ = engine.format_spell_interface(pj_mago, "Oração", [0])
    if resultado_oracao:
        print(f"[{resultado_oracao['nome']}] -> Cobrar PM Turno: {resultado_oracao.get('cobrar_pm_turno')}")
        print(f"[{resultado_oracao['nome']}] -> Popup Seleção Grupo UI: {resultado_oracao.get('requer_selecao_grupo')}")
        
    print("\n>>> Castando: Convocação Instantânea (Sacrifício PM Oculto)")
    resultado_ci, _ = engine.format_spell_interface(pj_mago, "Convocação Instantânea", [1])
    if resultado_ci:
        print(f"[{resultado_ci['nome']}] -> Sacrificar PM (Cadeado FrontEnd): {resultado_ci.get('exige_sacrificio_pm')}")
        
    print("\n>>> Castando: Mata-Dragão (Recursão Crítica 5º Círculo)")
    pj_mago_epico = {"nome": "Sszzaas", "classes": [("Arcanista", 18)]}
    resultado_epic, _ = engine.format_spell_interface(pj_mago_epico, "Mata-Dragão", [])
    if resultado_epic:
        print(f"[{resultado_epic['nome']}] -> Dado Explosivo Flag: {resultado_epic.get('dano_recursivo_explosivo')}")
        
    print("\n>>> Castando: Chuva de Meteoros (Testando Trava de Círculo Magico com Mago Baixo Lvl)")
    resultado_bloq, err = engine.format_spell_interface(pj_mago, "Chuva de Meteoros", [])
    if not resultado_bloq:
        print(err)
        
    print("\n>>> Busca por Escola: Evocação")
    magias_evo = engine.filtrar_magias_por_escola("Evocação")
    print(f"Total Encontradas: {len(magias_evo)}. Exemplos: {[m['nome'] for m in magias_evo[:3]]}")
