"use client";

import { useState } from "react";
import { Race } from "@/core/types";
import { Search, ChevronRight } from "lucide-react";
import { RaceDetailModal } from "@/features/races/components/RaceDetailModal";
import { cn } from "@/core/lib/utils";

interface RacesListProps {
    initialRaces: Race[];
}

export function RacesList({ initialRaces }: RacesListProps) {
    const [query, setQuery] = useState("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);

    const filteredRaces = initialRaces.filter(race => {
        const matchesQuery = race.name.toLowerCase().includes(query.toLowerCase());
        const sizeFallback = race.tamanho || "Médio";
        const matchesSize = selectedSize ? sizeFallback === selectedSize : true;

        return matchesQuery && matchesSize;
    });

    const uniqueSizes = Array.from(new Set(initialRaces.map(r => r.tamanho || "Médio"))).sort();

    return (
        <div className="w-full space-y-12">

            {/* Painel de Filtros Diegético */}
            <div className="bg-[#0D0202]/60 backdrop-blur-md border border-[#A6894A]/30 p-8 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />
                
                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A6894A] opacity-50" />
                        <input
                            type="text"
                            placeholder="Pesquisar raças ancestrais..."
                            className="w-full bg-black/40 border-b border-[#A6894A]/20 py-4 pl-12 pr-4 outline-none font-display text-sm uppercase tracking-widest text-[#E8DCC4] placeholder:text-[#A6894A]/30 focus:border-[#8B0000] transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="text-[10px] font-display font-bold text-[#A6894A] uppercase tracking-widest whitespace-nowrap">Tamanho:</span>
                        <select
                            className="flex-1 md:w-48 bg-black/40 border border-[#A6894A]/20 p-3 text-[#A6894A] font-serif text-sm outline-none focus:border-[#8B0000] rounded-sm appearance-none"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {uniqueSizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de Pergaminhos de Raça */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRaces.map((race) => (
                    <div
                        key={race.id}
                        className="group relative h-80 rounded-lg border border-[var(--color-gold-aged)] bg-parchment flex flex-col transition-all duration-300 cursor-pointer hover:border-[#A6894A] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(139,0,0,0.5),0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden active:scale-[0.98]"
                        onClick={() => setSelectedRace(race)}
                    >
                        {/* Card Content */}
                        <div className="p-6 flex flex-col h-full relative">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-display font-bold text-[#1A1A1A] group-hover:text-[#8B0000] transition-colors uppercase tracking-tight leading-none">
                                    {race.name}
                                </h3>
                                <span className="text-[9px] font-display font-bold text-[#8B0000] border border-[#8B0000]/30 px-2 py-0.5 uppercase tracking-widest">
                                    {race.tamanho || "Médio"}
                                </span>
                            </div>

                            <p className="font-serif text-[14px] text-text-dark/80 italic line-clamp-3 leading-relaxed mb-6">
                                &ldquo;{race.description}&rdquo;
                            </p>

                            {/* Attributes Mini-Rulebox */}
                            <div className="mt-auto pt-4 border-t border-[var(--color-gold-aged)]/20 grid grid-cols-6 gap-1">
                                {['for', 'des', 'con', 'int', 'sab', 'car'].map((attr) => {
                                    const val = race.bonus?.[attr as keyof typeof race.bonus];
                                    return (
                                        <div key={attr} className="flex flex-col items-center">
                                            <span className="text-[8px] uppercase font-display font-bold text-text-dark/40">{attr}</span>
                                            <span className={cn(
                                                "text-[11px] font-display font-bold",
                                                (val ?? 0) > 0 ? "text-[#8B0000]" :
                                                    (val ?? 0) < 0 ? "text-blue-700" : "text-text-dark/40"
                                            )}>
                                                {(val ?? 0) > 0 ? `+${val}` : (val ?? 0)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <ChevronRight className="w-4 h-4 text-[#8B0000] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                        </div>

                        {/* Decorative Corners */}
                        <div className="absolute top-2 left-2 size-2 border-t border-l border-[#A6894A]/20" />
                        <div className="absolute bottom-2 right-2 size-2 border-b border-r border-[#A6894A]/20" />
                    </div>
                ))}
            </div>

            {filteredRaces.length === 0 && (
                <div className="text-center py-32 border-2 border-dashed border-[#A6894A]/20 bg-black/20 rounded-lg">
                    <p className="text-2xl font-display text-[#A6894A]/30 italic uppercase tracking-[0.3em]">Linhagem Não Encontrada</p>
                </div>
            )}

            {selectedRace && (
                <RaceDetailModal
                    race={selectedRace}
                    onClose={() => setSelectedRace(null)}
                />
            )}
        </div>
    );
}

