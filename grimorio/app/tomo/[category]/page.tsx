"use client";

import { BookmarkButton } from "@/components/layout/BookmarkButton";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { Sparkles, Gavel, Shield, Heart, Zap, Scroll, Ghost, Sword, Info, Search } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import personagemData from "@/data/personagem.json";
import spellsData from "@/data/magias.json";
import deitiesData from "@/data/lotes_legado/personagem/divindades.json";
import { SpellScroll } from "@/features/spells/components/SpellScroll";

export default function TomoPage() {
    const params = useParams();
    const category = params.category as string;
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [circuloAtivo, setCirculoAtivo] = useState<number>(1);
    const [schoolFilter, setSchoolFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    let data: any[] = [];
    let title = "";
    let isSpell = category === "magias";
    let isRaca = category === "racas";
    let isClasse = category === "classes";
    let isDeity = category === "divindades";

    if (isRaca) { data = Object.values(personagemData.races); title = "Tomo de Raças"; }
    else if (isClasse) { data = Object.values(personagemData.classes); title = "Tomo de Classes"; }
    else if (isSpell) { data = spellsData; title = "Grimório de Magias"; }
    else if (isDeity) { data = Object.values(deitiesData) as any[]; title = "Tomo de Divindades"; }

    // Aplicar Filtros se for Magia
    if (isSpell) {
        // Primeiro filtra por círculo
        data = data.filter(s => (s.circle || s.circulo) === circuloAtivo);

        if (schoolFilter !== null) {
            data = data.filter(s => (s.school || s.escola || s.regras_tecnicas?.escola)?.includes(schoolFilter));
        }
        if (searchTerm) {
            data = data.filter(s => (s.name || s.nome).toLowerCase().includes(searchTerm.toLowerCase()));
        }
    }

    const schools = ["Abjuração", "Convocação", "Encantamento", "Evocação", "Ilusão", "Necromancia", "Transmutação"];

    // Por padrão seleciona o primeiro se não houver um selecionado
    const current = selectedItem || data[0];

    if (!current) return <div>Carregando...</div>;

    return (
        <div className="min-h-screen bg-arton-black py-20 px-4 md:px-20 relative">
            <BookmarkButton />

            <div className="max-w-7xl mx-auto space-y-12">
                <HeaderFrame className="z-10">
                    {title}
                </HeaderFrame>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filtros de Couro (Apenas para Magias) */}
                    {isSpell && (
                        <div className="flex flex-col gap-4 lg:w-48 order-last lg:order-first">
                            <h4 className="text-[10px] font-black text-arton-gold uppercase tracking-[0.3em] mb-2 opacity-50 px-2">Círculos</h4>
                            <div className="grid grid-cols-5 lg:flex lg:flex-col gap-1">
                                {[1, 2, 3, 4, 5].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => {
                                            setCirculoAtivo(c);
                                            setSelectedItem(null);
                                            setSearchTerm("");
                                        }}
                                        className={cn(
                                            "relative h-10 flex items-center justify-center font-serif font-black transition-all",
                                            "before:absolute before:inset-0 before:bg-[#3d2b1f] before:shadow-lg before:border-r-4 before:border-black/40",
                                            circuloAtivo === c ? "translate-x-2 before:bg-[#5c3d2e] brightness-125" : "hover:translate-x-1"
                                        )}
                                    >
                                        <span className="relative z-10 text-white text-xs">Círculo {c}</span>
                                    </button>
                                ))}
                            </div>

                            <h4 className="text-[10px] font-black text-arton-gold uppercase tracking-[0.3em] mt-8 mb-2 opacity-50 px-2">Escolas</h4>
                            <div className="grid grid-cols-2 lg:flex lg:flex-col gap-1">
                                {schools.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setSchoolFilter(schoolFilter === s ? null : s); setSelectedItem(null); }}
                                        className={cn(
                                            "relative py-2 px-4 flex items-center font-serif font-black text-[10px] transition-all uppercase tracking-tighter",
                                            "before:absolute before:inset-0 before:bg-[#2e1f14] before:shadow-lg before:border-r-4 before:border-black/40",
                                            schoolFilter === s ? "translate-x-2 before:bg-[#4d3321] brightness-125" : "hover:translate-x-1"
                                        )}
                                    >
                                        <span className="relative z-10 text-gray-300">{s}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lista de Seleção (Índice do Livro) */}
                    <div className="lg:w-1/4 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-arton-gold uppercase tracking-[0.3em] opacity-50">Pesquisar</h4>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar nome..."
                                        className="w-full bg-black/40 border border-zinc-800 rounded p-2 pl-10 text-xs font-serif focus:border-arton-red outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <h4 className="text-[10px] font-black text-arton-gold uppercase tracking-[0.3em] opacity-50">Índice</h4>
                        <div className="space-y-2">
                            {data.map((item) => (
                                        <button
                                            key={item.name || item.nome}
                                            onClick={() => setSelectedItem(item)}
                                            className={cn(
                                                "sidebar-item w-full text-left p-4 border-l-2 transition-all font-serif uppercase text-sm tracking-tighter",
                                                "hover:bg-[var(--bg-sidebar-hover)]",
                                                (current?.name || current?.nome) === (item.name || item.nome)
                                                    ? "active bg-arton-red border-arton-red text-white font-bold shadow-lg brightness-110"
                                                    : "border-[var(--border-item)] text-[var(--sidebar-text)] opacity-70 hover:opacity-100"
                                            )}
                                        >
                                            {item.name || item.nome}
                                        </button>
                            ))}
                            {data.length === 0 && (
                                <p className="text-xs text-zinc-600 italic p-4">Nenhum tomo encontrado com estes critérios...</p>
                            )}
                        </div>
                    </div>

                    {/* CONTEÚDO DIEGÉTICO (O LIVRO OU PERGAMINHO) */}
                    <div className="lg:w-3/4">
                        {isSpell ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current.nome}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SpellScroll spell={current} />
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className={cn(
                                "book-page w-full p-8 md:p-14 min-h-[700px] flex flex-col relative shadow-2xl transform perspective-1000 rotate-y-1"
                            )}>

                                {/* Textura de Fundo Adicional */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply" />

                                <div className="relative mb-10 z-10 flex justify-between items-start">
                                    <div>
                                        <h2 className="font-serif text-4xl font-black uppercase tracking-tighter text-white">
                                            {current.name || current.nome}
                                        </h2>
                                        <p className="text-xs font-sans italic tracking-widest opacity-70 text-arton-gold">
                                            {current.titulo || current.tomo}
                                        </p>
                                    </div>
                                </div>

                                {/* Layout 70/30 */}
                                <div className="flex flex-col md:flex-row gap-12 flex-1 relative z-10">

                                    {/* LORE (70%) */}
                                    <div className="md:w-[70%] space-y-8">
                                        <div className="lore-text drop-cap text-justify leading-relaxed">
                                            {current.lore}
                                        </div>

                                        {/* Habilidades Rodapé */}
                                        {(isRaca || isClasse) && current.habilidades_rodapé && (
                                            <div className="pt-8 border-t border-arton-red/20 space-y-4">
                                                <h3 className="text-arton-red font-serif font-black text-xs uppercase flex items-center gap-2">
                                                    <Sparkles className="w-3 h-3" /> Habilidades de {current.tomo}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {current.habilidades_rodapé.map((h: string, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-3 bg-black/5 p-3 border-l-2 border-arton-gold/30">
                                                            <div className="w-1.5 h-1.5 bg-arton-gold rounded-full" />
                                                            <span className="text-xs font-bold text-gray-300 italic">{h}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* REGRAS (30%) */}
                                    <div className="md:w-[30%] space-y-6">
                                        <div className="rule-box p-6 space-y-6 bg-arton-black/40 border-arton-red/40 shadow-inner">

                                            <h3 className="text-arton-red font-serif font-black text-[10px] uppercase tracking-[0.2em] border-b border-arton-red/20 pb-1 mb-4">
                                                Ficha Técnica
                                            </h3>

                                            {/* Detalhes Técnicos Dinâmicos */}
                                            <div className="space-y-4">
                                                {Object.entries(current.detalhes_tecnicos || {}).map(([key, val]: [string, any]) => (
                                                    <div key={key}>
                                                        <h4 className="text-[9px] font-black text-arton-gold uppercase tracking-tighter opacity-70">{key.replace('_', ' ')}</h4>
                                                        <p className="text-xs font-bold text-white">{val}</p>
                                                    </div>
                                                ))}

                                                {/* Regra específica para Divindades */}
                                                {isDeity && (
                                                    <>
                                                        <div>
                                                            <h4 className="text-[9px] font-black text-arton-gold uppercase tracking-tighter opacity-70">Crenças</h4>
                                                            <p className="text-[10px] italic text-gray-400">{current.crenças}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[9px] font-black text-arton-gold uppercase tracking-tighter opacity-70">Obrigações</h4>
                                                            <p className="text-[10px] italic text-gray-400">{current.obrigacoes}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rodapé Curva de Livro */}
                                <div className="mt-auto pt-8 flex justify-between items-center opacity-30 border-t border-black/5 text-white">
                                    <span className="text-[9px] font-serif uppercase tracking-[0.2em]">O Compêndio de Arton • {current.nome}</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-current rounded-full" />)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .rotate-y-1 { transform: rotateY(-2deg); }
                .text-sepia-900 { color: #433422; }
                .text-sepia-800 { color: #5e4934; }
                .text-sepia-700 { color: #7a5f46; }
            `}</style>
        </div>
    );
}
