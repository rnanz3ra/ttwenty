"use client";

import { useForja } from "@/context/ForjaContext";
import { cn } from "@/core/lib/utils";

export function ReviewStep() {
  const { character, calculateStats } = useForja();
  const { pv, pm, defense } = calculateStats();

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
      <div className="bg-parchment border border-gold-aged/50 rounded-sm p-10 md:p-16 relative shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        
        <header className="text-center mb-16 relative z-10">
          <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20 shadow-inner">
             <span className="material-symbols-outlined text-6xl fill">verified</span>
          </div>
          <h2 className="text-5xl font-display font-black text-text-dark uppercase tracking-widest mb-4">Consagração</h2>
          <p className="text-text-dark/70 font-serif italic text-lg leading-relaxed">
            "Que os deuses de Arton testemunhem o nascimento de um novo herói. Sua jornada começa agora."
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 relative z-10">
           <div className="space-y-6">
              <div className="bg-black/5 border border-gold-aged/20 p-6 rounded-xl flex items-center gap-6">
                 <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <span className="material-symbols-outlined text-4xl">person</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-display font-black text-accent-gold uppercase tracking-[0.2em] mb-1">Linhagem</p>
                    <p className="text-2xl font-display font-black text-text-dark uppercase tracking-tighter italic">{character.race?.nome || "—"}</p>
                 </div>
              </div>
              <div className="bg-black/5 border border-gold-aged/20 p-6 rounded-xl flex items-center gap-6">
                 <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <span className="material-symbols-outlined text-4xl">swords</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-display font-black text-accent-gold uppercase tracking-[0.2em] mb-1">Vocação</p>
                    <p className="text-2xl font-display font-black text-text-dark uppercase tracking-tighter italic">{character.class?.nome || "—"}</p>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-black/5 border border-gold-aged/20 p-6 rounded-xl flex items-center gap-6">
                 <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <span className="material-symbols-outlined text-4xl">history_edu</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-display font-black text-accent-gold uppercase tracking-[0.2em] mb-1">Passado</p>
                    <p className="text-2xl font-display font-black text-text-dark uppercase tracking-tighter italic">{character.origin?.nome || "—"}</p>
                 </div>
              </div>
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-xl shadow-inner backdrop-blur-sm">
                 <p className="text-[10px] font-display font-black text-primary uppercase tracking-[0.3em] mb-5 text-center">Essência (Atributos)</p>
                 <div className="grid grid-cols-6 gap-2">
                    {Object.entries(character.attributes).map(([at, baseVal]) => {
                       const raceBonus = character.race?.bonus?.[at] || 0;
                       const total = baseVal + raceBonus;
                       return (
                         <div key={at} className="text-center">
                            <p className="text-[8px] font-display font-black text-gold-aged uppercase">{at}</p>
                            <p className="text-lg font-display font-black text-text-dark">{total > 0 ? `+${total}` : total}</p>
                         </div>
                       );
                    })}
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-black/5 border-2 border-dashed border-gold-aged/20 p-8 rounded-xl mb-16 relative z-10">
           <h4 className="text-[10px] font-display font-black text-text-dark uppercase tracking-[0.2em] mb-4 text-center">Perícias Treinadas</h4>
           <div className="flex flex-wrap justify-center gap-2">
              {character.skills.length > 0 ? character.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-gold-aged/30 rounded-full text-[10px] font-bold text-text-dark uppercase italic shadow-sm">
                  {skill}
                </span>
              )) : (
                <p className="text-[10px] text-gold-aged italic">Nenhuma perícia selecionada</p>
              )}
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
           <button className="flex-[2] py-6 bg-primary text-text-main font-display font-black uppercase tracking-[0.4em] rounded-xl shadow-[0_15px_40px_rgba(139,0,0,0.5)] hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 border border-gold-aged/30">
             Gravar Crônica
           </button>
           <button className="flex-1 py-6 border-2 border-gold-aged/50 bg-transparent text-gold-aged font-display font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gold-aged/10 transition-all flex items-center justify-center gap-3">
             <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
             Pergaminho
           </button>
        </div>
      </div>
    </div>
  );
}
