"use client";

import { useState, useEffect, useRef } from "react";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { BookmarkButton } from "@/components/layout/BookmarkButton";
import {
    Heart,
    Zap,
    Sword,
    Shield,
    Skull,
    Plus,
    Minus,
    ChevronRight,
    Dices,
    RotateCcw,
    User,
    Ghost,
    Search,
    X,
    MessageSquare
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import monstersData from "@/data/lotes_legado/bestiario/ameacas_db_consolidado.json";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
} from "@/core/ui/dialog";

import { CharacterSheet, AttributeBonus, Participant, LogEntry } from "@/core/types";

// COMPONENTE DO DADO INDIVIDUAL COM FLICKER
function DiceRoller({ onRollResult, threatRange = 20 }: { onRollResult: (val: number, isCrit: boolean) => void, threatRange?: number }) {
    const [rolling, setRolling] = useState(false);
    const [currentValue, setCurrentValue] = useState(20);
    const [isCritical, setIsCritical] = useState(false);

    const rollDice = () => {
        setRolling(true);
        setIsCritical(false);

        let counter = 0;
        const interval = setInterval(() => {
            setCurrentValue(Math.floor(Math.random() * 20) + 1);
            counter++;
            if (counter > 15) {
                clearInterval(interval);
                const finalValue = Math.floor(Math.random() * 20) + 1;
                setCurrentValue(finalValue);
                setRolling(false);

                const crit = finalValue >= threatRange;
                setIsCritical(crit);
                onRollResult(finalValue, crit);
            }
        }, 50);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-black/60 border-2 border-[#c5a059]/30 rounded-xl backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/5 to-transparent pointer-events-none" />

            <div className={cn(
                "w-24 h-24 flex items-center justify-center text-4xl font-black font-cinzel",
                "border-4 rotate-45 transition-all duration-300 relative z-10",
                rolling ? "border-white text-white animate-spin" :
                    isCritical ? "border-[#ff0000] text-[#ff0000] shadow-[0_0_30px_#ff0000] scale-110" :
                        "border-[#c5a059] text-[#c5a059] shadow-[0_0_15px_#c5a059/20]"
            )}>
                <span className="-rotate-45 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {currentValue}
                </span>
            </div>

            <button
                onClick={rollDice}
                disabled={rolling}
                className={cn(
                    "w-full py-3 bg-[#c5a059] text-black font-black rounded-lg uppercase text-xs tracking-widest transition-all relative z-10 active:scale-95",
                    "hover:bg-white hover:shadow-[0_0_20px_white] disabled:opacity-50"
                )}
            >
                {rolling ? "Invocando..." : "Rolar d20"}
            </button>

            <AnimatePresence>
                {isCritical && !rolling && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#ff0000] font-black animate-bounce uppercase text-[10px] tracking-[0.2em] relative z-10"
                    >
                        ⚔️ Ameaça Crítica ⚔️
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const CONDICOES = [
    { nome: "Abalado", icone: <AlertCircle className="w-3 h-3" /> },
    { nome: "Enjoado", icone: <AlertCircle className="w-3 h-3 text-green-500" /> },
    { nome: "Caído", icone: <AlertCircle className="w-3 h-3 text-orange-500" /> },
    { nome: "Cego", icone: <AlertCircle className="w-3 h-3 text-purple-500" /> },
    { nome: "Dano Contínuo", icone: <Skull className="w-3 h-3 text-red-500" /> }
];

// Reutilizando icones se necessário, mas vou usar os da Lucide
function AlertCircle({ className }: { className?: string }) {
    return <AlertCircleLucide className={className} />;
}
import { AlertCircle as AlertCircleLucide } from "lucide-react";

export default function CombatPage() {
    const [round, setRound] = useState(1);
    const [turnIndex, setTurnIndex] = useState(0);
    const [combatants, setCombatants] = useState<Participant[]>([
        { id: "p1", nome: "Sir Galen", iniciativa: 22, pv_atual: 45, pv_max: 50, pm_atual: 12, pm_max: 20, condicoes: ["Protegido"], tipo: "jogador", threat: 19 },
        { id: "m1", nome: "Lefeu Veridak", iniciativa: 18, pv_atual: 60, pv_max: 64, pm_atual: 0, pm_max: 0, condicoes: [], tipo: "inimigo", threat: 20 },
    ]);
    const [search, setSearch] = useState("");
    const [log, setLog] = useState<LogEntry[]>([
        { round: 1, message: "Iniciado o combate em Arton.", type: "info" }
    ]);
    const [diceResult, setDiceResult] = useState<{ value: number; bonus: number; total: number; isCrit: boolean } | null>(null);
    const [isPulsingCrit, setIsPulsingCrit] = useState(false);
    const logEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    const addLog = (message: string, type: LogEntry["type"] = "info") => {
        setLog(prev => [{ round, message, type }, ...prev]);
    };

    const nextTurn = () => {
        let nextIndex = turnIndex + 1;
        if (nextIndex >= combatants.length) {
            nextIndex = 0;
            setRound(r => r + 1);
            addLog(`Início da Rodada ${round + 1}`, "info");
        } else {
            setTurnIndex(nextIndex);
        }

        // Se mudarmos o setTurnIndex fora do IF, ele não atualiza imediatamente para o log
        if (nextIndex < combatants.length) setTurnIndex(nextIndex);

        const nextActive = combatants[nextIndex];
        addLog(`Turno de ${nextActive.nome}`, "info");
        if (nextActive.condicoes.includes("Dano Contínuo")) {
            addLog(`⚠️ Alerta: ${nextActive.nome} sofre dano contínuo!`, "status");
        }
    };

    const updateValue = (id: string, field: "pv_atual" | "pm_atual", delta: number) => {
        setCombatants(prev => prev.map(c => {
            if (c.id === id) {
                const maxField = field === "pv_atual" ? "pv_max" : "pm_max";
                const maxVal = c[maxField] as number;
                const newVal = Math.min(maxVal, Math.max(0, c[field] + delta));
                const actionType = delta > 0 ? (field === "pv_atual" ? "heal" : "mana") : (field === "pv_atual" ? "damage" : "mana");

                if (newVal !== c[field]) {
                    addLog(`${c.nome} ${delta > 0 ? 'recuperou' : 'perdeu'} ${Math.abs(delta)} ${field === 'pv_atual' ? 'PV' : 'PM'}.`, actionType as any);
                }

                return { ...c, [field]: newVal };
            }
            return c;
        }));
    };

    const addToCombat = (monster: any) => {
        const id = `mob_${Date.now()}`;
        const newPart: Participant = {
            id,
            nome: monster.nome,
            iniciativa: Math.floor(Math.random() * 20) + 1 + (monster.nd === "S+" ? 20 : parseInt(monster.nd) || 0), // Simplificação de iniciativa
            pv_atual: monster.pv,
            pv_max: monster.pv,
            pm_atual: typeof monster.pm === 'number' ? monster.pm : 0,
            pm_max: typeof monster.pm === 'number' ? monster.pm : 0,
            condicoes: [],
            tipo: "inimigo",
            threat: 20
        };

        setCombatants(prev => [...prev, newPart].sort((a, b) => b.iniciativa - a.iniciativa));
        addLog(`${monster.nome} entrou na batalha!`, "info");
        setSearch("");
    };

    const toggleCondition = (id: string, condNome: string) => {
        setCombatants(prev => prev.map(p => {
            if (p.id === id) {
                const exists = p.condicoes.includes(condNome);
                addLog(`${p.nome} está agora ${exists ? 'livre de' : 'sob efeito de'} ${condNome}.`, "status");
                return {
                    ...p,
                    condicoes: exists
                        ? p.condicoes.filter(c => c !== condNome)
                        : [...p.condicoes, condNome]
                };
            }
            return p;
        }));
    };

    const handleRoll = (val: number, isCrit: boolean) => {
        const current = combatants[turnIndex];
        const bonus = current.tipo === "jogador" ? 7 : 10;
        const total = val + bonus;

        setDiceResult({ value: val, bonus, total, isCrit });
        addLog(`${current.nome} rolou ${total} (${val} + ${bonus})${isCrit ? ' --- CRÍTICO!' : ''}`, isCrit ? "crit" : "roll");

        if (isCrit) {
            setIsPulsingCrit(true);
            setTimeout(() => setIsPulsingCrit(false), 2000);
        }
    };

    const filteredMonsters = search.length > 1
        ? monstersData.filter(m => m.nome.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
        : [];

    return (
        <main className={cn(
            "min-h-screen bg-[#0a0a0a] text-zinc-300 py-12 px-4 md:px-20 relative overflow-hidden font-serif",
            isPulsingCrit && "bg-red-950/20"
        )}>
            <BookmarkButton />

            <div className="max-w-6xl mx-auto relative z-10 space-y-12">

                {/* HEADER ÉPICO */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative border-y-2 border-[#8b0000] py-6 flex justify-center items-center">
                        <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-[#0a0a0a] px-5">
                            <div className="w-8 h-8 border-2 border-[#8b0000] rotate-45 flex items-center justify-center">
                                <div className="w-3 h-3 bg-[#8b0000] animate-pulse"></div>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-white uppercase font-cinzel text-center">
                            Campo de Batalha <span className="text-[#8b0000] block md:inline md:ml-6 text-2xl md:text-3xl">Rodada {round}</span>
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LISTA DE INICIATIVA (2/3) */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {combatants.map((c, index) => {
                                const isActive = turnIndex === index;
                                const isDead = c.pv_atual <= 0;
                                const pvPercent = (c.pv_atual / c.pv_max) * 100;

                                return (
                                    <motion.div
                                        key={c.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "relative transition-all duration-300 p-5 rounded-r-xl border-l-[6px]",
                                            isActive
                                                ? "bg-zinc-900/80 border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.15)] scale-[1.02] z-20"
                                                : "bg-black/60 border-[#8b0000]/40 opacity-70 hover:opacity-100",
                                            isDead && "grayscale contrast-75 brightness-50"
                                        )}
                                    >
                                        {/* INDICADOR DE TURNO ATUAL */}
                                        {isActive && (
                                            <div className="absolute -left-14 top-1/2 -translate-y-1/2 text-[#c5a059] flex items-center gap-1">
                                                <div className="w-3 h-3 bg-[#c5a059] rotate-45 animate-ping" />
                                                <ChevronRight className="w-8 h-8 animate-pulse" />
                                            </div>
                                        )}

                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                {/* Medalhão de Iniciativa */}
                                                <div className="flex flex-col items-center">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded border-2 flex items-center justify-center font-black text-xl shadow-lg transition-colors",
                                                        isActive ? "bg-[#c5a059] border-[#c5a059] text-black" : "bg-[#1a1a1a] border-zinc-700 text-[#c5a059]"
                                                    )}>
                                                        {c.iniciativa}
                                                    </div>
                                                    <span className="text-[8px] uppercase font-bold mt-1 text-zinc-500">Iniciativa</span>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={cn(
                                                            "text-2xl font-black uppercase tracking-tighter",
                                                            c.tipo === 'inimigo' ? "text-[#8b0000]" : "text-white"
                                                        )}>
                                                            {c.nome}
                                                        </h3>
                                                        {isDead && <span className="text-[10px] bg-black border border-white/20 text-gray-500 px-2 py-0.5 rounded tracking-widest font-black uppercase">Caído</span>}
                                                    </div>

                                                    {/* Status / Condições */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {c.condicoes.map(s => (
                                                            <span key={s} className="flex items-center gap-1.5 text-[9px] bg-[#8b0000]/20 text-[#ff4444] px-2 py-0.5 rounded border border-[#8b0000]/40 italic font-black">
                                                                {CONDICOES.find(cond => cond.nome === s)?.icone} {s.toUpperCase()}
                                                            </span>
                                                        ))}
                                                        {isActive && (
                                                            <div className="flex gap-1 ml-2 opacity-40 hover:opacity-100 transition-opacity">
                                                                {CONDICOES.map(cond => (
                                                                    <button
                                                                        key={cond.nome}
                                                                        onClick={() => toggleCondition(c.id, cond.nome)}
                                                                        className={cn(
                                                                            "w-5 h-5 flex items-center justify-center rounded transition-colors",
                                                                            c.condicoes.includes(cond.nome) ? "bg-[#c5a059] text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"
                                                                        )}
                                                                        title={cond.nome}
                                                                    >
                                                                        {cond.icone}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Barras de Recursos */}
                                            <div className="flex flex-col gap-3 w-full md:w-56">
                                                {/* PV */}
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                                                        <span className="flex items-center gap-1 text-red-500"><Heart className="w-2 h-2" /> Vida</span>
                                                        <span className="text-white">{c.pv_atual} / {c.pv_max}</span>
                                                    </div>
                                                    <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pvPercent}%` }}
                                                            className={cn(
                                                                "h-full bg-gradient-to-r transition-all duration-500",
                                                                pvPercent > 50 ? "from-red-900 to-[#8b0000]" : pvPercent > 20 ? "from-orange-900 to-orange-600" : "from-red-950 to-red-900 animate-pulse"
                                                            )}
                                                        />
                                                        {isActive && (
                                                            <div className="absolute inset-0 flex items-center justify-between px-1 scale-75">
                                                                <button onClick={() => updateValue(c.id, "pv_atual", 5)} className="text-white hover:scale-125"><Plus className="w-4 h-4" /></button>
                                                                <button onClick={() => updateValue(c.id, "pv_atual", -5)} className="text-white hover:scale-125"><Minus className="w-4 h-4" /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* PM */}
                                                {c.pm_max > 0 && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-blue-400">
                                                            <span className="flex items-center gap-1"><Zap className="w-2 h-2" /> Mana</span>
                                                            <span className="text-white">{c.pm_atual}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 flex items-center relative">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(c.pm_atual / c.pm_max) * 100}%` }}
                                                                className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                                            />
                                                            {isActive && (
                                                                <div className="absolute inset-0 flex items-center justify-between px-1 scale-75">
                                                                    <button onClick={() => updateValue(c.id, "pm_atual", 1)} className="text-blue-200 hover:scale-125"><Plus className="w-3 h-3" /></button>
                                                                    <button onClick={() => updateValue(c.id, "pm_atual", -1)} className="text-blue-200 hover:scale-125"><Minus className="w-3 h-3" /></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botão de Ataque Rápido */}
                                        <div className="flex items-center justify-center p-4 border-l border-white/5">
                                            <div
                                                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-30 italic text-[8px] uppercase text-center leading-tight"
                                            >
                                                Pronto
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* PAINEL LATERAL (1/3) */}
                    <div className="space-y-6">
                        <div className="bg-[#1a1a1a] border-2 border-[#8b0000]/50 p-6 rounded-xl sticky top-20 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b0000]/5 -rotate-45 translate-x-12 -translate-y-12 pointer-events-none" />

                            <h2 className="text-[#c5a059] uppercase font-black text-xs mb-6 tracking-[0.3em] border-b border-[#c5a059]/20 pb-3 flex items-center gap-2">
                                <Sword className="w-4 h-4" /> Comandos de Guerra
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {/* DADO ANIMADO */}
                                <DiceRoller
                                    threatRange={combatants[turnIndex]?.threat}
                                    onRollResult={handleRoll}
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={nextTurn}
                                        className="relative group bg-[#8b0000] text-white py-4 rounded-lg font-black text-sm hover:brightness-125 transition-all shadow-[0_5px_15px_rgba(139,0,0,0.4)] uppercase tracking-tighter overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Turno <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </button>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="bg-zinc-800 text-zinc-300 py-4 rounded-lg font-black text-xs hover:bg-zinc-700 transition-all uppercase border border-zinc-700">
                                                + Herói
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#1a1a1a] border-[#8b0000] text-zinc-300 font-serif">
                                            <div className="space-y-6">
                                                <HeaderFrame className="text-sm">Novo Combatente</HeaderFrame>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2 space-y-2">
                                                        <label className="text-[10px] uppercase font-black text-arton-gold">Nome do Aventureiro</label>
                                                        <input id="new-name" type="text" className="w-full bg-black border border-zinc-800 p-3 rounded" placeholder="Ex: Sir Galen" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-black text-arton-gold">Iniciativa</label>
                                                        <input id="new-ini" type="number" className="w-full bg-black border border-zinc-800 p-3 rounded" placeholder="20" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-black text-arton-gold">Ameaça (Crítico)</label>
                                                        <input id="new-threat" type="number" className="w-full bg-black border border-zinc-800 p-3 rounded" placeholder="20" defaultValue="20" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-black text-arton-gold">PV Máximo</label>
                                                        <input id="new-pv" type="number" className="w-full bg-black border border-zinc-800 p-3 rounded" placeholder="40" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-black text-arton-gold">PM Máximo</label>
                                                        <input id="new-pm" type="number" className="w-full bg-black border border-zinc-800 p-3 rounded" placeholder="10" />
                                                    </div>
                                                </div>
                                                <DialogClose asChild>
                                                    <button
                                                        onClick={() => {
                                                            const nome = (document.getElementById('new-name') as HTMLInputElement).value;
                                                            const ini = parseInt((document.getElementById('new-ini') as HTMLInputElement).value) || 10;
                                                            const pv = parseInt((document.getElementById('new-pv') as HTMLInputElement).value) || 20;
                                                            const pm = parseInt((document.getElementById('new-pm') as HTMLInputElement).value) || 0;
                                                            const threat = parseInt((document.getElementById('new-threat') as HTMLInputElement).value) || 20;

                                                            if (nome) {
                                                                const newPart: Participant = {
                                                                    id: `manual_${Date.now()}`,
                                                                    nome,
                                                                    iniciativa: ini,
                                                                    pv_atual: pv,
                                                                    pv_max: pv,
                                                                    pm_atual: pm,
                                                                    pm_max: pm,
                                                                    condicoes: [],
                                                                    tipo: "jogador",
                                                                    threat
                                                                };
                                                                setCombatants(prev => [...prev, newPart].sort((a, b) => b.iniciativa - a.iniciativa));
                                                                addLog(`${nome} juntou-se ao combate!`, "info");
                                                            }
                                                        }}
                                                        className="w-full bg-[#8b0000] text-white py-3 rounded-lg font-black uppercase tracking-widest hover:brightness-125"
                                                    >
                                                        Concluir Convocação
                                                    </button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Adicionar Monstro */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Invocar Ameaça..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full bg-black/60 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-xs font-serif text-zinc-300 focus:border-[#c5a059] outline-none transition-all placeholder:text-zinc-600"
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {filteredMonsters.length > 0 && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-black/80 border border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-800"
                                            >
                                                {filteredMonsters.map(m => (
                                                    <button
                                                        key={m.nome}
                                                        onClick={() => addToCombat(m)}
                                                        className="w-full p-3 text-left hover:bg-[#8b0000]/20 transition-colors flex justify-between items-center group"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-white group-hover:text-[#c5a059]">{m.nome}</span>
                                                            <span className="text-[8px] text-zinc-500 uppercase tracking-widest">{m.tipo} • ND {m.nd}</span>
                                                        </div>
                                                        <Plus className="w-4 h-4 text-[#8b0000]" />
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* RELATÓRIO DE BATALHA (BATTLE LOG) */}
                            <div className="mt-8">
                                <h3 className="text-zinc-500 uppercase text-[9px] font-black mb-3 tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Relatário Artoniano
                                </h3>
                                <div className="bg-black/60 p-4 rounded-xl text-[11px] leading-relaxed italic text-zinc-500 border border-zinc-800/50 h-56 overflow-y-auto custom-scrollbar font-serif">
                                    <div className="space-y-3">
                                        {log.map((entry, i) => (
                                            <p key={i} className={cn(
                                                "border-l-2 pl-2 transition-all",
                                                entry.type === 'info' && "border-zinc-700",
                                                entry.type === 'damage' && "border-[#8b0000] text-red-400 font-bold not-italic",
                                                entry.type === 'heal' && "border-green-700 text-green-400 font-bold not-italic",
                                                entry.type === 'mana' && "border-blue-700 text-blue-400",
                                                entry.type === 'crit' && "border-[#c5a059] text-[#c5a059] font-black uppercase not-italic text-xs shadow-[0_0_10px_rgba(197,160,89,0.2)]",
                                                entry.type === 'status' && "border-orange-700 text-orange-400"
                                            )}>
                                                <span className="text-[8px] opacity-40 mr-2">[{entry.round}]</span>
                                                {entry.message}
                                            </p>
                                        ))}
                                        <div ref={logEndRef} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DICE ROLLER OVERLAY */}
            <AnimatePresence>
                {diceResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => setDiceResult(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
                    >
                        <div className={cn(
                            "bg-[#1a1a1a] border-[6px] p-12 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.9)] max-w-sm w-full text-center relative",
                            diceResult.isCrit ? "border-[#8b0000] animate-bounce" : "border-[#c5a059]"
                        )}>
                            <RotateCcw className="absolute top-6 right-6 w-5 h-5 text-zinc-500" />

                            {diceResult.isCrit && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1.2 }}
                                    className="mb-6 text-[#8b0000] font-black text-5xl tracking-tighter uppercase font-cinzel"
                                >
                                    ¡ CRÍTICO !
                                </motion.div>
                            )}

                            <div className="flex justify-center items-baseline gap-4 mb-4">
                                <span className="font-cinzel text-9xl font-black text-white">{diceResult.total}</span>
                            </div>

                            <div className="flex justify-center gap-6 text-[10px] uppercase font-black tracking-widest text-zinc-500 border-t border-zinc-800 pt-4">
                                <div>Dado: {diceResult.value}</div>
                                <div className="text-white">Bônus: +{diceResult.bonus}</div>
                            </div>

                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mt-8 text-[#c5a059] text-xs font-black uppercase italic tracking-widest flex items-center justify-center gap-2"
                            >
                                <Dices className="w-5 h-5" /> A Vontade de Khalmyr
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
                
                .font-cinzel { font-family: 'Cinzel', serif; }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.4);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #8b0000;
                    border-radius: 10px;
                }
            `}</style>
        </main>
    );
}
