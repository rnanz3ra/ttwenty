
import { AttributeBonus, Participant } from "@/core/types";

/**
 * Calcula o bônus de perícia baseado no nível, atributo e treinamento.
 * Fórmula: (Nível / 2) + Atributo + Treino + Outros
 */
export function calculateSkillTotal(
    level: number,
    attrValue: number,
    isTrained: boolean,
    others: number = 0
): number {
    const halfLevel = Math.floor(level / 2);
    // Em T20 Jogo do Ano, treino dá +2 (nível 1-6), +4 (7-14) ou +6 (15+).
    // Implementação padrão: +2 se treinado.
    const trainingBonus = isTrained ? (level >= 15 ? 6 : level >= 7 ? 4 : 2) : 0;

    return halfLevel + attrValue + trainingBonus + others;
}

/**
 * Calcula a Defesa Total.
 * Fórmula: 10 + DES + Armadura + Escudo + Outros
 */
export function calculateDefense(
    desMod: number,
    armorBonus: number = 0,
    shieldBonus: number = 0,
    others: number = 0
): number {
    return 10 + desMod + armorBonus + shieldBonus + others;
}

/**
 * Converte um valor de atributo (ex: 18) para o modificador (ex: +4).
 * Em T20, o valor JÁ É o modificador se for o formato resumido, 
 * ou (valor - 10) / 2 para o formato D&D. 
 * Tormenta 20 Oficial usa valores diretos de modificador (0, 1, 2...).
 */
export function getAttrModifier(value: number): number {
    return value; // T20 usa modificadores diretos
}
