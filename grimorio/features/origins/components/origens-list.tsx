"use client";

import { useState } from "react";
import { Origin } from "@/core/types";
import { Search, Sparkles, MapPin, ChevronRight } from "lucide-react";
import { OriginDetailModal } from "@/features/origins/components/OriginDetailModal";
import { cn } from "@/core/lib/utils";

interface OrigensListProps {
    initialOrigens: Origin[];
}

export function OrigensList({ initialOrigens }: OrigensListProps) {
    const [query, setQuery] = useState("");
    const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);

    const filteredOrigens = initialOrigens.filter(o =>
        o.nome.toLowerCase().includes(query.toLowerCase()) ||
        o.beneficios?.some(b => b.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="w-full space-y-12">

            {/* Relatos de Viagem: Filtros */}
            <div className="rule-box bg-arton-rulebox border-arton-gold/10 py-8 px-6">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-arton-gold opacity-50" />
                    <input
                        type="text"
                        placeholder="Pesquisar registros de origem e passado..."
                        className="w-full pl-12 pr-4 py-3 bg-arton-black/40 border-b border-arton-gold/30 focus:border-arton-red outline-none font-serif text-arton-gold placeholder:text-arton-gold/20 uppercase tracking-widest"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid de Origens - Mapas do Passado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredOrigens.map((origem) => (
                    <div
                        key={origem.id}
                        className="group relative cursor-pointer"
                        onClick={() => setSelectedOrigin(origem)}
                    >
                        <div className="absolute inset-0 bg-arton-gold/5 translate-x-1 translate-y-1 opacity-0 group-hover:opacity-10 transition-all border border-arton-gold" />

                        <div className="rule-box h-full flex flex-col p-6 transition-all group-hover:border-arton-gold group-hover:-translate-y-1 border-white/5 bg-arton-black/40">
                            <div className="flex flex-col gap-1 mb-4">
                                <MapPin className="w-4 h-4 text-arton-gold/40 group-hover:text-arton-gold transition-colors mb-1" />
                                <h3 className="text-xl font-serif font-black text-white group-hover:text-arton-gold transition-colors uppercase tracking-tight">
                                    {origem.nome}
                                </h3>
                            </div>

                            <div className="text-[10px] text-gray-500 font-serif italic mb-6 line-clamp-3">
                                {origem.descricao || "Uma história moldada pelos ventos de Arton..."}
                            </div>

                            <div className="mt-auto space-y-2">
                                <div className="flex flex-wrap gap-1">
                                    {origem.beneficios?.slice(0, 2).map((ben, i) => (
                                        <span key={i} className="text-[8px] bg-arton-red/10 border border-arton-red/20 px-1 py-0.5 rounded text-arton-red font-black uppercase tracking-tighter">
                                            {ben.substring(0, 12)}
                                        </span>
                                    ))}
                                    {(origem.beneficios?.length || 0) > 2 && (
                                        <span className="text-[8px] text-gray-600 font-bold">+{((origem.beneficios?.length || 0) - 2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">{origem.itens?.length || 0} Itens</span>
                                    <ChevronRight className="w-3 h-3 text-arton-red group-hover:text-arton-gold" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredOrigens.length === 0 && (
                <div className="text-center py-32 opacity-20">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-serif text-xl uppercase tracking-widest">Passado Esquecido.</p>
                </div>
            )}

            {selectedOrigin && (
                <OriginDetailModal
                    origin={selectedOrigin}
                    onClose={() => setSelectedOrigin(null)}
                />
            )}
        </div>
    );
}
