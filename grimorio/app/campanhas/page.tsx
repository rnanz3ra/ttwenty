"use client";

import { cn } from "@/core/lib/utils";

const campaigns = [
  { id: 1, name: "O Fim da Eternidade", master: "Mestre Arsenal", players: 5, status: "Ativa", nextSession: "Sábado, 20:00" },
  { id: 2, name: "Crônicas de Arton", master: "Você", players: 4, status: "Pausada", nextSession: "A definir" },
];

export default function MestrePage() {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <span className="material-symbols-outlined text-primary text-3xl">fort</span>
             <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Oficina do Mestre</h1>
          </div>
          <p className="text-slate-400 font-medium">Gerencie suas campanhas, mapas e encontros em um só lugar.</p>
        </div>
        <button className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          Nova Campanha
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Campaigns */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-primary/20 pb-2">Suas Campanhas</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {campaigns.map((camp) => (
               <div key={camp.id} className="bg-background-dark/40 border border-primary/10 rounded-2xl p-6 hover:border-primary/40 transition-all group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -translate-y-8 translate-x-8" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className={cn(
                      "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                      camp.status === "Ativa" ? "bg-green-500/20 text-green-500" : "bg-slate-500/20 text-slate-500"
                    )}>
                      {camp.status}
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase">{camp.players} Jogadores</span>
                  </div>

                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-primary transition-colors">{camp.name}</h3>
                  <p className="text-xs text-slate-500 mb-6 font-medium italic">Mestre: {camp.master}</p>

                  <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary">event</span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase">{camp.nextSession}</span>
                     </div>
                     <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">arrow_forward</span>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Tools Sidebar */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-primary/20 pb-2">Ferramentas</h2>
           <div className="space-y-3">
              {[
                { label: "Gerador de Encontros", icon: "swords", color: "text-red-500" },
                { label: "Biblioteca de Mapas", icon: "map", color: "text-blue-500" },
                { label: "Grimório de Monstros", icon: "skull", color: "text-primary" },
                { label: "Notas de Sessão", icon: "description", color: "text-accent-gold" },
              ].map((tool) => (
                <button key={tool.label} className="w-full p-4 bg-background-dark/40 border border-primary/5 rounded-xl flex items-center gap-4 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
                   <div className={cn("size-10 rounded-lg bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", tool.color)}>
                      <span className="material-symbols-outlined fill">{tool.icon}</span>
                   </div>
                   <span className="text-xs font-black text-slate-300 uppercase tracking-tight">{tool.label}</span>
                </button>
              ))}
           </div>

           <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-2xl p-6 mt-8">
              <h4 className="text-accent-gold font-black uppercase text-[10px] tracking-widest mb-2">Dica do Mestre</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                "Um bom combate em Tormenta 20 não é apenas sobre números, mas sobre o ambiente. Use obstáculos e perigos para desafiar seus jogadores!"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
