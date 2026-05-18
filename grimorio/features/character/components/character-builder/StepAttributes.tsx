
import { useCharacterStore } from "@/core/store/character-store";
import { calculateAttributeCost, calculateTotalPoints, INITIAL_POINTS } from "@/core/lib/rules";
import { Button } from '@/core/ui/button';
import { Input } from '@/core/ui/input';
import { Label } from '@/core/ui/label';
import { Minus, Plus, Trophy, Sparkles } from "lucide-react";
import { Card } from '@/core/ui/card';
import { AttributeBonus } from "@/core/types";

const ATTRIBUTE_NAMES = {
    for: "Força",
    des: "Destreza",
    con: "Constituição",
    int: "Inteligência",
    sab: "Sabedoria",
    car: "Carisma"
};

const ATTRIBUTE_DESCRIPTIONS = {
    for: "Potência muscular, combate corpo a corpo, capacidade de carga.",
    des: "Agilidade, reflexos, equilíbrio, pontaria.",
    con: "Saúde, vigor, resistência a venenos e doenças.",
    int: "Raciocínio, memória, conhecimento, magias arcanas.",
    sab: "Percepção, intuição, força de vontade, magias divinas.",
    car: "Personalidade, magnetismo pessoal, liderança, magia de feiticeiro."
};

export default function StepAttributes() {
    const { attributes, setAttributes, name, setName, playerName, setPlayerName, level, setLevel, suggestName } = useCharacterStore();
    const pointsSpent = calculateTotalPoints(attributes);
    const pointsRemaining = INITIAL_POINTS - pointsSpent;

    const handleChange = (attr: keyof AttributeBonus, delta: number) => {
        const newValue = attributes[attr] + delta;

        // Limits: Min -1, Max 4 (initial)
        if (newValue < -1 || newValue > 4) return;

        // Check cost
        const costDiff = calculateAttributeCost(newValue) - calculateAttributeCost(attributes[attr]);
        if (pointsRemaining - costDiff < 0 && delta > 0) return; // Cannot afford

        setAttributes({ ...attributes, [attr]: newValue });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-bold text-tormenta-red">Defina seus Atributos</h2>
                <p className="text-muted-foreground">Distribua seus pontos. Você tem <span className="text-white font-bold">{INITIAL_POINTS}</span> pontos iniciais.</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-lg border border-white/10">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="char-name" className="text-lg font-serif text-tormenta-gold flex items-center justify-between">
                            Nome do Personagem
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setName(suggestName())}
                                className="h-6 text-[10px] uppercase font-black text-arton-gold hover:bg-arton-gold hover:text-black border border-arton-gold/50"
                            >
                                <Sparkles className="w-3 h-3 mr-1" /> Sugerir Nome
                            </Button>
                        </Label>
                        <Input
                            id="char-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Artonio, o Bravo"
                            className="bg-black/40 border-white/10 text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="player-name" className="text-lg font-serif text-tormenta-gold">Nome do Jogador</Label>
                        <Input
                            id="player-name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Seu nome real"
                            className="bg-black/40 border-white/10 text-lg"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="char-level" className="text-lg font-serif text-tormenta-gold">Nível de Personagem</Label>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setLevel(Math.max(1, level - 1))}
                            disabled={level <= 1}
                            className="h-10 w-10"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-2xl font-bold font-mono w-16 text-center text-white">{level}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setLevel(Math.min(20, level + 1))}
                            disabled={level >= 20}
                            className="h-10 w-10"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Points Counter */}
            <div className="flex justify-center mb-8">
                <div className={`relative group text-5xl font-black font-mono border-4 p-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 ${pointsRemaining < 0 ? 'border-red-500/50 bg-red-950/30 text-red-500 shadow-red-900/20' : 'border-tormenta-gold/30 bg-black/40 text-tormenta-gold shadow-tormenta-gold/10'}`}>
                    <Trophy className="absolute -top-6 -left-6 w-12 h-12 text-white/10 group-hover:text-white/20 transition-colors rotate-12" />
                    {pointsRemaining}
                    <span className="text-xs tracking-widest block font-sans font-bold text-center text-white/30 mt-2 uppercase">Pontos Restantes</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(ATTRIBUTE_NAMES) as Array<keyof AttributeBonus>).map((attr) => (
                    <Card key={attr} className="p-4 border border-white/5 bg-black/20 backdrop-blur hover:bg-black/40 hover:border-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 bg-gradient-to-br from-tormenta-red/5 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold uppercase text-white tracking-wide group-hover:text-tormenta-red transition-colors">{ATTRIBUTE_NAMES[attr]}</h3>
                                    <p className="text-xs text-white/40 h-8 leading-relaxed max-w-[90%]">{ATTRIBUTE_DESCRIPTIONS[attr]}</p>
                                </div>
                                <div className={`text-3xl font-serif font-black ${attributes[attr] > 0 ? 'text-tormenta-gold' : attributes[attr] < 0 ? 'text-red-500' : 'text-white/20'}`}>
                                    {attributes[attr] > 0 ? `+${attributes[attr]}` : attributes[attr]}
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-black/40 rounded-lg p-1 border border-white/5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleChange(attr, -1)}
                                    disabled={attributes[attr] <= -1}
                                    className="hover:bg-red-500/20 hover:text-red-500 h-8 w-8"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>

                                <div className="text-center flex flex-col">
                                    <span className="text-[10px] uppercase text-white/20 font-bold">Custo</span>
                                    <div className="font-mono font-bold text-sm text-white/60">
                                        {calculateAttributeCost(attributes[attr])}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleChange(attr, 1)}
                                    disabled={attributes[attr] >= 4 || calculateAttributeCost(attributes[attr] + 1) - calculateAttributeCost(attributes[attr]) > pointsRemaining}
                                    className="hover:bg-green-500/20 hover:text-green-500 h-8 w-8"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
