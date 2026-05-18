import prisma from "@/core/database/prisma";
import { Monster } from "@/core/types";

export const threatRepository = {
    async getAll(): Promise<Monster[]> {
        const threats = await prisma.threat.findMany({
            orderBy: { name: 'asc' }
        });

        return threats.map(this.mapThreatToMonster);
    },

    async getById(id: string): Promise<Monster | null> {
        const threat = await prisma.threat.findUnique({
            where: { id }
        });
        if (!threat) return null;

        return this.mapThreatToMonster(threat);
    },

    async search(query: string): Promise<Monster[]> {
        const threats = await prisma.threat.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { type: { contains: query } }
                ]
            },
            take: 20
        });

        return threats.map(this.mapThreatToMonster);
    },

    mapThreatToMonster(t: any): Monster {
        // Parse JSON strings back to objects arrays
        const attributes = t.attributes ? JSON.parse(t.attributes) : { for: null, des: null, con: null, int: null, sab: null, car: null };
        const immunities = t.immunities ? JSON.parse(t.immunities) : [];
        const attacks = t.attacks ? JSON.parse(t.attacks) : [];
        const abilities = t.abilities ? JSON.parse(t.abilities) : [];
        const spells = t.spells ? JSON.parse(t.spells) : undefined;

        return {
            id: t.id,
            name: t.name,
            role: t.role || 'Especial',
            level: t.nd,
            type: t.type,
            size: t.size,
            attributes,
            defense: t.defense || 0,
            hp: t.hp || 0,
            mp: typeof t.mp === "string" ? t.mp : (t.mp || 0),
            speed: t.speed || "9m",
            attacks,
            abilities,
            percepcao: t.perception,
            iniciativa: t.initiative,
            fortitude: t.fortitude,
            reflexos: t.reflexes,
            vontade: t.will,
            imunidades: immunities,
            rd: t.rd,
            cura_acelerada: t.fastHealing,
            pericias: t.skills || "",
            magias: spells,
            fonte: t.book || "Ameaças de Arton"
        };
    }
};
