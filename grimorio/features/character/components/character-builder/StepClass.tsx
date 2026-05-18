
import { useCharacterStore } from "@/core/store/character-store";
import { Card, CardHeader, CardTitle } from '@/core/ui/card';
import { ScrollArea } from '@/core/ui/scroll-area';
import { Sword, BookOpen, Shield, Info, Heart, Zap, Check } from "lucide-react";
import { getAllClasses } from "@/core/lib/data";
import { cn } from "@/core/lib/utils";

export default function StepClass() {
    const { class: selectedClass, setClass } = useCharacterStore();
    const classes = getAllClasses();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
                {/* Class List */}
                <Card className="col-span-1 border-white/10 bg-black/20 backdrop-blur overflow-hidden flex flex-col">
                    <CardHeader className="bg-muted/50 pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Classes</CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 pr-2 custom-scrollbar">
                        {classes.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setClass(c)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                                    selectedClass?.id === c.id
                                        ? "bg-tormenta-red/20 border-tormenta-red text-foreground"
                                        : "bg-transparent border-transparent hover:bg-white/5 hover:text-tormenta-red"
                                )}
                            >
                                <span className="font-serif font-bold">{c.nome}</span>
                                {selectedClass?.id === c.id && <Check className="w-4 h-4 text-tormenta-red" />}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Class Details */}
                <Card className="col-span-1 lg:col-span-2 bg-black/40 border-white/10 overflow-hidden flex flex-col">
                    {selectedClass ? (
                        <>
                            <CardHeader className="border-b border-white/10 bg-white/5 pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-bold font-serif text-tormenta-red flex items-center gap-3">
                                            {selectedClass.nome}
                                        </h2>
                                        <div className="flex gap-4 text-sm text-gray-400 mt-2">
                                            <div className="flex items-center gap-1 text-red-400 bg-red-900/20 px-2 py-1 rounded border border-red-900/30" title="Pontos de Vida Iniciais">
                                                <Heart className="w-4 h-4" />
                                                <span className="font-bold">{selectedClass.pv.base}</span>
                                                <span className="text-muted-foreground text-xs">+ {selectedClass.pv.bonus}/nível</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/30" title="Pontos de Mana por Nível">
                                                <Zap className="w-4 h-4" />
                                                <span className="font-bold">{selectedClass.pm}</span>
                                                <span className="text-muted-foreground text-xs"> PM/nível</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                                {/* Base Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                        <h4 className="text-tormenta-gold font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <Sword className="w-3 h-3" /> Proficiências
                                        </h4>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {Array.isArray(selectedClass.proficiencias) && selectedClass.proficiencias.length > 0
                                                ? selectedClass.proficiencias.join(", ")
                                                : "Nenhuma proficiência inicial"}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                        <h4 className="text-tormenta-gold font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <BookOpen className="w-3 h-3" /> Perícias
                                        </h4>
                                        <p className="text-sm text-gray-300">
                                            Você poderá escolher <span className="font-bold text-white">{selectedClass.pericias.qnt}</span> perícias no passo <strong>Perícias</strong>.
                                        </p>
                                    </div>
                                </div>

                                {/* Class Abilities */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold font-serif text-white/40 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                                        <Info className="w-4 h-4" /> Habilidades de Classe
                                    </h3>
                                    <div className="grid gap-3">
                                        {selectedClass.abilities.length > 0 ? selectedClass.abilities.map((ability, idx) => (
                                            <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                                                <h4 className="font-bold text-tormenta-gold mb-1 group-hover:text-white transition-colors">
                                                    {ability.name}
                                                </h4>
                                                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                                                    {ability.description}
                                                </p>
                                            </div>
                                        )) : (
                                            <p className="text-muted-foreground italic">Nenhuma habilidade inicial listada.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center animate-pulse">
                            <Shield className="w-24 h-24 mb-6 opacity-10" />
                            <p className="text-xl font-serif text-white/20">Selecione uma classe ao lado para ver os detalhes.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
