"use client";

import { useState } from "react";
import { cn } from "@/core/lib/utils";
import { ForjaProvider, useForja } from "@/context/ForjaContext";
import { SidebarPreview } from "@/components/forja/SidebarPreview";
import { RaceStep } from "@/components/forja/RaceStep";
import { ClassStep } from "@/components/forja/ClassStep";
import { AttributesStep } from "@/components/forja/AttributesStep";
import { OriginStep } from "@/components/forja/OriginStep";
import { DeityStep } from "@/components/forja/DeityStep";
import { SkillsStep } from "@/components/forja/SkillsStep";
import { ReviewStep } from "@/components/forja/ReviewStep";

const steps = [
  { id: "linhagem", label: "Linhagem", icon: "person" },
  { id: "vocacao", label: "Vocação", icon: "swords" },
  { id: "essencia", label: "Essência", icon: "monitoring" },
  { id: "passado", label: "Passado", icon: "history_edu" },
  { id: "devocao", label: "Devoção", icon: "auto_awesome" },
  { id: "competencias", label: "Competências", icon: "menu_book" },
  { id: "consagracao", label: "Consagração", icon: "verified" },
];

function ForjaContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const { character } = useForja();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="flex h-screen bg-background-dark overflow-hidden">
      {/* Sidebar Preview */}
      <SidebarPreview />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Wizard Header - Grimório Identity */}
        <header className="px-6 py-8 border-b border-gold-aged/30 bg-background-dark relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-display font-black text-text-main uppercase tracking-widest drop-shadow-lg">
                  Forja de <span className="text-primary">Heróis</span>
                </h1>
                <p className="text-[10px] text-accent-gold font-display font-black uppercase tracking-[0.4em] mt-2">
                  Livro {currentStep + 1} de {steps.length}: {steps[currentStep].label}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                 <button 
                  onClick={prevStep} 
                  disabled={currentStep === 0} 
                  className="px-6 py-2 border border-gold-aged/30 text-gold-aged text-[10px] font-display font-black uppercase tracking-widest hover:bg-gold-aged/10 transition-all disabled:opacity-20 rounded-md"
                 >
                  Retroceder
                 </button>
                 <button 
                  onClick={nextStep} 
                  disabled={currentStep === steps.length - 1}
                  className="px-8 py-2 bg-primary text-text-main border border-primary text-[10px] font-display font-black uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(139,0,0,0.5)] hover:bg-red-700 transition-all rounded-md disabled:opacity-20"
                 >
                  Continuar
                 </button>
              </div>
            </div>

            {/* Stepper Grid - Grimório Identity */}
            <div className="grid grid-cols-7 gap-2">
              {steps.map((step, idx) => {
                const matches = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.id} className="relative group cursor-pointer" onClick={() => idx < currentStep && setCurrentStep(idx)}>
                    <div className={cn(
                      "h-1 rounded-full transition-all duration-700",
                      matches ? "bg-primary shadow-[0_0_10px_rgba(139,0,0,0.4)]" : "bg-gold-aged/10"
                    )} />
                    <div className="flex flex-col items-center gap-2 mt-4">
                      <span className={cn(
                        "material-symbols-outlined text-sm transition-all duration-300",
                        matches ? "text-primary drop-shadow-[0_0_5px_rgba(139,0,0,0.5)] scale-110" : "text-gold-aged/30"
                      )}>
                        {step.icon}
                      </span>
                      <span className={cn(
                        "text-[8px] uppercase font-display font-black tracking-widest hidden lg:block text-center",
                        isCurrent ? "text-text-main" : matches ? "text-accent-gold" : "text-gold-aged/30"
                      )}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        {/* Step Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide parchment-texture bg-background-dark/30">
          <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16">
            {currentStep === 0 && <RaceStep />}
            {currentStep === 1 && <ClassStep />}
            {currentStep === 2 && <AttributesStep />}
            {currentStep === 3 && <OriginStep />}
            {currentStep === 4 && <DeityStep />}
            {currentStep === 5 && <SkillsStep />}
            {currentStep === 6 && <ReviewStep />}
          </div>
        </main>

        {/* Mobile Footer Actions - Grimório Identity */}
        <footer className="md:hidden p-6 border-t border-gold-aged/20 bg-background-dark sticky bottom-0 z-30 flex gap-4 pb-10">
          <button 
              onClick={prevStep} 
              disabled={currentStep === 0} 
              className="flex-1 py-4 border border-gold-aged/30 text-gold-aged font-display font-black uppercase text-[10px] tracking-widest disabled:opacity-20 rounded-md"
          >
              Anterior
          </button>
          <button 
              onClick={nextStep} 
              disabled={currentStep === steps.length - 1}
              className="flex-[2] py-4 bg-primary text-text-main font-display font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_0_20px_rgba(139,0,0,0.4)] rounded-md disabled:opacity-20"
          >
              Prosseguir
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function ForjaPage() {
  return (
    <ForjaProvider>
      <ForjaContent />
    </ForjaProvider>
  );
}
