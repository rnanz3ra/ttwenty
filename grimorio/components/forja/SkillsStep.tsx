"use client";

import { useMemo } from "react";
import { useForja } from "@/context/ForjaContext";
import { cn } from "@/core/lib/utils";
import systemRules from "@/data/system_rules.json";

// Regras Oficiais T20 JDA - Perícias Obrigatórias por Classe
const MANDATORY_SKILLS: Record<string, string[]> = {
  arcanista: ["Misticismo", "Vontade"],
  barbaro: ["Fortitude", "Luta"],
  bardo: ["Atuação", "Reflexos"],
  bucaneiro: ["Reflexos", "Luta"], // Ou Pontaria, mas Luta é padrão no JSON
  cacador: ["Percepção", "Sobrevivência"],
  cavaleiro: ["Fortitude", "Luta"],
  clerigo: ["Religião", "Vontade"],
  druida: ["Sobrevivência", "Vontade"],
  guerreiro: ["Fortitude", "Luta"],
  inventor: ["Ofício", "Vontade"],
  ladino: ["Ladinagem", "Reflexos"],
  lutador: ["Fortitude", "Luta"],
  nobre: ["Diplomacia", "Vontade"],
  paladino: ["Luta", "Vontade"],
};

export function SkillsStep() {
  const { character, updateCharacter } = useForja();
  const allSkills = systemRules.skills;
  const selectedClass = character.class;

  // 1. Identificar Perícias Obrigatórias
  const classId = selectedClass?.key || selectedClass?.nome?.toLowerCase() || "";
  const fixedSkills = useMemo(() => MANDATORY_SKILLS[classId] || [], [classId]);

  // 2. Definir Listas de Perícias
  const classOptionsList = useMemo(() => {
    if (!selectedClass?.pericias?.opcoes) return [];
    return Object.values(selectedClass.pericias.opcoes).map((s: any) => {
        // Remover o (Atributo) do nome se existir no JSON
        return s.split(" (")[0].split("(")[0].trim();
    });
  }, [selectedClass]);

  // 3. Cálculos de Pontos
  const intMod = character.attributes.int + (character.race?.bonus?.int || 0);
  
  // Total de perícias da classe (Obrigatórias + Escolha)
  const totalClassSkillsCount = selectedClass?.pericias?.qnt || 0;
  const classChoicesCount = totalClassSkillsCount - fixedSkills.length;
  const intChoicesCount = Math.max(0, intMod);

  // 4. Estado das Perícias
  // Separamos as perícias em categorias para facilitar a lógica de bloqueio
  const currentSkills = character.skills;
  
  // Perícias que já estão "presas" por serem da classe (ou obrigatórias)
  const isMandatory = (skillName: string) => fixedSkills.includes(skillName);
  
  // Lógica de Seleção
  const toggleSkill = (skillName: string) => {
    if (isMandatory(skillName)) return; // Bloqueado

    const isSelected = currentSkills.includes(skillName);
    
    if (isSelected) {
      updateCharacter({ skills: currentSkills.filter(s => s !== skillName) });
      return;
    }

    // Tentar selecionar como Perícia de Classe
    const currentClassChoices = currentSkills.filter(s => 
      classOptionsList.includes(s) && !fixedSkills.includes(s)
    ).length;

    const currentIntChoices = currentSkills.filter(s => 
       !classOptionsList.includes(s) || (classOptionsList.includes(s) && currentClassChoices >= classChoicesCount)
    ).length;

    // Se é da lista da classe e ainda tem pontos de classe
    if (classOptionsList.includes(skillName) && currentClassChoices < classChoicesCount) {
      updateCharacter({ skills: [...currentSkills, skillName] });
    } 
    // Se não é da classe (ou acabaram os pontos da classe) e tem pontos de INT
    else if (currentIntChoices < intChoicesCount) {
      updateCharacter({ skills: [...currentSkills, skillName] });
    }
  };

  // Garantir que as obrigatórias estejam sempre marcadas
  useMemo(() => {
    const missingMandatory = fixedSkills.filter(s => !currentSkills.includes(s));
    if (missingMandatory.length > 0) {
      updateCharacter({ skills: [...currentSkills, ...missingMandatory] });
    }
  }, [fixedSkills, currentSkills, updateCharacter]);

  const classChoicesUsed = currentSkills.filter(s => 
    classOptionsList.includes(s) && !fixedSkills.includes(s)
  ).length;

  const intChoicesUsed = currentSkills.filter(s => 
    !fixedSkills.includes(s) && 
    (!classOptionsList.includes(s) || (classOptionsList.includes(s) && currentSkills.filter(sc => classOptionsList.includes(sc) && !fixedSkills.includes(sc)).length > classChoicesCount))
  ).length;

  // Na verdade a lógica de INT é: depois que acabam os pontos de classe, você pode usar INT para QUALQUER perícia (inclusive da classe).
  // Mas se você ainda tem pontos de classe, usa eles primeiro para perícias da classe.
  
  const canSelectAny = intChoicesCount > 0;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <header className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 bg-parchment p-10 border border-gold-aged/30 shadow-2xl rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        
        <div className="lg:col-span-2 relative z-10">
          <h2 className="text-4xl font-display font-black text-text-dark uppercase italic tracking-tighter mb-4">Competências</h2>
          <p className="text-sm text-text-dark/70 font-serif italic max-w-xl leading-relaxed">
            Sua vocação como <span className="text-primary font-bold">{selectedClass?.nome || "Herói"}</span> define seus talentos básicos. 
            Sua mente aguçada ({intMod > 0 ? `+${intMod}` : intMod} INT) permite conhecimentos adicionais além de sua classe.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-background-dark p-4 border border-primary/30 rounded shadow-inner text-center">
            <span className="text-[8px] font-display font-black text-accent-gold uppercase tracking-widest block mb-1">Pontos de Classe</span>
            <span className="text-3xl font-display font-black text-white leading-none">
              {Math.max(0, classChoicesCount - classChoicesUsed)}
            </span>
          </div>
          <div className="bg-background-dark p-4 border border-blue-500/30 rounded shadow-inner text-center">
            <span className="text-[8px] font-display font-black text-blue-400 uppercase tracking-widest block mb-1">Pontos de INT</span>
            <span className="text-3xl font-display font-black text-white leading-none">
              {Math.max(0, intChoicesCount - (currentSkills.length - fixedSkills.length - Math.min(classChoicesUsed, classChoicesCount)))}
            </span>
          </div>
        </div>
      </header>

      {/* Grupos de Perícias */}
      <div className="space-y-12">
        {/* Grupo 1: Herança de Classe (Fixas) */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xs font-display font-black text-gold-aged uppercase tracking-[0.3em]">Herança de Classe</h3>
            <div className="h-px flex-1 bg-gold-aged/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allSkills.filter(s => fixedSkills.includes(s.nome)).map(skill => (
               <SkillCard key={skill.id} skill={skill} isSelected={true} isLocked={true} />
            ))}
          </div>
        </section>

        {/* Grupo 2: Treinamento de Vocação (Lista da Classe) */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xs font-display font-black text-primary uppercase tracking-[0.3em]">Treinamento de Vocação</h3>
            <div className="h-px flex-1 bg-primary/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allSkills.filter(s => classOptionsList.includes(s.nome) && !fixedSkills.includes(s.nome)).map(skill => {
               const isSelected = currentSkills.includes(skill.nome);
               const noClassPoints = classChoicesUsed >= classChoicesCount;
               const noIntPoints = (currentSkills.length - fixedSkills.length - Math.min(classChoicesUsed, classChoicesCount)) >= intChoicesCount;
               const isDisabled = !isSelected && noClassPoints && noIntPoints;

               return (
                 <SkillCard 
                    key={skill.id} 
                    skill={skill} 
                    isSelected={isSelected} 
                    isDisabled={isDisabled}
                    onClick={() => toggleSkill(skill.nome)}
                 />
               );
            })}
          </div>
        </section>

        {/* Grupo 3: Sabedoria Adicional (Restante) */}
        <section className={cn(intChoicesCount === 0 && "opacity-40 grayscale pointer-events-none")}>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xs font-display font-black text-blue-500 uppercase tracking-[0.3em]">Sabedoria Adicional (INT)</h3>
            <div className="h-px flex-1 bg-blue-500/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allSkills.filter(s => !classOptionsList.includes(s.nome) && !fixedSkills.includes(s.nome)).map(skill => {
               const isSelected = currentSkills.includes(skill.nome);
               const noIntPoints = (currentSkills.length - fixedSkills.length - Math.min(classChoicesUsed, classChoicesCount)) >= intChoicesCount;
               const isDisabled = !isSelected && noIntPoints;

               return (
                 <SkillCard 
                    key={skill.id} 
                    skill={skill} 
                    isSelected={isSelected} 
                    isDisabled={isDisabled}
                    isExternal={true}
                    onClick={() => toggleSkill(skill.nome)}
                 />
               );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function SkillCard({ skill, isSelected, isLocked, isDisabled, isExternal, onClick }: any) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked || isDisabled}
      className={cn(
        "group relative text-left p-5 border transition-all duration-300 rounded-sm overflow-hidden min-h-[100px] flex flex-col justify-between",
        isSelected 
          ? isLocked ? "bg-gold-aged/10 border-gold-aged text-text-dark" : "bg-primary border-primary shadow-[0_10px_25px_rgba(139,0,0,0.3)] text-white" 
          : "bg-parchment border-gold-aged/20 hover:border-primary/50 text-text-dark",
        isDisabled && "grayscale opacity-40 cursor-not-allowed",
        isExternal && isSelected && "bg-blue-900 border-blue-500"
      )}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-display font-black uppercase tracking-tighter italic">
            {skill.nome}
          </span>
          <div className="flex items-center gap-1">
            {isLocked && <span className="material-symbols-outlined text-[10px] opacity-50">lock</span>}
            <span className={cn(
              "text-[8px] font-display font-black uppercase px-1.5 py-0.5 rounded",
              isSelected ? "bg-white/20" : "bg-black/5 text-gold-aged"
            )}>
              {skill.atributo}
            </span>
          </div>
        </div>
        <p className={cn(
          "text-[9px] font-serif leading-tight line-clamp-2",
          isSelected ? "opacity-80" : "opacity-50"
        )}>
          {skill.descricao}
        </p>
      </div>

      {isSelected && !isLocked && (
         <div className="absolute top-1 right-1 opacity-20">
            <span className="material-symbols-outlined text-4xl fill">check_circle</span>
         </div>
      )}
    </button>
  );
}
