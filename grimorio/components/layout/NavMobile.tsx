"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/core/lib/utils";

const navItems = [
  { label: "Início", icon: "home", href: "/" },
  { label: "Forja", icon: "hardware", href: "/forja" },
  { label: "Grimório", icon: "book_4", href: "/magias" },
  { label: "Besta", icon: "skull", href: "/monstros" },
  { label: "Mestre", icon: "fort", href: "/campanhas" },
];

export function NavMobile() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden sticky bottom-0 z-50">
      <div className="flex gap-2 border-t border-primary/40 bg-background-dark/95 backdrop-blur-xl px-4 pb-6 pt-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-end gap-1 transition-colors",
                isActive ? "text-primary" : "text-slate-400"
              )}
            >
              <div className="flex h-8 items-center justify-center">
                <span 
                  className={cn("material-symbols-outlined text-2xl", isActive && "fill")}
                >
                  {item.icon}
                </span>
              </div>
              <p className={cn(
                "text-[10px] uppercase leading-normal tracking-wider",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
