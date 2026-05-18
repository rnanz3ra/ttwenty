
import { useState } from "react";
import { useCharacterStore } from "@/core/store/character-store";
import { getAllOrigins, getAllDivinities } from "@/core/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card';
import { Button } from '@/core/ui/button';
import { Check, Sun, Sparkles, BookOpen, Cross, ArrowRight } from "lucide-react";
import { cn } from "@/core/lib/utils";

export default function StepOriginDivinity() {
    const { origin: selectedOrigin, divinity: selectedDivinity, setOrigin, setDivinity } = useCharacterStore();
    const origins = getAllOrigins();
    const divinities = getAllDivinities();
    const [view, setView] = useState<'origin' | 'divinity'>('origin');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-bold text-tormenta-red">Origem e Devoção</h2>
                <p className="text-muted-foreground">Escolha sua Origem e, opcionalmente, sua Divindade.</p>
            </div>

            {/* Navigation Toggles (Better than Tabs) */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={() => setView('origin')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-serif font-bold text-lg",
                        view === 'origin'
                            ? "bg-tormenta-red border-tormenta-red text-white shadow-lg shadow-red-900/50 scale-105"
                            : "bg-black/40 border-white/10 text-muted-foreground hover:border-white/30"
                    )}
                >
                    <Sparkles className="w-5 h-5" /> Origem
                    {selectedOrigin && <Check className="w-5 h-5 ml-2 bg-white text-tormenta-red rounded-full p-0.5" />}
                </button>
                <ArrowRight className="text-white/20 self-center" />
                <button
                    onClick={() => setView('divinity')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-serif font-bold text-lg",
                        view === 'divinity'
                            ? "bg-tormenta-gold border-tormenta-gold text-black shadow-lg shadow-yellow-900/50 scale-105"
                            : "bg-black/40 border-white/10 text-muted-foreground hover:border-white/30"
                    )}
                >
                    <Sun className="w-5 h-5" /> Divindade
                    {selectedDivinity && <Check className="w-5 h-5 ml-2 bg-black text-white rounded-full p-0.5" />}
                </button>
            </div>

            <div className="min-h-[60vh]">
                {/* ORIGIN CONTENT */}
                {view === 'origin' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* List */}
                        <Card className="col-span-1 border-white/10 bg-black/20 backdrop-blur overflow-hidden flex flex-col h-[60vh]">
                            <CardHeader className="bg-muted/50 pb-2">
                                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Lista de Origens</CardTitle>
                            </CardHeader>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 pr-2 custom-scrollbar">
                                {origins.map((o) => (
                                    <button
                                        key={o.id}
                                        onClick={() => setOrigin(o)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                                            selectedOrigin?.id === o.id
                                                ? "bg-tormenta-red/20 border-tormenta-red text-foreground"
                                                : "bg-transparent border-transparent hover:bg-white/5 hover:text-tormenta-red"
                                        )}
                                    >
                                        <span className="font-serif font-bold">{o.nome}</span>
                                        {selectedOrigin?.id === o.id && <Check className="w-4 h-4 text-tormenta-red" />}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Details */}
                        <Card className="col-span-1 lg:col-span-2 border-white/10 bg-black/40 backdrop-blur relative overflow-hidden flex flex-col h-[60vh]">
                            {selectedOrigin ? (
                                <>
                                    <CardHeader className="border-b border-white/10 pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20">
                                                <Sparkles className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-4xl font-serif font-black text-white">{selectedOrigin.nome}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-muted-foreground whitespace-pre-line">{selectedOrigin.descricao}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                                <h4 className="text-tormenta-gold font-bold mb-2">Itens Iniciais</h4>
                                                <p className="text-sm text-foreground">{selectedOrigin.itens || "Nenhum"}</p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                                <h4 className="text-tormenta-gold font-bold mb-2 flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4" /> Benefícios
                                                </h4>
                                                {selectedOrigin.beneficios && Object.keys(selectedOrigin.beneficios).length > 0 ? (
                                                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                                                        {Object.values(selectedOrigin.beneficios).map((beneficio, idx) => (
                                                            <li key={idx}>
                                                                <span className="text-gray-300">{beneficio}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Veja a descrição.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-white/10 flex justify-end">
                                        <Button
                                            onClick={() => setView('divinity')}
                                            className="bg-white text-black hover:bg-gray-200"
                                        >
                                            Confirmar Origem e Ir para Divindade <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center animate-pulse">
                                    <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg font-serif">Selecione uma origem.</p>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {/* DIVINITY CONTENT */}
                {view === 'divinity' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* List */}
                        <Card className="col-span-1 border-white/10 bg-black/20 backdrop-blur overflow-hidden flex flex-col h-[60vh]">
                            <CardHeader className="bg-muted/50 pb-2">
                                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Panteão</CardTitle>
                            </CardHeader>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 pr-2 custom-scrollbar">
                                <button
                                    onClick={() => setDivinity(null)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                                        !selectedDivinity
                                            ? "bg-stone-500/20 border-stone-500 text-foreground"
                                            : "bg-transparent border-transparent hover:bg-white/5"
                                    )}
                                >
                                    <span className="font-serif font-bold italic text-muted-foreground">Sem Devoção</span>
                                    {!selectedDivinity && <Check className="w-4 h-4 text-stone-500" />}
                                </button>
                                {divinities.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setDivinity(d)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                                            selectedDivinity?.id === d.id
                                                ? "bg-tormenta-gold/20 border-tormenta-gold text-foreground"
                                                : "bg-transparent border-transparent hover:bg-white/5 hover:text-tormenta-gold"
                                        )}
                                    >
                                        <span className="font-serif font-bold">{d.nome}</span>
                                        {selectedDivinity?.id === d.id && <Check className="w-4 h-4 text-tormenta-gold" />}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Details */}
                        <Card className="col-span-1 lg:col-span-2 border-white/10 bg-black/40 backdrop-blur relative overflow-hidden flex flex-col h-[60vh]">
                            {selectedDivinity ? (
                                <>
                                    <CardHeader className="border-b border-white/10 pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-tormenta-gold text-black rounded-lg shadow-glow">
                                                <Sun className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-4xl font-serif font-black text-white">{selectedDivinity.nome}</CardTitle>
                                                <div className="text-tormenta-gold font-serif mt-1">{selectedDivinity.simbolo_sagrado}</div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-muted-foreground border-l-2 border-tormenta-gold pl-4 italic">
                                                {selectedDivinity.crencas_objetivos}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                                <h4 className="text-tormenta-red font-bold mb-2">Arma Preferida</h4>
                                                <p className="text-sm font-bold text-white">{selectedDivinity.arma_preferida}</p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                                <h4 className="text-tormenta-red font-bold mb-2">Canalizar Energia</h4>
                                                <p className="text-sm text-foreground">{selectedDivinity.canalizar_energia}</p>
                                            </div>
                                        </div>

                                        {/* Poderes Concedidos */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold font-serif text-tormenta-gold flex items-center gap-2 border-b border-white/10 pb-2">
                                                Poderes Concedidos
                                            </h3>
                                            <div className="grid gap-4">
                                                {selectedDivinity.poderes_concedidos?.map((poder, idx) => (
                                                    <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-tormenta-gold/30 transition-colors">
                                                        <h4 className="font-bold text-tormenta-gold mb-1">{poder.nome}</h4>
                                                        <p className="text-sm text-muted-foreground whitespace-pre-line">{poder.descricao}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center animate-pulse">
                                    <Sun className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg font-serif">Escolha uma divindade para devotar sua vida.</p>
                                    <Button onClick={() => setView('origin')} variant="link" className="text-tormenta-red">
                                        Voltar para Origens
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
