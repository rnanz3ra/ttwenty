"use client";

import { useState } from "react";
import { Monster } from "@/core/types";
import { cn } from "@/core/lib/utils";
import { MonsterDetailModal } from "@/features/monsters/components/MonsterDetailModal";

interface MonstersListProps {
  initialMonsters: Monster[];
}

const NDS = ["1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "S", "S+"];

export function MonstersList({ initialMonsters }: MonstersListProps) {
  const [query, setQuery] = useState("");
  const [selectedND, setSelectedND] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredMonsters = initialMonsters.filter(monster => {
    const matchesQuery = monster.name.toLowerCase().includes(query.toLowerCase()) ||
      monster.type.toLowerCase().includes(query.toLowerCase());
    const matchesND = selectedND ? monster.level.toString() === selectedND : true;
    const matchesType = selectedType ? monster.type.toLowerCase().includes(selectedType.toLowerCase()) : true;

    return matchesQuery && matchesND && matchesType;
  });

  const uniqueTypes = Array.from(new Set(initialMonsters.map(m => m.type.split(" ")[0].split("/")[0].trim()))).filter(Boolean).sort();

  // ── Filters sidebar content ──────────────────────────────────────────────
  const FiltersContent = () => (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 pb-4 border-b border-[#A6894A]/20">
        <span className="material-symbols-outlined text-[#8B0000] text-2xl">skull</span>
        <h3 className="text-xl font-display font-bold text-[#8B0000] uppercase tracking-[0.1em]">Bestiário de Arton</h3>
      </div>

      {/* Term Search */}
      <div>
        <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Identificação</h4>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#A6894A] text-sm">search</span>
          <input
            type="text"
            placeholder="Nome da criatura..."
            className="w-full bg-black/40 border border-[#A6894A]/40 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:border-[#A6894A] focus:ring-1 focus:ring-[#A6894A] outline-none transition-all placeholder:text-slate-600 font-sans"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ND Filter */}
      <div>
        <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Nível de Desafio (ND)</h4>
        <div className="grid grid-cols-4 gap-2">
          {["1/4", "1/2", "1", "2", "5", "10", "15", "20"].map(nd => (
            <button
              key={nd}
              onClick={() => setSelectedND(selectedND === nd ? "" : nd)}
              className={cn(
                "h-10 rounded-full font-display font-bold text-[10px] transition-all border flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A6894A]",
                selectedND === nd 
                  ? "bg-gradient-to-br from-[#8B0000] to-[#500000] text-[#E8DCC4] border-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.8)] ring-1 ring-[#8B0000]" 
                  : "bg-black/30 border-[#A6894A]/20 text-slate-400 hover:border-[#A6894A]/60 hover:text-[#A6894A]"
              )}
            >
               {nd}
            </button>
          ))}
        </div>
        <select
          className="w-full mt-4 p-2.5 bg-black/40 border border-[#A6894A]/40 text-[#E8DCC4] text-[11px] font-serif font-bold uppercase tracking-widest rounded-lg outline-none focus:border-[#A6894A] transition-all appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23A6894A\'%3e%3cpath d=\'M7 10l5 5 5-5z\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '20px' }}
          value={selectedND}
          onChange={(e) => setSelectedND(e.target.value)}
        >
          <option value="" className="bg-[#0D0202]">Todos os NDs</option>
          {NDS.map(n => <option key={n} value={n} className="bg-[#0D0202]">ND {n}</option>)}
        </select>
      </div>

      {/* Type Filter */}
      <div>
        <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Tipo de Criatura</h4>
        <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto pr-2 scrollbar-blood">
          {uniqueTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? "" : type)}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left group",
                selectedType === type 
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-[#D4AF37]/40 text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.1)]" 
                  : "bg-transparent border-transparent text-slate-400 hover:bg-black/20 hover:text-[#E8DCC4]"
              )}
            >
              <span className={cn(
                "material-symbols-outlined text-lg transition-all duration-300",
                selectedType === type ? "text-[#D4AF37] drop-shadow-[0_0_4px_rgba(212,175,55,0.6)] fill" : "text-[#A6894A]/40 group-hover:text-[#A6894A]"
              )}>
                skull
              </span>
              <span className="text-[11px] font-serif uppercase tracking-[0.1em]">{type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
      {/* Filters Sidebar - Desktop */}
      <aside className="hidden md:block w-80 flex-shrink-0 border-r border-[#A6894A]/10 p-8 overflow-y-auto scrollbar-hide bg-black/20">
        <FiltersContent />
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header / Filters Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#A6894A]/20 bg-[#0D0202]/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8B0000]">skull</span>
            <div>
              <h2 className="text-base font-display font-bold text-[#E8DCC4] uppercase tracking-wider">Bestiário</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{filteredMonsters.length} ameaças encontradas</p>
            </div>
          </div>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={cn(
              "p-2 rounded-lg border transition-all flex items-center gap-2",
              showMobileFilters ? "bg-[#8B0000] text-white border-[#8B0000]" : "bg-[#8B0000]/10 text-[#8B0000] border-[#8B0000]/30"
            )}
          >
            <span className="material-symbols-outlined text-xl">tune</span>
            <span className="text-[10px] font-display font-bold uppercase tracking-widest">Filtros</span>
          </button>
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#0D0202] p-8 overflow-y-auto pb-32">
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="size-12 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center border border-[#8B0000]/30"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <FiltersContent />
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="fixed bottom-10 left-8 right-8 py-4 bg-gradient-to-r from-[#8B0000] to-[#500000] text-[#E8DCC4] font-display font-bold uppercase tracking-[0.2em] rounded-xl shadow-[0_10px_30px_rgba(139,0,0,0.3)] z-50 transition-all active:scale-95 border border-[#8B0000]"
            >
              Consultar Bestiário
            </button>
          </div>
        )}

        {/* Grid Area */}
        <div className={cn(
          "flex-1 p-6 md:p-10 overflow-y-auto scrollbar-hide",
          showMobileFilters && "blur-md"
        )}>
          {/* Desktop Title */}
          <div className="hidden md:block mb-10 pb-6 border-b border-[#A6894A]/10">
            <h1 className="text-4xl font-display font-bold text-[#E8DCC4] uppercase tracking-[0.05em] mb-2">Ameaças de Arton</h1>
            <div className="flex items-center gap-3">
               <div className="h-[1px] w-12 bg-[#8B0000]" />
               <p className="text-[11px] text-[#A6894A] font-serif font-bold uppercase tracking-[0.4em]">Exibindo {filteredMonsters.length} criaturas registradas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredMonsters.map(monster => (
              <div
                key={monster.id}
                onClick={() => setSelectedMonster(monster)}
                className="group relative h-72 rounded-sm border border-[#A6894A]/20 bg-black/40 p-5 flex flex-col gap-4 transition-all cursor-pointer hover:border-[#D4AF37]/50 hover:bg-black/60 shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] overflow-hidden active:scale-[0.98] isolate"
              >
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#A6894A]/40 group-hover:border-[#D4AF37] transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#A6894A]/40 group-hover:border-[#D4AF37] transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#A6894A]/40 group-hover:border-[#D4AF37] transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#A6894A]/40 group-hover:border-[#D4AF37] transition-colors" />

                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <div className="size-12 rounded-sm bg-gradient-to-br from-[#1F0505] to-[#0D0202] border border-[#A6894A]/30 flex items-center justify-center text-[#8B0000] group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-all shadow-xl">
                      <span className="material-symbols-outlined text-2xl group-hover:fill">skull</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-base text-[#E8DCC4] group-hover:text-[#D4AF37] transition-colors truncate uppercase tracking-wide">{monster.name}</h3>
                      <p className="text-[10px] text-[#A6894A] font-serif font-bold uppercase tracking-widest truncate">{monster.type}</p>
                    </div>
                  </div>
                  <div className="bg-[#1F0505] px-3 py-1.5 border border-[#8B0000]/40 text-[#8B0000] font-display font-bold text-[10px] shadow-lg flex-shrink-0 tracking-tighter">
                    ND {monster.level}
                  </div>
                </div>

                {/* Combat Stats Mini Grid */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="bg-black/20 p-2.5 border border-[#A6894A]/10 flex items-center justify-between group-hover:border-[#A6894A]/30 transition-colors">
                    <span className="material-symbols-outlined text-base text-[#8B0000]">favorite</span>
                    <span className="text-sm font-display font-bold text-[#E8DCC4]">{monster.hp} <span className="text-[9px] text-[#A6894A] uppercase tracking-tighter">PV</span></span>
                  </div>
                  <div className="bg-black/20 p-2.5 border border-[#A6894A]/10 flex items-center justify-between group-hover:border-[#A6894A]/30 transition-colors">
                    <span className="material-symbols-outlined text-base text-[#D4AF37]">shield</span>
                    <span className="text-sm font-display font-bold text-[#E8DCC4]">{monster.defense} <span className="text-[9px] text-[#A6894A] uppercase tracking-tighter">DEF</span></span>
                  </div>
                </div>
                
                {/* Preview Abilities */}
                <div className="flex-1 overflow-hidden relative z-10 space-y-2 pt-2 border-t border-[#A6894A]/10">
                  {monster.attacks?.slice(0, 1).map((atk, i) => (
                    <div key={i} className="text-[11px] text-[#E8DCC4]/80 flex items-center gap-2 font-serif font-bold uppercase tracking-tight">
                      <span className="text-[#8B0000]">⚔</span>
                      <span className="truncate">{atk.name} (+{atk.bonus})</span>
                    </div>
                  ))}
                  {monster.abilities?.slice(0, 1).map((ab, i) => (
                    <div key={i} className="text-[11px] text-slate-400 font-serif italic line-clamp-2 leading-snug">
                       <span className="text-[#A6894A]/80 not-italic font-bold uppercase text-[9px] tracking-widest">{ab.name}:</span> {ab.description}
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex justify-between items-center text-[10px] font-display font-bold uppercase tracking-[0.2em] text-[#A6894A]/60 group-hover:text-[#D4AF37] transition-colors z-10">
                  <span>Analisar Ameaça</span>
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                </div>
              </div>
            ))}
            
            {filteredMonsters.length === 0 && (
              <div className="col-span-full py-40 flex flex-col items-center justify-center text-[#A6894A]/30">
                <span className="material-symbols-outlined text-8xl mb-6">skull</span>
                <p className="text-2xl font-display font-bold uppercase tracking-[0.3em]">Nenhuma Ameaça</p>
                <p className="text-xs font-serif font-bold mt-3 uppercase tracking-widest">A Arca de Arton está vazia para esta busca</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedMonster && (
        <MonsterDetailModal
          monster={selectedMonster}
          onClose={() => setSelectedMonster(null)}
        />
      )}
    </div>
  );
}
