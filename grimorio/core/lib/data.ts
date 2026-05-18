import powers from "@/data/lotes_legado/personagem/powers.json";
import skills from "@/data/lotes_legado/personagem/skills.json";
import actions from "@/data/lotes_legado/regras_e_itens/actions.json";
import divindades from "@/data/lotes_legado/personagem/divindades.json";
import origens from "@/data/lotes_legado/personagem/origens.json";
import deitiesLote51 from "@/data/lotes_legado/deities_lote51.json";
import poderesConcedidos from "@/data/lotes_legado/lote60_poderes_concedidos.json";
import condicoesData from "@/data/lotes_legado/lote61_condicoes.json";
import manobrasData from "@/data/lotes_legado/lote62_manobras.json";
import aventurasData from "@/data/lotes_legado/lote71_aventuras.json";
import npcsData from "@/data/lotes_legado/lote72_npcs.json";
import parceirosData from "@/data/lotes_legado/lote73_parceiros.json";
import viagensData from "@/data/lotes_legado/lote74_viagens.json";
import downtimeData from "@/data/lotes_legado/lote75_downtime.json";
import ndRulesData from "@/data/lotes_legado/regras_e_itens/lote76_regras_nd.json";
import npcStatsData from "@/data/lotes_legado/lote77_npc_stats.json";
import perigosData from "@/data/lotes_legado/lote78_perigos.json";
import xpData from "@/data/lotes_legado/lote79_xp.json";
import tesourosData from "@/data/lotes_legado/lote80_tesouros.json";
import encantosData from "@/data/lotes_legado/lote81_encantos.json";
import artefatosData from "@/data/lotes_legado/lote82_artefatos.json";
import cronologiaData from "@/data/lotes_legado/lote83_cronologia.json";
import atlasData from "@/data/lotes_legado/lote84_atlas.json";
import nomesData from "@/data/lotes_legado/lote85_nomes.json";
import { spellRepository } from "@/features/spells/repositories/spell.repository";
import { monsterRepository } from "@/features/monsters/repositories/monster.repository";
import { classRepository } from "@/features/classes/repositories/class.repository";
import { raceRepository } from "@/features/races/repositories/race.repository";
import { Spell, Monster, Power, ActionRef, Race, Class, Skill, Divinity, Deity, Origin } from "@/core/types";

// Adapter for Spells
const typedSpells: Spell[] = spellRepository.getAll();

// Adapter for Base Monsters (Tormenta 20 Core)
const typedMonsters = monsterRepository.getAll();

const typedPowers = powers as unknown as Power[];
const typedActions = actions as unknown as ActionRef[];

// Adapter for Races (Object -> Array)
const typedRaces: Race[] = raceRepository.getAll();

// Adapter for Classes (Object -> Array)
const typedClasses: Class[] = classRepository.getAll();

// Adapter for Skills (Object -> Array)
const typedSkills: Skill[] = Object.values(skills).map((s: any) => ({
    name: s.nome,
    atributo: s.atributo,
    somente_treinada: s.somente_treinada,
    penalidade_armadura: s.penalidade_armadura,
    descricao: s.descricao,
    // Compat
    id: s.nome.toLowerCase().replace(/\s+/g, '-'),
    description: s.descricao
}));

// Adapter for Divindades (Object -> Array)
const typedDivinities: Divinity[] = Object.entries(divindades).map(([key, d]: [string, any]) => ({
    id: key,
    ...d
}));

// Adapter for Deities (Lote 51)
const typedDeities: Deity[] = (deitiesLote51 as any[]).map(d => ({
    id: d.nome.toLowerCase().replace(/\s+/g, '-'),
    ...d
}));

// Adapter for Origens (Object -> Array)
const typedOrigins: Origin[] = Object.entries(origens).map(([key, o]: [string, any]) => ({
    id: key,
    ...o
}));

// Adapter for Conditions (Lote 61)
export const getAllConditions = () => condicoesData.lista;

// Adapter for Maneuvers (Lote 62)
export const getAllManeuvers = () => manobrasData.lista;

// Adapter for Deity Powers (Lote 60)
export const getPowersByDeity = (deityName: string) => {
    const found = (poderesConcedidos as any[]).find(
        p => p.deus.toLowerCase() === deityName.toLowerCase()
    );
    return found ? found.poderes : [];
};

export const getAdventureSteps = () => aventurasData.fases;

export const getNPCQuickStats = () => npcsData.estatisticas_npc_rapida;

export const getNPCAttitudes = () => npcsData.atitudes;

export const getPartnerRules = () => parceirosData.regras_parceiros;

export const getTravelRules = () => viagensData.viagens;

export const getDowntimeRules = () => downtimeData.downtime;

export const getNDRules = () => ndRulesData.regras_nd;

export const getCritterTypes = () => ndRulesData.tipos_criaturas_habilidades;

export const getNPCTable = () => npcStatsData.tabela_7_2_npc_stats;

export const getHazards = () => perigosData.perigos_complexos;

export const getXPRules = () => xpData.regras_xp;

export const getTreasureRules = () => tesourosData.gerador_tesouro;

export const getEnchantments = () => encantosData.encantos_itens;

export const getArtifacts = () => artefatosData.artefatos;

export const getChronology = () => cronologiaData.eras;

export const getAtlas = () => atlasData;

export const getArtonNames = () => nomesData.nomes_arton;

export const getAllSpells = (): Spell[] => {
    return typedSpells;
};

export const getAllSkills = (): Skill[] => {
    return typedSkills;
};

export const getAllActions = (): ActionRef[] => {
    return typedActions;
};

export const getSpellById = (id: string): Spell | undefined => {
    return typedSpells.find(s => s.id === id);
};

export const getAllMonsters = (): Monster[] => {
    return typedMonsters;
};

export const getMonsterById = (id: string): Monster | undefined => {
    return typedMonsters.find(m => m.id === id);
};

export const getAllPowers = (): Power[] => {
    return typedPowers;
};

export const getAllRaces = (): Race[] => {
    return typedRaces;
};

export const getAllClasses = (): Class[] => {
    return typedClasses;
};

export const getAllDivinities = (): Divinity[] => {
    return typedDivinities;
};

export const getAllDeities = (): Deity[] => {
    return typedDeities;
};

export const getAllOrigins = (): Origin[] => {
    return typedOrigins;
};

export const searchGrimoire = (query: string) => {
    const q = query.toLowerCase();

    return {
        spells: typedSpells.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.school.toLowerCase().includes(q)
        ),
        monsters: typedMonsters.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.type.toLowerCase().includes(q)
        ),
        powers: typedPowers.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q)
        ),
        skills: typedSkills.filter(s =>
            s.name.toLowerCase().includes(q)
        ),
        races: typedRaces.filter(r =>
            r.name.toLowerCase().includes(q)
        ),
        classes: typedClasses.filter(c =>
            c.name.toLowerCase().includes(q)
        ),
        divinities: typedDivinities.filter(d =>
            d.nome?.toLowerCase().includes(q) ||
            d.crencas_objetivos?.toLowerCase().includes(q)
        ),
        origins: typedOrigins.filter(o =>
            o.nome?.toLowerCase().includes(q) ||
            o.itens?.join(' ').toLowerCase().includes(q)
        )
    };
};
