"use client";

import { useState } from "react";
import deitiesData from "@/data/lotes_legado/personagem/divindades.json";
import { cn } from "@/core/lib/utils";
import { useForja } from "@/context/ForjaContext";

export function DeityStep() {
  const { character, updateCharacter } = useForja();
  
  const deities = [
    { nome: "Panteão (Geral)", titulo: "Respeito a todos os Deuses", lore: "Você não serve a um deus específico, mas respeita o Panteão como um todo.", poderes: [], obrigacoes: "Nenhuma" },
    ...Object.values(deitiesData) as any[]
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {deities.map((deity, idx) => (
        <button
          key={idx}
          onClick={() => updateCharacter({ devotion: deity })}
          className={cn(
            "group relative text-left bg-parchment border border-gold-aged/50 p-8 rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden",
            character.devotion?.nome === deity.nome 
              ? "ring-4 ring-primary ring-offset-4 ring-offset-background-dark border-primary shadow-[0_0_40px_rgba(139,0,0,0.3)] scale-[1.02]" 
              : "opacity-90 hover:opacity-100"
          )}
        >
          {/* Decorative Halo */}
          <div className="absolute -top-10 -left-10 size-40 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors" />
          
          <header className="mb-6 relative z-10">
            <h3 className="text-2xl font-display font-black text-text-dark uppercase tracking-tighter italic mb-1 group-hover:text-primary transition-colors">
              {deity.nome}
            </h3>
            <p className="text-[10px] font-display font-black text-accent-gold uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded border border-gold-aged/10 inline-block">
              {deity.titulo}
            </p>
          </header>

          <div className="space-y-6 relative z-10">
            <p className="text-[10px] text-text-dark/70 font-serif italic leading-relaxed line-clamp-3">
              {deity.lore}
            </p>

            {/* Powers Section */}
            {deity.poderes.length > 0 && (
              <div>
                <p className="text-[9px] font-display font-black text-gold-aged/70 uppercase tracking-[0.2em] mb-2">Poderes Concedidos</p>
                <div className="flex flex-wrap gap-2">
                  {deity.poderes.map((pow: any, i: number) => (
                    <span key={i} className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      {pow}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Obligations Section */}
            <div>
              <p className="text-[9px] font-display font-black text-red-800/70 uppercase tracking-[0.2em] mb-2">Obrigações & Restrições</p>
              <p className="text-[10px] text-text-dark/80 font-bold leading-tight italic">
                {deity.obrigacoes}
              </p>
            </div>
          </div>

          {/* Selection Icon */}
          {character.devotion?.nome === deity.nome && (
            <div className="absolute bottom-4 right-4 animate-pulse">
              <span className="material-symbols-outlined text-primary text-3xl fill">auto_awesome</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
