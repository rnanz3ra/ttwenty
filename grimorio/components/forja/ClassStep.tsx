"use client";

import { useState } from "react";
import classesData from "@/data/lotes_legado/personagem/classes.json";
import { cn } from "@/core/lib/utils";
import { useForja } from "@/context/ForjaContext";

export function ClassStep() {
  const { character, updateCharacter } = useForja();
  const classes = Object.entries(classesData).map(([key, value]) => ({
    key,
    ...value,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {classes.map((cls) => (
        <button
          key={cls.key}
          onClick={() => updateCharacter({ class: cls })}
          className={cn(
            "group relative text-left bg-parchment border border-gold-aged/50 p-8 rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden",
            character.class?.key === cls.key 
              ? "ring-4 ring-primary ring-offset-4 ring-offset-background-dark border-primary shadow-[0_0_40px_rgba(139,0,0,0.3)] scale-[1.02]" 
              : "opacity-90 hover:opacity-100"
          )}
        >
          {/* Decorative Shield Icon in Background */}
          <div className="absolute -bottom-4 -right-4 size-32 opacity-5 text-primary rotate-12 group-hover:opacity-10 transition-opacity">
             <span className="material-symbols-outlined text-[128px]">shield</span>
          </div>
          
          <header className="mb-6 relative z-10">
            <h3 className="text-3xl font-display font-black text-text-dark uppercase tracking-tighter italic mb-1 group-hover:text-primary transition-colors">
              {cls.nome}
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-display font-black text-accent-gold uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded border border-gold-aged/10">
                Vocação
              </span>
            </div>
          </header>

          <div className="space-y-6 relative z-10">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-3 rounded border border-primary/20 text-center">
                 <p className="text-[8px] font-display font-black text-primary uppercase mb-1">Vida Inicial</p>
                 <p className="text-xl font-display font-black text-text-dark">{cls.pv.base}</p>
              </div>
              <div className="bg-blue-900/5 p-3 rounded border border-blue-500/20 text-center">
                 <p className="text-[8px] font-display font-black text-blue-600 uppercase mb-1">Mana Inicial</p>
                 <p className="text-xl font-display font-black text-text-dark">{cls.pm}</p>
              </div>
            </div>

            {/* Perícias Section */}
            <div>
              <p className="text-[9px] font-display font-black text-gold-aged/70 uppercase tracking-[0.2em] mb-2">Treinamento</p>
              <p className="text-[10px] text-text-dark/80 font-serif italic mb-3">
                {cls.pericias.qnt} perícias entre: {Object.values(cls.pericias.opcoes).slice(0, 4).join(", ")}...
              </p>
            </div>

            {/* Abilities Section */}
            <div>
              <p className="text-[9px] font-display font-black text-gold-aged/70 uppercase tracking-[0.2em] mb-3">Habilidades de Classe</p>
              <div className="space-y-3">
                {Object.values(cls.habilidades).slice(0, 2).map((hab: any, idx: number) => (
                  <div key={idx} className="group/hab">
                    <p className="text-[11px] font-display font-black text-text-dark uppercase mb-1 flex items-center gap-2">
                      <span className="size-1 bg-primary rounded-full" />
                      {hab.nome}
                    </p>
                    <p className="text-[10px] text-text-dark/60 font-serif leading-relaxed line-clamp-2">
                       {typeof hab.descricao === "string" ? hab.descricao : Object.values(hab.descricao)[0] as string}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Icon */}
          {character.class?.key === cls.key && (
            <div className="absolute top-4 right-4 animate-pulse">
              <span className="material-symbols-outlined text-primary text-3xl fill">shield</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
