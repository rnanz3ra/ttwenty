"use client";

import React, { useMemo } from "react";
import { useUIStore } from "@/core/store/ui-store";

// Databases para cruzamento inteligente
import spellsData from "@/data/magias.json";
import conditionsData from "@/data/condicoes.json";
import itensData from "@/data/itens.json";

// Dicionário básico para termos fundamentais que não estão nos JSONs
const basicTermsDict: Record<string, string> = {
    "vontade": "Teste de resistência (Sabedoria) contra magias mentais ou efeitos espantosos.",
    "reflexos": "Teste de resistência (Destreza) contra ataques em área ou armadilhas.",
    "fortitude": "Teste de resistência (Constituição) contra venenos ou esgotamento físico.",
};

interface SmartTooltipProps {
    text: string;
    className?: string;
}

export function SmartTooltip({ text, className }: SmartTooltipProps) {
    const { openDrawer } = useUIStore();

    // Dicionários unificados para busca rápida no renderizer
    const dict = useMemo(() => {
        const map = new Map<string, { type: "spell" | "monster" | "condition" | "item", data: any }>();
        // 1. Magias
        spellsData.forEach((s: any) => map.set((s.name || s.nome).toLowerCase(), { type: "spell", data: s }));

        // 2. Condições (Dinâmico do JSON)
        conditionsData.forEach((c: any) => {
            map.set(c.name.toLowerCase(), {
                type: "condition",
                data: { nome: c.name, lore: c.effect, tipo: c.category }
            });
        });

        // 3. Termos Básicos
        Object.entries(basicTermsDict).forEach(([k, v]) => {
            map.set(k.toLowerCase(), {
                type: "condition",
                data: { nome: k.charAt(0).toUpperCase() + k.slice(1), lore: v, tipo: "Regra" }
            });
        });

        // 4. Itens (Aplanando categorias)
        Object.values(itensData).forEach((category: any) => {
            if (Array.isArray(category)) {
                category.forEach((item: any) => {
                    if (item && item.nome) {
                        map.set(item.nome.toLowerCase(), { type: "item", data: item });
                    }
                });
            }
        });

        return map;
    }, []);

    // O Parser Principal "Smart Click Logic"
    // Separa a string por palavras (mantendo a pontuação fora do "match" caso a caso)
    const elements = useMemo(() => {
        if (!text) return [];

        // Este REGEX divide o texto preservando espaços e pontuações no array
        // A intenção é olhar para as palavras limpas, mas reconstruir o texto exato
        const tokens = text.split(/([\s\.,;!?()]+)/);

        // Otimização: vamos rastrear também frases compostas (ex: Espada Bastarda). 
        // Como o split simples divide "Espada" e "Bastarda", a abordagem ideal para 
        // termos compostos é varrer o texto original com Replace.

        let parsedText: React.ReactNode[] = [text];

        // Processamento reverso do Map (nomes maiores primeiro resolve conflito de Mão / Arma de Mão)
        const sortedKeys = Array.from(dict.keys()).sort((a, b) => b.length - a.length);

        sortedKeys.forEach((key) => {
            const entry = dict.get(key);
            if (!entry) return;

            // Substituir a chave garantindo word boundaries para não quebrar pedaços de palavras
            // Ex: curar -> procurador (não deveria ativar)
            const regex = new RegExp(`\\b(${key})\\b`, "gi");

            parsedText = parsedText.flatMap((node, i): any[] => {
                if (typeof node !== "string") return [node]; // Já é um JSX parseado 

                const parts = node.split(regex);
                return parts.map((part, j) => {
                    // Se o part for exatamente o match do Regex
                    if (part.toLowerCase() === key.toLowerCase()) {
                        return (
                            <span
                                key={`${i}-${j}`}
                                onClick={() => openDrawer(entry.type, entry.data)}
                                className={`
                                    cursor-pointer font-bold inline-block mx-[2px] transition-all
                                    border-b border-dashed relative group
                                    ${entry.type === 'spell' ? 'text-purple-800 border-purple-800 hover:text-purple-600 hover:bg-purple-900/10' : ''}
                                    ${entry.type === 'condition' ? 'text-arton-red border-arton-red hover:text-red-700 hover:bg-arton-red/10 border-b-2' : ''}
                                    ${entry.type === 'item' ? 'text-gray-700 border-gray-500 hover:text-black hover:bg-gray-200/50' : ''}
                                `}
                                title={`Visualizar detalhes de ${part}`}
                            >
                                {/* Tooltip "Flutuante" puramente CSS nativo para itens Condição/Regras Rápidas 
                                    (Como o usuário pediu "Smart Tooltips popups artonianos") */}
                                {entry.type === 'condition' && (
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#f4e4bc] text-[#2b1a0a] border-2 border-arton-gold shadow-xl text-[10px] font-sans rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-arton-gold">
                                        <b className="block border-b border-[#2b1a0a]/20 pb-1 mb-1 font-serif text-arton-red uppercase tracking-widest">{entry.data.nome}</b>
                                        {entry.data.lore}
                                    </span>
                                )}
                                {part}
                            </span>
                        );
                    }
                    return part;
                });
            });
        });

        return parsedText;
    }, [text, dict, openDrawer]);

    return (
        <span className={className}>
            {elements.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>)}
        </span>
    );
}
