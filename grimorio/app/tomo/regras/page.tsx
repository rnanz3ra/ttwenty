"use client";

import { getAllManeuvers } from "@/core/lib/data";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { ArrowLeft, Sword, Shield, Zap, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RulesPage() {
    const maneuvers = getAllManeuvers();

    return (
        <main className="min-h-screen p-8 bg-[var(--bg-global)]">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header Subtil */}
                <div className="flex flex-col gap-6">
                    <Link href="/" className="inline-flex items-center text-arton-gold hover:text-arton-red transition-all font-serif font-black uppercase text-xs tracking-widest group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Retornar
                    </Link>

                    <div className="space-y-4">
                        <h1 className="font-serif text-5xl md:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
                            Enciclopédia <span className="text-arton-red block md:inline">de Regras</span>
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] font-serif italic max-w-2xl border-l-2 border-arton-gold/30 pl-6">
                            "A força bruta vence batalhas, mas a técnica apurada vence guerras. Conheça as manobras que separam os recrutas dos heróis."
                        </p>
                    </div>
                </div>

                <HeaderFrame>
                    <div className="flex items-center gap-3">
                        <Sword className="w-5 h-5 text-arton-red" />
                        <span>Manobras de Combate</span>
                    </div>
                </HeaderFrame>

                {/* Lista de Manobras com Layout de Livro */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {maneuvers.map((m: any, idx: number) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={m.nome}
                            className="rule-box bg-[var(--card-bg)] border-[var(--card-border)] p-8 shadow-brutalist relative group overflow-hidden"
                            style={{ borderStyle: 'double', borderLeftWidth: '6px' }}
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-arton-red/5 -rotate-45 translate-x-10 -translate-y-10 group-hover:bg-arton-red/10 transition-colors" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="font-serif text-2xl font-black text-arton-red uppercase tracking-tight">
                                        {m.nome}
                                    </h2>
                                    <div className="p-2 bg-arton-black/5 border border-arton-gold/20 rounded">
                                        <Shield className="w-4 h-4 text-arton-gold" />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 flex-1">
                                    {/* Esquerda: Lore / Contexto */}
                                    <div className="md:w-1/2 space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-arton-gold uppercase tracking-widest flex items-center gap-2">
                                                <Zap className="w-3 h-3" /> Teste Requerido
                                            </span>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{m.teste}</p>
                                        </div>
                                        <div className="p-4 bg-arton-gold/5 border-l-2 border-arton-gold/30 italic text-[var(--text-secondary)] text-sm">
                                            "Uma execução perfeita exige equilíbrio e foco."
                                        </div>
                                    </div>

                                    {/* Direita: Mecânica / Efeito */}
                                    <div className="md:w-1/2 space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-arton-red uppercase tracking-widest flex items-center gap-2">
                                                <Info className="w-3 h-3" /> Efeito da Manobra
                                            </span>
                                            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                                                {m.efeito}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Rodapé */}
                <div className="py-12 text-center opacity-30">
                    <p className="font-serif text-xs uppercase tracking-[0.4em] text-[var(--text-secondary)]">
                        Mestra de Regras • Arton
                    </p>
                </div>
            </div>
        </main>
    );
}
