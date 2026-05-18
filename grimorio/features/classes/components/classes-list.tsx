"use client";

import { useState } from "react";
import { Class } from "@/core/types";
import { Search, ChevronRight, Swords, Zap, Heart } from "lucide-react";
import { ClassDetailModal } from "@/features/classes/components/ClassDetailModal";
import { cn } from "@/core/lib/utils";

interface ClassesListProps {
    initialClasses: Class[];
}

export function ClassesList({ initialClasses }: ClassesListProps) {
    const [query, setQuery] = useState("");
    const [selectedAttribute, setSelectedAttribute] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    const filteredClasses = initialClasses.filter(c => {
        const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
        const keyAttr = c.atributo_chave || "Variável";
        const matchesAttr = selectedAttribute ? keyAttr === selectedAttribute : true;

        return matchesQuery && matchesAttr;
    });

    const uniqueAttrs = Array.from(new Set(initialClasses.map(c => c.atributo_chave || "Variável"))).sort();

    return (
        <div className="w-full space-y-12">

            {/* Filtros em Estilo Manual do Aventureiro */}
            <div className="bg-[#0D0202]/60 backdrop-blur-md border border-[#A6894A]/30 p-8 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />
                
                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A6894A] opacity-50" />
                        <input
                            type="text"
                            placeholder="Consultar manuais de treinamento..."
                            className="w-full bg-black/40 border-b border-[#A6894A]/20 py-4 pl-12 pr-4 outline-none font-display text-sm uppercase tracking-widest text-[#E8DCC4] placeholder:text-[#A6894A]/30 focus:border-[#8B0000] transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="text-[10px] font-display font-bold text-[#A6894A] uppercase tracking-widest whitespace-nowrap">Atributo Chave:</span>
                        <select
                            className="flex-1 md:w-48 bg-black/40 border border-[#A6894A]/20 p-3 text-[#A6894A] font-serif text-sm outline-none focus:border-[#8B0000] rounded-sm appearance-none"
                            value={selectedAttribute}
                            onChange={(e) => setSelectedAttribute(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {uniqueAttrs.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de Classes - Pergaminhos Marciais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredClasses.map((cl) => (
                    <div
                        key={cl.id}
                        className="group relative h-[420px] rounded-lg border border-[var(--color-gold-aged)] bg-parchment flex flex-col transition-all duration-300 cursor-pointer hover:border-[#A6894A] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(139,0,0,0.5),0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden active:scale-[0.98]"
                        onClick={() => setSelectedClass(cl)}
                    >
                        <div className="p-6 flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-display font-bold text-[#1A1A1A] group-hover:text-[#8B0000] transition-colors uppercase tracking-tight leading-none">
                                    {cl.name}
                                </h3>
                                <span className="bg-[#8B0000] text-[#E8DCC4] text-[9px] font-display font-bold px-2 py-1 rotate-2 shadow-lg tracking-widest uppercase">
                                    {cl.atributo_chave || "Flex"}
                                </span>
                            </div>

                            {/* Métrica de Progressão */}
                            <div className="grid grid-cols-3 gap-1 mb-6 text-center">
                                <div className="bg-black/5 p-2 border border-[#A6894A]/20">
                                    <span className="block text-[8px] text-[#8B0000] uppercase font-display font-bold">PV INICIAL</span>
                                    <span className="text-lg font-display font-bold text-[#1A1A1A] leading-none">{cl.pv_inicial}</span>
                                </div>
                                <div className="bg-black/5 p-2 border border-[#A6894A]/20 font-serif">
                                    <span className="block text-[8px] text-text-dark/40 uppercase font-display font-bold">PV/NVL</span>
                                    <span className="text-lg font-display font-bold text-text-dark/60 leading-none">+{cl.pv_nivel}</span>
                                </div>
                                <div className="bg-black/5 p-2 border border-[#A6894A]/20">
                                    <span className="block text-[8px] text-blue-700 uppercase font-display font-bold">PM/NVL</span>
                                    <span className="text-lg font-display font-bold text-blue-800 leading-none">+{cl.pm_nivel}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1 overflow-hidden">
                                {cl.abilities.slice(0, 3).map((ab, i) => (
                                    <div key={i} className="text-[11px] text-text-dark/70 font-serif border-l-2 border-[#8B0000]/20 pl-3">
                                        <span className="text-[#8B0000] font-display font-bold uppercase tracking-tight block">{ab.name}</span>
                                        <span className="italic opacity-80 line-clamp-2 leading-tight">{ab.description}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto flex justify-between items-center pt-4 border-t border-[var(--color-gold-aged)]/20">
                                <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-[#A6894A] opacity-60 group-hover:opacity-100 transition-opacity">Caminho de Sangue</span>
                                <ChevronRight className="w-4 h-4 text-[#8B0000] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                        </div>

                        {/* Decorative Corners */}
                        <div className="absolute top-2 left-2 size-2 border-t border-l border-[#A6894A]/20" />
                        <div className="absolute bottom-2 right-2 size-2 border-b border-r border-[#A6894A]/20" />
                    </div>
                ))}
            </div>

            {filteredClasses.length === 0 && (
                <div className="text-center py-32 bg-black/20 border border-[#A6894A]/20 rounded-lg">
                    <Swords className="w-12 h-12 mx-auto mb-4 text-[#A6894A]/20" />
                    <p className="font-display text-xl text-[#A6894A]/30 uppercase tracking-[0.3em]">Doutrina Não Encontrada</p>
                </div>
            )}

            {selectedClass && (
                <ClassDetailModal
                    fighterClass={selectedClass}
                    onClose={() => setSelectedClass(null)}
                />
            )}
        </div>
    );
}

