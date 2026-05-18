
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/ui/table";
import { Input } from "@/core/ui/input"; // Need to ensure Input exists, otherwise use standard input 
import { Plus, Trash2, RefreshCw, Sword, Shield, Heart, Zap } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { getAllConditions, getNPCQuickStats, getHazards, getCritterTypes, getXPRules } from "@/core/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/ui/tabs";
import { Dialog, DialogContent } from "@/core/ui/dialog";
import { AlertCircle, Mountain, Wind, Timer } from "lucide-react";

// If Input component doesn't exist, I'll use standard HTML input with classes for now or check first.
// I will assume simple standard inputs for speed or create a simple wrapper if needed.
// Actually, let's use standard inputs styled with tailwind for now to avoid dependency blocking.

interface Combatant {
    id: string;
    name: string;
    initiative: number;
    hp: number;
    maxHp: number;
    type: "pc" | "npc" | "monster";
    nd?: number;
    conditions: string[];
}

export function calculateEncounterND(combatants: Combatant[]): string {
    const monsters = combatants.filter(c => c.type === "monster" && c.nd !== undefined);
    if (monsters.length === 0) return "---";

    // Pega o maior ND do grupo
    const maxND = Math.max(...monsters.map(m => m.nd || 0));
    const count = monsters.filter(m => m.nd === maxND).length;

    // Regra da Pág 282: Inimigo Base + 2 para cada vez que a quantidade dobra
    // Simplificando o cálculo de "dobras" para exibição imediata
    let finalND = maxND;
    if (count >= 2) finalND += 2;
    if (count >= 4) finalND += 2;
    if (count >= 8) finalND += 2;

    return `ND ${finalND}`;
}

