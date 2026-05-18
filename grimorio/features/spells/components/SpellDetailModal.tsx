import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/core/ui/dialog";
import { Spell } from "@/core/types";
import { cn } from "@/core/lib/utils";
import { Wand2, Zap, X, Scroll, Hourglass, ZoomIn } from "lucide-react";

interface SpellDetailModalProps {
    spell: Spell | null;
    onClose: () => void;
}

const FALLBACK_IMAGE = "/assets/generated/module_grimorio.png";

/**
 * SpellDetailModal — Tomo de Magia
 * Desktop: layout 60/40 (Lore | Stats)
 * Mobile: stack único (Hero → Lore → Stats → Custo)
 */
export function SpellDetailModal({ spell, onClose }: SpellDetailModalProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    if (!spell) return null;

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

    const imageUrl = imgSrc ?? `/assets/spells/${slug}.jpg`;

    const isDivina = spell.type?.toLowerCase().includes("divina");
    const isArcana = spell.type?.toLowerCase().includes("arcana");

    const typeLabel = isDivina ? "Divina" : isArcana ? "Arcana" : "Universal";
    const effectLabel = isDivina ? "Divino" : isArcana ? "Arcano" : "Universal";

    const typeBadgeClass = isDivina
        ? "bg-amber-800 text-amber-100"
        : isArcana
        ? "bg-purple-900 text-purple-100"
        : "bg-[#8B0000] text-white";

    const pmCost =
        spell.pmCost ??
        (spell.circle === 1
            ? 1
            : spell.circle === 2
            ? 3
            : spell.circle === 3
            ? 6
            : spell.circle === 4
            ? 10
            : 15);

    return (
        <>
            <Dialog open={!!spell} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-w-5xl w-[95vw] sm:w-full p-0 border-none bg-transparent overflow-visible shadow-none [&>button]:hidden">
                    <DialogDescription className="sr-only">
                        Efeitos, estatísticas e narrativa da magia {spell.name}
                    </DialogDescription>

                    {/* Tomo */}
                    <div className="book-page w-full flex flex-col relative bg-[#E8DCC4] rounded-lg shadow-2xl overflow-hidden border border-[#A6894A]/40 max-h-[92vh]">

                        {/* ── Hero Header ── */}
                        <div
                            className="relative w-full h-[200px] md:h-[280px] shrink-0 bg-arton-black overflow-hidden group cursor-zoom-in"
                            onClick={() => setIsFullscreen(true)}
                        >
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                onError={() => {
                                    if (imageUrl !== FALLBACK_IMAGE) {
                                        setImgSrc(FALLBACK_IMAGE);
                                    }
                                }}
                            />

                            {/* Zoom hint */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 drop-shadow-2xl" />
                            </div>

                            {/* Gradiente pergaminho */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#E8DCC4] via-[#E8DCC4]/10 to-transparent top-1/2" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                            {/* Fechar */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                className="absolute right-4 top-4 text-white/90 hover:text-[#A6894A] hover:bg-black/80 transition-all z-50 bg-black/50 backdrop-blur-md rounded-full p-2.5 border border-white/20 shadow-lg flex items-center justify-center group"
                            >
                                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Badge Manifestação */}
                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                <div className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-[#A6894A]/30 text-[9px] font-sans font-black text-[#A6894A] uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[12px]">magic_button</span>
                                    Manifestação {typeLabel}
                                </div>
                            </div>

                            {/* Título */}
                            <div className="absolute bottom-3 md:bottom-5 left-0 w-full text-center z-10 px-4">
                                <DialogTitle className="text-2xl md:text-4xl font-display font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase tracking-widest leading-none">
                                    {spell.name}
                                </DialogTitle>
                                <div className="flex items-center justify-center gap-3 w-48 mx-auto mt-3">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#A6894A] to-transparent flex-1" />
                                    <div className="rotate-45 size-1.5 bg-[#A6894A] shadow-[0_0_6px_rgba(166,137,74,0.6)]" />
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#A6894A] to-transparent flex-1" />
                                </div>
                            </div>
                        </div>

                        {/* ── Corpo — rola quando o conteúdo ultrapassa ── */}
                        <div className="flex-1 overflow-y-auto scrollbar-blood relative z-10">
                            {/* Textura pergaminho */}
                            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply" />

                            <div className="relative z-10 p-5 md:p-10 pt-5">
                                {/* Badge tipo + círculo */}
                                <div className="flex flex-wrap gap-3 items-center mb-4">
                                    <span className={cn(
                                        "px-3 py-1 text-[10px] font-sans font-black uppercase tracking-[0.2em] rounded-sm",
                                        typeBadgeClass
                                    )}>
                                        {spell.type} {spell.circle}º Círculo
                                    </span>
                                    <span className="text-[11px] font-display font-bold uppercase text-[#A6894A] tracking-[0.3em]">
                                        {spell.school}
                                    </span>
                                </div>

                                {/* Duas colunas no desktop, stack no mobile */}
                                <div className="flex flex-col md:flex-row gap-8 md:gap-10">

                                    {/* ── Coluna esquerda: Lore/Descrição ── */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <h3 className="text-[#8B0000] font-display font-bold text-base uppercase tracking-widest border-b border-[#A6894A]/40 pb-2 mb-3 flex items-center gap-2 shrink-0">
                                            <Scroll className="w-4 h-4 text-[#A6894A]" />
                                            Efeito {effectLabel}
                                        </h3>

                                        {/* Descrição com scroll próprio */}
                                        <div
                                            className="overflow-y-auto scrollbar-blood pr-2"
                                            style={{ maxHeight: "340px" }}
                                        >
                                            <p className="text-[#1A1A1A] font-serif text-[1rem] leading-[1.65] text-justify whitespace-pre-line selection:bg-[#8B0000]/30">
                                                {spell.description}
                                            </p>

                                            {/* Aprimoramentos */}
                                            {spell.enhancements && spell.enhancements.length > 0 && (
                                                <div className="mt-10 pt-6 border-t border-[#A6894A]/20">
                                                    <h3 className="text-[#8B0000] font-display font-bold text-xs uppercase tracking-[0.2em] mb-6">
                                                        Aprimoramentos
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {spell.enhancements.map((enh, idx) => (
                                                            <div key={idx} className="text-sm leading-relaxed">
                                                                <span className="font-sans font-bold text-red-600 mr-2">
                                                                    {enh.cost}:
                                                                </span>
                                                                <span className="font-serif text-[#1A1A1A]">
                                                                    {enh.effect}
                                                                </span>
                                                                {enh.requirement && (
                                                                    <span className="ml-2 text-xs font-serif italic text-slate-500">
                                                                        {enh.requirement}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ── Coluna direita: Stats + Custo Base ── */}
                                    <div className="md:w-[38%] shrink-0 flex flex-col gap-5">

                                        {/* Estatísticas */}
                                        <div className="bg-[#E8DCC4]/50 border border-[#A6894A] p-5 shadow-sm rounded-lg">
                                            <h3 className="text-[#8B0000] font-display font-bold text-base uppercase tracking-widest mb-4 border-b border-[#A6894A]/40 pb-2 flex items-center gap-2">
                                                <Hourglass className="w-4 h-4 text-[#A6894A]" />
                                                Estatísticas
                                            </h3>

                                            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-0 md:space-y-4">
                                                <div className="flex flex-col">
                                                    <h4 className="text-[10px] font-sans font-bold text-[#8B0000]/70 uppercase tracking-widest mb-0.5">Tempo de Execução</h4>
                                                    <p className="text-[14px] text-[#1A1A1A] font-serif font-bold capitalize">{spell.execTime}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-[10px] font-sans font-bold text-[#8B0000]/70 uppercase tracking-widest mb-0.5">Alcance</h4>
                                                    <p className="text-[14px] text-[#1A1A1A] font-serif font-bold capitalize">{spell.range}</p>
                                                </div>
                                                {spell.target && (
                                                    <div className="flex flex-col">
                                                        <h4 className="text-[10px] font-sans font-bold text-[#8B0000]/70 uppercase tracking-widest mb-0.5">Alvo</h4>
                                                        <p className="text-[14px] text-[#1A1A1A] font-serif font-bold capitalize">{spell.target}</p>
                                                    </div>
                                                )}
                                                {spell.area && (
                                                    <div className="flex flex-col">
                                                        <h4 className="text-[10px] font-sans font-bold text-[#8B0000]/70 uppercase tracking-widest mb-0.5">Área</h4>
                                                        <p className="text-[14px] text-[#1A1A1A] font-serif font-bold capitalize">{spell.area}</p>
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <h4 className="text-[10px] font-sans font-bold text-[#8B0000]/70 uppercase tracking-widest mb-0.5">Duração</h4>
                                                    <p className="text-[14px] text-[#1A1A1A] font-serif font-bold capitalize">{spell.duration}</p>
                                                </div>
                                                {spell.resistance && (
                                                    <div className="flex flex-col">
                                                        <h4 className="text-[10px] font-sans font-bold text-[#8B0000]/70 uppercase tracking-widest mb-0.5">Resistência</h4>
                                                        <p className="text-[14px] text-[#1A1A1A] font-serif font-bold capitalize">{spell.resistance}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* ── Custo Base — sempre visível ── */}
                                        <div className="bg-gradient-to-br from-[#8B0000] to-[#500000] border border-[#A6894A] p-5 rounded-lg shadow-lg flex flex-col items-center justify-center text-center">
                                            <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase tracking-[0.2em] mb-2 flex items-center justify-center gap-2">
                                                <Zap className="w-4 h-4 text-[#A6894A]" />
                                                Custo Base
                                            </h4>
                                            <p className="text-5xl font-display font-bold text-[#E8DCC4] leading-none drop-shadow-md">
                                                {pmCost}{" "}
                                                <span className="text-lg text-[#A6894A]">PM</span>
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* Rodapé decorativo */}
                                <div className="mt-6 pt-4 border-t border-[#A6894A]/20 flex justify-between items-center opacity-25">
                                    <span className="text-[9px] font-serif uppercase tracking-[0.3em] text-[#A6894A]">
                                        Arton Grimorium • {spell.name}
                                    </span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1 h-1 bg-[#A6894A] rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Fullscreen Image */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/96 backdrop-blur-sm flex items-center justify-center cursor-zoom-out p-4 md:p-16 animate-in fade-in zoom-in duration-300"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white p-2 transition-colors"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <X className="w-9 h-9" />
                    </button>

                    <img
                        src={imgSrc ?? `/assets/spells/${slug}.jpg`}
                        alt={name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                        className="max-w-full max-h-full object-contain shadow-[0_0_60px_rgba(139,0,0,0.3)] border border-white/10 rounded-lg"
                    />

                    <div className="absolute bottom-6 left-0 w-full text-center">
                        <h2 className="text-white font-display text-xl uppercase tracking-widest drop-shadow-lg">
                            {name}
                        </h2>
                    </div>
                </div>
            )}
        </>
    );
}
