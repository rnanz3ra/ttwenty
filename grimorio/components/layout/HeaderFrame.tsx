"use client";

import { cn } from "@/core/lib/utils";

interface HeaderFrameProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Componente de Título Diegético (Ameaças de Arton / Livro Básico)
 * Utiliza uma moldura decorativa vermelha inspirada no topo das páginas dos livros oficiais.
 */
export function HeaderFrame({ children, className }: HeaderFrameProps) {
    return (
        <div className={cn("relative mb-8", className)}>
            {/* Moldura Decorativa Superior */}
            <div className="flex items-center gap-2 mb-1">
                <div className="h-[4px] flex-1 bg-arton-red" />
                <div className="w-4 h-4 rotate-45 border-2 border-arton-red" style={{ backgroundColor: 'var(--bg-global)' }} />
                <div className="h-[4px] flex-1 bg-arton-red" />
            </div>

            {/* Título Centralizado */}
            <div className="bg-arton-red py-2 px-6 shadow-lg">
                <h2 className="text-white text-3xl md:text-4xl font-serif font-black uppercase tracking-[0.2em] text-center leading-tight">
                    {children}
                </h2>
            </div>

            {/* Moldura Decorativa Inferior */}
            <div className="flex items-center gap-2 mt-1">
                <div className="h-[2px] flex-1 bg-arton-red/50" />
                <div className="w-2 h-2 rotate-45 bg-arton-red/50" />
                <div className="h-[2px] flex-1 bg-arton-red/50" />
            </div>

            {/* Ornamentos Laterais Flutuantes (Opcional - Estetismo RPG) */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-arton-gold/20 blur-[1px]" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-arton-gold/20 blur-[1px]" />
        </div>
    );
}
