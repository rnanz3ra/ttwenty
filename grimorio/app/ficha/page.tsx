"use client";

import { OfficialCharacterSheet } from "@/features/character/components/character/OfficialCharacterSheet";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { BookmarkButton } from "@/components/layout/BookmarkButton";
import { useCharacterStore } from "@/core/store/character-store";

export default function FichaPage() {
    const character = useCharacterStore();

    return (
        <main className="min-h-screen bg-[#0a0a0a] py-20 px-4 md:px-10 font-serif">
            <BookmarkButton />

            <div className="max-w-6xl mx-auto space-y-12">
                <HeaderFrame className="max-w-xl mx-auto">
                    Pergaminho do Herói
                </HeaderFrame>

                <div className="relative">
                    {/* Efeito de brilho atrás da ficha */}
                    <div className="absolute inset-0 bg-[#8b0000]/5 blur-3xl rounded-full" />

                    <OfficialCharacterSheet character={{
                        ...character,
                        tibares: character.tibares,
                        partners: character.partners,
                        restCondition: character.restCondition,
                        setTibares: character.setTibares,
                        addPartner: character.addPartner,
                        removePartner: character.removePartner,
                        setRestCondition: character.setRestCondition
                    } as any} />
                </div>

                <div className="text-center py-10 space-y-4">
                    {!character.class && (
                        <p className="text-arton-gold text-sm font-bold uppercase tracking-widest animate-pulse">
                            ⚓ Selecione sua Classe no Construtor para definir PV e PM!
                        </p>
                    )}
                    <button
                        onClick={() => character.reset()}
                        className="text-[10px] text-zinc-700 hover:text-arton-red uppercase tracking-widest transition-colors"
                    >
                        Resetar Personagem
                    </button>
                    <p className="text-zinc-600 text-sm italic">
                        "As crônicas de Arton lembram daqueles que se mantêm firmes perante o abismo."
                    </p>
                </div>
            </div>
        </main>
    );
}
