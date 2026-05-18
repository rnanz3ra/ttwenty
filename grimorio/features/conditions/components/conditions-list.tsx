"use client";

import { useState } from "react";
import { Condition } from "@/core/types";
import { cn } from "@/core/lib/utils";
import { ConditionDetailModal } from "./ConditionDetailModal";
import { Search, Filter, Hash, Sparkles } from "lucide-react";

interface ConditionsListProps {
  initialConditions: Condition[];
}

const CATEGORIES = ["Ação", "Defesa", "Fadiga", "Geral", "Medo", "Mental", "Paralisia", "Posicionamento", "Sentidos", "Especial"];

export function ConditionsList({ initialConditions }: ConditionsListProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredConditions = initialConditions.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.effect.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
    return matchesQuery && matchesCategory;
  });

  const FiltersContent = () => (
    <div className="space-y-10">
      <div className="flex items-center gap-3 mb-2 pb-4 border-b border-[var(--color-gold-aged)]/20">
        <span className="material-symbols-outlined text-[#8B0000] text-2xl">healing</span>
        <h3 className="text-xl font-display font-bold text-[#8B0000] uppercase tracking-[0.1em]">Codex Condições</h3>
      </div>

      {/* Term Search */}
      <div>
        <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Pesquisa</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6894A] w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar condição..."
            className="w-full bg-black/40 border border-[#A6894A]/40 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:border-[#A6894A] focus:ring-1 focus:ring-[#A6894A] outline-none transition-all placeholder:text-slate-600 font-sans"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="text-[11px] font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-[0.2em] border-b border-[#E8DCC4]/20 pb-2">Categorias</h4>
        <div className="grid grid-cols-1 gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg border transition-all text-left group",
                selectedCategory === cat 
                  ? "bg-[#8B0000]/10 border-[#A6894A]/30 text-[#A6894A] shadow-[0_0_10px_rgba(166,137,74,0.1)]" 
                  : "bg-transparent border-transparent text-slate-400 hover:bg-black/20 hover:text-[#E8DCC4]"
              )}
            >
              <span className="text-[11px] font-serif uppercase tracking-[0.15em]">{cat}</span>
              {selectedCategory === cat && <Sparkles className="w-3 h-3 text-[#A6894A]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
      {/* Filters Sidebar - Desktop */}
      <aside className="hidden md:block w-80 flex-shrink-0 border-r border-primary/20 p-8 overflow-y-auto scrollbar-hide bg-background-dark/40">
        <FiltersContent />
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header / Filters Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-primary/20 bg-background-dark/60 sticky top-0 z-20 backdrop-blur-md">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter italic">Condições</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{filteredConditions.length} encontradas</p>
          </div>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={cn(
              "p-2 rounded-lg border transition-all flex items-center gap-2",
              showMobileFilters ? "bg-primary text-white border-primary" : "bg-primary/10 text-primary border-primary/30"
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filtros</span>
          </button>
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32">
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/30"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <FiltersContent />
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="fixed bottom-24 left-6 right-6 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-primary/30 z-50"
            >
              Aplicar Filtros
            </button>
          </div>
        )}

        {/* Conditions Grid */}
        <div className={cn(
          "flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background-dark/20 to-transparent",
          showMobileFilters && "blur-sm"
        )}>
          {/* Desktop Title */}
          <div className="hidden md:block mb-8">
            <h1 className="text-4xl font-display font-bold text-slate-100 uppercase tracking-[0.1em] drop-shadow-lg">Manual de Condições</h1>
            <div className="flex items-center gap-4 w-64 mb-4 mt-2">
              <div className="h-px bg-gradient-to-r from-transparent via-[#A6894A] to-transparent flex-1"></div>
              <div className="rotate-45 size-2 bg-[#A6894A] border border-[#D4AF37]"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-[#A6894A] to-transparent flex-1"></div>
            </div>
            <p className="text-sm font-sans text-slate-500 font-bold uppercase tracking-[0.3em] pl-1">Estados alterados de corpo e mente</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-12">
            {filteredConditions.map(condition => (
              <div
                key={condition.id}
                onClick={() => setSelectedCondition(condition)}
                className="group relative h-48 rounded-lg border border-[var(--color-gold-aged)] bg-parchment flex flex-col transition-all duration-300 cursor-pointer hover:border-[#A6894A] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(139,0,0,0.5),0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden active:scale-[0.98]"
              >
                <div className="p-5 flex-1 flex flex-col min-h-0 relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display font-bold text-lg text-text-dark uppercase tracking-wider group-hover:text-[#8B0000] transition-colors">
                      {condition.name}
                    </h3>
                    <span className="text-[8px] font-black px-2 py-0.5 bg-black/5 text-[#A6894A] rounded border border-[#A6894A]/20 uppercase tracking-widest">
                      {condition.category}
                    </span>
                  </div>
                  
                  <p className="font-serif text-[12px] text-text-dark/80 line-clamp-3 leading-relaxed mb-4 italic">
                    &ldquo;{condition.effect.substring(0, 150)}...&rdquo;
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--color-gold-aged)]/20">
                     <div className="flex items-center gap-1.5 opacity-60">
                        <Hash className="w-3 h-3 text-[#A6894A]" />
                        <span className="text-[10px] font-sans font-black text-text-dark/60 uppercase tracking-tighter">ID: {condition.id}</span>
                     </div>
                     <span className="material-symbols-outlined text-sm text-[#8B0000] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredConditions.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-600 grayscale opacity-40">
                <span className="material-symbols-outlined text-8xl mb-4">healing</span>
                <p className="text-xl font-black uppercase tracking-[0.5em] italic">Nada Encontrado</p>
                <p className="text-sm font-bold mt-2">Tente buscar por outro termo</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedCondition && (
        <ConditionDetailModal
          condition={selectedCondition}
          onClose={() => setSelectedCondition(null)}
        />
      )}
    </div>
  );
}
