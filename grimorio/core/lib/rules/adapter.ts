import {
    RaceName,
    Translator,
    Dwarf,
    Human,
    Dahllan,
    Elf,
    Goblin,
    Lefeu,
    Minotaur,
    Qareen,
    type Race,
    type Attributes,
    SpellName,
    RoleName,
    Arcanist,
    Barbarian,
    Bard,
    Buccaneer,
    Cleric,
    Druid,
    Fighter,
    Inventor,
    Knight,
    Noble,
    Paladin,
    Ranger,
    Rogue,
    Warrior,
} from 't20-sheet-builder';

// Simplified interface for the frontend
export interface RaceData {
    slug: string;
    name: string;
    modifiers?: Partial<Attributes>;
    abilities?: {
        name: string;
        description?: string;
    }[];
}

export interface RoleData {
    slug: string;
    name: string;
    initialLifePoints: number;
    lifePointsPerLevel: number;
    manaPerLevel: number;
    proficiencies: string[];
    // We could add skills here too if needed
}

const RACES = [
    RaceName.dwarf,
    RaceName.human,
    RaceName.dahllan,
    RaceName.elf,
    RaceName.goblin,
    RaceName.lefeu,
    RaceName.minotaur,
    RaceName.qareen,
];

const ROLES = [
    { slug: RoleName.arcanist, Class: Arcanist },
    { slug: RoleName.barbarian, Class: Barbarian },
    { slug: RoleName.bard, Class: Bard },
    { slug: RoleName.buccaneer, Class: Buccaneer },
    { slug: RoleName.cleric, Class: Cleric },
    { slug: RoleName.druid, Class: Druid },
    { slug: RoleName.fighter, Class: Fighter },
    { slug: RoleName.inventor, Class: Inventor },
    { slug: RoleName.knight, Class: Knight },
    { slug: RoleName.noble, Class: Noble },
    { slug: RoleName.paladin, Class: Paladin },
    { slug: RoleName.ranger, Class: Ranger },
    { slug: RoleName.rogue, Class: Rogue },
    { slug: RoleName.warrior, Class: Warrior },
];

export function getAvailableRaces(): RaceData[] {
    return RACES.map((slug) => ({
        slug,
        name: Translator.getRaceTranslation(slug),
    }));
}

export function getRaceDetails(slug: string): RaceData | null {
    let race: Race;

    try {
        switch (slug) {
            case RaceName.dwarf:
                race = new Dwarf();
                break;
            case RaceName.human:
                race = new Human(['strength', 'dexterity', 'constitution']);
                break;
            case RaceName.dahllan:
                race = new Dahllan();
                break;
            case RaceName.elf:
                race = new Elf();
                break;
            case RaceName.goblin:
                race = new Goblin();
                break;
            case RaceName.lefeu:
                race = new Lefeu(['strength', 'dexterity', 'constitution']);
                break;
            case RaceName.minotaur:
                race = new Minotaur();
                break;
            case RaceName.qareen:
                race = new Qareen('water', SpellName.arcaneArmor);
                break;
            default:
                return null;
        }

        const name = Translator.getRaceTranslation(slug as RaceName);

        const abilities = Object.values(race.abilities).map((ability) => ({
            name: Translator.getRaceAbilityTranslation(ability.name),
        }));

        return {
            slug,
            name,
            modifiers: race.attributeModifiers,
            abilities
        };

    } catch (error) {
        console.error(`Error instantiating race ${slug}:`, error);
        return null;
    }
}

export function getAvailableRoles(): RoleData[] {
    return ROLES.map(({ slug, Class }) => {
        return {
            slug,
            name: Translator.getRoleTranslation(slug),
            initialLifePoints: Class.initialLifePoints,
            lifePointsPerLevel: Class.lifePointsPerLevel,
            manaPerLevel: Class.manaPerLevel,
            proficiencies: Class.proficiencies.map(p => Translator.getProficiencyTranslation(p)),
        };
    });
}

import { AttributeBonus } from "@/core/types";

export function mapAttributes(attrs: Partial<Attributes> = {}): AttributeBonus {
    const map: Record<string, keyof AttributeBonus> = {
        strength: 'for',
        dexterity: 'des',
        constitution: 'con',
        intelligence: 'int',
        wisdom: 'sab',
        charisma: 'car',
    };

    const bonus: AttributeBonus = {
        for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0
    };

    Object.entries(attrs).forEach(([key, val]) => {
        const shortKey = map[key];
        if (shortKey) {
            bonus[shortKey] = val;
        }
    });

    return bonus;
}
