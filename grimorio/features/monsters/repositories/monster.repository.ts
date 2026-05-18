import monsters from "@/data/lotes_legado/bestiario/monsters.json";
import ameacasConsolidadas from "@/data/lotes_legado/bestiario/ameacas_db_consolidado.json";
import { getLefeuTraits } from "@/features/monsters/services/monster-rules";
import { Monster } from "@/core/types";

class MonsterRepository {
    private monsters: Monster[];

    constructor() {
        const baseMonsters = (monsters as unknown as Monster[]).map(m => ({
            ...m,
            fonte: "Livro Básico"
        }));

        const typedAmeacas: Monster[] = (ameacasConsolidadas as any[]).map((a: any) => {
            const isLefeu = (a.tipo || "").toLowerCase().includes("lefeu");
            const injectedAbilities = isLefeu ? getLefeuTraits().map(trait => ({
                name: "Característica Lefeu",
                description: trait,
                type: "Passiva"
            })) : [];

            const mappedAbilities = (a.habilidades || []).map((h: any) => {
                if (typeof h === 'string') {
                    return { name: "Habilidade", description: h, type: "Especial" };
                }
                return {
                    name: h.nome,
                    description: h.descricao,
                    type: h.tipo,
                    cost: h.custo
                };
            });

            const safeND = a.nd ? String(a.nd).replace(/\//g, '') : "0";
            const generateId = a.nome?.toLowerCase().replace(/\s+/g, '-').replace(/\'/g, '') || "unknown";

            return {
                id: `${generateId}-${safeND}`,
                name: a.nome || "Ameaça Desconhecida",
                role: a.papel || 'Especial',
                level: a.nd || '1',
                type: a.tipo || 'Monstro',
                size: a.tamanho || 'Médio',
                attributes: {
                    for: a.atributos?.for ?? null,
                    des: a.atributos?.des ?? null,
                    con: a.atributos?.con ?? null,
                    int: a.atributos?.int ?? null,
                    sab: a.atributos?.sab ?? null,
                    car: a.atributos?.car ?? null,
                },
                defense: a.defesa || 0,
                hp: a.pv || 0,
                mp: a.pm || 0,
                speed: a.deslocamento || "9m",
                attacks: (a.ataques || []).map((atk: any) => ({
                    name: atk.nome || "Ataque",
                    bonus: atk.bonus || 0,
                    damage: atk.dano || "1d4",
                    type: "Corpo-a-corpo / À distância",
                })),
                abilities: [...injectedAbilities, ...mappedAbilities],
                percepcao: a.percepcao,
                iniciativa: a.iniciativa,
                fortitude: a.fortitude,
                reflexos: a.reflexos,
                vontade: a.vontade,
                imunidades: a.imunidades,
                rd: a.rd,
                cura_acelerada: a.cura_acelerada,
                pericias: a.pericias,
                magias: a.magias,
                habilidades_lekael: a.habilidades_lekael,
                fonte: a.fonte || "Ameaças de Arton"
            };
        });

        this.monsters = [...baseMonsters, ...typedAmeacas];
    }

    getAll(): Monster[] {
        return this.monsters;
    }

    getById(id: string): Monster | undefined {
        return this.monsters.find(m => m.id === id);
    }

    search(query: string): Monster[] {
        const q = query.toLowerCase();
        return this.monsters.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.type.toLowerCase().includes(q)
        );
    }
}

export const monsterRepository = new MonsterRepository();
