"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeaderFrame } from '@/components/layout/HeaderFrame';
import { getAtlas, getChronology } from '@/core/lib/data';
import { Map, ScrollText, Sunrise, Shield, Settings2, Wind } from 'lucide-react';

export default function AtlasPage() {
    const [activeTab, setActiveTab] = useState<'atlas' | 'cronologia'>('atlas');
    const atlas = getAtlas();
    const chronology = getChronology();
    const [selectedKingdom, setSelectedKingdom] = useState(atlas[0]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[#faf9f6] text-black font-serif relative overflow-hidden flex flex-col p-6 dark:bg-black dark:text-white transition-colors duration-500">
            {/* BACKGROUND DE PERGAMINHO (AZGHER) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-100 dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay" />

            <HeaderFrame>
                Atlas de Arton
            </HeaderFrame>

            {/* SELETOR DE MODO */}
            <div className="flex justify-center gap-4 mt-8 relative z-10 w-full max-w-5xl mx-auto">
                <button
                    onClick={() => setActiveTab('atlas')}
                    className={`flex items-center gap-2 px-6 py-3 rounded border font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'atlas'
                        ? 'bg-arton-red text-white border-arton-red shadow-[0_4px_15px_rgba(139,0,0,0.3)]'
                        : 'bg-white text-zinc-600 border-zinc-300 hover:border-arton-red dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
                        }`}
                >
                    <Map className="w-4 h-4" /> Reinos Conhecidos
                </button>
                <button
                    onClick={() => setActiveTab('cronologia')}
                    className={`flex items-center gap-2 px-6 py-3 rounded border font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'cronologia'
                        ? 'bg-arton-gold text-black border-arton-gold shadow-[0_4px_15px_rgba(197,160,89,0.3)]'
                        : 'bg-white text-zinc-600 border-zinc-300 hover:border-arton-gold dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
                        }`}
                >
                    <ScrollText className="w-4 h-4" /> Cronologia
                </button>
            </div>

            <div className="max-w-6xl w-full mx-auto relative z-10 flex-1 mt-8 mb-12">

                {activeTab === 'atlas' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[700px]">
                        {/* LISTA DE REINOS (ESQUERDA) */}
                        <div className="md:col-span-3 border-r-2 border-zinc-200 dark:border-zinc-800 pr-4 overflow-y-auto custom-scrollbar">
                            <h3 className="text-xs uppercase font-black text-arton-red mb-4 tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Selecione o Local
                            </h3>
                            <div className="space-y-2">
                                {atlas.map((k, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedKingdom(k)}
                                        className={`w-full text-left px-4 py-3 rounded transition-all border ${selectedKingdom.nome === k.nome
                                            ? 'bg-arton-red/10 border-arton-red text-arton-red dark:text-white dark:bg-arton-red/20'
                                            : 'bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-400'
                                            }`}
                                    >
                                        <div className="font-black text-sm uppercase">{k.nome}</div>
                                        <div className="text-[10px] italic">{k.titulo}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* DISPLAY DIEGÉTICO DO REINO (DIREITA) */}
                        <div className="md:col-span-9 grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl">

                            {/* LORE E CAPITULAR (ESQUERDA) */}
                            <motion.div
                                key={selectedKingdom.nome + 'lore'}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-2 prose prose-sm max-w-none dark:prose-invert"
                            >
                                <div className="border-b-2 border-arton-gold pb-4 mb-6">
                                    <h1 className="text-4xl font-black font-serif text-arton-red m-0 uppercase flex items-center gap-3">
                                        <Sunrise className="w-8 h-8 text-arton-gold" />
                                        {selectedKingdom.nome}
                                    </h1>
                                    <p className="text-sm italic text-zinc-500 mt-1 m-0">{selectedKingdom.titulo}</p>
                                </div>
                                <div className="text-justify leading-relaxed text-zinc-800 dark:text-zinc-300 first-letter:float-left first-letter:text-7xl first-letter:pr-2 first-letter:font-black first-letter:text-arton-red first-letter:font-serif first-letter:leading-[0.8]">
                                    {selectedKingdom.lore}
                                </div>
                            </motion.div>

                            {/* RULE BOX DE DETALHES (DIREITA) */}
                            <motion.div
                                key={selectedKingdom.nome + 'box'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg self-start shadow-inner"
                            >
                                <h4 className="text-xs uppercase font-black tracking-widest text-[#c5a059] border-b border-[#c5a059]/30 pb-2 mb-4 flex items-center gap-2">
                                    <Settings2 className="w-4 h-4" /> Detalhes Geográficos
                                </h4>

                                <div className="space-y-4 text-sm font-sans">
                                    {selectedKingdom.detalhes.capital && (
                                        <div>
                                            <span className="block text-[10px] font-black uppercase text-zinc-500">Capital</span>
                                            <span className="font-bold text-zinc-900 dark:text-white">{selectedKingdom.detalhes.capital}</span>
                                        </div>
                                    )}
                                    {selectedKingdom.detalhes.regente && (
                                        <div>
                                            <span className="block text-[10px] font-black uppercase text-zinc-500">Regente</span>
                                            <span className="text-zinc-800 dark:text-zinc-300">{selectedKingdom.detalhes.regente}</span>
                                        </div>
                                    )}
                                    {selectedKingdom.detalhes.clima && (
                                        <div>
                                            <span className="block text-[10px] font-black uppercase text-zinc-500">Clima</span>
                                            <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300">
                                                <Wind className="w-3 h-3 text-blue-500" /> {selectedKingdom.detalhes.clima}
                                            </span>
                                        </div>
                                    )}
                                    {selectedKingdom.detalhes.locais_notaveis && (
                                        <div>
                                            <span className="block text-[10px] font-black uppercase text-zinc-500 mb-1">Locais Notáveis</span>
                                            <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-700 dark:text-zinc-400">
                                                {selectedKingdom.detalhes.locais_notaveis.map((local, i) => (
                                                    <li key={i}>{local}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {activeTab === 'cronologia' && (
                    <div className="max-w-5xl mx-auto relative select-none pb-20">
                        {/* A LINHA CENTRAL (RED LINE) */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-arton-red via-arton-gold to-arton-red opacity-50 dark:opacity-30"></div>

                        <div className="space-y-12">
                            {chronology.map((era, index) => (
                                <div key={index} className={`flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>

                                    {/* LADO DO TEXTO */}
                                    <div className="w-5/12 group cursor-pointer" onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                                        <div className={`p-6 rounded-lg border-2 transition-all duration-500 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm
                                            ${index === expandedIndex ? 'border-arton-gold shadow-[0_0_20px_rgba(197,160,89,0.2)]' : 'border-arton-red/30 hover:border-arton-red dark:border-arton-red/30 dark:hover:border-arton-red'}`}>

                                            <span className="text-arton-gold font-serif font-black text-sm tracking-widest">{era.ano}</span>

                                            {/* Extraindo Título do Evento se possível, ou exibindo uma parte do texto */}
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-tighter mt-1">
                                                {era.evento.split('.')[0]}
                                            </h3>

                                            <p className={`text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif transition-all duration-500 overflow-hidden ${index === expandedIndex ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                                {era.evento}
                                            </p>

                                            {index !== expandedIndex && <p className="text-arton-red text-[10px] mt-3 italic animate-pulse font-bold uppercase tracking-widest">Clique para ler o registro...</p>}
                                        </div>
                                    </div>

                                    {/* O MARCADOR CENTRAL (DIAMANTE) */}
                                    <div className="z-10 relative">
                                        <div className={`w-10 h-10 rotate-45 border-4 transition-all duration-500 flex items-center justify-center
                                            ${index === expandedIndex ? 'bg-arton-gold border-white dark:border-zinc-950 scale-125' : 'bg-zinc-100 dark:bg-black border-arton-red'}`}>
                                            <div className="-rotate-45 text-zinc-900 dark:text-white font-black font-serif text-sm">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* LADO VAZIO (EQUILÍBRIO) */}
                                    <div className="w-5/12"></div>
                                </div>
                            ))}
                        </div>

                        {/* RODAPÉ DO TOMO */}
                        <div className="mt-20 text-center text-zinc-500 dark:text-zinc-600 text-xs italic uppercase tracking-widest font-black">
                            <p>Extraído dos anais da Grande Academia Arcana de Valkaria</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
