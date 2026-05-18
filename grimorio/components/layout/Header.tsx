"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/core/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/30 bg-background-dark/95 backdrop-blur-md p-4 md:px-8 h-16">
      {/* Mobile Menu Icon (Stitch Style) */}
      <div className="flex md:hidden items-center gap-2">
        <span className="material-symbols-outlined text-primary text-3xl">menu</span>
      </div>

      {/* Mobile Title (Stitch Style) */}
      <h1 className="md:hidden text-xl font-black tracking-tighter text-slate-100 uppercase">
        Arton <span className="text-primary">Digital</span>
      </h1>

      {/* Desktop Search Bar (Stitch Style) */}
      <div className="hidden md:flex flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input 
            type="text" 
            placeholder="Pesquisar grimório, monstros, itens..." 
            className="w-full bg-primary/5 border border-primary/20 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-200 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications (Desktop Only in Stitch layout) */}
        <button className="hidden md:block relative text-slate-400 hover:text-slate-100 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border border-background-dark"></span>
        </button>

        {/* User Profile Summary */}
        <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-primary/20 cursor-pointer group">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-100 group-hover:text-primary transition-colors">Khardis, o Mestre</p>
            <p className="text-[10px] text-accent-gold uppercase tracking-[0.2em]">Nível 15</p>
          </div>
          <div 
            className="size-10 rounded-full bg-cover bg-center border-2 border-primary/50 group-hover:border-primary transition-all shadow-lg shadow-primary/10"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZrc9jNM2Kq-kVP6ph6lQNv0N1rEV3j61tOQPjmEBlU_J3bFXJ2y441d0sDah-D-qsWKvbrV4X85Jb0_bPICAEHa7HESwjmqgcEOKckCy52JuIjIh90T7p2wCKG5OpYwFCOS13YV_bl8LlFYnstvI4f0S8L4IU4Uen6JbLLCBSYP-lx7YjbjW4wHcgXcy9EGv8vfwwb4lEMSZ5HrZI-1umuYqglrbKojjk2pkjWKUm66DdGTS8h4CWWE7TgfYQKmwaZjLObo2AOkU')" }}
          />
        </div>
      </div>
    </header>
  );
}
