"use client";

import { useState, useEffect } from "react";
import { cn } from "@/core/lib/utils";
import { useForja } from "@/context/ForjaContext";

const STAT_LABELS: Record<string, string> = {
  for: "Força",
  des: "Destreza",
  con: "Constituição",
  int: "Inteligência",
  sab: "Sabedoria",
  car: "Carisma",
};

const COST_TABLE: Record<number, number> = {
  [-1]: -1,
  [0]: 0,
  [1]: 1,
  [2]: 2,
  [3]: 4,
  [4]: 7,
};

export function AttributesStep() {
  const { character, updateCharacter } = useForja();
  const [method, setMethod] = useState<"point-buy" | "dice">("point-buy");
  const [error, setError] = useState<string | null>(null);

  // Calculate current points spent based on official T20 table
  const calculatePointsSpent = (attrs: typeof character.attributes) => {
    return Object.values(attrs).reduce((acc, val) => acc + (COST_TABLE[val] || 0), 0);
  };

  const pointsRemaining = 10 - calculatePointsSpent(character.attributes);

  const updateStat = (stat: string, delta: number) => {
    if (method === "dice") return;

    const currentVal = character.attributes[stat as keyof typeof character.attributes] || 0;
    const newVal = currentVal + delta;

    if (newVal < -1 || newVal > 4) return;

    const nextAttributes = { ...character.attributes, [stat]: newVal };
    const nextSpent = calculatePointsSpent(nextAttributes);

    if (nextSpent > 10) {
      setError("Pontos insuficientes para esta compra.");
      setTimeout(() => setError(null), 2000);
      return;
    }

    updateCharacter({ attributes: nextAttributes });
    setError(null);
  };

  const rollDice = () => {
    setMethod("dice");
    const newAttrs = { ...character.attributes };
    let totalModifiers = 0;

    Object.keys(STAT_LABELS).forEach((key) => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => a - b);
      const sum = rolls.slice(1).reduce((a, b) => a + b, 0);
      
      let mod = 0;
      if (sum >= 18) mod = 4;
      else if (sum >= 16) mod = 3;
      else if (sum >= 14) mod = 2;
      else if (sum >= 12) mod = 1;
      else if (sum >= 10) mod = 0;
      else if (sum >= 8) mod = -1;
      else if (sum >= 6) mod = -2;
      else if (sum >= 4) mod = -3;
      else if (sum >= 2) mod = -4;
      else mod = -5;

      newAttrs[key as keyof typeof character.attributes] = mod;
      totalModifiers += mod;
    });

    if (totalModifiers < 6) {
      setError("O destino foi cruel. Role novamente!");
      updateCharacter({ attributes: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 } });
    } else {
      updateCharacter({ attributes: newAttrs });
      setError(null);
    }
  };

  const getStatColor = (val: number) => {
    if (val < 0) return "text-primary"; // Red (Blood)
    if (val === 0) return "text-white"; 
    return "text-accent-gold"; // Gold
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 bg-parchment p-8 border border-gold-aged/30 shadow-xl rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-black text-text-dark uppercase italic tracking-tighter mb-2">Essência do Herói</h2>
          <p className="text-sm text-text-dark/70 font-serif italic max-w-lg">
            Escolha seu método: a disciplina da **Compra de Pontos** ou a sorte da **Rolagem de Dados**.
          </p>
          
          <div className="flex gap-4 mt-6">
             <button 
              onClick={() => {
                setMethod("point-buy");
                updateCharacter({ attributes: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 } });
              }}
              className={cn(
                "px-4 py-2 text-[10px] font-display font-black uppercase tracking-widest border transition-all rounded",
                method === "point-buy" ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(139,0,0,0.4)]" : "bg-black/5 text-gold-aged border-gold-aged/20 hover:bg-black/10"
              )}
             >
               Compra de Pontos
             </button>
             <button 
              onClick={rollDice}
              className={cn(
                "px-4 py-2 text-[10px] font-display font-black uppercase tracking-widest border transition-all rounded flex items-center gap-2",
                method === "dice" ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(139,0,0,0.4)]" : "bg-black/5 text-gold-aged border-gold-aged/20 hover:bg-black/10"
              )}
             >
               <span className="material-symbols-outlined text-sm">casino</span>
               Rolar Dados
             </button>
          </div>
        </div>
        
        {method === "point-buy" && (
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-colors animate-pulse" />
             <div className="relative bg-background-dark px-10 py-6 border-2 border-primary shadow-[inset_0_0_20px_rgba(139,0,0,0.4)] rounded-sm text-center min-w-[180px]">
                <span className="text-[10px] font-display font-black text-accent-gold uppercase tracking-[0.2em] mb-1 block font-display">Pontos Restantes</span>
                <span className="text-6xl font-display font-black text-white leading-none tracking-tighter">
                  {pointsRemaining}
                </span>
             </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-900/90 text-white text-[10px] font-display font-black uppercase tracking-widest px-6 py-2 rounded-full border border-red-500 shadow-xl animate-in slide-in-from-bottom-2 z-20">
            {error}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(STAT_LABELS).map(([key, label]) => {
          const baseVal = character.attributes[key as keyof typeof character.attributes] || 0;
          const raceBonus = character.race?.bonus?.[key] || 0;
          const total = baseVal + raceBonus;

          return (
            <div key={key} className="group relative bg-parchment border border-gold-aged/40 p-8 rounded-sm hover:border-primary transition-all duration-300">
              <header className="text-center mb-6">
                <span className="text-[11px] font-display font-black text-gold-aged uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
                  {label}
                </span>
              </header>
              
              <div className="flex items-center justify-between gap-4 relative z-10">
                <button 
                  onClick={() => updateStat(key, -1)}
                  disabled={method === "dice" || baseVal <= -1}
                  className="size-12 rounded-full border-2 border-gold-aged/30 bg-white/40 flex items-center justify-center text-primary hover:border-primary hover:bg-primary hover:text-white transition-all active:scale-90 shadow-md disabled:opacity-0"
                >
                   <span className="material-symbols-outlined text-2xl font-black">remove</span>
                </button>
                
                <div className="bg-background-dark/90 px-6 py-4 rounded-lg border border-gold-aged/20 shadow-inner min-w-[100px] text-center">
                  <span className={cn(
                    "text-5xl font-display font-black italic tracking-tighter leading-none block mb-1",
                    getStatColor(total)
                  )}>
                    {total > 0 ? `+${total}` : total}
                  </span>
                  <div className="flex flex-col items-center border-t border-gold-aged/10 pt-2 gap-1">
                     <span className="text-[8px] font-display font-black text-text-main/40 uppercase">Base: {baseVal}</span>
                     {raceBonus !== 0 && (
                        <span className="text-[8px] font-display font-black text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">
                          Raça: {raceBonus > 0 ? `+${raceBonus}` : raceBonus}
                        </span>
                     )}
                  </div>
                </div>

                <button 
                  onClick={() => updateStat(key, 1)}
                  disabled={method === "dice" || baseVal >= 4}
                  className="size-12 rounded-full border-2 border-gold-aged/30 bg-white/40 flex items-center justify-center text-primary hover:border-primary hover:bg-primary hover:text-white transition-all active:scale-90 shadow-md disabled:opacity-0"
                >
                   <span className="material-symbols-outlined text-2xl font-black">add</span>
                </button>
              </div>

              {/* Background Initial */}
              <div className="absolute top-2 right-4 text-4xl font-display font-black text-black/5 pointer-events-none uppercase italic">
                {key[0]}
              </div>
            </div>
          );
        })}
      </div>
      
      {method === "dice" && (
         <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-[10px] font-display font-black text-accent-gold uppercase tracking-[0.4em] mb-4">O destino foi selado pelos dados</p>
            <button 
              onClick={() => {
                setMethod("point-buy");
                updateCharacter({ attributes: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 } });
              }}
              className="text-[10px] font-display font-black text-primary hover:text-red-500 uppercase tracking-widest border-b border-primary/20 pb-1 transition-all"
            >
              Resetar e usar Compra de Pontos
            </button>
         </div>
      )}
    </div>
  );
}
