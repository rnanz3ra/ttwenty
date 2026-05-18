"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";

export function BookmarkButton() {
    return (
        <Link
            href="/"
            className="fixed top-0 left-12 z-[100] group"
        >
            <div className="relative">
                {/* Marcador de Página Vermelho */}
                <div className="bg-arton-red w-12 h-20 shadow-2xl transition-all group-hover:h-24 flex flex-col items-center pt-4">
                    <Bookmark className="w-5 h-5 text-white animate-pulse" />
                    <span className="text-[8px] font-black text-white uppercase vertical-rl tracking-widest mt-2 transform rotate-180">
                        VOLTAR
                    </span>
                </div>
                {/* Ponta do Marcador */}
                <div className="absolute -bottom-4 left-0 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[16px] border-t-arton-red" />
            </div>
        </Link>
    );
}

function vertical_rl_style() {
    return (
        <style jsx global>{`
            .vertical-rl {
                writing-mode: vertical-rl;
            }
        `}</style>
    );
}
