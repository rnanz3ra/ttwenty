"use client";

import { useState } from "react";
import { InitiativeTracker } from "@/components/dm/InitiativeTracker";
import { DiceRoller } from "@/components/dm/DiceRoller";
import { Search, Calculator, BookOpen, Swords, Skull, Sword } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { cn } from "@/core/lib/utils";
import { getAllSkills, getAllActions } from "@/core/lib/data";

// Placeholder for conditions data
const conditions = [
    { name: "Abalado", desc: "O personagem sofre -2 em testes de perícia." },
    { name: "Agarrado", desc: "O personagem fica desprevenido e imóvel." },
    { name: "Alquebrado", desc: "O custo de PM das habilidades aumenta em +1." },
    { name: "Atordoado", desc: "O personagem fica desprevenido e não pode fazer ações." },
    { name: "Caído", desc: "O personagem sofre -5 em ataque corpo a corpo e deslocamento reduzido." },
    { name: "Cego", desc: "O personagem fica desprevenido e lento, falha em testes de percepção visual." },
    { name: "Confuso", desc: "O comportamento do personagem é determinado aleatoriamente." },
    { name: "Debilitado", desc: "O personagem sofre -5 em testes de atributo físico." },
    { name: "Desprevenido", desc: "O personagem sofre -5 na Defesa e Reflexos." },
    { name: "Doente", desc: "O personagem recupera menos PV e PM com descanso." },
    { name: "Enjoado", desc: "O personagem só pode realizar uma ação padrão ou de movimento." },
    { name: "Entediado", desc: "O personagem sofre -2 em testes de Vontade." },
    { name: "Exausto", desc: "O personagem fica debilitado, lento e vulnerável." },
    { name: "Fascinado", desc: "O personagem não pode fazer ações e sofre -5 em Percepção." },
    { name: "Fatigado", desc: "O personagem sofre -2 em testes de perícia e não pode correr." },
    { name: "Fraco", desc: "O personagem sofre -2 em testes de atributo físico e dano corpo a corpo." },
    { name: "Frustrado", desc: "O personagem sofre -2 em testes de atributo mental e CD." },
    { name: "Imóvel", desc: "O deslocamento do personagem se torna 0." },
    { name: "Inconsciente", desc: "O personagem fica indefeso e não pode fazer ações." },
    { name: "Indefeso", desc: "O personagem fica desprevenido, imóvel e falha em reflexos." },
    { name: "Lento", desc: "O deslocamento do personagem é reduzido à metade e não pode correr." },
    { name: "Ofuscado", desc: "O personagem sofre -2 em testes de ataque e percepção." },
    { name: "Paralisado", desc: "O personagem fica imóvel e indefeso." },
    { name: "Pasmo", desc: "O personagem não pode fazer ações." },
    { name: "Petrificado", desc: "O personagem se torna pedra, fica inconsciente e recebe RD 10." },
    { name: "Sangrando", desc: "O personagem perde 1d6 PV no início de seus turnos." },
    { name: "Surdo", desc: "O personagem falha em testes de percepção auditiva e sofre penalidade em iniciativa." },
    { name: "Surpreendido", desc: "O personagem fica desprevenido e não pode fazer ações." },
    { name: "Vulnerável", desc: "O personagem sofre -2 na Defesa." }
];

