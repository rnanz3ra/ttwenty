"use client";

import { Dialog, DialogContent } from "@/core/ui/dialog";
import { Race } from "@/core/types";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { Sparkles } from "lucide-react";

interface RaceDetailModalProps {
    race: Race | null;
    onClose: () => void;
}

export function RaceDetailModal({ race, onClose }: RaceDetailModalProps) {
    if (!race) return null;

    const renderAttribute = (label: string, value: number | undefined | null) => {
        if (value === undefined || value === null || value === 0) return null;
        const formatted = value > 0 ? `+${value}` : `${value}`;
        return (
            <div className="flex justify-between items-center py-1 border-b border-arton-red/10 last:border-0">
                <span className="text-xs font-serif font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-sm font-bold font-serif text-arton-gold">{formatted}</span>
            </div>
        );
    };

    return (
        <Dialog open={!!race} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 border-none bg-transparent overflow-visible shadow-none">
                <div className="book-page w-full p-8 md:p-14 min-h-[600px] flex flex-col relative">

                    {/* Textura de Fundo Adicional (Papel Antigo) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply" />

                    {/* Header Diegético */}
                    <HeaderFrame>
                        {race.name}
                    </HeaderFrame>

                    {/* Layout de Colunas: Lore vs Regras */}
                    <div className="flex flex-col md:flex-row gap-12 mt-4 flex-1 relative z-10">

                        {/* Coluna de Lore (70%) */}
                        <div className="md:w-[70%] space-y-8">
                            <div className="lore-text drop-cap text-justify">
                                {race.description || "A história desta raça em Arton é envolta em mistério e lendas passadas de geração em geração..."}
                            </div>

                            {/* Citação Estilo Lore */}
                            <div className="lore-quote">
                                "Em tempos de guerra, o sangue ferve; em tempos de paz, o espírito busca o infinito. Assim caminha o {race.name.toLowerCase()} sob o sol de Arton."
                                <span className="block text-xs mt-2 text-arton-gold/50 not-italic">— Trecho de 'O Panteão e seus Filhos'</span>
                            </div>
                        </div>

                        {/* Coluna de Regras (30%) */}
                        <div className="md:w-[30%] space-y-6">

                            {/* Rule Box: Atributos */}
                            <div className="rule-box space-y-4">
                                <h3 className="text-arton-red font-serif font-black text-xs uppercase tracking-tighter mb-4 border-b border-arton-red/20 pb-1">
                                    Modificadores Raciais
                                </h3>
                                <div className="space-y-1">
                                    {renderAttribute("Força", race.bonus?.for)}
                                    {renderAttribute("Destreza", race.bonus?.des)}
                                    {renderAttribute("Constituição", race.bonus?.con)}
                                    {renderAttribute("Inteligência", race.bonus?.int)}
                                    {renderAttribute("Sabedoria", race.bonus?.sab) || renderAttribute("Sabedoria", race.attributes?.sab)}
                                    {renderAttribute("Carisma", race.bonus?.car) || renderAttribute("Carisma", race.attributes?.car)}

                                    {(!race.bonus && (!race.attributes || Object.values(race.attributes).every(v => !v))) && (
                                        <p className="text-[10px] text-gray-500 italic mt-1">O jogador distribui +2 em três atributos diferentes.</p>
                                    )}
                                </div>
                            </div>

                            {/* Rule Box: Informações Base */}
                            <div className="rule-box space-y-4">
                                <h3 className="text-arton-red font-serif font-black text-xs uppercase mb-4 border-b border-arton-red/20 pb-1">
                                    Informações Base
                                </h3>
                                <ul className="space-y-3 text-xs font-serif font-bold text-gray-300">
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="opacity-50">TAMANHO:</span>
                                        <span className="text-arton-gold uppercase">{race.tamanho || "Médio"}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="opacity-50">DESLOCAMENTO:</span>
                                        <span className="text-arton-gold">{race.deslocamento || "9m"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Habilidades Raciais (Seção Expandida ou no final) */}
                    <div className="mt-8 pt-8 border-t-2 border-arton-red/20 relative z-10">
                        <h3 className="text-white font-serif font-black text-sm uppercase mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-arton-gold" /> Habilidades de Raça
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {race.abilities.map((ab, idx) => (
                                <div key={idx} className="group border-l border-arton-gold/30 pl-4 py-1">
                                    <h4 className="text-[11px] font-black text-arton-gold group-hover:text-white transition-colors uppercase tracking-tight">
                                        {ab.name}
                                    </h4>
                                    <p className="text-[10px] leading-relaxed text-gray-400 mt-1 text-justify">
                                        {ab.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Estilizado */}
                    <div className="mt-12 flex justify-end">
                        <button
                            onClick={onClose}
                            className="text-arton-red font-serif font-black uppercase text-xs tracking-widest hover:text-arton-gold transition-colors flex items-center gap-2 group"
                        >
                            <span className="w-8 h-px bg-arton-red group-hover:bg-arton-gold transition-all" />
                            Sair da Consulta
                        </button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
