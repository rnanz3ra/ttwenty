import racasRaw from "@/data/lotes_legado/personagem/t20_racas.json";
import racasAmeacas1 from "@/data/lotes_legado/bestiario/racas_ameacas.json";
import racasAmeacas2 from "@/data/lotes_legado/bestiario/racas_ameacas_2.json";
import racasAmeacas3 from "@/data/lotes_legado/bestiario/racas_ameacas_3.json";
import racasMoreau from "@/data/lotes_legado/personagem/racas_moreau.json";
import { Race } from "@/core/types";

export const getRacas = (): Race[] => {
    let racasTotal: Race[] = [];

    // 1. Livro Básico (t20_racas.json)
    const dataArray = Array.isArray(racasRaw) ? racasRaw : (racasRaw as any).racas;
    if (dataArray && Array.isArray(dataArray)) {
        const base = dataArray.map((r: any) => ({
            id: String(r.nome).toLowerCase().replace(/\s+/g, '-'),
            name: r.nome,
            nome: r.nome,
            bonus: {
                for: r.mods?.for || 0,
                des: r.mods?.des || 0,
                con: r.mods?.con || 0,
                int: r.mods?.int || 0,
                sab: r.mods?.sab || 0,
                car: r.mods?.car || 0,
            },
            attributes: { ...r.mods },
            abilities: Array.isArray(r.habilidades) ? r.habilidades.map((h: any) => ({
                name: h.nome,
                description: h.desc
            })) : [],
            habilidades_de_raca: r.habilidades,
            description: r.desc || `${r.nome} - Raça jogável do Livro Básico.`,
            tamanho: r.tamanho || "Médio",
            deslocamento: r.deslocamento || "9m"
        }));
        racasTotal = [...racasTotal, ...base];
    }

    // 2. Helper para mapear Ameaças (formato: lista_racas -> mods_atributo, habilidades como string array)
    const mapAmeacas = (source: any) => {
        if (!source || !Array.isArray(source.lista_racas)) return [];
        return source.lista_racas.map((r: any) => ({
            id: String(r.nome).toLowerCase().replace(/\s+/g, '-'),
            name: r.nome,
            nome: r.nome,
            bonus: {
                for: r.mods_atributo?.for || 0,
                des: r.mods_atributo?.des || 0,
                con: r.mods_atributo?.con || 0,
                int: r.mods_atributo?.int || 0,
                sab: r.mods_atributo?.sab || 0,
                car: r.mods_atributo?.car || 0,
            },
            attributes: { ...r.mods_atributo },
            abilities: Array.isArray(r.habilidades) ? r.habilidades.map((h: any) => ({
                name: String(h).split("(")[0].trim(),
                description: String(h)
            })) : [],
            description: `${r.nome} - Raça jogável do Ameaças de Arton.`,
            tamanho: "Médio", // Fallback, pode ser extraído do texto da habilidade se houver
            deslocamento: "9m"
        }));
    };

    racasTotal = [...racasTotal, ...mapAmeacas(racasAmeacas1)];
    racasTotal = [...racasTotal, ...mapAmeacas(racasAmeacas2)];
    racasTotal = [...racasTotal, ...mapAmeacas(racasAmeacas3)];

    // 3. Moreau (formato herancas -> mods, habilidades como string array)
    if (racasMoreau && Array.isArray(racasMoreau.herancas)) {
        const moreaus = racasMoreau.herancas.map((h: any) => ({
            id: `moreau-${String(h.nome).toLowerCase()}`,
            name: `Moreau (${h.nome})`,
            nome: `Moreau (${h.nome})`,
            bonus: {
                for: h.mods?.for || 0,
                des: h.mods?.des || 0,
                con: h.mods?.con || 0,
                int: h.mods?.int || 0,
                sab: h.mods?.sab || 0,
                car: h.mods?.car || 0,
            },
            attributes: { ...h.mods },
            abilities: Array.isArray(h.habilidades) ? [{ name: "Herança", description: racasMoreau.habilidade_base }, ...h.habilidades.map((hab: any) => ({
                name: String(hab).split("(")[0].trim(),
                description: String(hab)
            }))] : [],
            description: `Moreau com Herança de ${h.nome} - Ilha dos Povos-Fera.`,
            tamanho: "Médio",
            deslocamento: "9m"
        }));
        racasTotal = [...racasTotal, ...moreaus];
    }

    return racasTotal;
};

export const baseRacas = getRacas();

import classesRaw from "@/data/lotes_legado/personagem/t20_classes.json";
import { Class } from "@/core/types";

export const getClasses = (): Class[] => {
    if (!classesRaw || !Array.isArray(classesRaw.classes)) return [];

    return classesRaw.classes.map((c: any) => {
        return {
            id: String(c.nome).toLowerCase().replace(/\s+/g, '-'),
            name: c.nome,
            nome: c.nome,
            pv: {
                base: c.pv_inicial || 0,
                bonus: c.pv_nivel || 0
            },
            pm: c.pm_nivel || 0,
            pericias: {
                qnt: 0,
                opcoes: {}
            },
            proficiencias: [],
            abilities: Array.isArray(c.habilidades_base) ? c.habilidades_base.map((h: string) => ({
                name: h.split('(')[0].trim(),
                description: h
            })) : [],
            description: `${c.nome} - Profissão heroica de Tormenta 20 com Inteligência Combate/Mágica.`,
            pv_inicial: c.pv_inicial,
            pv_nivel: c.pv_nivel,
            pm_nivel: c.pm_nivel,
            atributo_chave: c.atributo_chave,
            pericias_treinadas: c.pericias_treinadas || [],
            habilidades_base: c.habilidades_base || []
        };
    });
};

export const baseClasses = getClasses();

import origensRaw from "@/data/lotes_legado/personagem/t20_origens.json";
import { Origin } from "@/core/types";

export const getOrigens = (): Origin[] => {
    if (!origensRaw || !Array.isArray(origensRaw.origens)) return [];

    return origensRaw.origens.map((o: any) => {
        return {
            id: String(o.nome).toLowerCase().replace(/\s+/g, '-'),
            nome: o.nome,
            name: o.nome,
            itens: o.itens || [],
            beneficios: o.beneficios || [],
            descricao: `${o.nome} - Uma das 35 origens do jogo, definindo seu passado antes da jornada.`
        } as any; // Cast needed as Origin type might lack 'name' or arrays in old version
    });
};

export const baseOrigens = getOrigens();
