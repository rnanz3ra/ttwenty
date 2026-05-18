
import { create } from 'zustand';
import { CharacterSheet, AttributeBonus, Race, Class, Origin, Divinity, Power, Spell, Skill } from '@/core/types';
import { calculateInitialHP, calculateInitialMP } from '@/core/lib/rules';
import { getArtonNames } from '@/core/lib/data';

interface CharacterStore extends CharacterSheet {
    // Actions
    suggestName: () => string;
    setName: (name: string) => void;
    setPlayerName: (playerName: string) => void;
    setLevel: (level: number) => void;
    setAttributes: (attributes: AttributeBonus) => void;
    setRace: (race: Race | null) => void;
    setClass: (classe: Class | null) => void;
    setOrigin: (origin: Origin | null) => void;
    setDivinity: (divinity: Divinity | null) => void;
    setSkills: (skills: string[]) => void;
    setTibares: (amount: number) => void;
    addPartner: (partner: { tipo: string; patamar: 'Iniciante' | 'Veterano' | 'Mestre' }) => void;
    removePartner: (index: number) => void;
    setRestCondition: (condition: 'Pobre' | 'Médio' | 'Rico' | 'Luxuoso' | null) => void;
    addXP: (amount: number) => void;
    setManaSacrifice: (amount: number) => void;
    identifyItem: (index: number) => void;
    addItem: (item: string | any) => void;
    buyItem: (item: any, cost: number) => boolean;
    removeItem: (index: number) => void;
    spendPM: (amount: number) => boolean;
    // ... specialized actions (addPower, trainSkill, etc.)
    reset: () => void;
}

const INITIAL_ATTRIBUTES: AttributeBonus = {
    for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0
};

const INITIAL_STATE = {
    name: "",
    playerName: "",
    level: 1,
    attributes: INITIAL_ATTRIBUTES,
    race: null,
    class: null,
    origin: null,
    divinity: null,
    powers: [],
    skills: [],
    spells: [],
    inventory: [],
    tibares: 0,
    partners: [],
    restCondition: null,
    xp: 0,
    manaSacrifice: 0,
    hp: { current: 0, max: 0 },
    pm: { current: 0, max: 0 },
};

export const useCharacterStore = create<CharacterStore>((set, get) => ({
    ...INITIAL_STATE,

    suggestName: () => {
        const artonNames = getArtonNames() as Record<string, string>;
        const state = get();
        const userRace = (state.race && state.race.nome) ? state.race.nome : "Humanos"; // Usa a raça atual ou base

        // Mapeamento simples
        const raceKey = Object.keys(artonNames).find(k => userRace.toLowerCase().includes(k.toLowerCase())) || "Humanos";

        const suggestionText = artonNames[raceKey];
        // Um pequeno pseudo-parser caso tivéssemos arrays, mas aqui extraímos o "Ex: " do texto do lote 85
        const exMatch = suggestionText?.match(/Ex:\s*([^.]+)/i);
        const nameExample = exMatch ? exMatch[1].split(',')[0].trim() : "Herói de Arton";

        alert(`Dica de Arton (${raceKey}):\n${suggestionText}\n\nSugestão Adicionada: ${nameExample}`);
        return nameExample;
    },

    setName: (name) => set({ name }),
    setPlayerName: (playerName) => set({ playerName }),
    setLevel: (level) => set({ level }),

    setAttributes: (attributes) => set((state) => {
        // Recalculate derived stats if class exists, considering racial bonuses
        const finalCon = attributes.con + (state.race?.bonus?.con || 0);
        const finalInt = attributes.int + (state.race?.bonus?.int || 0);

        const newMaxHP = state.class ? calculateInitialHP(state.class, finalCon) : 0;
        const newMaxMP = state.class ? calculateInitialMP(state.class, finalInt) : 0;

        return {
            attributes,
            hp: { ...state.hp, max: newMaxHP, current: newMaxHP },
            pm: { ...state.pm, max: newMaxMP, current: newMaxMP }
        };
    }),

    setRace: (race) => set((state) => {
        // Recalculate HP/MP when race changes (due to con/int bonuses)
        const finalCon = state.attributes.con + (race?.bonus?.con || 0);
        const finalInt = state.attributes.int + (race?.bonus?.int || 0);

        const newMaxHP = state.class ? calculateInitialHP(state.class, finalCon) : 0;
        const newMaxMP = state.class ? calculateInitialMP(state.class, finalInt) : 0;

        return {
            race,
            hp: { ...state.hp, max: newMaxHP, current: newMaxHP },
            pm: { ...state.pm, max: newMaxMP, current: newMaxMP }
        };
    }),

    setClass: (classe) => set((state) => {
        const finalCon = state.attributes.con + (state.race?.bonus?.con || 0);
        const finalInt = state.attributes.int + (state.race?.bonus?.int || 0);

        const newMaxHP = classe ? calculateInitialHP(classe, finalCon) : 0;
        const newMaxMP = classe ? calculateInitialMP(classe, finalInt) : 0;

        return {
            class: classe,
            hp: { ...state.hp, max: newMaxHP, current: newMaxHP },
            pm: { ...state.pm, max: newMaxMP, current: newMaxMP }
        };
    }),

    setOrigin: (origin) => set({ origin }),
    setDivinity: (divinity) => set({ divinity }),
    setSkills: (skills) => set({ skills }),

    setTibares: (tibares) => set({ tibares }),
    addPartner: (partner) => set((state) => ({ partners: [...state.partners, partner] })),
    removePartner: (index) => set((state) => ({
        partners: state.partners.filter((_, i) => i !== index)
    })),
    setRestCondition: (restCondition) => set({ restCondition }),

    addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const xpTable: Record<string, number> = {
            "1": 0, "2": 1000, "3": 3000, "4": 6000, "5": 10000,
            "6": 15000, "7": 21000, "8": 28000, "9": 36000, "10": 45000,
            "11": 55000, "12": 66000, "13": 78000, "14": 91000, "15": 105000,
            "16": 120000, "17": 136000, "18": 153000, "19": 171000, "20": 190000
        };
        let newLevel = state.level;
        Object.entries(xpTable).forEach(([lvl, req]) => {
            if (newXP >= req) newLevel = parseInt(lvl);
        });
        if (newLevel > state.level) alert(`PARABÉNS! Você subiu para o nível ${newLevel}!`);
        return { xp: newXP, level: newLevel };
    }),

    setManaSacrifice: (amount) => set((state) => ({
        manaSacrifice: amount,
        pm: { ...state.pm, max: state.pm.max - (amount - state.manaSacrifice) }
    })),

    identifyItem: (index) => set((state) => {
        const item = state.inventory[index];
        if (typeof item !== 'string' && item) {
            const newInventory = [...state.inventory];
            newInventory[index] = { ...item, identificado: true };
            return { inventory: newInventory };
        }
        return state;
    }),

    addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),

    buyItem: (item, cost) => {
        const state = get();
        if (state.tibares < cost) return false;

        set({
            tibares: state.tibares - cost,
            inventory: [...state.inventory, item]
        });
        return true;
    },

    removeItem: (index) => set((state) => ({ inventory: state.inventory.filter((_, i) => i !== index) })),

    spendPM: (amount) => {
        const { pm } = get();
        if (pm.current < amount) return false;
        set((state) => ({
            pm: { ...state.pm, current: state.pm.current - amount }
        }));
        return true;
    },

    reset: () => set(INITIAL_STATE)
}));
