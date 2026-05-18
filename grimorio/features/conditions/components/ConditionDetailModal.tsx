"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/core/ui/dialog";
import { Condition } from "@/core/types";
import { cn } from "@/core/lib/utils";
import { X, Scroll, Info, Layers } from "lucide-react";

interface ConditionDetailModalProps {
    condition: Condition | null;
    onClose: () => void;
}

export function ConditionDetailModal({ condition, onClose }: ConditionDetailModalProps) {
    if (!condition) return null;

    return (
        <Dialog open={!!condition} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-[95vw] sm:w-full p-0 border-none bg-transparent overflow-visible shadow-none [&>button]:hidden">
                <DialogDescription className="sr-only">Efeitos e regras da condição {condition.name}</DialogDescription>
                <div className="book-page w-full flex flex-col relative bg-[#E8DCC4] rounded-lg shadow-2xl overflow-hidden border border-[#A6894A]/40 min-h-[500px]">
                    
                    {/* Header Decorativo */}
                    <div className="relative w-full h-40 shrink-0 bg-[#2a1a1a]">
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#E8DCC4] to-transparent" />
                         
                         <button
                            onClick={onClose}
                            className="absolute right-6 top-6 text-white/90 hover:text-[#A6894A] hover:bg-black/80 transition-all z-50 bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-lg flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>

                        <div className="absolute bottom-4 left-0 w-full text-center z-10 px-6">
                            <DialogTitle className="text-4xl font-display font-bold text-[#8B0000] uppercase tracking-widest drop-shadow-sm">{condition.name}</DialogTitle>
                            <div className="flex items-center justify-center gap-4 w-48 mx-auto mt-2">
                                <div className="h-px bg-[#A6894A]/40 flex-1"></div>
                                <div className="rotate-45 size-1.5 bg-[#A6894A]"></div>
                                <div className="h-px bg-[#A6894A]/40 flex-1"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row gap-8">
                            {/* Descrição Principal */}
                            <div className="flex-1">
                                <h3 className="text-[#8B0000] font-display font-bold text-lg uppercase tracking-widest border-b border-[#A6894A]/40 pb-2 mb-6 flex items-center gap-2">
                                    <Scroll className="w-4 h-4 text-[#A6894A]" /> Descrição do Efeito
                                </h3>
                                <div className="text-[#1A1A1A] font-serif text-lg leading-relaxed text-justify bg-white/30 p-6 rounded-lg border border-[#A6894A]/20 shadow-inner italic">
                                    "{condition.effect}"
                                </div>
                            </div>

                            {/* Detalhes Técnicos */}
                            <div className="md:w-72 shrink-0 space-y-6">
                                <div className="bg-black/5 p-5 rounded-lg border border-[#A6894A]/30">
                                    <h4 className="text-[10px] font-sans font-black text-[#8B0000] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Info className="w-3 h-3" /> Ficha Técnica
                                    </h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Categoria</span>
                                            <span className="px-3 py-1 bg-[#8B0000] text-white text-[10px] font-black rounded uppercase tracking-wider">{condition.category}</span>
                                        </div>
                                        
                                        {condition.stackingRule && (
                                            <div>
                                                <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Acúmulo</span>
                                                <div className="p-3 bg-amber-100/50 border border-amber-200 rounded text-[12px] font-serif font-medium text-amber-900 leading-tight flex items-start gap-2">
                                                    <Layers className="w-3 h-3 mt-0.5 shrink-0" />
                                                    {condition.stackingRule}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 border border-[#A6894A]/20 rounded-lg bg-parchment/30 italic text-[11px] text-slate-600 text-center">
                                    "As condições de Arton refletem o estado físico e mental dos heróis perante os perigos do mundo."
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer Decorativo */}
                    <div className="p-4 bg-black/5 border-t border-[#A6894A]/20 flex justify-center">
                         <span className="text-[9px] font-serif uppercase tracking-[0.4em] text-[#A6894A]">Codex Artonis • Condições de Jogo</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
