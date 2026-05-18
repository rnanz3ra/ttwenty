
import { AttributeBonus, Class, Race } from "@/core/types";

// Attribute Point Buy System
export const ATTRIBUTE_COSTS = {
    "-1": -1, // Not official but for logic
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 4,
    "4": 7, // Needs clarification on official table, usually: 0=0, 1=1, 2=2, 3=4, 4=7, 5=12
    "5": 12
};

export const INITIAL_POINTS = 10;
export const MIN_ATTRIBUTE = -1; // Or 0 depending on table
export const MAX_ATTRIBUTE_START = 4; // Before racial bonuses

// Helper to calculate cost
export function calculateAttributeCost(score: number): number {
    if (score <= 0) return 0; // Negative scores give 0 points back in standard T20 (or do they give points? usually not in point buy, just can't sell below 0)
    // Actually, T20 Jogo do Ano:
    // -1 = custa -1 (ganha 1 ponto)
    // 0 = 0
    // 1 = 1
    // 2 = 2
    // 3 = 4
    // 4 = 7
    // 5 = 12 (somente com raciais e itens, base max é 4)

    // Implementação segura baseada em Jogo do Ano
    if (score === -2) return -2;
    if (score === -1) return -1;
    if (score === 0) return 0;
    if (score === 1) return 1;
    if (score === 2) return 2;
    if (score === 3) return 4;
    if (score === 4) return 7;
    if (score === 5) return 12; // Apenas teórico
    return 0;
}

export function calculateTotalPoints(attributes: AttributeBonus): number {
    let total = 0;
    Object.values(attributes).forEach(score => {
        total += calculateAttributeCost(score);
    });
    return total;
}

// HP and MP Calculation
export function calculateInitialHP(classe: Class, conMod: number): number {
    if (!classe || !classe.pv) return 0;
    return classe.pv.base + conMod;
}

export function calculateInitialMP(classe: Class, attrMod: number): number {
    if (!classe) return 0;
    // T20: PM iniciais = Base da classe
    // Atributo chave soma? Geralmente sim, Arcanista soma Int/Car. 
    // Por simplificação inicial, retornamos a base. O "Wizard" deve lidar com conformidades especificas (ex: Arcanista)
    return classe.pm;
}

// Proficiency check
export function getProficiencies(classe: Class): string[] {
    if (!classe || !classe.proficiencias) return [];
    if (Array.isArray(classe.proficiencias)) return classe.proficiencias;
    return [classe.proficiencias]; // Handle string case
}
