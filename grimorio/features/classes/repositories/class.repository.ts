import classes from "@/data/lotes_legado/personagem/classes.json";
import { Class } from "@/core/types";

class ClassRepository {
    private classes: Class[];

    constructor() {
        this.classes = Object.values(classes).map((c: any) => ({
            id: c.id,
            name: c.nome,
            pv: {
                base: parseInt(c.pv_inicial) || 0,
                bonus: parseInt(c.pv_por_nivel) || 0
            },
            pm: parseInt(c.pm_por_nivel) || 0,
            pericias: {
                qnt: 0,
                opcoes: {}
            },
            proficiencias: c.proficiencias || "",
            description: `Classe ${c.nome}`,
            abilities: c.habilidades_de_classe ? c.habilidades_de_classe.map((h: any) => ({
                name: h.nome,
                description: typeof h.descricao === 'object' ? Object.values(h.descricao).join('\n') : h.descricao
            })) : []
        }));
    }

    getAll(): Class[] {
        return this.classes;
    }

    getById(id: string): Class | undefined {
        return this.classes.find(c => c.id === id);
    }

    search(query: string): Class[] {
        const q = query.toLowerCase();
        return this.classes.filter(c => c.name.toLowerCase().includes(q));
    }
}

export const classRepository = new ClassRepository();
