"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/core/ui/dialog";
import { Deity } from "@/core/types";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { cn } from "@/core/lib/utils";
import { Sparkles, Gavel, Users, Info, Dices, AlertCircle, ShieldCheck } from "lucide-react";
import { getPowersByDeity } from "@/core/lib/data";

interface DeityDetailModalProps {
    deity: Deity | null;
    onClose: () => void;
}

/**
 * DeityDetailModal - Visualização de "Tomo" de Divindade
 * Simula uma página aberta do livro com layout 70/30.
 */
export function DeityDetailModal({ deity, onClose }: DeityDetailModalProps) {
    const [diceResult, setDiceResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [nimbEffect, setNimbEffect] = useState<string | null>(null);

    // Reset results when deity changes
    useEffect(() => {
        setDiceResult(null);
        setNimbEffect(null);
    }, [deity]);

    if (!deity) return null;

    const rollD6 = () => {
        setIsRolling(true);
        setDiceResult(null);
        setTimeout(() => {
            const res = Math.floor(Math.random() * 6) + 1;
            setDiceResult(res);
            setIsRolling(false);

            if (deity.nome === "Nimb") {
                const effects = [
                    "Sorte Absurda: +2 em todos os testes na próxima rodada.",
                    "Confusão Mental: Você fica Confuso até o fim da cena.",
                    "Voz do Caos: Suas palavras se tornam incompreensíveis.",
                    "Eco do Destino: Role novamente e some os resultados.",
                    "Riso de Nimb: Você recupera 1d6 PM, mas perde 1d6 PV.",
                    "Visão do Abismo: -2 em testes de Vontade pela próxima hora."
                ];
                setNimbEffect(effects[res - 1]);
            }
        }, 600);
    };

    return (
        <Dialog open={!!deity} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl p-0 border-none bg-transparent overflow-visible shadow-none">
                <div className="book-page w-full p-8 md:p-14 min-h-[600px] flex flex-col relative">

                    {/* Textura de Fundo Adicional (Papel Antigo) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply" />

                    <HeaderFrame className="mb-10">
                        <div className="flex flex-col items-center">
                            <span>{deity.nome}</span>
                            <span className="text-[10px] md:text-xs font-sans italic opacity-70 tracking-[0.4em] mt-1 normal-case font-normal text-white/80">
                                {deity.titulo}
                            </span>
                        </div>
                    </HeaderFrame>

                    <div className="flex flex-col md:flex-row gap-12 mt-2 flex-1 relative z-10">
                        <div className="md:w-[70%] space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-arton-red font-serif font-black text-xs uppercase tracking-widest border-b border-arton-red/20 pb-1 mb-4 flex items-center gap-2">
                                    <Info className="w-3 h-3" /> Relato Teológico
                                </h3>
                                <div className="lore-text drop-cap text-justify leading-relaxed">
                                    {deity.lore}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-arton-red/10">
                                <h3 className="text-arton-red font-serif font-black text-xs uppercase tracking-widest mb-3">
                                    Crenças e Filosofia
                                </h3>
                                <p className="lore-text italic border-l-2 border-arton-gold/30 pl-6 py-2 text-arton-gold/90">
                                    "{deity.crenças}"
                                </p>
                            </div>
                        </div>

                        <div className="md:w-[30%] space-y-6">
                            <div className="rule-box space-y-6 bg-arton-black/40 border-arton-red/40 p-6 shadow-inner">
                                <div>
                                    <h4 className="text-[10px] font-black text-arton-red uppercase tracking-widest mb-1">Símbolo Sagrado</h4>
                                    <p className="text-xs text-gray-200 font-serif italic border-b border-white/5 pb-2">{deity.simbolo}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-[10px] font-black text-arton-red uppercase tracking-widest mb-1">Canalização</h4>
                                        <p className="text-xs text-white font-bold">{deity.canalizacao}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-arton-red uppercase tracking-widest mb-1">Arma</h4>
                                        <p className="text-xs text-white font-bold">{deity.arma}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-arton-red uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Users className="w-3 h-3" /> Devotos
                                    </h4>
                                    <p className="text-[11px] text-gray-300 leading-tight bg-black/30 p-2 rounded">
                                        {deity.devotos}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <h4 className="text-[10px] font-black text-arton-red uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Gavel className="w-3 h-3" /> Obrigações & Restrições
                                    </h4>
                                    <p className="text-[11px] text-gray-400 leading-relaxed italic border-l border-arton-gold/20 pl-3">
                                        {deity.obrigacoes}
                                    </p>
                                </div>

                                {/* Poderes Concedidos Detalhados (Lote 60) */}
                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <h4 className="text-[10px] font-black text-arton-gold uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Poderes do Devoto
                                    </h4>
                                    <div className="space-y-2">
                                        {getPowersByDeity(deity.nome).map((p: any, idx: number) => (
                                            <div key={idx} className="bg-arton-black/60 border border-arton-gold/20 p-3 rounded shadow-brutalist-sm group/power hover:border-arton-red transition-colors">
                                                <h5 className="text-[10px] font-bold text-white uppercase tracking-tight mb-1 group-hover/power:text-arton-red transition-colors">{p.nome}</h5>
                                                <p className="text-[10px] text-gray-400 leading-tight italic">{p.efeito}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Simulador de Fé (Interativo) */}
                                {(deity.nome === "Aharadak" || deity.nome === "Nimb") && (
                                    <div className="mt-6 pt-6 border-t border-arton-red/40">
                                        <button
                                            onClick={rollD6}
                                            disabled={isRolling}
                                            className={cn(
                                                "w-full py-3 px-4 font-serif font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl group",
                                                deity.nome === "Aharadak" ? "bg-purple-900/40 text-purple-200 border border-purple-500/50 hover:bg-purple-800/60" : "bg-arton-gold/10 text-arton-gold border border-arton-gold/50 hover:bg-arton-gold/20"
                                            )}
                                        >
                                            <Dices className={cn("w-4 h-4", isRolling && "animate-spin")} />
                                            {deity.nome === "Aharadak" ? "Testar Fé (1d6)" : "O Dado de Nimb"}
                                        </button>

                                        {diceResult !== null && (
                                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                                <div className="flex items-center justify-between bg-black/40 p-3 border-l-2 border-arton-red">
                                                    <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">Resultado:</span>
                                                    <span className="text-2xl font-black text-white">{diceResult}</span>
                                                </div>

                                                {deity.nome === "Aharadak" && (
                                                    <div className={cn(
                                                        "mt-2 p-2 text-[10px] font-bold text-center uppercase tracking-tighter",
                                                        diceResult % 2 !== 0 ? "bg-purple-900/60 text-purple-100 border border-purple-400/50" : "text-green-400"
                                                    )}>
                                                        {diceResult % 2 !== 0 ? (
                                                            <span className="flex items-center justify-center gap-2"><AlertCircle className="w-3 h-3" /> Fascinado!</span>
                                                        ) : "Sua mente resiste à loucura."}
                                                    </div>
                                                )}

                                                {deity.nome === "Nimb" && nimbEffect && (
                                                    <div className="mt-2 p-3 bg-arton-gold/10 border border-arton-gold/30 text-[10px] text-arton-gold italic leading-tight text-center">
                                                        {nimbEffect}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t-2 border-arton-red/20 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="bg-arton-red text-white px-4 py-2 font-serif font-black text-xs uppercase tracking-widest shadow-lg -rotate-1">
                                Poderes Concedidos
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {deity.poderes.map((p, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-arton-gold/20 rounded-full">
                                        <Sparkles className="w-3 h-3 text-arton-gold" />
                                        <span className="text-[11px] font-bold text-arton-gold uppercase tracking-tighter">{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-8 text-arton-red/30 hover:text-arton-red font-serif font-black uppercase text-[10px] tracking-[0.5em] transition-all"
                    >
                        Fechar Tomo [X]
                    </button>

                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-arton-gold/20 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-arton-gold/20 pointer-events-none" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
