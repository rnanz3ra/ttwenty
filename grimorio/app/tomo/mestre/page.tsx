"use client";

import { useState } from "react";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import {
    Map as MapIcon,
    Search,
    Scroll,
    CloudRain,
    Dices
} from "lucide-react";
import { getAdventureSteps, getTravelRules, getDowntimeRules } from "@/core/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/core/lib/utils";

export default function MestrePage() {
    // Calculadora de Viagem
    const travelRules = getTravelRules();
    const [distancia, setDistancia] = useState(18);
    const [velocidade, setVelocidade] = useState("9m");
    const [climaSevero, setClimaSevero] = useState(false);

    // @ts-ignore
    const baseKmDia = parseInt(travelRules.velocidade_dia[velocidade]) || 18;
    const kmDiaFinal = climaSevero ? baseKmDia / 2 : baseKmDia;
    const diasViagem = Math.ceil(distancia / kmDiaFinal);

    // Simulador de Busca (Downtime)
    const [buscaStep, setBuscaStep] = useState(0); // 0: Idle, 1: Testing, 2: Result
    const [sucessos, setSucessos] = useState(0);
    const [randomRoll, setRandomRoll] = useState(0);

    const iniciarBusca = () => {
        setBuscaStep(1);
        setSucessos(0);

        // Simular os 3 testes CD 20
        const roll1 = Math.random() > 0.5; // Jogador
        const roll2 = Math.random() > 0.6; // Mestre
        const d12_1 = Math.floor(Math.random() * 12) + 1;
        const d12_2 = Math.floor(Math.random() * 12) + 1;
        const roll3 = (d12_1 + d12_2) >= 15; // Aleatória 2d12 vs CD 20

        setRandomRoll(d12_1 + d12_2);

        let total = 0;
        if (roll1) total++;
        if (roll2) total++;
        if (roll3) total++;

        setTimeout(() => {
            setSucessos(total);
            setBuscaStep(2);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] py-20 px-4 md:px-10 font-serif">
            <div className="max-w-6xl mx-auto space-y-12">
                <HeaderFrame className="max-w-xl mx-auto uppercase text-center">
                    Tomo do Mestre
                </HeaderFrame>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* CALCULADORA DE VIAGEM */}
                    <Card className="border-zinc-800 bg-zinc-950/40 backdrop-blur-xl border-[3px] border-b-[6px]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-arton-gold uppercase tracking-widest text-sm">
                                <MapIcon className="w-5 h-5 text-arton-red" />
                                Calculadora de Viagem
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-zinc-500">Distância Total (km)</Label>
                                <Input
                                    type="number"
                                    value={distancia}
                                    onChange={(e) => setDistancia(Number(e.target.value))}
                                    className="bg-black border-zinc-800 text-arton-gold font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-zinc-500">Velocidade do Grupo</Label>
                                    <select
                                        value={velocidade}
                                        onChange={(e) => setVelocidade(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white outline-none focus:border-arton-red"
                                    >
                                        <option value="4.5m">4.5m (Lento)</option>
                                        <option value="9m">9m (Normal)</option>
                                        <option value="12m">12m (Rápido)</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant={climaSevero ? "destructive" : "outline"}
                                        onClick={() => setClimaSevero(!climaSevero)}
                                        className="w-full gap-2 border-zinc-800 uppercase text-[10px] font-bold"
                                    >
                                        <CloudRain className="w-4 h-4" />
                                        {climaSevero ? "Clima Severo" : "Clima Aberto"}
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 bg-red-950/10 border border-red-900/40 rounded-lg text-center shadow-inner">
                                <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1 tracking-tighter">Tempo Estimado de Viagem</div>
                                <div className="text-6xl font-black text-white">{diasViagem} <span className="text-lg text-arton-red">DIAS</span></div>
                                <div className="text-[9px] text-zinc-600 mt-2 italic uppercase">Cálculo baseado em marcha forçada (Lote 74).</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SIMULADOR DE BUSCA */}
                    <Card className="border-zinc-800 bg-zinc-950/40 backdrop-blur-xl border-[3px] border-b-[6px] relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-arton-gold uppercase tracking-widest text-sm">
                                <Search className="w-5 h-5 text-arton-red" />
                                Simulador de Busca (Downtime)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {buscaStep === 0 && (
                                <div className="text-center py-10 space-y-6">
                                    <p className="text-zinc-500 text-xs leading-relaxed px-10 italic uppercase font-bold tracking-tighter">
                                        "O mundo é vasto e cheio de segredos. Role 3 perícias para encontrar seu destino."
                                    </p>
                                    <Button onClick={iniciarBusca} className="bg-arton-red hover:bg-red-700 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-red-900/20">
                                        Iniciar Busca
                                    </Button>
                                </div>
                            )}

                            {buscaStep === 1 && (
                                <div className="text-center py-20 space-y-4">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    >
                                        <Dices className="w-12 h-12 text-arton-gold mx-auto" />
                                    </motion.div>
                                    <p className="text-arton-gold animate-pulse uppercase font-black text-[10px] tracking-widest">Consultando as Crônicas...</p>
                                </div>
                            )}

                            {buscaStep === 2 && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex justify-center gap-6 text-center">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={cn(
                                                    "w-14 h-14 rounded border-[3px] flex items-center justify-center text-2xl font-black rotate-45 transform transition-all shadow-lg",
                                                    i <= sucessos
                                                        ? "bg-green-600/20 border-green-500 text-green-500"
                                                        : "bg-red-600/20 border-red-500 text-red-500 opacity-20"
                                                )}>
                                                    <span className="-rotate-45">{i <= sucessos ? "✓" : "✗"}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 bg-black border border-zinc-800 rounded text-center">
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Perícia Aleatória (2d12)</div>
                                            <div className="text-3xl font-black text-arton-gold font-mono">{randomRoll}</div>
                                        </div>

                                        <div className="text-center space-y-2 py-4">
                                            <h3 className={cn(
                                                "text-3xl font-black uppercase tracking-tighter",
                                                sucessos >= 2 ? "text-green-500" : "text-arton-red"
                                            )}>
                                                {sucessos === 0 ? "DESASTRE TOTAL" : sucessos === 1 ? "FRACASSO" : sucessos === 2 ? "SUCESSO" : "TRIUNFO"}
                                            </h3>
                                            <p className="text-[10px] text-zinc-500 italic uppercase font-bold">
                                                {sucessos === 0 ? "Você encontrou o que NÃO devia." : sucessos === 3 ? "Recompensas extras aguardam em Arton!" : "Busca concluída conforme o planejado."}
                                            </p>
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={() => setBuscaStep(0)}
                                            className="w-full border-zinc-800 uppercase font-bold text-[10px] tracking-widest hover:text-arton-gold transition-colors"
                                        >
                                            Reiniciar
                                        </Button>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </CardContent>
                    </Card>

                    {/* ESTRUTURA DE AVENTURA */}
                    <Card className="border-zinc-800 bg-zinc-950/40 backdrop-blur-xl border-[3px] border-b-[6px] lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-arton-gold uppercase tracking-widest text-sm">
                                <Scroll className="w-5 h-5 text-arton-red" />
                                Roteiro de Arton (Gestão de Cenas)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {getAdventureSteps().map((fase: any) => (
                                    <div key={fase.fase} className="p-4 bg-black/60 border border-zinc-900 rounded-lg hover:border-arton-red transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <span className="text-6xl font-black">{fase.fase}</span>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-[10px] text-arton-red font-black mb-1 uppercase">Etapa {fase.fase}</div>
                                            <div className="text-sm font-bold text-white group-hover:text-arton-gold transition-colors uppercase tracking-tighter">{fase.nome}</div>
                                            <div className="text-[10px] text-zinc-500 mt-2 italic leading-tight uppercase font-medium">{fase.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </main>
    );
}
