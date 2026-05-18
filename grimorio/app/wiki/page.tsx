"use client";

import { cn } from "@/core/lib/utils";

const wikiCategories = [
  { id: "lore", label: "Lore & História", icon: "history_edu", color: "bg-amber-500/10 text-amber-500" },
  { id: "rules", label: "Regras do Jogo", icon: "gavel", color: "bg-blue-500/10 text-blue-500" },
  { id: "gods", label: "O Panteão", icon: "church", color: "bg-primary/10 text-primary" },
  { id: "atlas", label: "Geografia & Atlas", icon: "map", color: "bg-green-500/10 text-green-500" },
];

const topArticles = [
  { title: "A Queda de Lenórienn", category: "Lore", views: "1.2k" },
  { title: "Condições de Combate", category: "Regras", views: "850" },
  { title: "Valkaria: A Deusa da Ambição", category: "Deuses", views: "2.1k" },
];

export default function WikiPage() {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col h-full overflow-y-auto scrollbar-hide">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <span className="material-symbols-outlined text-primary text-4xl">menu_book</span>
           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Wiki de Arton</h1>
        </div>
        <div className="relative max-w-2xl group">
           <input 
            type="text" 
            placeholder="Pesquisar nos registros de Arton..." 
            className="w-full bg-background-dark/60 border border-primary/20 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all shadow-xl"
           />
           <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
         {wikiCategories.map((cat) => (
           <button key={cat.id} className="bg-background-dark/40 border border-primary/10 rounded-3xl p-8 flex flex-col items-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all group scale-pulse-sm">
              <div className={cn("size-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg", cat.color)}>
                 <span className="material-symbols-outlined text-4xl fill">{cat.icon}</span>
              </div>
              <span className="text-sm font-black text-white uppercase tracking-tighter">{cat.label}</span>
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
         {/* Atlas Preview */}
         <div className="lg:col-span-2 relative aspect-video bg-background-dark/60 border border-primary/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-primary/40 transition-all">
            <div className="absolute inset-0 bg-[url('https://api.nanobanana.com/generate?prompt=epic%20rpg%20map%20of%20fantasy%20world%20arton%20high%20detail')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
            <div className="absolute bottom-6 left-8">
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">O Mapa de Arton</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Explore os segredos do continente.</p>
            </div>
            <div className="absolute top-6 right-8">
               <button className="p-3 bg-primary/20 backdrop-blur-md rounded-full text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all shadow-2xl">
                  <span className="material-symbols-outlined">zoom_in</span>
               </button>
            </div>
         </div>

         {/* Trending Articles */}
         <div className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight border-b border-primary/20 pb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-accent-gold">trending_up</span>
              Em Alta
            </h2>
            <div className="space-y-3">
               {topArticles.map((art) => (
                 <div key={art.title} className="p-4 bg-background-dark/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-primary/20 cursor-pointer transition-all">
                    <div>
                       <p className="text-[10px] font-black text-primary uppercase tracking-tighter mb-0.5">{art.category}</p>
                       <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{art.title}</h4>
                    </div>
                    <span className="text-[9px] font-black text-slate-600 uppercase italic">{art.views} visitas</span>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/20 transition-all">
              Ver Todos os Artigos
            </button>
         </div>
      </div>
    </div>
  );
}
