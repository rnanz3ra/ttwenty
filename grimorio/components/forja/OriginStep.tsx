"use client";

import { useState } from "react";
import originsData from "@/data/lotes_legado/personagem/origens.json";
import { cn } from "@/core/lib/utils";
import { useForja } from "@/context/ForjaContext";

export function OriginStep() {
  const { character, updateCharacter } = useForja();
  const origins = Object.entries(originsData).map(([key, value]) => ({
    key,
    ...value,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {origins.map((origin) => (
        <button
          key={origin.key}
          onClick={() => updateCharacter({ origin })}
          className={cn(
            "group relative text-left bg-parchment border border-gold-aged/50 p-8 rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden",
            character.origin?.key === origin.key 
              ? "ring-4 ring-primary ring-offset-4 ring-offset-background-dark border-primary shadow-[0_0_40px_rgba(139,0,0,0.3)] scale-[1.02]" 
              : "opacity-90 hover:opacity-100"
          )}
        >
          {/* Decorative Icon */}
          <div className="absolute -top-4 -right-4 size-24 opacity-5 text-primary rotate-12 group-hover:opacity-10 transition-opacity">
             <span className="material-symbols-outlined text-[96px]">history_edu</span>
          </div>
          
          <header className="mb-6 relative z-10">
            <h3 className="text-2xl font-display font-black text-text-dark uppercase tracking-tighter italic mb-1 group-hover:text-primary transition-colors">
              {origin.nome}
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-display font-black text-accent-gold uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded border border-gold-aged/10">
                Passado
              </span>
            </div>
          </header>

          <div className="space-y-6 relative z-10">
            <p className="text-[11px] text-text-dark/70 font-serif italic leading-relaxed line-clamp-3">
              {origin.descricao}
            </p>

            {/* Benefits Section */}
            <div>
              <p className="text-[9px] font-display font-black text-gold-aged/70 uppercase tracking-[0.2em] mb-3">Benefícios</p>
              <div className="space-y-2">
                {Object.values(origin.beneficios).slice(0, 3).map((bene: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[10px] text-primary mt-0.5">diamond</span>
                    <span className="text-[10px] text-text-dark/80 font-bold leading-tight">
                       {bene as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Icon */}
          {character.origin?.key === origin.key && (
            <div className="absolute bottom-4 right-4 animate-pulse">
              <span className="material-symbols-outlined text-primary text-3xl fill">history_edu</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
