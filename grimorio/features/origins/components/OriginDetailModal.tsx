"use client";

import { Dialog, DialogContent } from "@/core/ui/dialog";
import { Origin } from "@/core/types";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { Backpack, Sparkles } from "lucide-react";

interface OriginDetailModalProps {
    origin: Origin | null;
    onClose: () => void;
}

export function OriginDetailModal({ origin, onClose }: OriginDetailModalProps) {
    if (!origin) return null;

    return (
        <Dialog open={!!origin} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 border-none bg-transparent overflow-visible shadow-none">
                <div className="book-page w-full p-8 md:p-14 min-h-[600px] flex flex-col relative">

                    {/* Textura de Fundo Adicional (Papel Antigo) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply" />

                    {/* Header Nome da Origem */}
                    <HeaderFrame className="z-10">
                        {origin.nome}
                    </HeaderFrame>

                    {/* Layout de Colunas: Lore vs Regras (70/30) */}
                    <div className="flex flex-col md:flex-row gap-12 mt-6 flex-1 relative z-10">

                        {/* Coluna de Lore (70%) */}
                        <div className="md:w-[70%] space-y-8">
                            <div className="lore-text drop-cap text-justify">
                                {origin.descricao || "Todo aventureiro veio de algum lugar. Seus dias antes da vida de perigos moldaram quem você é hoje e os benefícios que carrega em sua jornada por Arton."}
                            </div>

                            <div className="lore-quote">
                                "O passado não é um fardo, mas o alicerce onde construímos nosso futuro sob os olhos dos deuses."
                                <span className="block text-xs mt-2 text-arton-gold/50 not-italic">— Provérbio Popular do Reinado</span>
                            </div>

                            {/* Itens Pessoais */}
                            <div className="space-y-6 pt-8 border-t border-arton-red/10">
                                <h3 className="text-white font-serif font-black text-sm uppercase flex items-center gap-3">
                                    <Backpack className="w-4 h-4 text-arton-gold" /> Bens do Passado
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {origin.itens?.map((item, idx) => (
                                        <div key={idx} className="bg-arton-black/40 p-4 border-l border-arton-gold/30 italic text-xs text-gray-400 hover:bg-arton-red/5 transition-colors">
                                            {item}
                                        </div>
                                    ))}
                                    {(!origin.itens || origin.itens.length === 0) && (
                                        <p className="text-[10px] text-gray-500 italic">Nenhum item remanescente do seu passado.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coluna de Regras (30%) */}
                        <div className="md:w-[30%] space-y-6">

                            {/* Rule Box: Benefícios */}
                            <div className="rule-box space-y-6 p-6 shadow-2xl">
                                <h3 className="text-arton-red font-serif font-black text-xs uppercase mb-2 border-b border-arton-red/20 pb-1 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> Benefícios Escolhidos
                                </h3>
                                <p className="text-[10px] leading-relaxed text-gray-500 italic mb-4">
                                    Ao selecionar esta origem, você deve escolher dois benefícios (perícias ou poderes) da lista de herança abaixo:
                                </p>
                                <div className="space-y-3">
                                    {origin.beneficios?.map((ben, idx) => (
                                        <div key={idx} className="group bg-black/40 p-3 border border-white/5 hover:border-arton-gold transition-all cursor-default">
                                            <span className="text-[9px] font-black text-arton-red uppercase tracking-widest block mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                {ben.includes("Poder") ? "Poder da Origem" : "Perícia de Herança"}
                                            </span>
                                            <span className="text-xs font-serif font-bold text-white group-hover:text-arton-gold transition-colors">{ben}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Sair */}
                    <div className="mt-12 flex justify-end">
                        <button onClick={onClose} className="text-arton-red font-serif font-black uppercase text-xs tracking-widest hover:text-arton-gold transition-all">
                            Fechar Relato de Origem
                        </button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
