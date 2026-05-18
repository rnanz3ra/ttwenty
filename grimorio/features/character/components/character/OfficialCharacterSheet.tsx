
"use client";

import React from 'react';
import { cn } from "@/core/lib/utils";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import {
    Heart,
    Zap,
    Shield,
    Sword,
    Skull,
    Ghost,
    Sparkles,
    User as UserIcon,
    Dices
} from "lucide-react";
import { CharacterSheet, AttributeBonus } from "@/core/types";
import { calculateSkillTotal, calculateDefense } from "@/features/character/services/character-utils";
import { motion } from "framer-motion";
import { getPartnerRules } from "@/core/lib/data";

interface OfficialCharacterSheetProps {
    character: CharacterSheet & {
        tibares: number;
        partners: { tipo: string; patamar: 'Iniciante' | 'Veterano' | 'Mestre' }[];
        restCondition: 'Pobre' | 'Médio' | 'Rico' | 'Luxuoso' | null;
        setTibares: (val: number) => void;
        addPartner: (p: any) => void;
        removePartner: (i: number) => void;
        setRestCondition: (c: any) => void;
        setManaSacrifice?: (val: number) => void;
        identifyItem?: (i: number) => void;
    };
}

const ATTRIBUTES = [
    { key: 'for', label: 'FOR' },
    { key: 'des', label: 'DES' },
    { key: 'con', label: 'CON' },
    { key: 'int', label: 'INT' },
    { key: 'sab', label: 'SAB' },
    { key: 'car', label: 'CAR' },
] as const;

