import prisma from "@/core/database/prisma";
import { Condition } from "@/core/types";

export const conditionRepository = {
    async getAll(): Promise<Condition[]> {
        const conditions = await prisma.condition.findMany({
            orderBy: { name: 'asc' }
        });

        return conditions.map((c: any) => ({
            id: c.id,
            name: c.name,
            category: c.category,
            effect: c.effect,
            stackingRule: c.stackingRule,
        }));
    },

    async getById(id: string): Promise<Condition | null> {
        const c = await prisma.condition.findUnique({
            where: { id }
        });
        if (!c) return null;

        return {
            id: c.id,
            name: c.name,
            category: c.category,
            effect: c.effect,
            stackingRule: c.stackingRule,
        };
    },

    async search(query: string): Promise<Condition[]> {
        const conditions = await prisma.condition.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { category: { contains: query } }
                ]
            }
        });

        return conditions.map((c: any) => ({
            id: c.id,
            name: c.name,
            category: c.category,
            effect: c.effect,
            stackingRule: c.stackingRule,
        }));
    }
};
