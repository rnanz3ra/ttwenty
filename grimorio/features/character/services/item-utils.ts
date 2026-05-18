/**
 * Utilitários para Items de Tormenta20 (Lotes de Equipamentos e Materiais)
 */

export const DAMAGE_PROGRESSION = [
    "1", "1d2", "1d3", "1d4", "1d6", "1d8", "1d10", "1d12", "2d6", "2d8", "3d6", "4d6", "4d8"
];

/**
 * Aumenta o dano de uma arma em X passos conforme a Tabela 3-2.
 * Funciona com dados compostos, ex: "1d10 / 1d12 (Duas mãos)".
 */
export function applyStepDamage(diceString: string, steps: number = 1): string {
    if (!diceString) return diceString;

    // Separate choices like "1d10 / 1d12 (Duas mãos)"
    if (diceString.includes("/")) {
        const parts = diceString.split("/");
        return parts.map(p => stepSingleDice(p, steps)).join(" / ");
    }

    return stepSingleDice(diceString, steps);
}

function stepSingleDice(dice: string, steps: number): string {
    const trimmed = dice.trim();
    // Pega o dado base (ex: 1d6, 2d6) e preserva qualquer texto extra (ex: "(Duas mãos)")
    const match = trimmed.match(/^(\d+d\d+)(.*)/);

    if (match) {
        const baseDice = match[1];
        const rest = match[2];
        const currentIndex = DAMAGE_PROGRESSION.indexOf(baseDice);

        if (currentIndex !== -1) {
            const newIndex = Math.min(currentIndex + steps, DAMAGE_PROGRESSION.length - 1);
            return DAMAGE_PROGRESSION[newIndex] + rest;
        }
    }

    return trimmed;
}

/**
 * Altera a Margem de Ameaça (ex: "19", "19/x3" -> "18", "18/x3")
 */
export function applyThreatMargin(critString: string, bonus: number = 1): string {
    if (!critString) return critString;

    const parts = critString.split("/");
    let margin = parseInt(parts[0]);
    let multiplier = parts[1];

    // Se não for um número válido (ex: "x3" puro), a base é 20
    if (isNaN(margin)) {
        margin = 20;
        multiplier = parts[0]; // ex: "x3"
    }

    // Aplica bônus de Margem
    const newMargin = Math.max(margin - bonus, 2);

    // Retorna novo formato (ex: 19/x3)
    if (multiplier) {
        return `${newMargin}/${multiplier}`;
    }

    return `${newMargin}`;
}

/**
 * Extrai valor puro em T$ de strings formatadas "T$ 3.000" ou "+T$ 2.000"
 */
export function parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    const match = priceStr.match(/T\$\s*([\d,.]+)/);
    if (match) {
        return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
    }
    return 0;
}

/**
 * Formata número para string estizada
 */
export function formatPrice(value: number): string {
    return `T$ ${value.toLocaleString('pt-BR')}`;
}
