"use client";

import { Dialog, DialogContent } from "@/core/ui/dialog";
import { Class } from "@/core/types";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { Sparkles } from "lucide-react";

interface ClassDetailModalProps {
    fighterClass: Class | null;
    onClose: () => void;
}

export function ClassDetailModal({ fighterClass, onClose }: ClassDetailModalProps) {
    if (!fighterClass) return null;

    return (
        <Dialog open={!!fighterClass} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 border-none bg-transparent overflow-visible shadow-none">
                <div className="book-page w-full p-8 md:p-14 min-h-[600px] flex flex-col relative">

                    {/* Textura de Fundo Adicional (Papel Antigo) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply" />

                    {/* Header Nome da Classe */}
                    <HeaderFrame className="z-10">
                        {fighterClass.name}
                    </HeaderFrame>

                    {/* Layout de Colunas: Lore vs Regras (70/30) */}
                    <div className="flex flex-col md:flex-row gap-12 mt-6 flex-1 relative z-10">

                        {/* Coluna de Lore (70%) */}
                        <div className="md:w-[70%] space-y-8">
                            <div className="lore-text drop-cap text-justify">
                                {fighterClass.description || "O caminho do aventureiro em Arton é forjado em aço, magia ou fé. Esta classe representa uma das pedras fundamentais que sustentam a resistência contra a Tormenta."}
                            </div>

                            <div className="lore-quote">
                                "Não é o poder que define o herói, mas como ele encara o abismo quando o abismo resolve retribuir o olhar."
                                <span className="block text-xs mt-2 text-arton-gold/50 not-italic">— Trecho do 'Guia do Aventureiro'</span>
                            </div>

                            {/* Poderes Base */}
                            <div className="space-y-6 pt-8 border-t border-arton-red/10">
                                <h3 className="text-white font-serif font-black text-sm uppercase flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-arton-gold" /> Habilidades de Classe
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {fighterClass.abilities.map((ab, idx) => (
                                        <div key={idx} className="group border-l-2 border-arton-gold/20 pl-6 py-1 hover:border-arton-red transition-colors">
                                            <h4 className="text-arton-gold font-serif font-black text-xs uppercase mb-2 group-hover:text-white transition-colors tracking-tight">{ab.name}</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed text-justify italic">{ab.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Coluna de Regras (30%) */}
                        <div className="md:w-[30%] space-y-6">

                            {/* Rule Box: Atributo Chave */}
                            <div className="rule-box bg-arton-red/10 border-arton-red p-6 shadow-xl">
                                <h3 className="text-arton-red font-serif font-black text-[10px] uppercase tracking-widest mb-2 border-b border-arton-red/20 pb-1">Atributo Chave</h3>
                                <p className="text-3xl font-serif font-black text-white uppercase tracking-tighter">
                                    {fighterClass.atributo_chave || "Padrão"}
                                </p>
                            </div>

                            {/* Rule Box: PV e PM */}
                            <div className="rule-box space-y-4 p-6 bg-arton-black/40 border-arton-red/30">
                                <h3 className="text-white font-serif font-black text-xs uppercase mb-4 border-b border-white/5 pb-1">Bases de Vitalidade</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">PV Inicial</span>
                                        <span className="text-lg font-black text-white">{fighterClass.pv_inicial} <span className="text-[9px] text-gray-600 font-bold ml-1">+ CON</span></span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Por Nível</span>
                                        <div className="flex gap-3">
                                            <span className="text-sm font-black text-orange-500 border-r border-white/10 pr-2">+{fighterClass.pv_nivel} <span className="text-[8px] opacity-40">PV</span></span>
                                            <span className="text-sm font-black text-blue-500">+{fighterClass.pm_nivel} <span className="text-[8px] opacity-40">PM</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rule Box: Perícias e Proficiências */}
                            <div className="rule-box space-y-5 p-6">
                                <h3 className="text-arton-red font-serif font-black text-xs uppercase mb-3 border-b border-arton-red/20 pb-1">Treinamento</h3>
                                <div className="space-y-5">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Perícias de Classe</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {fighterClass.pericias_treinadas?.map((p, i) => (
                                                <span key={i} className="text-[9px] bg-arton-red/10 border border-arton-red/30 px-2 py-0.5 rounded text-arton-red font-black uppercase tracking-tighter">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 border-t border-white/5 pt-3">Armas & Armaduras</h4>
                                        <p className="text-[10px] text-gray-400 leading-tight italic border-l border-arton-gold/20 pl-3">
                                            {typeof fighterClass.proficiencias === 'string' ? fighterClass.proficiencias : fighterClass.proficiencias?.join(", ") || "Conforme o Livro Básico."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sair */}
                    <div className="mt-12 flex justify-end">
                        <button onClick={onClose} className="text-arton-red font-serif font-black uppercase text-xs tracking-widest hover:text-arton-gold transition-all">
                            Fechar Manual de Classe
                        </button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
