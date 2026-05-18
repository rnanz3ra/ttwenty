"use client";

import { useState } from "react";
import { Spell, School, Circle } from "@/core/types";
import { cn } from "@/core/lib/utils";
import { SpellDetailModal } from "@/features/spells/components/SpellDetailModal";
import { useFavorites } from "@/core/hooks/useFavorites";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface SpellsListProps {
    initialSpells: Spell[];
}

const SCHOOLS: School[] = [
    "Abjuração", "Adivinhação", "Convocação", "Encantamento",
    "Evocação", "Ilusão", "Necromancia", "Transmutação",
];
const CIRCLES: Circle[] = [1, 2, 3, 4, 5];
const TYPES = ["Arcana", "Divina", "Universal"];

function getSchoolIcon(school: School) {
    switch (school) {
        case "Evocação":      return "local_fire_department";
        case "Abjuração":     return "shield_with_heart";
        case "Adivinhação":   return "visibility";
        case "Necromancia":   return "skull";
        case "Convocação":    return "groups";
        case "Encantamento":  return "psychology";
        case "Ilusão":        return "interests";
        case "Transmutação":  return "transform";
        default:              return "auto_stories";
    }
}

export function SpellsList({ initialSpells }: SpellsListProps) {
    const [query, setQuery] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<School | "">("");
    const [selectedCircle, setSelectedCircle] = useState<Circle | 0>(0);
    const [selectedType, setSelectedType] = useState<string>("");
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const { toggle, isFavorite } = useFavorites();

    const filteredSpells = initialSpells.filter(spell => {
        const matchesQuery =
            spell.name.toLowerCase().includes(query.toLowerCase()) ||
            spell.description.toLowerCase().includes(query.toLowerCase()) ||
            (spell.enhancements?.some(enh => 
                enh.effect.toLowerCase().includes(query.toLowerCase()) || 
                enh.cost.toLowerCase().includes(query.toLowerCase())
            ) ?? false);
        const matchesSchool = selectedSchool ? spell.school === selectedSchool : true;
        const matchesCircle = selectedCircle ? spell.circle == selectedCircle : true;
        const matchesType = selectedType ? spell.type === selectedType : true;
        const matchesFav = onlyFavorites ? isFavorite(spell.id) : true;
        return matchesQuery && matchesSchool && matchesCircle && matchesType && matchesFav;
    });

    // ── Filters sidebar content ──────────────────────────────────────────────
    const FiltersContent = () => (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-[var(--color-gold-aged)]/20">
                <span className="material-symbols-outlined text-[#8B0000] text-2xl">menu_book</span>
                <h3 className="text-xl font-display font-bold text-[#8B0000] uppercase tracking-[0.1em]">Índice Arcano</h3>
            </div>

            {/* Search */}
            <div>
                <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Pesquisa</h4>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#A6894A] text-sm">search</span>
                    <input
                        type="text"
                        placeholder="Buscar magia..."
                        className="w-full bg-black/40 border border-[#A6894A]/40 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:border-[#A6894A] focus:ring-1 focus:ring-[#A6894A] outline-none transition-all placeholder:text-slate-600 font-sans"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ── MEU GRIMÓRIO — Apenas Favoritos ── */}
            <div>
                <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">
                    Meu Grimório
                </h4>
                <button
                    id="filter-favorites"
                    onClick={() => setOnlyFavorites(prev => !prev)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300 text-left group",
                        onlyFavorites
                            ? "bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                            : "bg-black/20 border-[#A6894A]/20 hover:border-[#A6894A]/50 hover:bg-black/30"
                    )}
                >
                    <BookmarkCheck
                        className={cn(
                            "w-5 h-5 transition-all duration-300 shrink-0",
                            onlyFavorites ? "text-[#D4AF37] drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]" : "text-slate-500 group-hover:text-[#A6894A]"
                        )}
                    />
                    <span className={cn(
                        "text-[11px] font-serif uppercase tracking-[0.15em] transition-colors",
                        onlyFavorites ? "text-[#D4AF37]" : "text-slate-400 group-hover:text-[#E8DCC4]"
                    )}>
                        Apenas Favoritos
                    </span>
                </button>
            </div>

            {/* Circle */}
            <div>
                <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Círculo</h4>
                <div className="grid grid-cols-5 gap-2">
                    {CIRCLES.map(circle => (
                        <button
                            key={circle}
                            onClick={() => setSelectedCircle(selectedCircle === circle ? 0 : circle)}
                            className={cn(
                                "size-10 mx-auto rounded-full font-display font-bold text-xs transition-all border flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6894A]",
                                selectedCircle === circle
                                    ? "bg-gradient-to-br from-[#8B0000] to-[#500000] text-[#E8DCC4] border-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.8)] ring-1 ring-[#8B0000]"
                                    : "bg-black/30 border-[#A6894A]/20 text-slate-400 hover:border-[#A6894A]/60 hover:text-[#A6894A]"
                            )}
                        >
                            {circle}º
                        </button>
                    ))}
                </div>
            </div>

            {/* Type */}
            <div>
                <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Natureza</h4>
                <div className="flex gap-2">
                    {TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(selectedType === type ? "" : type)}
                            className={cn(
                                "flex-1 py-2.5 rounded-sm text-[10px] font-serif font-bold uppercase tracking-widest transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6894A]",
                                selectedType === type
                                    ? "bg-gradient-to-b from-[#8B0000] to-[#500000] text-[#E8DCC4] border-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.8)] ring-1 ring-[#8B0000]"
                                    : "bg-gradient-to-b from-[#2a1a1a] to-[#1a0f0f] border-[#3a2f2f] text-[#A6894A] hover:border-[#A6894A]/50 hover:text-[#E8DCC4]"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schools */}
            <div>
                <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Escolas de Magia</h4>
                <div className="grid grid-cols-1 gap-1">
                    {SCHOOLS.map(school => (
                        <button
                            key={school}
                            onClick={() => setSelectedSchool(selectedSchool === school ? "" : school)}
                            className={cn(
                                "flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6894A]",
                                selectedSchool === school
                                    ? "bg-[#8B0000]/10 border-[#A6894A]/30 text-[#A6894A] drop-shadow-[0_0_8px_rgba(166,137,74,0.4)]"
                                    : "bg-transparent border-transparent text-slate-400 hover:bg-black/20 hover:text-[#E8DCC4]"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined text-lg transition-colors",
                                selectedSchool === school ? "text-[#A6894A] fill drop-shadow-[0_0_8px_rgba(166,137,74,0.8)]" : "text-slate-600 group-hover:text-[#E8DCC4]"
                            )}>
                                {getSchoolIcon(school)}
                            </span>
                            <span className="text-[11px] font-serif uppercase tracking-[0.15em]">{school}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    // ── Empty favorites message ───────────────────────────────────────────────
    const EmptyFavorites = () => (
        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center px-8">
            <BookmarkCheck className="w-16 h-16 text-[#A6894A]/30 mb-6" strokeWidth={1} />
            <p className="font-display text-2xl text-[#A6894A]/50 uppercase tracking-[0.3em] mb-3">
                Grimório Pessoal Vazio
            </p>
            <p className="font-serif text-base text-slate-500 italic max-w-xs leading-relaxed">
                Seu grimório pessoal ainda está vazio. Marque suas magias favoritas para consulta rápida.
            </p>
            <div className="flex items-center gap-3 mt-6 opacity-40">
                <div className="h-px w-16 bg-[#A6894A]" />
                <Bookmark className="w-4 h-4 text-[#A6894A]" />
                <div className="h-px w-16 bg-[#A6894A]" />
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-80 flex-shrink-0 border-r border-primary/20 p-8 overflow-y-auto scrollbar-hide bg-background-dark/40">
                <FiltersContent />
            </aside>

            {/* Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-primary/20 bg-background-dark/60 sticky top-0 z-20 backdrop-blur-md">
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tighter italic">Grimório</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {filteredSpells.length} magias encontradas
                        </p>
                    </div>
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className={cn(
                            "p-2 rounded-lg border transition-all flex items-center gap-2",
                            showMobileFilters ? "bg-primary text-white border-primary" : "bg-primary/10 text-primary border-primary/30"
                        )}
                    >
                        <span className="material-symbols-outlined text-xl">tune</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Filtros</span>
                    </button>
                </div>

                {/* Mobile Filters Overlay */}
                {showMobileFilters && (
                    <div className="md:hidden fixed inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/30"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <FiltersContent />
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed bottom-24 left-6 right-6 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-primary/30 z-50 transition-all active:scale-95"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                )}

                {/* Spells Grid */}
                <div className={cn(
                    "flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background-dark/20 to-transparent",
                    showMobileFilters && "blur-sm"
                )}>
                    {/* Desktop Title */}
                    <div className="hidden md:block mb-8">
                        <h1 className="text-4xl font-display font-bold text-slate-100 uppercase tracking-[0.1em] drop-shadow-lg">
                            {onlyFavorites ? "Meu Grimório" : "Grimório de Arton"}
                        </h1>
                        <div className="flex items-center gap-4 w-64 mb-4 mt-2">
                            <div className="h-px bg-gradient-to-r from-transparent via-[#A6894A] to-transparent flex-1" />
                            <div className="rotate-45 size-2 bg-[#A6894A] border border-[#D4AF37]" />
                            <div className="h-px bg-gradient-to-r from-transparent via-[#A6894A] to-transparent flex-1" />
                        </div>
                        <p className="text-sm font-sans text-slate-500 font-bold uppercase tracking-[0.3em] pl-1">
                            Exibindo {filteredSpells.length} magias catalogadas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 pb-12">
                        {filteredSpells.map(spell => {
                            const name = spell.name || (spell as any).nome || "";
                            const slug = name
                                .toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/\s+/g, "-")
                                .replace(/[^\w\-]+/g, "")
                                .replace(/\-\-+/g, "-")
                                .replace(/^-+/, "")
                                .replace(/-+$/, "");
                            const imagePath = `/assets/spells/${slug}.jpg`;
                            const fav = isFavorite(spell.id);

                            return (
                                <div
                                    key={spell.id}
                                    onClick={() => setSelectedSpell(spell)}
                                    className="group relative h-72 rounded-lg border border-[var(--color-gold-aged)] bg-parchment flex flex-col transition-all duration-300 cursor-pointer hover:border-gold-aged hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(139,0,0,0.5),0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden active:scale-[0.98]"
                                >
                                    {/* Card Hero */}
                                    <div className={cn(
                                        "relative h-24 w-full shrink-0 border-b border-primary/20 bg-gradient-to-br",
                                        spell.type === "Divina" ? "from-amber-900/40 to-background-dark" :
                                        spell.type === "Arcana" ? "from-purple-900/40 to-background-dark" :
                                        "from-primary/40 to-background-dark"
                                    )}>
                                        <img
                                            src={imagePath}
                                            alt={spell.name}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 opacity-0"
                                            onLoad={(e) => {
                                                (e.target as HTMLImageElement).classList.remove("opacity-0");
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).remove();
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                        {/* Nome + PM badge */}
                                        <div className="absolute top-0 left-0 right-0 px-3 py-2 flex justify-between items-center z-10 bg-black/30 backdrop-blur-[2px]">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="material-symbols-outlined text-[#A6894A] text-[16px] drop-shadow-md">
                                                    {getSchoolIcon(spell.school)}
                                                </span>
                                                <h3 className="font-display font-bold text-sm text-white truncate uppercase tracking-[0.1em] drop-shadow-md">
                                                    {spell.name}
                                                </h3>
                                            </div>
                                            <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] px-2 py-0.5 rounded-full border border-[#8A6A2A] text-black font-sans font-black text-[9px] shrink-0 ml-2 shadow-md flex items-center justify-center min-w-[32px]">
                                                {spell.pmCost ?? (spell.circle === 1 ? 1 : spell.circle === 2 ? 3 : spell.circle === 3 ? 6 : spell.circle === 4 ? 10 : 15)} PM
                                            </div>
                                        </div>

                                        {/* ── Favorite Button ── */}
                                        <button
                                            id={`fav-${spell.id}`}
                                            aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggle(spell.id);
                                            }}
                                            className={cn(
                                                "absolute bottom-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-sm border transition-all duration-300",
                                                fav
                                                    ? "bg-[#D4AF37]/20 border-[#D4AF37]/60 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                                    : "bg-black/30 border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10"
                                            )}
                                        >
                                            <Bookmark
                                                className={cn(
                                                    "w-3.5 h-3.5 transition-all duration-300",
                                                    fav
                                                        ? "text-[#D4AF37] fill-[#D4AF37] drop-shadow-[0_0_5px_rgba(212,175,55,0.9)] scale-110"
                                                        : "text-white/60 hover:text-[#D4AF37]"
                                                )}
                                            />
                                        </button>

                                        {/* Tipo badge */}
                                        <div
                                            style={{ writingMode: "vertical-rl" }}
                                            className={cn(
                                                "absolute left-2 bottom-2 text-[7px] font-sans font-black uppercase tracking-[0.15em] px-1 py-1 rounded border rotate-180 z-10 backdrop-blur-sm",
                                                spell.type === "Arcana"
                                                    ? "text-purple-300 border-purple-400/40 bg-purple-900/40"
                                                    : "text-amber-200 border-amber-300/40 bg-amber-900/40"
                                            )}
                                        >
                                            {spell.type}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-3 flex-1 flex flex-col min-h-0 relative">
                                        <p className="text-[9px] text-primary font-sans font-bold uppercase tracking-widest mb-1 opacity-70">
                                            {spell.school} • {spell.circle}º Círculo
                                        </p>
                                        <p className="font-serif text-[12px] text-text-dark/90 line-clamp-3 leading-tight flex-1 pr-1 italic">
                                            &ldquo;{spell.description.replace(/(<([^>]+)>)/gi, "").substring(0, 120)}...&rdquo;
                                        </p>
                                        <div className="mt-2 pt-2 border-t border-[var(--color-gold-aged)]/20 flex justify-between items-center text-[8px] font-sans font-black uppercase tracking-tighter text-text-dark/60">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">hourglass_empty</span>
                                                {spell.execTime.split(";")[0]}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">gps_fixed</span>
                                                {spell.range ? spell.range.split(";")[0] : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty States */}
                        {filteredSpells.length === 0 && onlyFavorites && <EmptyFavorites />}

                        {filteredSpells.length === 0 && !onlyFavorites && (
                            <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-600 grayscale opacity-40">
                                <span className="material-symbols-outlined text-8xl mb-4">auto_stories</span>
                                <p className="text-xl font-black uppercase tracking-[0.5em] italic">Nada Catalogado</p>
                                <p className="text-sm font-bold mt-2">Remova os filtros para ver mais magias</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {selectedSpell && (
                <SpellDetailModal
                    spell={selectedSpell}
                    onClose={() => setSelectedSpell(null)}
                />
            )}
        </div>
    );
}
