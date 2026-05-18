"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderFrame } from '@/components/layout/HeaderFrame';
import { getArtifacts } from '@/core/lib/data';
import { Button } from '@/core/ui/button';
import { Sparkles, Skull, Flame, Shield, Dices } from 'lucide-react';

export default function ChaosDeckPage() {
    const artifacts = getArtifacts();
    const chaosDeck = artifacts.find(a => a.nome === "Baralho do Caos");

    const cards = chaosDeck?.cartas || [];

    // State
    const [deckOpen, setDeckOpen] = useState(false);
    const [drawnCard, setDrawnCard] = useState<{ nome: string; efeito: string } | null>(null);
    const [drawing, setDrawing] = useState(false);

    const drawCard = () => {
        if (!cards.length) return;
        setDrawing(true);
        setDrawnCard(null);

        // Simulate drawing animation
        setTimeout(() => {
            const randomIdx = Math.floor(Math.random() * cards.length);
            setDrawnCard(cards[randomIdx]);
            setDrawing(false);
        }, 1500); // 1.5s tension delay
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans relative overflow-hidden flex flex-col items-center">
            <HeaderFrame>
                <div className="flex items-center gap-3 justify-center text-center flex-col">
                    <div className="flex items-center gap-3">
                        <Dices className="w-8 h-8 text-arton-gold" />
                        <span>Baralho do Caos</span>
                    </div>
                </div>
            </HeaderFrame>
            <p className="text-zinc-400 font-serif italic mb-8 mt-2 text-center text-lg max-w-lg relative z-10">
                Aposte Sua Vida, Ganhe Tudo ou Perca a Alma.
            </p>

            <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center justify-center flex-1 mt-12 gap-12">
                {!deckOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-64 h-96 bg-red-950 border-4 border-[#c5a059] rounded-xl mx-auto shadow-[0_0_50px_rgba(139,0,0,0.5)] flex items-center justify-center flex-col gap-6 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setDeckOpen(true)}>
                            <Skull className="w-16 h-16 text-[#c5a059]" />
                            <h2 className="text-[#c5a059] font-black uppercase tracking-widest font-serif text-xl border-b border-[#c5a059] pb-2">O Artefato</h2>
                        </div>
                        <p className="mt-8 text-zinc-400 italic font-serif max-w-lg">
                            "{chaosDeck?.mecanica || 'Um baralho misterioso onde cada carta altera o destino. Você deve declarar quantas cartas vai puxar ANTES de começar.'}"
                        </p>
                    </motion.div>
                )}

                {deckOpen && (
                    <div className="w-full flex justify-center items-center gap-12">
                        {/* THE DECK */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                className="w-48 h-72 bg-[#8b0000] border-2 border-[#c5a059] rounded-lg shadow-[0_0_30px_rgba(139,0,0,0.6)] flex items-center justify-center cursor-pointer group"
                                onClick={!drawing ? drawCard : undefined}
                                whileHover={{ y: -10 }}
                                animate={drawing ? { x: [-5, 5, -5, 5, 0], y: [-5, 5, -5, 5, 0] } : {}}
                                transition={{ duration: 0.2, repeat: drawing ? 5 : 0 }}
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
                                <Dices className="w-12 h-12 text-[#c5a059] group-hover:scale-110 transition-transform" />
                            </motion.div>
                            <Button
                                onClick={!drawing ? drawCard : undefined}
                                disabled={drawing}
                                className="mt-6 bg-[#c5a059] hover:bg-yellow-600 text-black font-black uppercase tracking-widest w-full border-none"
                            >
                                {drawing ? "Sacando..." : "Sacar Carta"}
                            </Button>
                        </div>

                        {/* DRAWN CARD SEAT */}
                        <div className="w-64 h-96 relative border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center perspective-[1000px]">
                            <AnimatePresence>
                                {drawnCard && (
                                    <motion.div
                                        key={drawnCard.nome}
                                        initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
                                        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                                        exit={{ rotateY: -180, scale: 0.5, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                        className="absolute inset-0 bg-zinc-100 border-4 border-[#c5a059] rounded-xl flex flex-col p-6 shadow-2xl backface-hidden"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <div className="border border-[#c5a059]/30 flex-1 flex flex-col items-center justify-between p-4 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
                                            <div className="text-[#8b0000] font-black uppercase tracking-widest text-lg text-center border-b-2 border-[#8b0000] pb-2 w-full">
                                                {drawnCard.nome}
                                            </div>

                                            <div className="flex-1 flex items-center justify-center w-full my-4 relative">
                                                {/* Icon based on effect type (simple heuristic) */}
                                                {drawnCard.efeito.toLowerCase().includes("morte") || drawnCard.efeito.toLowerCase().includes("perde") ? (
                                                    <Flame className="w-16 h-16 text-[#8b0000]" />
                                                ) : drawnCard.efeito.toLowerCase().includes("ganha") || drawnCard.efeito.toLowerCase().includes("pm") ? (
                                                    <Sparkles className="w-16 h-16 text-[#c5a059]" />
                                                ) : (
                                                    <Shield className="w-16 h-16 text-zinc-600" />
                                                )}
                                            </div>

                                            <div className="text-black font-serif text-center text-sm font-semibold italic border-t-2 border-[#8b0000]/30 pt-4 w-full h-[30%] overflow-y-auto custom-scrollbar">
                                                {drawnCard.efeito}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {!drawnCard && !drawing && (
                                <span className="text-zinc-600 uppercase font-black text-xs tracking-widest opacity-50 text-center">
                                    O Destino Aguarda
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* SELO MÁGICO BACKGROUND */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8b0000] rotate-45 opacity-[0.02] pointer-events-none rounded-3xl" />
        </div>
    );
}
