"use client";

import { useState, useMemo } from "react";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Label } from "@/core/ui/label";
import { getNPCTable } from "@/core/lib/data";
import { NPCTableEntry } from "@/core/types";
import {
    Sword,
    Shield,
    Heart,
    Sparkles,
    Zap,
    Skull,
    Save
} from "lucide-react";
import { cn } from "@/core/lib/utils";

type Archetype = "Equilibrado" | "Bruto" | "Conjurador";

export default function NPCBuilderPage() {
    const npcTable = getNPCTable();
    const [selectedND, setSelectedND] = useState("1/2");
    const [archetype, setArchetype] = useState<Archetype>("Equilibrado");

    const baseStats = useMemo(() => {
        return npcTable.find(e => e.nd === selectedND) || npcTable[0];
    }, [selectedND, npcTable]);

    const finalStats = useMemo(() => {
        const stats = { ...baseStats };

        if (archetype === "Bruto") {
            stats.pv = Math.round(stats.pv * 1.2);
            stats.defesa -= 2;
            stats.ataque += 2;
        } else if (archetype === "Conjurador") {
            stats.pv = Math.round(stats.pv * 0.8);
            stats.cd += 2;
            stats.ataque -= 2;
        }

        return stats;
    }, [baseStats, archetype]);

    return (
        <main className="min-h-screen bg-[#0a0a0a] py-20 px-4 md:px-10 font-serif">
            <div className="max-w-4xl mx-auto space-y-10">
                <HeaderFrame className="max-w-md mx-auto uppercase">
                    Gerador de NPCs
                </HeaderFrame>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CONFIGURAÇÃO */}
                    <Card className="md:col-span-1 border-zinc-800 bg-black/40 border-b-4">
                        <CardHeader>
                            <CardTitle className="text-xs uppercase text-zinc-500 tracking-widest">Parâmetros</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-arton-gold">Nível de Desafio (ND)</Label>
                                <select
                                    value={selectedND}
                                    onChange={(e) => setSelectedND(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white outline-none focus:border-arton-red"
                                >
                                    {npcTable.map(e => (
                                        <option key={e.nd} value={e.nd}>ND {e.nd}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-arton-gold">Arquétipo</Label>
                                <div className="flex flex-col gap-2">
                                    {(["Equilibrado", "Bruto", "Conjurador"] as Archetype[]).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setArchetype(type)}
                                            className={cn(
                                                "w-full px-3 py-2 text-left text-xs rounded border transition-all uppercase font-bold",
                                                archetype === type
                                                    ? "bg-arton-red border-arton-red text-white"
                                                    : "bg-black border-zinc-800 text-zinc-500 hover:border-arton-red"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[9px] text-zinc-600 italic mt-1">
                                    {archetype === "Bruto" && "+20% PV, +2 Atk, -2 Def"}
                                    {archetype === "Conjurador" && "-20% PV, +2 CD, -2 Atk"}
                                    {archetype === "Equilibrado" && "Valores base da Tabela 7-2"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* DADOS DO NPC */}
                    <Card className="md:col-span-2 border-zinc-800 bg-zinc-950/60 border-b-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Skull className="w-32 h-32" />
                        </div>

                        <CardHeader className="border-b border-zinc-900">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-arton-gold" />
                                    <span className="text-arton-gold uppercase tracking-tighter">Estatísticas Geradas</span>
                                </div>
                                <div className="text-[10px] bg-arton-red px-2 py-1 rounded text-white font-black">
                                    ND {selectedND}
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="grid grid-cols-2">
                                <div className="p-6 border-r border-b border-zinc-900 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-950/30 flex items-center justify-center">
                                        <Sword className="w-5 h-5 text-arton-red" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Ataque</div>
                                        <div className="text-2xl font-black text-white">+{finalStats.ataque}</div>
                                    </div>
                                </div>
                                <div className="p-6 border-b border-zinc-900 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-950/30 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Defesa</div>
                                        <div className="text-2xl font-black text-white">{finalStats.defesa}</div>
                                    </div>
                                </div>
                                <div className="p-6 border-r border-zinc-900 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-950/30 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Pontos de Vida</div>
                                        <div className="text-2xl font-black text-white">{finalStats.pv}</div>
                                    </div>
                                </div>
                                <div className="p-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-950/30 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold">CD de Magia/Hab.</div>
                                        <div className="text-2xl font-black text-white">{finalStats.cd}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-black/40 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500 font-bold uppercase text-[10px]">Dano Médio</span>
                                    <span className="text-arton-gold font-black">{finalStats.dano}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500 font-bold uppercase text-[10px]">Bônus de Perícias</span>
                                    <span className="text-white font-mono">+{finalStats.pericias} / +{Math.floor(finalStats.pericias / 2)}</span>
                                </div>

                                <Button className="w-full bg-arton-gold hover:bg-[#a6864a] text-black font-black uppercase tracking-widest mt-4">
                                    <Save className="w-4 h-4 mr-2" />
                                    Exportar para Combate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
