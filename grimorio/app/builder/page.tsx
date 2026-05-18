"use client";

import { useState } from "react";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/core/ui/button";
import { cn } from "@/core/lib/utils";
import StepRace from "@/features/character/components/character-builder/StepRace";
import StepClass from "@/features/character/components/character-builder/StepClass";
import StepAttributes from "@/features/character/components/character-builder/StepAttributes";
import StepOriginDivinity from "@/features/character/components/character-builder/StepOriginDivinity";
import StepSkills from "@/features/character/components/character-builder/StepSkills";
import StepEquipment from "@/features/character/components/character-builder/StepEquipment";
import StepSummary from "@/features/character/components/character-builder/StepSummary";

const STEPS = [
    { id: 1, label: "Raça" },
    { id: 2, label: "Classe" },
    { id: 3, label: "Atributos" },
    { id: 4, label: "Origem & Devoção" },
    { id: 5, label: "Perícias" },
    { id: 6, label: "Equipamento" },
    { id: 7, label: "Resumo" },
];

export default function BuilderPage() {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => setCurrentStep((p) => Math.min(p + 1, STEPS.length));
    const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Header / Progress Bar */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Sair
                    </Link>

                    <div className="flex items-center gap-2">
                        {STEPS.map((step) => {
                            const isCompleted = step.id < currentStep;
                            const isCurrent = step.id === currentStep;

                            return (
                                <div key={step.id} className="flex items-center group relative">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                        isCompleted ? "bg-tormenta-red border-tormenta-red text-white" :
                                            isCurrent ? "bg-white border-white text-black scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]" :
                                                "bg-black/40 border-white/10 text-white/40"
                                    )}>
                                        {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                                    </div>
                                    {/* Tooltip for step name */}
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap bg-black border border-white/10 px-2 py-1 rounded pointer-events-none">
                                        {step.label}
                                    </div>

                                    {step.id !== STEPS.length && (
                                        <div className={cn(
                                            "w-4 sm:w-8 h-0.5 mx-1 transition-colors",
                                            isCompleted ? "bg-tormenta-red" : "bg-white/10"
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-20 hidden sm:block" /> {/* Spacer */}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 container mx-auto p-4 lg:p-8 max-w-6xl">
                {/* Step Content */}
                <div className="min-h-[400px]">
                    {currentStep === 1 && <StepRace />}
                    {currentStep === 2 && <StepClass />}
                    {currentStep === 3 && <StepAttributes />}
                    {currentStep === 4 && <StepOriginDivinity />}
                    {currentStep === 5 && <StepSkills />}
                    {currentStep === 6 && <StepEquipment />}
                    {currentStep === 7 && <StepSummary />}
                </div>
            </div>

            {/* Footer / Navigation */}
            <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md p-4 sticky bottom-0 z-40">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="text-muted-foreground hover:text-white"
                    >
                        Anterior
                    </Button>

                    <div className="text-sm text-muted-foreground font-serif hidden sm:block">
                        {STEPS[currentStep - 1].label}
                    </div>

                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={nextStep}
                            className="bg-tormenta-red hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                        >
                            Próximo <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => window.print()}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                        >
                            Imprimir / Salvar PDF
                        </Button>
                    )}
                </div>
            </footer>
        </main>
    );
}