export function GMScreen() {
    const [activeTab, setActiveTab] = useState("conditions");
    const [query, setQuery] = useState("");
    const [level, setLevel] = useState(1);
    const [difficulty, setDifficulty] = useState("Médio");

    const skills = getAllSkills();
    const actions = getAllActions();

    const calculateDC = () => {
        let base = 10;
        let diffMod = 0;
        if (difficulty === "Fácil") diffMod = -5;
        if (difficulty === "Difícil") diffMod = +5;
        if (difficulty === "Lendário") diffMod = +10;
        // T20 rule: 10 + half level + mod
        return base + Math.floor(level / 2) + diffMod;
    };

    const filteredConditions = conditions.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase())
    );

    const filteredSkills = skills.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        (s.desc && s.desc.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab("conditions")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-t-lg",
                        activeTab === "conditions" ? "bg-tormenta-red text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    )}
                >
                    <Skull className="w-4 h-4" /> Condições & CD
                </button>
                <button
                    onClick={() => setActiveTab("skills")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-t-lg",
                        activeTab === "skills" ? "bg-tormenta-red text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    )}
                >
                    <BookOpen className="w-4 h-4" /> Perícias
                </button>
                <button
                    onClick={() => setActiveTab("actions")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-t-lg",
                        activeTab === "actions" ? "bg-tormenta-red text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    )}
                >
                    <Swords className="w-4 h-4" /> Ações em Combate
                </button>
                <button
                    onClick={() => setActiveTab("combat")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-t-lg",
                        activeTab === "combat" ? "bg-tormenta-gold text-black" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    )}
                >
                    <Sword className="w-4 h-4" /> Rastreador de Combate (BETA)
                </button>
            </div>

            {/* TAB: CONDITIONS & DC */}
            {activeTab === "conditions" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="lg:col-span-1 space-y-6">
                        <Card variant="gold">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="w-5 h-5" /> Calculadora de CD
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1">Nível do Grupo / Ameaça</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 bg-white/20 border-2 border-tormenta-black font-mono text-lg rounded text-white"
                                        value={level}
                                        onChange={(e) => setLevel(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1">Dificuldade</label>
                                    <select
                                        className="w-full p-2 bg-white/20 border-2 border-tormenta-black font-sans rounded text-black"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                    >
                                        <option>Fácil</option>
                                        <option>Médio</option>
                                        <option>Difícil</option>
                                        <option>Lendário</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-black/50 text-white text-center rounded border border-white/10">
                                    <span className="block text-xs uppercase text-gray-400">Classe de Dificuldade</span>
                                    <span className="text-4xl font-black font-serif text-tormenta-gold">{calculateDC()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Testes de Resistência</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>Fortitude (CON):</strong> Físico, veneno, doença.</p>
                                <p><strong>Reflexos (DES):</strong> Áreas, armadilhas, explosões.</p>
                                <p><strong>Vontade (SAB):</strong> Mental, medo, encantamento.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Filtrar condições..."
                                className="w-full pl-10 pr-4 py-3 bg-background border-2 border-white/10 focus:border-tormenta-red outline-none text-lg rounded"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredConditions.map((c) => (
                                <div key={c.name} className="p-4 bg-card border border-white/10 hover:border-tormenta-red transition-colors group rounded">
                                    <h3 className="font-bold text-tormenta-red text-lg group-hover:underline mb-1">{c.name}</h3>
                                    <p className="text-sm text-balance leading-relaxed text-muted-foreground">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SKILLS */}
            {activeTab === "skills" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar perícia..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-white/10 focus:border-tormenta-red outline-none rounded"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSkills.map((s) => (
                            <Card key={s.name} className="h-full hover:border-tormenta-red transition-colors">
                                <CardHeader className="pb-2 border-b border-border/10">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{s.name}</CardTitle>
                                        <span className="text-xs font-bold font-mono bg-white/10 px-2 py-1 rounded">
                                            {s.attr?.toUpperCase()}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground mb-2">{s.desc}</p>
                                    {s.penalty && (
                                        <span className="text-[10px] uppercase font-bold text-tormenta-red flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-tormenta-red inline-block"></span>
                                            Penalidade de Armadura
                                        </span>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: ACTIONS */}
            {activeTab === "actions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    {actions.map((group) => (
                        <div key={group.type} className="space-y-4">
                            <h3 className="text-2xl font-black font-serif text-white uppercase border-b-4 border-tormenta-red pb-2 inline-block">
                                Ação {group.type}
                            </h3>
                            <div className="space-y-3">
                                {group.actions.map((act: any) => (
                                    <div key={act.name} className="bg-card border-l-4 border-white/10 p-3 hover:border-tormenta-red transition-all rounded">
                                        <strong className="block text-tormenta-red mb-1">{act.name}</strong>
                                        <p className="text-sm text-muted-foreground">{act.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB: COMBAT (NEW) */}
            {activeTab === "combat" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-left-4 duration-300 h-[70vh]">
                    <div className="lg:col-span-2 h-full">
                        <InitiativeTracker />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <DiceRoller />
                    </div>
                </div>
            )}
        </div>
    );
}
