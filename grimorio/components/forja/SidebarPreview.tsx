"use client";

import { useForja } from "@/context/ForjaContext";
import { cn } from "@/core/lib/utils";

export function SidebarPreview() {
  const { character, calculateStats } = useForja();
  const { pv, pm, defense } = calculateStats();

  return (
    <aside className="w-80 hidden xl:flex flex-col border-l border-gold-aged/20 bg-background-dark/50 backdrop-blur-md sticky top-0 h-screen p-8 overflow-y-auto scrollbar-hide">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
      
      <div className="relative z-10 space-y-10">
        <header className="text-center">
          <p className="text-[10px] font-display font-black text-accent-gold uppercase tracking-[0.4em] mb-2">Resumo da Lenda</p>
          <h3 className="text-2xl font-display font-black text-text-main uppercase tracking-tighter italic leading-none truncate">
            {character.name || "Herói Sem Nome"}
          </h3>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-4" />
        </header>

        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-gold-aged/10 pb-2">
            <span className="text-[9px] font-display font-black text-gold-aged/50 uppercase tracking-widest">Linhagem</span>
            <span className="text-sm font-display font-black text-text-main uppercase tracking-tight">{character.race?.nome || "—"}</span>
          </div>
          <div className="flex justify-between items-end border-b border-gold-aged/10 pb-2">
            <span className="text-[9px] font-display font-black text-gold-aged/50 uppercase tracking-widest">Vocação</span>
            <span className="text-sm font-display font-black text-text-main uppercase tracking-tight">{character.class?.nome || "—"}</span>
          </div>
          <div className="flex justify-between items-end border-b border-gold-aged/10 pb-2">
            <span className="text-[9px] font-display font-black text-gold-aged/50 uppercase tracking-widest">Passado</span>
            <span className="text-sm font-display font-black text-text-main uppercase tracking-tight">{character.origin?.nome || "—"}</span>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center shadow-inner">
            <p className="text-[8px] font-display font-black text-primary uppercase mb-1">Vida</p>
            <p className="text-2xl font-display font-black text-text-main">{pv}</p>
          </div>
          <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg text-center shadow-inner">
            <p className="text-[8px] font-display font-black text-blue-400 uppercase mb-1">Mana</p>
            <p className="text-2xl font-display font-black text-text-main">{pm}</p>
          </div>
          <div className="bg-gold-aged/5 border border-gold-aged/20 p-4 rounded-lg text-center shadow-inner">
            <p className="text-[8px] font-display font-black text-accent-gold uppercase mb-1">Defesa</p>
            <p className="text-2xl font-display font-black text-text-main">{defense}</p>
          </div>
        </section>

        <section className="bg-black/20 border border-gold-aged/10 p-6 rounded-xl">
           <p className="text-[9px] font-display font-black text-accent-gold uppercase tracking-[0.3em] mb-6 text-center">Atributos</p>
           <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {Object.entries(character.attributes).map(([at, baseVal]) => {
                const raceBonus = character.race?.bonus?.[at] || 0;
                const total = baseVal + raceBonus;
                return (
                  <div key={at} className="flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-display font-black text-gold-aged/50 uppercase">{at}</span>
                      <span className="text-xl font-display font-black text-text-main leading-none">
                         {total > 0 ? `+${total}` : total}
                      </span>
                    </div>
                    {raceBonus !== 0 && (
                      <div className="text-[8px] font-display font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                        {raceBonus > 0 ? `+${raceBonus}` : raceBonus} R
                      </div>
                    )}
                  </div>
                );
              })}
           </div>
        </section>

        <div className="pt-6">
          <div className="p-4 border border-gold-aged/20 rounded-lg bg-gold-aged/5 italic font-serif text-[11px] text-gold-aged/70 leading-relaxed">
            "Os destinos de Arton são moldados por aqueles que ousam forjar seu próprio caminho."
          </div>
        </div>
      </div>
    </aside>
  );
}
