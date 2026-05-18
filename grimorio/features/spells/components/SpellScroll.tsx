"use client";

import { useState, useEffect } from "react";
import { cn } from "@/core/lib/utils";
import { Scroll, Zap, Info, CheckCircle2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCharacterStore } from "@/core/store/character-store";

interface SpellScrollProps {
    spell: any;
}

export function SpellScroll({ spell }: SpellScrollProps) {
    const [selectedAprimoramentos, setSelectedAprimoramentos] = useState<number[]>([]);
    const [totalPM, setTotalPM] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const { pm, spendPM } = useCharacterStore();

    // PM Base according to circle
    const basePM = spell.circulo ? (
        spell.circulo === 1 ? 1 :
            spell.circulo === 2 ? 3 :
                spell.circulo === 3 ? 6 :
                    spell.circulo === 4 ? 10 : 15
    ) : 1;

    useEffect(() => {
        const extraPM = selectedAprimoramentos.reduce((acc, idx) => {
            return acc + (spell.aprimoramentos?.[idx]?.custo || 0);
        }, 0);
        setTotalPM(basePM + extraPM);
    }, [selectedAprimoramentos, spell, basePM]);

    // Reset selecionados ao mudar de magia
    useEffect(() => {
        setSelectedAprimoramentos([]);
    }, [spell]);

    const toggleAprimoramento = (idx: number) => {
        setSelectedAprimoramentos(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const handleCast = () => {
        if (spendPM(totalPM)) {
            setShowConfirm(false);
            alert(`Você conjurou ${spell.nome}! ${totalPM} PM subtraídos.`);
        } else {
            alert("Você não possui mana suficiente para canalizar este poder!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="spell-scroll relative w-full min-h-[800px] shadow-2xl p-8 md:p-14 overflow-hidden border-y-[20px] border-[#d4c49c]"
            key={spell.nome}
        >
            {/* Efeito de Bordas Enroladas */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            {/* Textura de Papel */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply" />

            {/* Contador de PM Flutuante */}
            <div className="absolute top-6 right-8 z-20 flex flex-col items-center">
                <div className="bg-blue-900/90 text-white p-4 shadow-xl border-2 border-blue-400 rotate-3 flex flex-col items-center min-w-[80px]">
                    <span className="text-[9px] uppercase font-black tracking-tighter">Custo Total</span>
                    <span className="text-3xl font-serif font-black leading-none">{totalPM} PM</span>
                </div>
            </div>

            {/* Botão Lançar Magia */}
            <div className="absolute bottom-12 right-12 z-50">
                <button
                    onClick={() => setShowConfirm(true)}
                    className="bg-arton-red hover:bg-arton-red/90 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-arton-gold font-serif font-black flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95"
                >
                    <Wand2 className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
                    LANÇAR MAGIA
                </button>
            </div>

            {/* Modal de Confirmação Diegético */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black/60 flex items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#f4e4bc] p-10 border-4 border-arton-gold shadow-2xl max-w-md w-full relative"
                        >
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply" />

                            <h3 className="text-sepia-900 font-serif text-3xl font-black mb-4 uppercase">Gasto de Mana</h3>
                            <p className="text-sepia-800 font-serif italic mb-8">
                                Você deseja canalizar sua essência para lançar <b className="text-arton-red">{spell.nome}</b>?<br />
                                <span className="text-2xl block mt-4 font-black">Gastar {totalPM} PM?</span>
                            </p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-6 py-2 border-2 border-sepia-900 text-sepia-900 font-black uppercase text-xs hover:bg-sepia-900/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCast}
                                    className="px-8 py-2 bg-arton-red text-white font-black uppercase text-xs hover:bg-arton-red/90 shadow-lg"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cabeçalho do Pergaminho */}
            <div className="relative z-10 mb-12 border-b-2 border-sepia-900/10 pb-6">
                {/* Imagem Épica (Se existir) */}
                <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg shadow-xl border-2 border-arton-gold/30">
                    <img
                        src={`/assets/spells/${spell.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')}.jpg`}
                        alt={spell.nome}
                        className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-700"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f4e4bc] via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex items-center gap-4 mb-2">
                    <Scroll className="w-8 h-8 text-[#2b1a0a]" />
                    <h2 className="font-serif text-5xl font-black text-[#2b1a0a] uppercase tracking-tighter">
                        {spell.nome}
                    </h2>
                </div>
                <p className="spell-label text-xs font-serif italic tracking-[0.3em] uppercase">
                    {(spell.escola || spell.regras_tecnicas?.escola)} • {spell.circulo}º Círculo
                </p>
            </div>

            {/* Layout 70/30 Estilo Pergaminho */}
            <div className="flex flex-row gap-12 relative z-10 flex-1 h-full">

                {/* LORE E EFEITO (70%) */}
                <div className="w-[70%] space-y-10">
                    <div className="spell-lore-text drop-cap text-justify leading-relaxed font-serif text-lg first-letter:text-[#8b0000] first-letter:text-5xl first-letter:mr-2">
                        {spell.lore}
                    </div>

                    <div className="space-y-4">
                        <h3 className="spell-label font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4 text-arton-gold" /> Efeito da Magia
                        </h3>
                        <div className="p-8 bg-white/30 border-2 border-[#2b1a0a]/10 rounded-xl shadow-inner relative overflow-hidden">
                            <p className="font-serif text-xl leading-relaxed">
                                {spell.efeito || spell.efeito_base}
                            </p>
                        </div>
                    </div>
                </div>

                {/* REGRAS TÉCNICAS (30%) - Notas de Margem */}
                <div className="w-[30%] space-y-8">
                    <div className="bg-sepia-900/5 border-2 border-dashed border-sepia-900/20 p-6 space-y-6">
                        <h3 className="text-sepia-900 font-serif font-black text-[10px] uppercase tracking-widest text-center border-b border-sepia-900/10 pb-2">
                            Anotações Arcanas
                        </h3>

                        {Object.entries(spell.regras || spell.regras_tecnicas || {}).map(([key, val]: [string, any]) => (
                            <div key={key} className="flex flex-col gap-0.5 border-b border-[#2b1a0a]/5 pb-2 last:border-0">
                                <span className="spell-label text-[8px] font-black uppercase opacity-80 tracking-tighter">{key}</span>
                                <span className="text-xs font-bold">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* APRIMORAMENTOS (Seção Inferior) */}
            <div className="relative z-10 mt-12 pt-8 border-t-2 border-sepia-900/10">
                <h3 className="text-sepia-900 font-serif font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700" /> Aprimoramentos Disponíveis
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {spell.aprimoramentos?.map((ap: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => toggleAprimoramento(idx)}
                            className={cn(
                                "flex items-start gap-4 p-4 transition-all text-left group border-2",
                                selectedAprimoramentos.includes(idx)
                                    ? "bg-sepia-900/10 border-sepia-900/20 shadow-md"
                                    : "bg-transparent border-transparent hover:bg-sepia-900/5"
                            )}
                        >
                            <div className={cn(
                                "mt-1 w-5 h-5 min-w-[20px] border-2 flex items-center justify-center transition-colors",
                                selectedAprimoramentos.includes(idx)
                                    ? "bg-sepia-900 border-sepia-900 text-white"
                                    : "border-sepia-900/30"
                            )}>
                                {selectedAprimoramentos.includes(idx) && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase text-sepia-900">
                                        {ap.custo > 0 ? `+${ap.custo} PM` : "Truque"}
                                    </span>
                                </div>
                                <p className="text-xs text-sepia-800 leading-relaxed italic">
                                    {ap.efeito}
                                </p>
                            </div>
                        </button>
                    ))}
                    {(!spell.aprimoramentos || spell.aprimoramentos.length === 0) && (
                        <p className="text-xs text-sepia-700 italic opacity-50">Nenhum aprimoramento disponível para esta magia.</p>
                    )}
                </div>
            </div>

            <style jsx>{`
                .text-sepia-900 { color: #433422; }
                .text-sepia-800 { color: #5e4934; }
                .text-sepia-700 { color: #7a5f46; }
                .border-sepia-900 { border-color: #433422; }
            `}</style>
        </motion.div>
    );
}