export function OfficialCharacterSheet({ character }: OfficialCharacterSheetProps) {
    const halfLevel = Math.floor(character.level / 2);

    // Calcular Atributos Finais (Base + Bônus Raciais)
    const finalAttributes: AttributeBonus = { ...character.attributes };
    if (character.race?.bonus) {
        Object.entries(character.race.bonus).forEach(([k, v]) => {
            const key = k as keyof AttributeBonus;
            if (finalAttributes[key] !== undefined) {
                finalAttributes[key] += v || 0;
            }
        });
    }

    const defenseTotal = calculateDefense(finalAttributes.des);

    // Bônus de Parceiro Combatente
    const partnerAttackBonus = character.partners.some(p => p.tipo === "Combatente") ? 2 : 0;

    const partnerRules = getPartnerRules();

    return (
        <div className="bg-[#0a0a0a] p-6 md:p-10 text-white font-sans border-[6px] border-[#8b0000] shadow-[0_0_50px_rgba(139,0,0,0.3)] max-w-5xl mx-auto rounded-xl relative overflow-hidden">
            {/* TEXTURA DE PAPEL ENVELHECIDO */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")' }} />

            {/* CABEÇALHO OFICIAL */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 border-b-2 border-[#8b0000]/50 pb-8">
                <div className="md:col-span-2 space-y-4">
                    <div className="group">
                        <label className="text-[#8b0000] text-[10px] uppercase font-black tracking-[0.2em] mb-1 block">Nome do Herói</label>
                        <div className="text-3xl font-serif font-black border-b border-zinc-800 pb-1 group-hover:border-[#c5a059] transition-colors">
                            {character.name || "Aventureiro de Arton"}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Raça</label>
                            <div className="text-sm font-semibold border-b border-zinc-900">{character.race?.name || "---"}</div>
                        </div>
                        <div>
                            <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Classe</label>
                            <div className="text-sm font-semibold border-b border-zinc-900">{character.class?.name || "---"}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-center bg-zinc-900/50 p-3 rounded border border-zinc-800">
                        <label className="text-[#8b0000] text-[10px] uppercase font-black tracking-widest block mb-1">Nível de Poder</label>
                        <div className="text-4xl font-serif font-black text-white">{character.level}</div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-16 h-16 border-2 border-[#c5a059] rotate-45 flex items-center justify-center bg-black/40">
                        <div className="-rotate-45 font-black text-[#c5a059]">T20</div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-[#8b0000]">Tormenta 20 Oficial</span>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* COLUNA DA ESQUERDA: ATRIBUTOS E COMBATE */}
                <div className="lg:col-span-8 space-y-8">

                    {/* ATRIBUTOS (HEXÁGONOS) */}
                    <div className="flex flex-wrap justify-around bg-red-950/5 p-6 border-y border-[#8b0000]/20 rounded backdrop-blur-sm">
                        {ATTRIBUTES.map(atr => {
                            const val = (finalAttributes as any)[atr.key];
                            return (
                                <motion.div
                                    key={atr.key}
                                    whileHover={{ scale: 1.1 }}
                                    className="text-center group p-2"
                                >
                                    <div className="text-[#c5a059] font-black text-[10px] tracking-widest mb-2 group-hover:text-white transition-colors uppercase">{atr.label}</div>
                                    <div className="w-16 h-16 border-[3px] border-[#8b0000] rotate-45 flex items-center justify-center bg-arton-black shadow-[0_0_15px_rgba(139,0,0,0.2)] group-hover:border-[#c5a059] transition-all relative">
                                        <span className="-rotate-45 text-2xl font-black font-serif text-white">
                                            {val >= 0 ? `+${val}` : val}
                                        </span>
                                        {/* Pequeno detalhe metálico nos cantos */}
                                        <div className="absolute top-0 right-0 w-1 h-1 bg-[#c5a059]" />
                                        <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#c5a059]" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* PV E PM (DESIGN DE CRISTAIS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pontos de Vida */}
                        <div className="relative bg-red-950/20 border-2 border-[#8b0000] p-5 rounded-lg overflow-hidden group">
                            <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#8b0000] rotate-45 opacity-20" />
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[#ff4444] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Heart className="w-4 h-4" /> Energia Vital (PV)
                                </h4>
                                <span className="text-xs text-zinc-500 font-bold">Máximo {character.hp.max || "---"}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black font-serif text-white drop-shadow-md">{character.hp.current || 0}</span>
                                <div className="h-4 w-full bg-black/60 rounded-full border border-[#8b0000]/40 overflow-hidden mt-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: character.hp.max > 0 ? `${(character.hp.current / character.hp.max) * 100}%` : 0 }}
                                        className="h-full bg-gradient-to-r from-[#8b0000] to-[#ff0000] shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pontos de Mana */}
                        <div className="relative bg-blue-950/20 border-2 border-blue-900 p-5 rounded-lg overflow-hidden group">
                            <div className="absolute -left-4 -top-4 w-12 h-12 bg-blue-900 rotate-45 opacity-20" />
                            <div className="flex justify-between items-center mb-4 text-blue-400">
                                <h4 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Pontos de Mana (PM)
                                </h4>
                                <span className="text-xs text-zinc-500 font-bold">Reserva {character.pm.max || "---"}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black font-serif text-white drop-shadow-md">{character.pm.current || 0}</span>
                                <div className="h-4 w-full bg-black/60 rounded-full border border-blue-900/40 overflow-hidden mt-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: character.pm.max > 0 ? `${(character.pm.current / character.pm.max) * 100}%` : 0 }}
                                        className="h-full bg-gradient-to-r from-blue-900 to-blue-500 shadow-[0_0_15px_rgba(0,0,255,0.3)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DEFESA OFICIAL */}
                    <div className="border-2 border-[#c5a059]/30 bg-zinc-900/40 p-6 rounded-lg backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="text-center relative">
                                <div className="w-20 h-20 border-4 border-[#c5a059] rotate-45 flex items-center justify-center bg-black shadow-xl">
                                    <span className="-rotate-45 text-4xl font-black text-[#c5a059]">
                                        {defenseTotal}
                                    </span>
                                </div>
                                <div className="text-[10px] uppercase text-[#c5a059] font-black mt-4 tracking-widest">Defesa</div>
                            </div>
                            <div className="flex-1 text-zinc-500 text-[10px] md:text-xs uppercase font-black grid grid-cols-5 gap-2 text-center items-center">
                                <div className="bg-black/40 p-2 border border-zinc-800 rounded">10<br /><span className="text-[8px] opacity-50">BASE</span></div>
                                <div className="text-xl">+</div>
                                <div className="bg-black/40 p-2 border border-zinc-800 rounded">{finalAttributes.des}<br /><span className="text-[8px] opacity-50">DES</span></div>
                                <div className="text-xl">+</div>
                                <div className="bg-black/40 p-2 border border-zinc-800 rounded">0<br /><span className="text-[8px] opacity-50">EXTRAS</span></div>
                            </div>
                        </div>
                    </div>

                    {/* ATAQUES */}
                    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black/40">
                        <table className="w-full text-left text-xs font-serif">
                            <thead className="bg-[#8b0000]/20 text-[#c5a059] uppercase font-black tracking-widest border-b border-[#8b0000]/30">
                                <tr>
                                    <th className="p-4">Arma de Ataque</th>
                                    <th className="p-4 text-center">Teste</th>
                                    <th className="p-4 text-center">Dano</th>
                                    <th className="p-4 text-center">Crítico</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {character.inventory.length > 0 ? character.inventory.map((item, idx) => {
                                    const isObj = typeof item !== 'string';
                                    const itemName = !isObj ? item : item.identificado ? item.nome : "Item Misterioso (?)";
                                    const encantos = isObj && item.encantos ? item.encantos.join(", ") : "";
                                    const isIdentified = !isObj || item.identificado;

                                    return (
                                        <tr key={idx} className="hover:bg-white/5 cursor-pointer transition-colors group">
                                            <td className="p-4 flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <Sword className="w-4 h-4 text-[#8b0000] group-hover:rotate-12 transition-transform" />
                                                    <span className="font-bold text-white text-sm">{itemName}</span>
                                                </div>
                                                {encantos && <span className="text-[10px] text-[#c5a059] italic ml-7 text-xs">{encantos}</span>}
                                                {isObj && !item.identificado && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const roll = Math.floor(Math.random() * 20) + 1;
                                                            const misticismoBonus = calculateSkillTotal(character.level, finalAttributes.int, true);
                                                            // CD 20 (Simples para identificar itens comuns)
                                                            if (roll + misticismoBonus >= 20) {
                                                                alert(`Misticismo: ${roll} + ${misticismoBonus} = ${roll + misticismoBonus}\nSucesso! Item identificado.`);
                                                                character.identifyItem?.(idx);
                                                            } else {
                                                                alert(`Misticismo: ${roll} + ${misticismoBonus} = ${roll + misticismoBonus}\nFalha! Você não conseguiu compreender o item...`);
                                                            }
                                                        }}
                                                        className="w-20 ml-7 text-[8px] bg-blue-900/50 hover:bg-blue-700 border border-blue-500/30 text-white rounded px-1 py-1 uppercase font-black tracking-widest transition-colors mt-1"
                                                    >
                                                        Identificar
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4 text-center text-xl font-black text-[#c5a059]">
                                                {isIdentified ? `+${finalAttributes.for + halfLevel + partnerAttackBonus}` : "???"}
                                                {isIdentified && partnerAttackBonus > 0 && <span className="text-[10px] block text-green-500 font-sans">Aliado +{partnerAttackBonus}</span>}
                                            </td>
                                            <td className="p-4 text-center text-red-500 font-bold bg-red-950/10 tracking-widest">
                                                {isIdentified ? "---" : "???"}
                                            </td>
                                            <td className="p-4 text-center text-zinc-400 italic">
                                                {isIdentified ? "---" : "???"}
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={4} className="p-10 text-center text-zinc-600 italic uppercase tracking-widest text-[10px]">Prepare seu arsenal no Construtor...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* COLUNA DA DIREITA: PERÍCIAS */}
                <div className="lg:col-span-4 border-l-2 border-[#8b0000]/30 pl-6 space-y-4">
                    <h3 className="text-[#8b0000] font-black text-xs uppercase tracking-[0.3em] mb-6 border-b border-[#8b0000]/20 pb-3 flex items-center gap-2">
                        <Dices className="w-4 h-4" /> Perícias de Arton
                    </h3>

                    <div className="space-y-1 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                        {character.skills.map(skillName => {
                            // Mapeamento simplificado de perícia -> atributo
                            // Em um sistema real, isso viria de uma tabela de perícias
                            const skillAttrMap: Record<string, keyof AttributeBonus> = {
                                "Luta": "for", "Pontaria": "des", "Fortitude": "con", "Reflexos": "des", "Vontade": "sab",
                                "Iniciativa": "des", "Percepção": "sab", "Misticismo": "int", "Religião": "sab", "Diplomacia": "car"
                            };
                            const attrKey = skillAttrMap[skillName] || "int";
                            const attrVal = finalAttributes[attrKey];
                            const total = calculateSkillTotal(character.level, attrVal, true);

                            return (
                                <div
                                    key={skillName}
                                    className="flex justify-between items-center text-[12px] group cursor-pointer hover:bg-[#8b0000]/10 p-2 rounded transition-all border-b border-zinc-900/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-500 font-black text-[10px] w-6">✯</span>
                                        <span className="text-zinc-400 group-hover:text-white transition-colors uppercase font-bold tracking-tighter">
                                            {skillName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] text-zinc-600 font-mono">
                                            ({halfLevel}+{attrVal}+2)
                                        </span>
                                        <div className="w-10 h-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-[#c5a059] font-black text-sm group-hover:border-[#c5a059] transition-all">
                                            +{total}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {character.skills.length === 0 && (
                            <p className="text-zinc-700 text-[10px] uppercase italic text-center py-10">Você ainda não treinou perícias...</p>
                        )}
                    </div>

                    <div className="mt-8 p-4 bg-zinc-950 border border-zinc-900 rounded italic text-[10px] text-zinc-600 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-arton-gold font-black">✯</span>
                            <span>Somente treinado (Somado bônus de treino)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-arton-red font-black">✠</span>
                            <span>Aplica penalidade de carga/armadura</span>
                        </div>
                        <p className="pt-2 border-t border-zinc-900">
                            Fórmula: Metade do Nível ({halfLevel}) + Atributo + Treino + Outros.
                        </p>
                    </div>

                    {/* MÓDULO DE CAMPANHA: PARCEIROS E TIBARES */}
                    <div className="mt-8 space-y-6">
                        <div className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[#c5a059] font-black text-[10px] uppercase tracking-widest">Tesouros (Tibares)</h4>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={character.tibares}
                                        onChange={(e) => character.setTibares(Number(e.target.value))}
                                        className="w-20 bg-black border border-zinc-800 rounded px-2 py-1 text-sm text-right text-arton-gold font-mono"
                                    />
                                    <span className="text-arton-gold font-bold">T$</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-lg">
                            <h4 className="text-[#c5a059] font-black text-[10px] uppercase tracking-widest mb-4">Parceiros e Montarias</h4>
                            <div className="space-y-3">
                                {character.partners.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-2 rounded border border-zinc-800 group">
                                        <div>
                                            <div className="text-white text-xs font-bold">{p.tipo} <span className="text-[10px] text-zinc-500">({p.patamar})</span></div>
                                            <div className="text-[9px] text-zinc-400 italic">Bônus ativo aplicado.</div>
                                        </div>
                                        <button
                                            onClick={() => character.removePartner(i)}
                                            className="text-red-900 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                        >
                                            <Skull className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {character.partners.length === 0 && (
                                    <button
                                        onClick={() => character.addPartner({ tipo: "Combatente", patamar: "Iniciante" })}
                                        className="w-full py-2 border border-dashed border-zinc-800 rounded text-[10px] text-zinc-600 uppercase hover:text-[#c5a059] hover:border-[#c5a059] transition-all"
                                    >
                                        + Adicionar Parceiro
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#8b0000]/5 border border-[#8b0000]/20 p-4 rounded-lg">
                            <h4 className="text-arton-red font-black text-[10px] uppercase tracking-widest mb-4">Descanso e Custo de Vida</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {['Pobre', 'Médio', 'Rico', 'Luxuoso'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => {
                                            const costs = { 'Pobre': 0, 'Médio': 10, 'Rico': 50, 'Luxuoso': 100 };
                                            const cost = costs[mode as keyof typeof costs];
                                            if (character.tibares >= cost) {
                                                character.setTibares(character.tibares - cost);
                                                character.setRestCondition(mode as any);
                                            }
                                        }}
                                        className={cn(
                                            "flex flex-col items-center p-2 rounded border transition-all text-[10px]",
                                            character.restCondition === mode
                                                ? "bg-arton-red border-arton-red text-white"
                                                : "bg-black border-zinc-800 text-zinc-500 hover:border-arton-red"
                                        )}
                                    >
                                        <span className="font-bold">{mode}</span>
                                        <span className="opacity-50">{mode === 'Pobre' ? '0 T$' : `${mode === 'Médio' ? 10 : mode === 'Rico' ? 50 : 100} T$`}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* BARRA INFERIOR DE SACRIFÍCIO E XP */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t-2 border-[#8b0000]/30">
                <div className="bg-[#8b0000]/10 border border-[#8b0000]/30 p-6 rounded-lg relative overflow-hidden group">
                    <div className="absolute -left-4 -top-4 w-16 h-16 bg-[#8b0000] rotate-45 opacity-20 group-hover:scale-150 transition-transform" />
                    <h4 className="text-arton-red font-black text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2 relative z-10">
                        <Zap className="w-4 h-4" /> Sacrifício de Poder
                    </h4>
                    <p className="text-[10px] text-zinc-400 mb-6 italic leading-relaxed relative z-10 pr-12">
                        Criar itens mágicos permanentes exige um sacrifício terrível de sua essência (Pág. 334). O PM sacrificado é reduzido do seu máximo permanentemente.
                    </p>
                    <div className="flex justify-between items-center relative z-10">
                        <span className="text-xs font-bold text-white uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded border border-white/5">
                            PM Reduzido: <span className="text-arton-red font-black text-xl ml-2">{character.manaSacrifice || 0}</span>
                        </span>
                        <button
                            onClick={() => {
                                if (confirm("Deseja criar um item mágico permanente? Isso reduzirá seu PM máximo em 1 permanentemente! (Pág. 334)")) {
                                    character.setManaSacrifice?.((character.manaSacrifice || 0) + 1);
                                }
                            }}
                            className="bg-arton-red hover:bg-[#8b0000] text-white text-[10px] uppercase font-black px-4 py-2 border border-red-500/50 rounded transition-all shadow-[0_0_15px_rgba(139,0,0,0.5)] hover:scale-105"
                        >
                            Forjar Item
                        </button>
                    </div>
                </div>

                <div className="bg-[#c5a059]/10 border border-[#c5a059]/30 p-6 rounded-lg relative overflow-hidden">
                    <h4 className="text-[#c5a059] font-black text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Evolução (XP)
                    </h4>
                    <p className="text-[10px] text-zinc-400 mb-6 italic leading-relaxed pr-12">
                        Experiência adquirida através de combates e desafios. A cada patamar de XP, o herói eleva suas capacidades para enfrentar ameaças maiores.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-black/60 h-8 rounded-full border border-[#c5a059]/40 overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '50%' }} // Placeholder para % real baseada na tabela
                                className="h-full bg-gradient-to-r from-[#c5a059]/50 to-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white mix-blend-difference">
                                {character.xp || 0} XP
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-black border-2 border-[#c5a059] rotate-45 flex items-center justify-center shrink-0">
                            <span className="-rotate-45 text-[#c5a059] font-black font-serif text-lg">{character.level}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SELO DE ARTON (BACKGROUND DECOR) */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8b0000] rotate-45 translate-x-32 translate-y-32 opacity-5 pointer-events-none" />
            <Sparkles className="absolute top-10 right-10 w-24 h-24 text-[#c5a059] opacity-5 pointer-events-none" />
        </div>
    );
}

