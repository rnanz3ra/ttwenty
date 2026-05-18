import json
import os

class CombatTracker:
    def __init__(self, filename="combat_state.json"):
        self.filename = filename
        self.state = self.load_state()

    def load_state(self):
        if os.path.exists(self.filename):
            with open(self.filename, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {
            "combate_ativo": False,
            "rodada": 1,
            "turno_atual_index": 0,
            "participantes": []
        }

    def save_state(self):
        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump(self.state, f, indent=2, ensure_ascii=False)

    def adicionar_participante(self, nome, iniciativa, pv_max, pm_max=0, tipo="inimigo", id=None):
        import uuid
        novo = {
            "id": id or str(uuid.uuid4()),
            "nome": nome,
            "iniciativa": iniciativa,
            "pv_atual": pv_max,
            "pv_max": pv_max,
            "pm_atual": pm_max,
            "pm_max": pm_max,
            "condicoes": [],
            "tipo": tipo
        }
        self.state["participantes"].append(novo)
        self.ordenar_iniciativa()
        self.save_state()

    def ordenar_iniciativa(self):
        # T20: Maior iniciativa primeiro. Empates podem ser resolvidos por Deslocamento ou Atributo (simplificado aqui por valor bruto)
        self.state["participantes"].sort(key=lambda x: x["iniciativa"], reverse=True)

    def iniciar_combate(self):
        self.state["combate_ativo"] = True
        self.state["rodada"] = 1
        self.state["turno_atual_index"] = 0
        self.save_state()

    def proximo_turno(self):
        if not self.state["participantes"]:
            return
        
        self.state["turno_atual_index"] += 1
        if self.state["turno_atual_index"] >= len(self.state["participantes"]):
            self.state["turno_atual_index"] = 0
            self.state["rodada"] += 1
        
        self.save_state()
        return self.state["participantes"][self.state["turno_atual_index"]]

    def aplicar_dano(self, id, valor):
        for p in self.state["participantes"]:
            if p["id"] == id:
                p["pv_atual"] = max(0, p["pv_atual"] - valor)
                break
        self.save_state()

    def aplicar_cura(self, id, valor):
        for p in self.state["participantes"]:
            if p["id"] == id:
                p["pv_atual"] = min(p["pv_max"], p["pv_atual"] + valor)
                break
        self.save_state()

if __name__ == "__main__":
    # Exemplo de uso rápido
    tracker = CombatTracker()
    # tracker.adicionar_participante("Sir Galen", 22, 50, 12, "jogador", "player_1")
    # tracker.adicionar_participante("Lefeu Veridak", 18, 64, 0, "inimigo", "mob_1")
    print(f"Combate Ativo: {tracker.state['combate_ativo']} | Rodada: {tracker.state['rodada']}")
