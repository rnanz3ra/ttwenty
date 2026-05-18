"use client";

import { useState } from "react";
import { Monster } from "@/core/types";
import { Dialog, DialogContent } from "@/core/ui/dialog";
import { X, Heart, Shield, Zap, Skull, Swords, Crosshair, Scroll } from "lucide-react";
import spellsData from "@/data/magias.json";
import { useUIStore } from "@/core/store/ui-store";
import { SmartTooltip } from "@/core/ui/smart-tooltip";
import { cn } from "@/core/lib/utils";

interface MonsterDetailModalProps {
    monster: Monster | null;
    onClose: () => void;
}

export function MonsterDetailModal({ monster, onClose }: MonsterDetailModalProps) {
    const { openDrawer } = useUIStore();

    if (!monster) return null;

    return (
        <Dialog open={!!monster} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-6xl p-0 border-none bg-transparent overflow-visible shadow-none">
                <div className="relative w-full min-h-[85vh] md:h-[800px] bg-[#E8DCC4] rounded-sm overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#A6894A]/30 isolate">
                    
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-multiply z-0" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none z-0" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-[#8B0000] hover:text-[#A6894A] transition-all z-50 hover:rotate-90 duration-300"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* ── LEFT COLUMN: Illustration & Stats (40%) ── */}
                    <div className="w-full md:w-[40%] bg-[#0D0202] relative overflow-hidden flex flex-col border-r border-[#A6894A]/20">
                        {/* Illustration */}
                        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0202] via-transparent to-transparent z-10" />
                            <img 
                                src={
                                    monster.imageUrl || 
                                    (monster.id.includes('orc') ? '/assets/generated/monster_orc.png' :
                                     monster.id.includes('esqueleto') ? '/assets/generated/monster_esqueleto.png' :
                                     monster.id === 'glop' ? '/assets/generated/monster_glop.png' :
                                     monster.id.includes('manticora') ? '/assets/generated/monster_manticora.png' :
                                     monster.id.includes('aharadak') ? '/assets/generated/monster_aharadak.png' :
                                     '/assets/generated/module_bestiario.png')
                                } 
                                alt={monster.name}
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                            />
                            
                            {/* ND Badge */}
                            <div className="absolute top-8 left-8 z-20">
                                <div className="bg-[#8B0000] text-[#E8DCC4] p-4 shadow-2xl border border-[#A6894A]/40 flex flex-col items-center min-w-[70px] -rotate-3">
                                    <span className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60">ND</span>
                                    <span className="text-4xl font-display font-bold">{monster.level}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Overlay */}
                        <div className="flex-1 p-8 flex flex-col gap-6 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-[#A6894A]/20 p-4 rounded-sm flex flex-col items-center">
                                    <Heart className="w-5 h-5 text-[#8B0000] mb-2" />
                                    <span className="text-2xl font-display font-bold text-[#E8DCC4]">{monster.hp}</span>
                                    <span className="text-[9px] font-display font-bold text-[#A6894A] uppercase tracking-widest">Vida</span>
                                </div>
                                <div className="bg-white/5 border border-[#A6894A]/20 p-4 rounded-sm flex flex-col items-center">
                                    <Shield className="w-5 h-5 text-[#A6894A] mb-2" />
                                    <span className="text-2xl font-display font-bold text-[#E8DCC4]">{monster.defense}</span>
                                    <span className="text-[9px] font-display font-bold text-[#A6894A] uppercase tracking-widest">Defesa</span>
                                </div>
                            </div>

                            {/* Attributes */}
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(monster.attributes).map(([key, val]) => (
                                    <div key={key} className="flex flex-col items-center bg-white/5 py-2 rounded-sm border border-white/5 hover:border-[#A6894A]/30 transition-all">
                                        <span className="text-[8px] font-display font-bold text-[#A6894A] uppercase tracking-[0.2em]">{key}</span>
                                        <span className="text-sm font-display font-bold text-[#E8DCC4]">{val ?? '-'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: Content (60%) ── */}
                    <div className="w-full md:w-[60%] flex flex-col p-8 md:p-12 overflow-hidden relative">
                        {/* Header */}
                        <div className="mb-8 relative shrink-0">
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#8B0000] uppercase tracking-tight mb-2">
                                {monster.name}
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="h-[2px] w-12 bg-[#8B0000]" />
                                <span className="text-xs font-serif font-bold text-[#A6894A] uppercase tracking-[0.3em]">
                                    {monster.type} • {monster.size}
                                </span>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto scrollbar-blood pr-4 space-y-10">
                            
                            {/* Description/Lore */}
                            <section>
                                <h3 className="text-[#8B0000] font-display font-bold text-xs uppercase tracking-[0.2em] mb-4 border-b border-[#A6894A]/20 pb-2 flex items-center gap-2">
                                    <Scroll className="w-4 h-4 text-[#A6894A]" /> Registro do Explorador
                                </h3>
                                <p className="text-[#1A1A1A] font-serif text-[1.05rem] leading-relaxed text-justify whitespace-pre-line selection:bg-[#8B0000]/20 italic opacity-90">
                                    "{monster.description || "Relatos de aventureiros sobreviventes descrevem esta criatura como uma manifestação pura dos perigos que assolam as terras de Arton..."}"
                                </p>
                            </section>

                            {/* Combat Capabilities */}
                            <section>
                                <h3 className="text-[#8B0000] font-display font-bold text-xs uppercase tracking-[0.2em] mb-6 border-b border-[#A6894A]/20 pb-2 flex items-center gap-2">
                                    <Swords className="w-4 h-4 text-[#A6894A]" /> Repertório de Combate
                                </h3>
                                <div className="space-y-4">
                                    {monster.attacks.map((atk, idx) => (
                                        <div key={idx} className="bg-black/5 p-4 border-l-4 border-[#8B0000] rounded-r-md">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-display font-bold text-sm text-[#1A1A1A] uppercase">{atk.name}</span>
                                                <span className="font-display font-bold text-[#8B0000]">+{atk.bonus}</span>
                                            </div>
                                            <div className="text-xs font-serif text-slate-600 italic">
                                                Dano: <span className="text-[#1A1A1A] not-italic font-bold">{atk.damage}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Special Abilities */}
                            <section>
                                <h3 className="text-[#8B0000] font-display font-bold text-xs uppercase tracking-[0.2em] mb-6 border-b border-[#A6894A]/20 pb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[#A6894A]" /> Habilidades Especiais
                                </h3>
                                <div className="space-y-6">
                                    {monster.abilities?.map((ab, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-display font-bold text-[#8B0000] text-sm uppercase">• {ab.name}</span>
                                                {ab.cost && <span className="bg-[#8B0000] text-[#E8DCC4] text-[9px] px-1.5 py-0.5 font-bold rounded-sm">{ab.cost}</span>}
                                            </div>
                                            <p className="font-serif text-sm text-[#1A1A1A] leading-relaxed text-justify">
                                                {ab.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Spells */}
                            {monster.magias && (
                                <section>
                                    <h3 className="text-[#8B0000] font-display font-bold text-xs uppercase tracking-[0.2em] mb-6 border-b border-[#A6894A]/20 pb-2 flex items-center gap-2">
                                        <Skull className="w-4 h-4 text-[#A6894A]" /> Conhecimento Arcano (CD {monster.magias.cd})
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {monster.magias.lista.map((spellName, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    const spellData = spellsData.find((s: any) => (s.name || s.nome).toLowerCase() === spellName.toLowerCase());
                                                    if (spellData) openDrawer('spell', spellData);
                                                }}
                                                className="px-4 py-2 bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000] font-display font-bold text-[10px] uppercase tracking-widest hover:bg-[#8B0000] hover:text-[#E8DCC4] transition-all rounded-sm"
                                            >
                                                {spellName}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Defenses & Resistances */}
                            {(monster.imunidades || monster.rd !== undefined) && (
                                <section className="pt-6 mt-4 border-t border-[#A6894A]/20 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {monster.rd !== undefined && (
                                        <div>
                                            <span className="text-[10px] font-display font-bold text-[#8B0000] uppercase tracking-widest block mb-1">Resistência a Dano</span>
                                            <span className="text-lg font-display font-bold text-[#1A1A1A]">{monster.rd}</span>
                                        </div>
                                    )}
                                    {monster.imunidades && (
                                        <div>
                                            <span className="text-[10px] font-display font-bold text-[#8B0000] uppercase tracking-widest block mb-1">Imunidades</span>
                                            <div className="flex flex-wrap gap-1">
                                                {monster.imunidades.map((im, i) => (
                                                    <span key={i} className="text-[11px] font-serif font-bold bg-black/5 px-2 py-0.5 border border-black/10 text-[#1A1A1A] rounded-sm">{im}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>

                        {/* Footer Decorative */}
                        <div className="mt-8 pt-4 border-t border-[#A6894A]/10 flex justify-between items-center shrink-0">
                            <span className="text-[9px] font-serif uppercase tracking-[0.4em] text-[#A6894A] opacity-60">Bestiário • Tomo de Ameaças de Arton</span>
                            <div className="flex gap-2">
                                <div className="w-1 h-1 bg-[#8B0000] rounded-full" />
                                <div className="w-1 h-1 bg-[#A6894A] rounded-full" />
                                <div className="w-1 h-1 bg-[#8B0000] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

