import { useState, useEffect, useMemo } from 'react';
import { useCharacterStore } from '@/core/store/character-store';
import { getAllSkills } from '@/core/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card';
import { Label } from '@/core/ui/label';
import { Checkbox } from '@/core/ui/checkbox';
import { Badge } from '@/core/ui/badge';
import { ScrollArea } from '@/core/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert';
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/core/lib/utils";

export default function StepSkills() {
    const {
        race,
        class: selectedClass,
        origin,
        attributes,
        skills: storedSkills,
        setSkills
    } = useCharacterStore();

    const allSkills = useMemo(() => getAllSkills(), []);

    // Local state for selections
    const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>([]);
    const [selectedBonusSkills, setSelectedBonusSkills] = useState<string[]>([]);

    // Derived constants
    const intBonus = attributes.int > 0 ? attributes.int : 0;

    // 1. Calculate Fixed Skills (Granted by Race/Origin/Class automatically)
    // Note: T20 usually makes you CHOOSE class skills, but some might be fixed? 
    // In standard T20, class skills are choices. Origin skills can be fixed.
    const fixedSkills = useMemo(() => {
        const fixed = new Set<string>();

        // Origin Fixed Skills
        if (origin?.beneficios) {
            Object.values(origin.beneficios).forEach((benefit: string) => {
                if (benefit.startsWith("Perícia:") && !benefit.includes("qualquer") && !benefit.includes("escolha")) {
                    // Extract skill name: "Perícia: Cura." -> "Cura"
                    const match = benefit.match(/Perícia:\s*([\wÀ-ú]+)/);
                    if (match && match[1]) {
                        // Find standard name
                        const skillName = match[1];
                        // Verify it exists in allSkills to avoid typos
                        const found = allSkills.find(s => s.name.startsWith(skillName));
                        if (found) fixed.add(found.name);
                    }
                }
            });
        }

        return Array.from(fixed);
    }, [origin, allSkills]);

    // 2. Calculate Budgets
    const classSkillBudget = selectedClass?.pericias.qnt || 0;

    const originBonusBudget = useMemo(() => {
        let budget = 0;
        if (origin?.beneficios) {
            Object.values(origin.beneficios).forEach((benefit: string) => {
                // "Perícia: Uma qualquer" or similar
                if (benefit.includes("Perícia") && (benefit.includes("qualquer") || benefit.includes("escolha"))) {
                    budget++;
                }
            });
        }
        return budget;
    }, [origin]);

    const raceBonusBudget = useMemo(() => {
        let budget = 0;
        if (race?.name === "Humano") budget += 2; // Versátil
        if (race?.name === "Kliren") budget += 1; // Híbrido
        // Osteon logic is complex (one skill OR power), skipping for MVP or assuming skill for now if user wants
        // For simplicity in MVP, we might not auto-add Osteon/Human generic budget without a dedicated "Race Choice" step, 
        // but let's be generous and allow it if we detect the race.
        return budget;
    }, [race]);

    const totalBonusBudget = intBonus + originBonusBudget + raceBonusBudget;

    // 3. Class Options
    const classOptions = useMemo(() => {
        if (!selectedClass) return [];
        return Object.values(selectedClass.pericias.opcoes).map(opt => {
            // Extract Name from "Perícia (Attr)" string
            const name = opt.split('(')[0].trim();
            return allSkills.find(s => s.name.startsWith(name))?.name || opt;
        });
    }, [selectedClass, allSkills]);

    // Sync with store on mount (only once or if empty)
    useEffect(() => {
        // Initial sync logic if needed
    }, []);

    // Effect to update global store whenever local selections change
    useEffect(() => {
        const uniqueSkills = new Set([
            ...fixedSkills,
            ...selectedClassSkills,
            ...selectedBonusSkills
        ]);
        setSkills(Array.from(uniqueSkills));
    }, [fixedSkills, selectedClassSkills, selectedBonusSkills, setSkills]);

    // Handlers
    const toggleClassSkill = (skillName: string) => {
        if (selectedClassSkills.includes(skillName)) {
            setSelectedClassSkills(prev => prev.filter(s => s !== skillName));
        } else {
            if (selectedClassSkills.length < classSkillBudget) {
                setSelectedClassSkills(prev => [...prev, skillName]);
            }
        }
    };

    const toggleBonusSkill = (skillName: string) => {
        if (selectedBonusSkills.includes(skillName)) {
            setSelectedBonusSkills(prev => prev.filter(s => s !== skillName));
        } else {
            if (selectedBonusSkills.length < totalBonusBudget) {
                setSelectedBonusSkills(prev => [...prev, skillName]);
            }
        }
    };

    const isSkillSelected = (skill: string) => {
        return fixedSkills.includes(skill) || selectedClassSkills.includes(skill) || selectedBonusSkills.includes(skill);
    };

    // Filter for Bonus Skills (Exclude already selected/fixed/class restricted if needed)
    // Actually, T20 allows picking any skill for Int bonus, but usually not one you already have (unless it allows "Expertise"? No, usually just trained).
    // So we filter out skills that are already in Fixed or SelectedClass.
    const availableBonusSkills = allSkills.filter(s =>
        !fixedSkills.includes(s.name) &&
        !selectedClassSkills.includes(s.name)
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-tormenta-red">Perícias</h2>
                <div className="text-sm text-muted-foreground">
                    Total Treinadas: <span className="font-bold text-foreground">{fixedSkills.length + selectedClassSkills.length + selectedBonusSkills.length}</span>
                </div>
            </div>

            {/* Fixed Skills Section */}
            {fixedSkills.length > 0 && (
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-500" />
                            Perícias Garantidas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {fixedSkills.map(skill => (
                                <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    {skill} (Origem/Raça)
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Class Skills Section */}
            <Card className={cn("border-l-4", selectedClassSkills.length === classSkillBudget ? "border-l-green-500" : "border-l-yellow-500")}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Perícias de Classe</CardTitle>
                        <Badge variant={selectedClassSkills.length === classSkillBudget ? "default" : "outline"} className={cn("text-sm", selectedClassSkills.length === classSkillBudget ? "bg-green-600 hover:bg-green-700" : "")}>
                            {selectedClassSkills.length} / {classSkillBudget}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {classOptions.map(skill => {
                            const isFixed = fixedSkills.includes(skill);
                            const isSelected = selectedClassSkills.includes(skill);

                            return (
                                <div key={skill} className={cn(
                                    "flex items-center space-x-3 border p-3 rounded-lg transition-colors",
                                    isSelected ? "bg-red-50 border-red-200" : "hover:bg-accent",
                                    isFixed ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"
                                )}
                                    onClick={() => !isFixed && toggleClassSkill(skill)}
                                >
                                    <Checkbox
                                        checked={isSelected || isFixed}
                                        disabled={isFixed || (!isSelected && selectedClassSkills.length >= classSkillBudget)}
                                        onCheckedChange={() => !isFixed && toggleClassSkill(skill)}
                                    />
                                    <Label className={cn("cursor-pointer font-medium", isFixed ? "text-muted-foreground" : "")}>
                                        {skill}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Bonus Skills Section (Int + Origin Choices + Race) */}
            <Card className={cn("border-l-4", selectedBonusSkills.length === totalBonusBudget ? "border-l-green-500" : "border-l-yellow-500")}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Perícias Livres</CardTitle>
                        <Badge variant={selectedBonusSkills.length === totalBonusBudget ? "default" : "outline"} className={cn("text-sm", selectedBonusSkills.length === totalBonusBudget ? "bg-green-600 hover:bg-green-700" : "")}>
                            {selectedBonusSkills.length} / {totalBonusBudget}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Provenientes de Inteligência ({intBonus}), Origem ({originBonusBudget}) e Raça ({raceBonusBudget}).
                    </p>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {availableBonusSkills.map(skill => {
                                const isSelected = selectedBonusSkills.includes(skill.name);
                                return (
                                    <div key={skill.name} className={cn(
                                        "flex items-center space-x-3 border p-3 rounded-lg transition-colors",
                                        isSelected ? "bg-red-50 border-red-200" : "hover:bg-accent cursor-pointer"
                                    )}
                                        onClick={() => toggleBonusSkill(skill.name)}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={!isSelected && selectedBonusSkills.length >= totalBonusBudget}
                                            onCheckedChange={() => toggleBonusSkill(skill.name)}
                                        />
                                        <div className="flex flex-col">
                                            <Label className="cursor-pointer font-medium">
                                                {skill.name}
                                            </Label>
                                            <span className="text-xs text-muted-foreground uppercase">{skill.atributo}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Validation Alert */}
            {(selectedClassSkills.length < classSkillBudget || selectedBonusSkills.length < totalBonusBudget) && (
                <Alert variant="warning" className="bg-orange-50 border-orange-200">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-800">Seleção Incompleta</AlertTitle>
                    <AlertDescription className="text-orange-700">
                        Você ainda pode selecionar mais perícias. Certifique-se de usar todos os seus pontos!
                    </AlertDescription>
                </Alert>
            )}

            {(selectedClassSkills.length === classSkillBudget && selectedBonusSkills.length === totalBonusBudget) && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Tudo pronto!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Todas as perícias disponíveis foram selecionadas.
                    </AlertDescription>
                </Alert>
            )}

        </div>
    );
}
