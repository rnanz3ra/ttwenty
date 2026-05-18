export type School = "Abjuração" | "Adivinhação" | "Convocação" | "Encantamento" | "Evocação" | "Ilusão" | "Necromancia" | "Transmutação";
export type Circle = "1" | "2" | "3" | "4" | "5" | 1 | 2 | 3 | 4 | 5;

export interface Spell {
    id: string;
    name: string;
    type?: string; // Arcana, Divina, Universal
    school: School;
    circle: Circle;
    execTime: string;
    range: string;
    target?: string;
    area?: string;
    effect?: string;
    duration: string;
    resistance?: string;
    pmCost?: number; // Optional, can be derived from circle
    description: string;
    enhancements?: { cost: string; effect: string; requirement?: string | null }[];
    imageUrl?: string;
}

export interface Monster {
    id: string;
    name: string;
    role: "Lacaio" | "Solo" | "Especial" | string;
    level: number | string; // Allow "1/4" or "S+" strings
    type: string;
    size: "Minúsculo" | "Pequeno" | "Médio" | "Grande" | "Enorme" | "Colossal" | string;
    attributes: {
        for: number | null;
        des: number | null;
        con: number | null;
        int: number | null;
        sab: number | null;
        car: number | null;
    };
    defense: number;
    hp: number;
    mp?: number | string;
    speed: string;
    attacks: {
        name: string;
        bonus: number;
        damage: string;
        type?: string;
        crit?: string;
    }[];
    abilities: {
        name: string;
        description: string;
        type?: string;
        cost?: string;
    }[];
    description?: string;
    percepcao?: number;
    iniciativa?: number;
    fortitude?: number;
    reflexos?: number;
    vontade?: number;
    imunidades?: string[];
    rd?: number;
    cura_acelerada?: number;
    pericias?: string;
    magias?: { nivel: number; cd: number; lista: string[] };
    habilidades_lekael?: string[];
    fonte?: string;
    imageUrl?: string;
}

export type PowerType = "Geral" | "Combate" | "Destino" | "Magia" | "Tormenta" | "Classe" | "Concedido";

export interface Power {
    id: string;
    name: string;
    type: PowerType;
    source?: string;
    prerequisite?: string;
    description: string;
}

export interface AttributeBonus {
    for: number;
    des: number;
    con: number;
    int: number;
    sab: number;
    car: number;
}

export interface Race {
    id: string | number;
    name: string; // Mapped from "nome"
    nome?: string; // Raw JSON
    bonus?: AttributeBonus;
    attributes?: AttributeBonus; // Legacy compat
    habilidades_de_raca?: {
        nome: string;
        descricao: string;
    }[];
    abilities: { // Mapped or Legacy
        name: string;
        description: string;
    }[];
    description: string;
    tamanho?: string;
    deslocamento?: string;
}

export interface Class {
    id: string;
    name: string; // Mapped from "nome"
    nome?: string;
    pv: {
        base: number;
        bonus: number;
    };
    pm: number;
    pericias: {
        qnt: number;
        opcoes: { [key: string]: string };
    };
    proficiencias: string | string[]; // Raw can be string "Armas marciais..."
    habilidades?: {
        [key: string]: {
            nome: string;
            descricao: { [key: string]: string };
        }
    };
    abilities: { // Mapped for UI
        name: string;
        description: string;
    }[];
    description?: string;
    pv_inicial?: number;
    pv_nivel?: number;
    pm_nivel?: number;
    atributo_chave?: string;
    pericias_treinadas?: string[];
    habilidades_base?: string[];
}

export interface Divinity {
    id: string; // key from JSON (e.g. "aharadak")
    nome: string;
    crencas_objetivos: string;
    devotos_permitidos: string;
    simbolo_sagrado: string;
    canalizar_energia: string;
    arma_preferida: string;
    obrigacoes_restricoes: { [key: string]: string };
    poderes_concedidos: {
        nome: string;
        descricao: string;
    }[];
}

export interface Deity {
    id: string;
    nome: string;
    titulo: string;
    lore: string;
    crenças: string;
    simbolo: string;
    canalizacao: string;
    arma: string;
    devotos: string;
    poderes: string[];
    obrigacoes: string;
}

export interface Origin {
    id: string; // key from JSON
    nome: string;
    name?: string;
    descricao?: string;
    itens?: string[];
    beneficios?: string[];
}

export interface Skill {
    id?: string;
    start?: boolean; // 'inicio' from JSON
    name: string; // Mapped from key or nome
    atributo: string;
    somente_treinada: boolean;
    penalidade_armadura: boolean;
    descricao: string;
    // Legacy compat
    attr?: string;
    penalty?: boolean;
    desc?: string;
}

export interface ActionRef {
    type: string;
    actions: {
        name: string;
        desc: string;
    }[];
}

export interface CharacterSheet {
    name: string;
    playerName: string;
    level: number;
    attributes: AttributeBonus; // Base attributes (purchased)
    race: Race | null;
    class: Class | null;
    origin: Origin | null;
    divinity: Divinity | null;
    powers: Power[];
    skills: string[]; // List of skill names
    spells: Spell[];
    inventory: (string | { nome: string; identificado: boolean; encantos?: string[] })[];
    tibares: number;
    partners: { tipo: string; patamar: 'Iniciante' | 'Veterano' | 'Mestre' }[];
    restCondition: 'Pobre' | 'Médio' | 'Rico' | 'Luxuoso' | null;
    xp: number;
    manaSacrifice: number; // PM reduzido permanentemente
    hp: {
        current: number;
        max: number;
    };
    pm: {
        current: number;
        max: number;
    };
}

export interface Participant {
    id: string;
    nome: string;
    iniciativa: number;
    pv_atual: number;
    pv_max: number;
    pm_atual: number;
    pm_max: number;
    condicoes: string[];
    tipo: "jogador" | "inimigo";
    threat: number;
}

export interface Condition {
    id: string;
    name: string;
    category: string;
    effect: string;
    stackingRule?: string | null;
}

export interface LogEntry {
    round: number;
    message: string;
    type: "info" | "damage" | "heal" | "mana" | "crit" | "status" | "roll";
}

export interface NDRule {
    base_group: string;
    calculo_multiplos_inimigos: {
        nd_menor_que_1: string;
        nd_maior_ou_igual_a_1: string;
    };
    papeis_combate: Record<string, { desc: string; mod: string }>;
}

export interface NPCTableEntry {
    nd: string;
    ataque: number;
    dano: string;
    defesa: number;
    pv: number;
    pericias: number;
    cd: number;
}

export interface Hazard {
    nome: string;
    nd: number;
    objetivo: string;
    efeito: string;
    acoes: { nome: string; pericia: string; cd: number }[];
}

export interface Enchantment {
    nome: string;
    efeito: string;
}

export interface Artifact {
    nome: string;
    mecanica?: string;
    beneficio?: string;
    maldicao?: string;
    cartas?: { nome: string; efeito: string }[];
}

export interface ChronologyEra {
    ano: string;
    evento: string;
}

export interface AtlasKingdom {
    nome: string;
    titulo: string;
    lore: string;
    detalhes: {
        capital?: string;
        regente?: string;
        clima?: string;
        divindade_local?: string;
        locais_notaveis?: string[];
    };
}

export interface ArtonNames {
    nomes_arton: Record<string, string>;
}
