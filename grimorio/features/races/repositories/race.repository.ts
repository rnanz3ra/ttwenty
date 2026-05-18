import races from "@/data/lotes_legado/personagem/races.json";
import { Race } from "@/core/types";

class RaceRepository {
    private races: Race[];

    constructor() {
        this.races = Object.values(races).map((r: any) => ({
            id: r.id,
            name: r.nome,
            attributes: r.atributos,
            abilities: r.habilidades_de_raca.map((h: any) => ({
                name: h.nome,
                description: h.descricao
            })),
            description: `Raça ${r.nome}`
        }));
    }

    getAll(): Race[] {
        return this.races;
    }

    getById(id: string): Race | undefined {
        return this.races.find(r => r.id === id);
    }

    search(query: string): Race[] {
        const q = query.toLowerCase();
        return this.races.filter(r => r.name.toLowerCase().includes(q));
    }
}

export const raceRepository = new RaceRepository();
