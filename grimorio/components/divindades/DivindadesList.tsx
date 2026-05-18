"use client";

import { useState } from "react";
import { Deity } from "@/core/types";
import { Search, ChevronRight, Sun, Skull, Shield, Sword, Moon, Star, Flame, Droplets, Zap, Eye, Coins, Gavel, Scale, Heart, Sparkles, BookOpen } from "lucide-react";
import { DeityDetailModal } from "./DeityDetailModal";
import { cn } from "@/core/lib/utils";

interface DivindadesListProps {
    initialDeities: Deity[];
}

// Map de ícones para deuses
const getDeityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('azgher')) return Sun;
    if (lower.includes('tenebra') || lower.includes('sszzaas')) return Moon;
    if (lower.includes('khalmyr')) return Scale;
    if (lower.includes('arsenal') || lower.includes('thwor')) return Sword;
    if (lower.includes('lena') || lower.includes('marah')) return Heart;
    if (lower.includes('wynna')) return Sparkles;
    if (lower.includes('tanna-toh')) return BookOpen;
    if (lower.includes('oceano')) return Droplets;
    if (lower.includes('megalokk')) return Skull;
    if (lower.includes('lin-wu')) return Shield;
    if (lower.includes('nimb')) return Zap;
    if (lower.includes('ahradak')) return Eye;
    if (lower.includes('thyatis')) return Flame;
    if (lower.includes('kallyadranoch')) return Coins;

    return Star;
};

export function DivindadesList({ initialDeities }: DivindadesListProps) {
    const [query, setQuery] = useState("");
    const [selectedDeity, setSelectedDeity] = useState<Deity | null>(null);

    const filteredDeities = initialDeities.filter(d =>
        d.nome.toLowerCase().includes(query.toLowerCase()) ||
        d.titulo.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="w-full space-y-12">

            {/* Filtros em Estilo Altar do Panteão */}
            <div className="rule-box bg-arton-rulebox border-arton-gold/10 py-8 px-6 shadow-2xl">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-arton-gold opacity-50" />
                    <input
                        type="text"
                        placeholder="Pesquisar pelos Vinte Deuses do Panteão..."
                        className="w-full pl-12 pr-4 py-3 bg-arton-black/40 border-b border-arton-gold/30 focus:border-arton-red outline-none font-serif text-arton-gold placeholder:text-arton-gold/20 uppercase tracking-[0.2em] transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid de Ícones e Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDeities.map((deity) => {
                    const Icon = getDeityIcon(deity.nome);
                    return (
                        <div
                            key={deity.id}
                            className="group relative cursor-pointer"
                            onClick={() => setSelectedDeity(deity)}
                        >
                            {/* Papel de Fundo com Borda Gold */}
                            <div className="absolute inset-0 bg-arton-gold translate-x-1 translate-y-1 opacity-0 group-hover:opacity-10 transition-all" />

                            <div className="rule-box h-full flex flex-col p-6 transition-all group-hover:border-arton-gold group-hover:-translate-y-1 border-arton-red/20 bg-arton-black/60">

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-arton-black border border-arton-gold/20 text-arton-gold group-hover:scale-110 group-hover:bg-arton-red group-hover:text-white transition-all shadow-brutalist-sm">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-serif font-black text-white group-hover:text-arton-gold transition-colors uppercase tracking-tight leading-none">
                                            {deity.nome}
                                        </h3>
                                        <span className="text-[9px] font-sans italic text-gray-500 uppercase tracking-widest">
                                            {deity.titulo}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs font-sans text-gray-400 italic mb-6 line-clamp-3 leading-relaxed border-l border-arton-gold/10 pl-4">
                                    "{deity.lore.substring(0, 150)}..."
                                </p>

                                <div className="mt-auto space-y-3">
                                    <div className="flex flex-wrap gap-1">
                                        {deity.poderes.slice(0, 2).map((p, i) => (
                                            <span key={i} className="text-[9px] bg-arton-red/10 border border-arton-red/20 px-2 py-0.5 text-arton-red font-black uppercase">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                        <span className="text-[10px] font-black uppercase text-arton-gold opacity-50 group-hover:opacity-100 transition-opacity tracking-widest">Ouvir Dogma</span>
                                        <ChevronRight className="w-4 h-4 text-arton-red" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredDeities.length === 0 && (
                <div className="text-center py-32 border-2 border-dashed border-arton-gold/10 grayscale opacity-40">
                    <Sparkles className="w-16 h-16 mx-auto mb-6 text-arton-gold" />
                    <p className="text-2xl font-serif text-arton-gold uppercase tracking-[0.3em]">Céus Vazios.</p>
                </div>
            )}

            {selectedDeity && (
                <DeityDetailModal
                    deity={selectedDeity}
                    onClose={() => setSelectedDeity(null)}
                />
            )}
        </div>
    );
}
