"use client";

import { useState } from "react";
import racesData from "@/data/lotes_legado/personagem/races.json";
import { cn } from "@/core/lib/utils";
import { useForja } from "@/context/ForjaContext";

export function RaceStep() {
  const { character, updateCharacter } = useForja();
  const races = Object.entries(racesData).map(([key, value]) => ({
    key,
    ...value,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {races.map((race) => (
        <button
          key={race.key}
          onClick={() => updateCharacter({ race, attributes: race.bonus })}
          className={cn(
            "group relative text-left bg-parchment border border-gold-aged/50 p-8 rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden",
            character.race?.key === race.key 
              ? "ring-4 ring-primary ring-offset-4 ring-offset-background-dark border-primary shadow-[0_0_40px_rgba(139,0,0,0.3)] scale-[1.02]" 
              : "opacity-90 hover:opacity-100"
          )}
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 -translate-y-8 translate-x-8 rotate-45 group-hover:bg-primary/20 transition-colors" />
          
          <header className="mb-6 relative z-10">
            <h3 className="text-3xl font-display font-black text-text-dark uppercase tracking-tighter italic mb-1 group-hover:text-primary transition-colors">
              {race.nome}
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-display font-black text-accent-gold uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded border border-gold-aged/10">
                Linhagem
              </span>
            </div>
          </header>

          <div className="space-y-6 relative z-10">
            {/* Attributes Section */}
            <div>
              <p className="text-[9px] font-display font-black text-gold-aged/70 uppercase tracking-[0.2em] mb-3">Dons Raciais</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(race.bonus).map(([at, val]) => (
                  (val as number) !== 0 && (
                    <div key={at} className="flex flex-col items-center bg-black/5 p-2 rounded border border-gold-aged/10">
                      <span className="text-[8px] font-display font-black text-gold-aged uppercase">{at}</span>
                      <span className={cn(
                        "text-sm font-display font-black",
                        (val as number) > 0 ? "text-green-700" : "text-red-700"
                      )}>
                        {(val as number) > 0 ? `+${val}` : val}
                      </span>
                    </div>
                  )
                ))}
                {/* Humano / Osteon special case note */}
                {race.key === "humano" && (
                   <div className="col-span-3 flex items-center justify-center bg-primary/5 p-2 rounded border border-primary/20 mt-1">
                      <span className="text-[9px] font-display font-black text-primary uppercase text-center">+2 em três atributos</span>
                   </div>
                )}
              </div>
            </div>

            {/* Abilities Section */}
            <div>
              <p className="text-[9px] font-display font-black text-gold-aged/70 uppercase tracking-[0.2em] mb-3">Habilidades</p>
              <div className="space-y-3">
                {race.habilidades_de_raca.slice(0, 2).map((hab: any, idx: number) => (
                  <div key={idx} className="group/hab">
                    <p className="text-[11px] font-display font-black text-text-dark uppercase mb-1 flex items-center gap-2">
                      <span className="size-1 bg-primary rounded-full" />
                      {hab.nome}
                    </p>
                    <p className="text-[10px] text-text-dark/60 font-serif leading-relaxed line-clamp-2 group-hover/hab:line-clamp-none transition-all">
                      {hab.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Icon */}
          {character.race?.key === race.key && (
            <div className="absolute bottom-4 right-4 animate-pulse">
              <span className="material-symbols-outlined text-primary text-3xl fill">verified</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
