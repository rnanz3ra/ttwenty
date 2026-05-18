"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/core/lib/utils";

const sidebarItems = [
  { label: "Início", icon: "home", href: "/" },
  { label: "Forja", icon: "hardware", href: "/forja" },
  { label: "Grimório", icon: "auto_stories", href: "/magias" },
  { label: "Bestiário", icon: "skull", href: "/monstros" },
  { label: "Wiki", icon: "menu_book", href: "/wiki" },
  { label: "Campanhas", icon: "swords", href: "/campanhas" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full flex-shrink-0 bg-[#0D0202] border-r border-[#A6894A]/30 hidden md:flex flex-col relative isolate shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')] z-[-1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 z-[-1]" />
      
      <div className="px-6 pt-10 pb-8 flex justify-center items-center border-b border-[#A6894A]/20">
        <Link href="/" className="block w-full flex justify-center group">
          <div className="relative">
            <Image 
              src="/logo-natro.png" 
              alt="Natro - Um portal T20" 
              width={400} 
              height={200} 
              className="w-full max-w-[180px] h-auto object-contain drop-shadow-[0_0_15px_rgba(139,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute -inset-4 bg-[#8B0000]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 pt-8 pb-4 space-y-3 overflow-y-auto scrollbar-hide">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all duration-300",
                isActive 
                  ? "text-[#E8DCC4] bg-[#8B0000]/10 border-l-2 border-[#8B0000] shadow-[inset_10px_0_20px_rgba(139,0,0,0.1)]" 
                  : "text-slate-400 hover:text-[#E8DCC4] hover:bg-white/5"
              )}
            >
              {/* Active Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/20 to-transparent opacity-50" />
              )}

              <span className={cn(
                "material-symbols-outlined text-xl transition-all duration-300", 
                isActive 
                  ? "text-[#8B0000] drop-shadow-[0_0_8px_rgba(139,0,0,0.8)] scale-110" 
                  : "text-slate-600 group-hover:text-[#A6894A] group-hover:scale-110"
              )}>
                {item.icon}
              </span>
              <span className={cn(
                "font-display text-xs uppercase tracking-[0.2em] transition-colors",
                isActive ? "font-bold text-[#E8DCC4]" : "font-medium group-hover:text-[#E8DCC4]"
              )}>
                {item.label}
              </span>

              {/* Decorative Corner (Only on Hover/Active) */}
              <div className={cn(
                "absolute right-2 top-2 size-1 border-t border-r border-[#A6894A]/40 opacity-0 transition-opacity",
                (isActive || "group-hover:opacity-100")
              )} />
              <div className={cn(
                "absolute left-2 bottom-2 size-1 border-b border-l border-[#A6894A]/40 opacity-0 transition-opacity",
                (isActive || "group-hover:opacity-100")
              )} />
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-[#A6894A]/10 mt-auto">
        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-default">
          <div className="size-2 rounded-full bg-[#8B0000] animate-pulse shadow-[0_0_8px_rgba(139,0,0,1)]" />
          <span className="text-[9px] font-display font-bold text-[#A6894A] uppercase tracking-[0.3em]">Arton Online</span>
        </div>
      </div>
    </aside>
  );
}

