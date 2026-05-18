import monsterRulesData from '@/data/lotes_legado/bestiario/monster-rules.json';

// --- Tipos de Dados ---
export type TamanhoId = 'minusc' | 'peq' | 'med' | 'grande' | 'enorme' | 'colossal';

export interface Tamanho {
    id: TamanhoId;
    nome: string;
    espaco: string;
    mod_furtividade: number;
    mod_manobra: number;
}

export type TipoCriaturaId = 'Animal' | 'Construto' | 'Espírito' | 'Humanóide' | 'Monstro' | 'Morto-Vivo';

export interface TipoCriatura {
    int_max?: number;
    traits: string[];
}

export interface HabilidadeGeral {
    nome: string;
    tipo?: string;
    efeito: string;
    icone?: string;
}

// --- Dados Importados ---
export const TABELA_TAMANHOS: Tamanho[] = monsterRulesData.tabela_tamanhos as Tamanho[];
export const TIPOS_CRIATURAS: Record<string, TipoCriatura> = monsterRulesData.tipos_criaturas;
export const HABILIDADES_GERAIS: HabilidadeGeral[] = monsterRulesData.habilidades_gerais;

// --- Funções Auxiliares (Regras de Ameaças) ---

/**
 * Retorna os dados de tamanho pelo ID
 */
export function getTamanho(id: string): Tamanho | undefined {
    return TABELA_TAMANHOS.find((t) => t.id === id);
}

/**
 * Verifica se o ND é especial (S ou S+)
 */
export function isNDSpecial(nd: number | string): boolean {
    return typeof nd === 'string' && (nd.toUpperCase() === 'S' || nd.toUpperCase() === 'S+');
}

/**
 * Converte ND para número de forma segura para cálculos.
 */
export function parseND(nd: number | string): number {
    if (isNDSpecial(nd)) return 20; // NDs invencíveis geralmente se comportam como 20+ em cálculos de base, caso falte o dado.
    if (typeof nd === 'string') {
        const parsed = parseFloat(nd);
        return isNaN(parsed) ? 0 : parsed;
    }
    return nd;
}

/**
 * Calcula a Classe de Dificuldade (CD) para extração de tesouro de um monstro.
 * Regra Ameaças de Arton: 15 + ND. (Considerando ND de lacaios ou menor que 1, a regra usa o ND matemático ou apenas arredonda? 
 * Geralmente ND < 1 como 1/2 ou 1/4 usa como fração ou trata como 0 para efeitos de cálculo inteiro - usaremos floor para garantir precisão)
 */
export function calcularCDExtracaoTesouro(nd: number | string): number {
    if (isNDSpecial(nd)) return 15 + 20; // Exemplo para lordes
    return 15 + Math.floor(parseND(nd));
}

/**
 * Calcula o bônus de uma perícia NÃO treinada para Ameaças.
 * Regra Ameaças de Arton: Nível do Desafio (ND) / 2 + Modificador do Atributo.
 * Em Tormenta20, divisões por 2 são arredondadas para baixo.
 */
export function calcularPericiaNaoTreinada(nd: number | string, modAtributo: number): number {
    return Math.floor(parseND(nd) / 2) + modAtributo;
}

/**
 * Aplica modificadores de tamanho a Valores Base da ficha.
 * Na tabela extraída, o tamanho afeta Furtividade e Manobra.
 * @param valorBase Valor do teste (sem o modificador de tamanho)
 * @param tamanhoId ID do tamanho (ex: "med", "grande")
 * @param tipoModificador "furtividade" ou "manobra"
 */
export function aplicarModificadorTamanho(
    valorBase: number,
    tamanhoId: string,
    tipoModificador: 'furtividade' | 'manobra'
): number {
    const tamanho = getTamanho(tamanhoId);
    if (!tamanho) return valorBase;

    if (tipoModificador === 'furtividade') {
        return valorBase + tamanho.mod_furtividade;
    }
    if (tipoModificador === 'manobra') {
        return valorBase + tamanho.mod_manobra;
    }

    return valorBase;
}

/**
 * Modificadores extras de Ataque e Defesa devido a Tamanho 
 * (Tormenta20 Padrão: Minúsculo +2, Pequeno +1, Médio 0, Grande -1, Enorme -2, Colossal -4)
 */
export function getModificadorTamanhoAtaqueDefesa(tamanhoId: string): number {
    const modificadores: Record<string, number> = {
        minusc: 2,
        peq: 1,
        med: 0,
        grande: -1,
        enorme: -2,
        colossal: -4
    };
    return modificadores[tamanhoId] || 0;
}

/**
 * Retorna as características unificadas de criaturas do subtipo Lefeu (Monstros da Tormenta)
 * Evita repetição de texto nas fichas.
 */
export function getLefeuTraits(): string[] {
    return [
        "Criatura da Tormenta: Imunidade a atordoamento, doença, encantamento, fadiga, metamorfose, paralisia, petrificação, sono e veneno.",
        "Não respira e não dorme.",
        "Anatomia Bizarra: Imune a acertos críticos e ataques furtivos.",
        "Visão no Escuro.",
        "Insanidade da Tormenta: No início do combate, qualquer não-lefeu em alcance médio deve fazer teste de Vontade, sujeito a penalidades ou problemas mentais."
    ];
}

/**
 * Helper para checar se a criatura atua como Bando ou Enxame,
 * aplicando regras especiais (dano dobrado se superar defesa em 10, imune a manobras, etc).
 */
export function isBandoOuEnxame(habilidades: string[]): boolean {
    return habilidades.some(h =>
        h.toLowerCase().includes('bando') ||
        h.toLowerCase().includes('enxame') ||
        h.toLowerCase().includes('turba')
    );
}

/**
 * Calcula o dano recebido por uma criatura, considerando imunidades ou habilidades raras.
 * Exemplo prático: O "Carrasco de Lena" sofre dano quando curado, e é curado quando recebe dano mecânico.
 */
export function calcularDanoEspecial(nomeCriatura: string, valor: number, isCura: boolean = false): number {
    if (nomeCriatura.toLowerCase() === "carrasco de lena") {
        if (isCura) {
            return Math.abs(valor); // Cura vira dano (positivo)
        } else {
            return -Math.abs(valor); // Dano vira cura (negativo deduz menos ou devolve no sistema final)
        }
    }

    // Para monstros normais: Inverte a lógica final baseado na engine de combate real do app
    return isCura ? -Math.abs(valor) : Math.abs(valor);
}
