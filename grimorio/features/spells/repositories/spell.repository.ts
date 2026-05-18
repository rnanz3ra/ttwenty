import spellsData from "@/data/magias.json";
import { Spell } from "@/core/types";

class SpellRepository {
    private spells: Spell[];

    constructor() {
        this.spells = (spellsData as any[]).map(s => ({
            ...s,
            execTime: s.execTime || s.execution || "Padrão"
        }));
    }

    getAll(): Spell[] {
        return this.spells;
    }

    getById(id: string): Spell | undefined {
        return this.spells.find(s => s.id === id);
    }

    search(query: string): Spell[] {
        const q = query.toLowerCase();
        return this.spells.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.school.toLowerCase().includes(q)
        );
    }
}

export const spellRepository = new SpellRepository();
