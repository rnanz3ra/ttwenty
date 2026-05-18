import { useCharacterStore } from "@/core/store/character-store";
import { getAvailableRaces, getRaceDetails, mapAttributes } from "@/core/lib/rules/adapter";
import { getAllRaces as getLegacyRaces } from "@/core/lib/data";
import { Card, CardHeader, CardTitle } from '@/core/ui/card';
import { Check, User, Info, Zap } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { useMemo } from "react";
import { AttributeBonus, Race } from "@/core/types";

export default function StepRace() {
    const { race: selectedRace, setRace } = useCharacterStore();

    // Hybrid Data: Merge Engine Rules with Legacy Flavor Text
    const races = useMemo(() => {
        const engineRaces = getAvailableRaces();
        const legacyRaces = getLegacyRaces();

        return engineRaces.map(engineRace => {
            // Match by name (e.g. "Humano" === "Humano")
            const legacy = legacyRaces.find(l => l.name === engineRace.name);

            // Get full details to preview stats
            const details = getRaceDetails(engineRace.slug);

            return {
                ...engineRace,
                // Fallback to legacy description if available, or a generic placeholder
                description: legacy?.description || "Uma das raças de Arton.",
                mechanics: details,
                legacyId: legacy?.id
            };
        });
    }, []);

    const handleSelectRace = (race: typeof races[0]) => {
        if (!race.mechanics) return;

        // Map Adapter Data -> Store Race Type
        const storeRace: Race = {
            id: race.slug, // Use slug as ID for consistency
            name: race.name,
            description: race.description,
            bonus: mapAttributes(race.mechanics.modifiers),
            abilities: race.mechanics.abilities?.map(a => ({
                name: a.name,
                description: a.description || "Descrição completa disponível no livro básico." // Engine doesn't have full text yet
            })) || []
        };

        setRace(storeRace);
    };

    // Helper to format bonuses for display
    const formatModifiers = (modifiers?: Record<string, number>) => {
        if (!modifiers) return "Nenhum";
        return Object.entries(modifiers)
            .filter(([_, val]) => val !== 0)
            .map(([key, val]) => `${key.substring(0, 3).toUpperCase()} ${val > 0 ? '+' : ''}${val}`)
            .join(', ');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-bold text-tormenta-red">Escolha sua Raça</h2>
                <p className="text-muted-foreground">Cada povo de Arton possui características e habilidades únicas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[60vh]">
                {/* Left: List */}
                <Card className="col-span-1 border-white/10 bg-black/20 backdrop-blur overflow-hidden flex flex-col">
                    <CardHeader className="bg-muted/50 pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Raças Disponíveis</CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                        {races.map((r) => (
                            <button
                                key={r.slug}
                                onClick={() => handleSelectRace(r)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                                    selectedRace?.id === r.slug
                                        ? "bg-tormenta-red/20 border-tormenta-red text-white"
                                        : "bg-transparent border-transparent hover:bg-white/5 hover:text-tormenta-red"
                                )}
                            >
                                <span className="font-serif font-bold">{r.name}</span>
                                {selectedRace?.id === r.slug && <Check className="w-4 h-4 text-tormenta-red" />}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Right: Details */}
                <Card className="col-span-1 lg:col-span-2 border-white/10 bg-black/40 backdrop-blur relative overflow-hidden flex flex-col">
                    {selectedRace ? (
                        <>
                            <CardHeader className="border-b border-white/10 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-tormenta-red to-red-900 text-white rounded-xl shadow-lg">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-4xl font-serif font-black text-white">{selectedRace.name}</CardTitle>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedRace.bonus && Object.values(selectedRace.bonus).some(v => v !== 0) && (
                                                <span className="flex items-center gap-1 text-xs font-mono bg-white/10 text-green-400 px-2 py-1 rounded border border-white/5">
                                                    <Zap className="w-3 h-3" />
                                                    {Object.entries(selectedRace.bonus)
                                                        .filter(([_, v]) => v !== 0)
                                                        .map(([k, v]) => `${k.toUpperCase()} ${v > 0 ? '+' : ''}${v}`)
                                                        .join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                                {/* Description */}
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-white/80 leading-relaxed italic border-l-2 border-tormenta-red pl-4 text-lg">
                                        &quot;{selectedRace.description}&quot;
                                    </p>
                                </div>

                                {/* Abilities */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold font-serif text-white/40 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                                        <Info className="w-4 h-4" /> Habilidades de Raça
                                    </h3>
                                    <div className="grid gap-3">
                                        {selectedRace.abilities.map((ability, idx) => (
                                            <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                                                <h4 className="font-bold text-tormenta-gold mb-1 group-hover:text-white transition-colors">
                                                    {ability.name}
                                                </h4>
                                                <p className="text-sm text-gray-400 leading-relaxed">
                                                    {ability.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center animate-pulse">
                            <User className="w-24 h-24 mb-6 opacity-10" />
                            <p className="text-xl font-serif text-white/20">Selecione uma linhagem para ver seus segredos.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
