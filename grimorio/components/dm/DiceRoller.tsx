
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Button } from "@/core/ui/button";
import { Dices, History, Trash2 } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface RollResult {
    id: number;
    die: string;
    value: number;
    timestamp: Date;
}

const DICE = [
    { label: "d4", max: 4, color: "bg-green-600 border-green-400" },
    { label: "d6", max: 6, color: "bg-blue-600 border-blue-400" },
    { label: "d8", max: 8, color: "bg-purple-600 border-purple-400" },
    { label: "d10", max: 10, color: "bg-pink-600 border-pink-400" },
    { label: "d12", max: 12, color: "bg-orange-600 border-orange-400" },
    { label: "d20", max: 20, color: "bg-tormenta-red border-red-400" },
];

export function DiceRoller() {
    const [history, setHistory] = useState<RollResult[]>([]);
    const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

    const roll = (die: string, max: number) => {
        const val = Math.floor(Math.random() * max) + 1;
        const newRoll: RollResult = {
            id: Date.now(),
            die,
            value: val,
            timestamp: new Date()
        };

        setLastRoll(newRoll);
        setHistory(prev => [newRoll, ...prev].slice(0, 20)); // Keep last 20
    };

    const clearHistory = () => {
        setHistory([]);
        setLastRoll(null);
    };

    return (
        <Card variant="dark" className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-white/10">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Dices className="w-5 h-5 text-tormenta-gold" />
                    Dados
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col p-4 space-y-6">

                {/* Active Roll Display */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] bg-black/20 rounded-lg border-2 border-dashed border-white/10 relative">
                    {lastRoll ? (
                        <div key={lastRoll.id} className="text-center animate-in zoom-in-50 duration-300">
                            <span className="block text-sm uppercase font-bold text-white/50 mb-1">{lastRoll.die}</span>
                            <span className={cn(
                                "text-6xl font-black font-serif drop-shadow-lg",
                                lastRoll.value === 20 ? "text-tormenta-gold" :
                                    lastRoll.value === 1 ? "text-red-600" : "text-white"
                            )}>
                                {lastRoll.value}
                            </span>
                        </div>
                    ) : (
                        <span className="text-white/20 font-serif italic">Role os dados...</span>
                    )}
                </div>

                {/* Dice Buttons */}
                <div className="grid grid-cols-3 gap-3">
                    {DICE.map((d) => (
                        <button
                            key={d.label}
                            onClick={() => roll(d.label, d.max)}
                            className={cn(
                                "py-3 rounded text-white font-black font-serif uppercase tracking-wider shadow-lg transform active:scale-95 transition-all text-sm border-b-4 hover:-translate-y-1",
                                d.color
                            )}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>

                {/* History */}
                <div className="flex-1 overflow-hidden flex flex-col pt-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase font-bold text-white/40 flex items-center gap-1">
                            <History className="w-3 h-3" /> Histórico
                        </span>
                        <button onClick={clearHistory} className="text-white/20 hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                        {history.map((h) => (
                            <div key={h.id} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded">
                                <span className="text-white/50">{h.die}</span>
                                <span className={cn(
                                    "font-bold",
                                    h.value === 20 ? "text-tormenta-gold" :
                                        h.value === 1 ? "text-red-500" : "text-white"
                                )}>{h.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
