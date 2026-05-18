import prisma from "@/core/database/prisma";
import { Spell } from "@/core/types";

export const spellRepository = {
    async getAll(): Promise<Spell[]> {
        const spells = await prisma.spell.findMany({
            orderBy: { name: 'asc' }
        });

        // Map from DB schema to frontend type Spell
        return spells.map((s: any) => ({
            id: s.id,
            name: s.name,
            circle: s.circle as any,
            type: s.type as any,
            school: s.school as any,
            execTime: s.execution,
            range: s.range,
            duration: s.duration,
            description: s.description,
            resistance: s.resistance ?? undefined,
            area: s.area ?? undefined,
            enhancements: (s.enhancements as any) ?? [],
        }));
    },

    async getById(id: string): Promise<Spell | null> {
        const s = await prisma.spell.findUnique({
            where: { id }
        });
        if (!s) return null;

        return {
            id: s.id,
            name: s.name,
            circle: s.circle as any,
            type: s.type as any,
            school: s.school as any,
            execTime: s.execution,
            range: s.range,
            duration: s.duration,
            description: s.description,
            resistance: s.resistance ?? undefined,
            area: s.area ?? undefined,
            enhancements: (s.enhancements as any) ?? [],
        };
    },

    async search(query: string): Promise<Spell[]> {
        const spells = await prisma.spell.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { school: { contains: query } }
                ]
            },
            take: 20
        });

        return spells.map((s: any) => ({
            id: s.id,
            name: s.name,
            circle: s.circle as any,
            type: s.type as any,
            school: s.school as any,
            execTime: s.execution,
            range: s.range,
            duration: s.duration,
            description: s.description,
            resistance: s.resistance ?? undefined,
            area: s.area ?? undefined,
            enhancements: (s.enhancements as any) ?? [],
        }));
    }
};
