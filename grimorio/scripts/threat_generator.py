import json
import math
import copy

class ThreatGenerator:
    def __init__(self, data_path="data/tabelas_criacao.json"):
        self.tabelas = {}
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.tabelas = data.get("tabelas_criacao", {})
        except FileNotFoundError:
            print(f"Warning: Tabela de criação {data_path} não encontrada. Usando dados na memória se possível.")

    def get_dano_dice(self, media_alvo):
        """
        Calcula aproximadamente uma rolagem de dados que resulte na média alvo.
        Simplicidade: assume dano dividido por 4 (+ alguma base).
        Ex: média 18 = 2d8 + 9 (2 * 4.5 + 9 = 18)
        """
        if media_alvo <= 0: return "0"
        if media_alvo <= 4: return f"1d4+{media_alvo-2}" if media_alvo > 2 else "1d4"
        if media_alvo <= 8: return f"1d6+{media_alvo-3}"
        
        # Algoritmo genérico para dados maiores
        dados_d8 = max(1, media_alvo // 9)
        bonus = media_alvo - (dados_d8 * 4.5)
        return f"{dados_d8}d8+{math.floor(bonus)}"

    def generate_base_stats(self, nd_str, papel="solos"):
        """
        Gera as estatísticas base cruzando ND e a tabela correspondente.
        Papéis válidos: 'solos', 'lacaios', 'especiais'
        """
        tabela = self.tabelas.get(papel, {})
        # Tenta pegar exato, se não achar cai pro 1/4 default
        stats = tabela.get(str(nd_str), tabela.get("1/4", {}))
        
        criatura = {
            "nd": nd_str,
            "papel": papel,
            "ataque": stats.get("ataque", 0),
            "dano_medio": stats.get("dano", 0),
            "dano_sugerido": self.get_dano_dice(stats.get("dano", 0)),
            "defesa": stats.get("defesa", 0),
            "pv": stats.get("pv", 0),
            "fortitude": stats.get("fort_ref_von", [0,0,0])[0],
            "reflexos": stats.get("fort_ref_von", [0,0,0])[1],
            "vontade": stats.get("fort_ref_von", [0,0,0])[2],
            "cd": stats.get("cd", 0),
            "atributos": self.generate_attributes("Mediano")
        }
        return criatura

    def adjust_stat(self, criatura, attr_to_increase, attr_to_decrease, steps=1):
        """
        Lógica Step 3/4: Aumentar uma stat (como Defesa) custa a redução de outra (Ex: PV).
        Aproximação matemática simples: Defesa +2 em troca de -20% PV.
        """
        # Exemplo Simples de Trade-off (Poderia usar a escada real de NDs da tabela)
        if attr_to_increase == "defesa" and attr_to_decrease == "pv":
            criatura["defesa"] += (2 * steps)
            criatura["pv"] -= max(1, math.floor(criatura["pv"] * 0.15 * steps))
            criatura["ajuste_aplicado"] = f"+{2*steps} Defesa / -{15*steps}% PV"
            
        elif attr_to_increase == "ataque" and attr_to_decrease == "dano_medio":
            criatura["ataque"] += (2 * steps)
            criatura["dano_medio"] = max(1, criatura["dano_medio"] - (4 * steps))
            criatura["dano_sugerido"] = self.get_dano_dice(criatura["dano_medio"])
            criatura["ajuste_aplicado"] = f"+{2*steps} Ataque / Dano reduzido"
            
        return criatura

    def generate_attributes(self, nivel="Mediano"):
        """
        Mapeia níveis do Manual para valores numéricos (-5 a 8+)
        """
        niveis = {
            "Incapaz": -5,
            "Fraco": -2,
            "Forte": 2,
            "Mediano": 0,
            "Extraordinário": 5,
            "Excepcional": 8
        }
        val = niveis.get(nivel, 0)
        return {"for": val, "des": val, "con": val, "int": val, "sab": val, "car": val}

    def apply_template_bando(self, criatura_base):
        """ Aplica Página 387: Bando """
        bando = copy.deepcopy(criatura_base)
        bando["nome"] = f"Bando de {bando.get('nome', 'Criaturas')}"
        bando["tamanho"] = "Aumentado em +1 passo (Ex: Médio -> Grande)"
        bando["habilidades_extras"] = ["Imunidade a Manobras", "Metade do Dano de Armas", "Dano em Área"]
        
        # Aumentar ND (simplificado para +2 para bandos pequenos e x2 dano)
        try:
            nd_atual = math.floor(float(bando.get("nd", bando.get("nd_base", 0))))
            bando["nd"] = str(nd_atual + 2)
        except ValueError:
            pass
            
        bando["dano_medio"] *= 2 # 1 patamar de aumento na tabela
        bando["dano_sugerido"] = self.get_dano_dice(bando["dano_medio"])
        return bando

    def apply_template_boss(self, criatura_base):
        """ Aplica Página 368: Chefe (V2 Integrada a Generator) """
        chefe = copy.deepcopy(criatura_base)
        chefe["nome"] = f"[CHEFE] {chefe.get('nome', 'Sem Nome')}"
        try:
            # Pega valor da tabela e dobra
            chefe["pv"] = int(chefe.get("pv", 0)) * 2
        except ValueError:
            pass
        
        try:
            nd_val = float(chefe.get("nd", "0"))
            chefe["pm"] = math.floor(2 * nd_val)
            chefe["nd"] = str(math.floor(nd_val + 2))
        except ValueError:
            pass

        habs = chefe.get("habilidades_extras", [])
        habs.append("Maior que a Morte (Imune a efeitos paralisantes ou de cura negativa cumulativa)")
        chefe["habilidades_extras"] = habs
        
        return chefe


if __name__ == "__main__":
    generator = ThreatGenerator()
    
    print("--- Gerando Esqueleto ND 5 Solo ---")
    base_dragon = generator.generate_base_stats("5", "solos")
    base_dragon["nome"] = "Dragão Jovem do Ocaso"
    print(json.dumps(base_dragon, indent=2, ensure_ascii=False))
    
    print("\n--- Ajustando: Dragão Agil (+Defesa, -PV) ---")
    agile_dragon = generator.adjust_stat(copy.deepcopy(base_dragon), "defesa", "pv", steps=1)
    print(json.dumps(agile_dragon, indent=2, ensure_ascii=False))

    print("\n--- Transformando em Chefe ND 7 ---")
    boss_dragon = generator.apply_template_boss(base_dragon)
    print(json.dumps(boss_dragon, indent=2, ensure_ascii=False))