export function InitiativeTracker() {
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [round, setRound] = useState(1);
    const [turnIndex, setTurnIndex] = useState(0);
    const [showRewards, setShowRewards] = useState(false);
    const [numPlayers, setNumPlayers] = useState(4);
    const [victoryType, setVictoryType] = useState<'Vitoria_Total' | 'Empate' | 'Derrota'>('Vitoria_Total');

    // New Climate State
    const [climate, setClimate] = useState<string>("Temperado");

    // New Combatant State
    const [newName, setNewName] = useState("");
    const [newInit, setNewInit] = useState("");
    const [newHp, setNewHp] = useState("");

    const addCombatant = () => {
        if (!newName) return;
        const initVal = parseInt(newInit) || 0;
        const hpVal = parseInt(newHp) || 10;

        const critterTypes = getCritterTypes();
        let traits: string[] = [];

        if (newName.toLowerCase().includes("lefeu")) {
            traits = [...traits, "Imunidade: Críticos", "Imunidade: Veneno"];
        } else if (newName.toLowerCase().includes("construto")) {
            traits = [...traits, "Imunidade: Fadiga", "Imunidade: Veneno"];
        }

        const newCombatant: Combatant = {
            id: Math.random().toString(36).substr(2, 9),
            name: newName,
            initiative: initVal,
            hp: hpVal,
            maxHp: hpVal,
            type: "npc",
            conditions: traits
        };

        const updated = [...combatants, newCombatant].sort((a, b) => b.initiative - a.initiative);
        setCombatants(updated);
        setNewName("");
        setNewInit("");
        setNewHp("");
    };

    const nextTurn = () => {
        if (combatants.length === 0) return;
        let nextIndex = turnIndex + 1;
        if (nextIndex >= combatants.length) {
            nextIndex = 0;
            setRound(r => r + 1);
        }
        setTurnIndex(nextIndex);
    };

    const removeCombatant = (id: string) => {
        const idx = combatants.findIndex(c => c.id === id);
        const updated = combatants.filter(c => c.id !== id);
        setCombatants(updated);
        if (idx < turnIndex) {
            setTurnIndex(prev => prev - 1);
        } else if (idx === turnIndex && updated.length > 0) {
            // If we removed the active one, the next one becomes active (index stays same unless it was last)
            if (turnIndex >= updated.length) setTurnIndex(0);
        }
    };

    const updateHp = (id: string, delta: number) => {
        setCombatants(prev => prev.map(c =>
            c.id === id ? { ...c, hp: Math.max(0, c.hp + delta) } : c
        ));
    };

    const toggleCondition = (id: string, condName: string) => {
        setCombatants(prev => prev.map(c => {
            if (c.id !== id) return c;
            const exists = c.conditions.includes(condName);
            return {
                ...c,
                conditions: exists
                    ? c.conditions.filter(cn => cn !== condName)
                    : [...c.conditions, condName]
            };
        }));
    };

    const allConditions = getAllConditions();

    const sortCombatants = () => {
        setCombatants(prev => [...prev].sort((a, b) => b.initiative - a.initiative));
        setTurnIndex(0);
    };

    const calculateRewards = () => {
        const monsters = combatants.filter(c => c.type === "monster" && c.nd !== undefined);
        const totalND = monsters.reduce((acc, m) => acc + (m.nd || 0), 0);

        const xpRules = getXPRules();
        const modifiers = xpRules.modificadores_vitoria as any;
        const baseXP = (totalND * 1000) / numPlayers;
        const finalXP = Math.round(baseXP * (modifiers[victoryType] || 1));

        return { xp: finalXP, totalXP: finalXP * numPlayers };
    };

    return (
        <Card variant="dark" className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-white/10 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sword className="w-5 h-5 text-tormenta-red" />
                        Iniciativa
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                        Rodada <span className="text-tormenta-gold font-bold text-lg">{round}</span>
                        <span className="mx-3 opacity-20">|</span>
                        Dificuldade: <span className="text-arton-red font-black">{calculateEncounterND(combatants)}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowRewards(true)} className="border-arton-gold text-arton-gold hover:bg-arton-gold/10">
                        Finalizar
                    </Button>
                    <Button size="sm" variant="outline" onClick={sortCombatants} title="Reordenar">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={nextTurn} className="bg-tormenta-red hover:bg-red-700 text-white font-bold">
                        Próximo Turno
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
                <Tabs defaultValue="combate" className="w-full h-full flex flex-col">
                    <div className="px-4 py-2 border-b border-white/5 bg-black/20 overflow-x-auto custom-scrollbar">
                        <TabsList className="bg-transparent gap-4 w-max">
                            <TabsTrigger value="combate" className="data-[state=active]:text-arton-red uppercase font-black text-[10px]">Combate</TabsTrigger>
                            <TabsTrigger value="perigos" className="data-[state=active]:text-arton-gold uppercase font-black text-[10px]">Perigos Complexos</TabsTrigger>
                            <TabsTrigger value="ambiente" className="data-[state=active]:text-blue-500 uppercase font-black text-[10px]">Ambiente & Clima</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="combate" className="flex-1 overflow-hidden flex flex-col m-0 data-[state=inactive]:hidden">
                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            <Table>
                                {/* ... Tabela existente ... */}
                                <TableHeader className="bg-black/20 sticky top-0 backdrop-blur-sm">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="w-[80px] text-center">Init</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="w-[120px] text-center">PV</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {combatants.map((c, idx) => (
                                        <TableRow
                                            key={c.id}
                                            className={cn(
                                                "border-white/5 transition-colors",
                                                idx === turnIndex ? "bg-tormenta-red/10 border-l-4 border-l-tormenta-red" : "hover:bg-white/5"
                                            )}
                                        >
                                            <TableCell className="text-center font-bold text-lg font-mono">
                                                {c.initiative}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-white">{c.name}</div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {c.conditions.map(cond => {
                                                        const info = allConditions.find(ac => ac.nome === cond);
                                                        return (
                                                            <span
                                                                key={cond}
                                                                title={info?.efeito}
                                                                className="text-[9px] bg-arton-red/20 border border-arton-red/30 px-1.5 py-0.5 rounded text-arton-red font-black uppercase cursor-help animate-in zoom-in-75 duration-200"
                                                            >
                                                                {cond}
                                                            </span>
                                                        );
                                                    })}
                                                    {c.hp <= 0 && <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black uppercase">Derrotado</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        className="w-6 h-6 rounded bg-red-900/50 hover:bg-red-700 flex items-center justify-center text-xs"
                                                        onClick={() => updateHp(c.id, -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={cn(
                                                        "font-mono font-bold w-12 text-center",
                                                        c.hp < c.maxHp / 2 ? "text-red-400" : "text-green-400"
                                                    )}>
                                                        {c.hp}
                                                    </span>
                                                    <button
                                                        className="w-6 h-6 rounded bg-green-900/50 hover:bg-green-700 flex items-center justify-center text-xs"
                                                        onClick={() => updateHp(c.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-1">
                                                        {allConditions.map(cond => (
                                                            <button
                                                                key={cond.nome}
                                                                onClick={() => toggleCondition(c.id, cond.nome)}
                                                                title={`${cond.nome}: ${cond.efeito}`}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[8px] font-black transition-all",
                                                                    c.conditions.includes(cond.nome)
                                                                        ? "bg-arton-red text-white border-arton-red scale-110 z-10 shadow-lg"
                                                                        : "bg-black/40 text-white/20 hover:text-white/60"
                                                                )}
                                                            >
                                                                {cond.nome[0]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => removeCombatant(c.id)}
                                                        className="text-white/10 hover:text-red-500 transition-colors ml-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {combatants.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                Nenhum combatente. Adicione abaixo.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Add Input */}
                        <div className="p-4 bg-black/40 border-t border-white/10 grid grid-cols-[1fr_80px_80px_auto] gap-2 items-end">
                            <div>
                                <label className="text-[10px] uppercase text-white/50 font-bold ml-1">Nome</label>
                                <input
                                    className="w-full bg-white/10 border border-white/10 rounded px-3 py-2 text-sm focus:border-tormenta-red outline-none"
                                    placeholder="Goblin..."
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addCombatant()}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-white/50 font-bold ml-1">Init</label>
                                <input
                                    type="number"
                                    className="w-full bg-white/10 border border-white/10 rounded px-3 py-2 text-sm focus:border-tormenta-red outline-none text-center"
                                    placeholder="0"
                                    value={newInit}
                                    onChange={(e) => setNewInit(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addCombatant()}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-white/50 font-bold ml-1">PV</label>
                                <input
                                    type="number"
                                    className="w-full bg-white/10 border border-white/10 rounded px-3 py-2 text-sm focus:border-tormenta-red outline-none text-center"
                                    placeholder="10"
                                    value={newHp}
                                    onChange={(e) => setNewHp(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addCombatant()}
                                />
                            </div>
                            <Button onClick={addCombatant} size="icon" className="bg-white/10 hover:bg-tormenta-red hover:text-white">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* NPC Rápido (Lote 72) */}
                        <div className="p-4 border-t border-white/10 bg-red-950/10">
                            <label className="text-[10px] uppercase text-arton-gold font-black mb-2 block tracking-widest">Invocação Rápida (NPC)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {getNPCQuickStats().map((stat: any) => (
                                    <Button
                                        key={stat.patamar}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newNPC: Combatant = {
                                                id: Math.random().toString(36).substr(2, 9),
                                                name: `${stat.patamar} Genérico`,
                                                initiative: Math.floor(Math.random() * 20) + (stat.patamar === "Campeão" ? 10 : 5),
                                                hp: stat.patamar === "Iniciante" ? 20 : stat.patamar === "Veterano" ? 60 : 120,
                                                maxHp: stat.patamar === "Iniciante" ? 20 : stat.patamar === "Veterano" ? 60 : 120,
                                                type: "npc",
                                                conditions: []
                                            };
                                            setCombatants(prev => [...prev, newNPC].sort((a, b) => b.initiative - a.initiative));
                                        }}
                                        className="text-[10px] uppercase font-bold border-zinc-800 hover:border-arton-gold hover:text-arton-gold"
                                    >
                                        {stat.patamar}
                                        <span className="text-[8px] opacity-40 ml-1">({stat.pericia_forte}/{stat.pericia_fraca})</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="perigos" className="flex-1 overflow-y-auto p-4 m-0 data-[state=inactive]:hidden bg-zinc-950/40">
                        <div className="space-y-4">
                            {getHazards().map((hazard) => (
                                <div key={hazard.nome} className="p-4 border border-zinc-900 bg-black rounded-lg space-y-3 relative overflow-hidden group hover:border-arton-gold/50 transition-all">
                                    <div className="absolute top-0 right-0 p-2 opacity-5">
                                        {hazard.nome === "Avalanche" ? <Mountain className="w-12 h-12" /> : <Wind className="w-12 h-12" />}
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-arton-gold font-black uppercase text-sm">{hazard.nome}</h4>
                                            <p className="text-[10px] text-zinc-500 font-bold">ND {hazard.nd} • {hazard.objetivo}</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-7 text-[9px] uppercase font-black border-zinc-800 hover:border-arton-gold hover:text-arton-gold">
                                            Iniciar Cena
                                        </Button>
                                    </div>
                                    <div className="text-[10px] text-zinc-400 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 italic">
                                        "{hazard.efeito}"
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {hazard.acoes.map((acao, i) => (
                                            <div key={i} className="flex justify-between items-center bg-zinc-900/30 p-2 rounded border border-white/5 text-[10px]">
                                                <span className="text-white font-bold">{acao.nome}</span>
                                                <span className="text-zinc-500 uppercase">{acao.pericia} <span className="text-arton-red font-black">CD {acao.cd}</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="ambiente" className="flex-1 overflow-y-auto p-4 m-0 data-[state=inactive]:hidden bg-zinc-950/40">
                        <div className="space-y-6">
                            <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                                    <Mountain className="w-4 h-4 text-blue-500" /> Selecionar Clima Atual
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Temperado', 'Frio Extremo', 'Calor Extremo', 'Chuva Forte', 'Tempestade de Areia', 'Ventos Uivantes'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setClimate(c)}
                                            className={cn(
                                                "px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors border",
                                                climate === c
                                                    ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                                    : "bg-transparent border-white/10 text-zinc-500 hover:text-white"
                                            )}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* EFEITOS DO CLIMA */}
                            <div className="space-y-3">
                                {climate === 'Temperado' && (
                                    <div className="p-4 border border-zinc-800 rounded bg-zinc-900/30 text-zinc-500 text-xs italic text-center">
                                        Clima padrão. Nenhuma penalidade mecânica ativa.
                                    </div>
                                )}
                                {climate === 'Frio Extremo' && (
                                    <div className="p-4 border border-blue-900/50 rounded bg-blue-950/20 relative overflow-hidden">
                                        <h4 className="text-blue-400 font-black uppercase text-[10px] mb-2">🏔️ Efeitos do Frio (Ex: Bielefeld / Montanhas Uivantes)</h4>
                                        <p className="text-zinc-300 text-xs leading-relaxed">
                                            Personagens sem proteção adequada devem fazer um teste de <strong className="text-arton-red">Fortitude (CD 15 + 1 por teste anterior)</strong> a cada hora.
                                            Falha resulta na condição <strong className="text-arton-red">Fatigado</strong>. Se já estiver fatigado, sofre <strong className="text-arton-red">1d6 de dano de frio</strong>.
                                        </p>
                                    </div>
                                )}
                                {climate === 'Calor Extremo' && (
                                    <div className="p-4 border border-orange-900/50 rounded bg-orange-950/20 relative overflow-hidden">
                                        <h4 className="text-orange-400 font-black uppercase text-[10px] mb-2">☀️ Efeitos do Calor (Ex: Deserto da Perdição)</h4>
                                        <p className="text-zinc-300 text-xs leading-relaxed">
                                            Personagens sem água suficiente ou armaduras pesadas devem fazer um teste de <strong className="text-arton-red">Fortitude (CD 15 + 1 por teste anterior)</strong> a cada hora.
                                            Falha resulta na condição <strong className="text-arton-red">Fatigado</strong>. Usar armadura pesada impõe -5 no teste.
                                        </p>
                                    </div>
                                )}
                                {climate === 'Chuva Forte' && (
                                    <div className="p-4 border border-zinc-700/50 rounded bg-zinc-800/20 relative overflow-hidden">
                                        <h4 className="text-zinc-300 font-black uppercase text-[10px] mb-2">🌧️ Efeitos de Chuva</h4>
                                        <p className="text-zinc-400 text-xs leading-relaxed">
                                            A visibilidade cai severamente. <strong className="text-arton-red">-2 em testes de Percepção e ataques à distância</strong>. Projéteis não mágicos podem se desviar com ventos fortes. Testes de Sobrevivência para orientar-se sofrem -2.
                                        </p>
                                    </div>
                                )}
                                {climate === 'Tempestade de Areia' && (
                                    <div className="p-4 border border-yellow-900/50 rounded bg-yellow-950/20 relative overflow-hidden">
                                        <h4 className="text-yellow-500 font-black uppercase text-[10px] mb-2">🌪️ Tempestade de Areia</h4>
                                        <p className="text-zinc-300 text-xs leading-relaxed">
                                            Cortante e ensurdecedora. Visibilidade reduzida a 3 metros (os alvos além possuem <strong>Camuflagem Total</strong>).
                                            Sofre 1d4 de dano de corte contínuo a cada hora desprotegido. <strong className="text-arton-red">-5 em Percepção</strong>.
                                        </p>
                                    </div>
                                )}
                                {climate === 'Ventos Uivantes' && (
                                    <div className="p-4 border border-teal-900/50 rounded bg-teal-950/20 relative overflow-hidden">
                                        <h4 className="text-teal-400 font-black uppercase text-[10px] mb-2">🌬️ Ventanias Arcanas</h4>
                                        <p className="text-zinc-300 text-xs leading-relaxed">
                                            Voar se torna impossível para criaturas Médias ou menores sem magia específica. Ataques baseados em Flechas rolam o dano <strong className="text-red-500">duas vezes e pegam o pior resultado</strong>.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            {/* Modal de Recompensas */}
            <Dialog open={showRewards} onOpenChange={setShowRewards}>
                <DialogContent className="bg-zinc-950 border border-arton-gold/50 text-white p-0 overflow-hidden max-w-md">
                    <div className="bg-arton-gold/10 p-6 border-b border-arton-gold/20">
                        <h2 className="text-2xl font-serif font-black text-arton-gold uppercase tracking-tighter">Espólios de Guerra</h2>
                        <p className="text-[10px] text-zinc-400 uppercase font-black">Cálculo de XP e Tesouro (Lotes 79-80)</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase font-black text-zinc-500">Jogadores</label>
                                <Input
                                    type="number"
                                    value={numPlayers}
                                    onChange={(e) => setNumPlayers(parseInt(e.target.value) || 1)}
                                    className="bg-black/50 border-white/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase font-black text-zinc-500">Resultado</label>
                                <select
                                    value={victoryType}
                                    onChange={(e) => setVictoryType(e.target.value as any)}
                                    className="w-full h-10 bg-black/50 border border-white/10 rounded-md px-3 text-sm outline-none focus:border-arton-gold"
                                >
                                    <option value="Vitoria_Total">Vitória Total</option>
                                    <option value="Empate">Empate / Fuga</option>
                                    <option value="Derrota">Derrota</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-black p-4 rounded-lg border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap className="w-6 h-6 text-arton-gold" />
                                <div>
                                    <p className="text-[10px] uppercase font-black text-zinc-500">XP por Jogador</p>
                                    <p className="text-3xl font-serif font-black text-white">{calculateRewards().xp}</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    alert(`XP Distribuído: ${calculateRewards().xp} para cada herói.`);
                                    setShowRewards(false);
                                    setCombatants([]);
                                    setRound(1);
                                }}
                                className="bg-arton-red hover:bg-red-700 text-white font-black"
                            >
                                Aplicar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// Helper: Add variant type or ignore since standard shadcn component might not have "variant" typed, using standard class instead if fails.
// Assuming customized Card component based on previous usage.
