"use client";

import { useUIStore } from "@/core/store/ui-store";
import { useCharacterStore } from "@/core/store/character-store";
import { useEffect, useState, useMemo } from "react";
import { X, ShoppingCart, Hammer } from "lucide-react";
import { applyStepDamage, applyThreatMargin, parsePrice, formatPrice } from "@/features/character/services/item-utils";
import materiaisData from "@/data/lotes_legado/lote87_materiais.json";

export function SideDrawer() {
    const { isDrawerOpen, closeDrawer, drawerContentType, drawerContentData: content } = useUIStore();

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDrawer();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeDrawer]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isDrawerOpen]);

    // ==== MÓDULO BAZAR E MATERIAIS ====
    const [selectedMaterial, setSelectedMaterial] = useState<string>("");
    const [improvementsCount, setImprovementsCount] = useState<number>(0);

    useEffect(() => {
        setSelectedMaterial("");
        setImprovementsCount(0);
    }, [content]);

    const { buyItem } = useCharacterStore();

    const computedItem = useMemo(() => {
        if (!content) return null;
        if (drawerContentType !== "item") return content;

        // Clone profundo para não mutar o JSON original
        const baseItem = JSON.parse(JSON.stringify(content));
        if (!baseItem.regras) return baseItem;

        let extraPrice = 0;
        const mat = materiaisData.find(m => m.material === selectedMaterial);

        if (mat) {
            baseItem.material = mat.material;
            const isWeapon = baseItem.categoria === "Arma";
            const isArmor = baseItem.categoria === "Armadura" || baseItem.categoria === "Escudo";

            if (mat.material === "Adamante") {
                if (isWeapon && baseItem.regras.Dano) {
                    baseItem.regras.Dano = applyStepDamage(baseItem.regras.Dano, 1);
                }
                if (isArmor && baseItem.regras.Defesa) {
                    baseItem.efeito = (baseItem.efeito ? baseItem.efeito + " " : "") + "[Adamante: RD +2 contra crítico/ataques]";
                }
                extraPrice = isWeapon ? 3000 : 5000;
            }
            else if (mat.material === "Mitral") {
                if (isWeapon && baseItem.regras.Crítico) {
                    baseItem.regras.Crítico = applyThreatMargin(baseItem.regras.Crítico, 1);
                }
                if (isArmor) {
                    if (baseItem.regras.Espaço) {
                        const spc = parseFloat(baseItem.regras.Espaço.replace(',', '.').replace('espaços', '').replace('espaço', ''));
                        if (!isNaN(spc)) baseItem.regras.Espaço = `${Math.max(spc - 1, 0.5)} espaços`;
                    }
                    if (baseItem.regras.Penalidade) {
                        const pen = parseInt(baseItem.regras.Penalidade);
                        if (!isNaN(pen)) {
                            // Se penalidade for nativa Ex: -2, soma 2 (cap em 0)
                            baseItem.regras.Penalidade = pen < 0 ? String(Math.min(0, pen + 2)) : String(Math.max(0, pen - 2));
                        }
                    }
                }
                extraPrice = isWeapon ? 1500 : 2000;
            }
            else if (mat.material === "Aço-Rubi") {
                extraPrice = isWeapon ? 6000 : 2000;
                baseItem.efeito = (baseItem.efeito ? baseItem.efeito + " " : "") + "[Aço-Rubi: Ignora imunidade/RD LeFeu]";
            }
            else if (mat.material === "Madeira Tollon") {
                extraPrice = 600;
            }
        }

        const improvementPrice = improvementsCount * 300;
        const basePriceVal = parsePrice(baseItem.regras.Preço || "0");
        baseItem.precoCalculado = basePriceVal + extraPrice + improvementPrice;
        baseItem.regras.Preço = formatPrice(baseItem.precoCalculado);

        if (improvementsCount > 0) {
            baseItem.melhorias = [`${improvementsCount}x Melhoria${improvementsCount > 1 ? 's' : ''}`];
        }

        return baseItem;
    }, [content, drawerContentType, selectedMaterial, improvementsCount]);

    const handleBuy = () => {
        if (!computedItem || drawerContentType !== "item") return;
        const success = buyItem(computedItem, computedItem.precoCalculado || parsePrice(computedItem.regras?.Preço));
        if (success) {
            // Pode fazer um efeito sonoro ou toast aqui depois
            closeDrawer();
        } else {
            alert("❌ Você não possui Tibares (T$) suficientes para esta aquisição.");
        }
    };


    if (!content && isDrawerOpen) return null;

    return (
        <>
            {/* Overlay: escurece o fundo ao abrir (estilo Nimb) */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity z-40 ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={closeDrawer}
            />

            {/* Painel Lateral (estilo D&D Beyond) */}
            <div className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#f4e4bc] shadow-[-10px_0_40px_rgba(0,0,0,0.8)] transform transition-transform duration-500 z-50 overflow-hidden ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>

                {/* Borda Decorativa Artoniana */}
                <div className="absolute left-0 top-0 h-full w-2 bg-[#8b0000]" />

                {/* Textura de Fundo (Papel Velvet) */}
                <div className="absolute inset-0 opacity-[0.2] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply" />

                {/* Botão de Fechar */}
                <button
                    onClick={closeDrawer}
                    className="absolute top-4 right-4 w-10 h-10 bg-[#8b0000] text-white flex items-center justify-center rotate-45 border-2 border-[#c5a059] hover:bg-red-700 transition-all shadow-lg z-[60]"
                >
                    <span className="-rotate-45 font-bold"><X className="w-5 h-5" /></span>
                </button>

                <div className="p-8 h-full overflow-y-auto custom-scrollbar relative z-10">
                    {/* Fallback caso content seja nulo mas drawer esteja abrindo */}
                    {content ? (
                        <>
                            {/* Título com Letra Capitular */}
                            <h2 className="font-serif text-3xl font-bold text-[#8b0000] border-b-2 border-[#8b0000]/20 pb-2 mt-6 uppercase tracking-tighter">
                                {computedItem.nome}
                            </h2>

                            <div className="mt-4 flex gap-2">
                                <span className="bg-red-900/10 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-900/20 uppercase">
                                    {computedItem.circulo !== undefined ? `Círculo ${computedItem.circulo}` : computedItem.nd !== undefined ? `ND ${computedItem.nd}` : computedItem.categoria || "Regra / Lore"}
                                </span>
                                <span className="bg-black/5 text-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded border border-black/10 uppercase italic">
                                    {computedItem.escola || computedItem.tipo || "Compêndio"}
                                </span>
                            </div>

                            {/* Lore / Descrição Narrativa (Capitular) */}
                            {(computedItem.lore || computedItem.desc || computedItem.description) && (
                                <div className="mt-8 text-[#2b1a0a] font-serif text-lg italic leading-relaxed text-justify">
                                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#8b0000] first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                                        {computedItem.lore || computedItem.desc || computedItem.description}
                                    </p>
                                </div>
                            )}

                            {/* Tabela de Regras (Side-Box) */}
                            {(computedItem.regras || computedItem.regras_tecnicas || computedItem.attributes) && (
                                <div className="mt-8 bg-[#8b0000]/5 p-4 border-l-4 border-[#8b0000] rounded-r shadow-inner relative">
                                    {/* Módulo Especial de Material e Melhorias se Categoria for Item (Arma/Armadura) */}
                                    {drawerContentType === 'item' && (computedItem.categoria === 'Arma' || computedItem.categoria === 'Armadura') && (
                                        <div className="flex flex-col gap-2 bg-white/40 p-2 rounded mb-4 border border-[#8b0000]/20">
                                            <h5 className="text-[10px] font-bold text-[#8b0000] uppercase tracking-widest border-b border-[#8b0000]/10 pb-1 flex items-center gap-1">
                                                <Hammer className="w-3 h-3" /> Forja & Customização
                                            </h5>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-zinc-700">Material Extra:</span>
                                                <select
                                                    className="bg-transparent border-b-2 border-red-800/30 text-xs font-bold font-serif text-red-900 outline-none focus:border-red-800 py-1"
                                                    value={selectedMaterial}
                                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                                >
                                                    <option value="">Nenhum (Padrão)</option>
                                                    {materiaisData.map(m => (
                                                        <option key={m.material} value={m.material}>{m.material}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-zinc-700">Qtd. Melhorias:</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] text-[#8b0000] font-black italic">+T$ 300 cada</span>
                                                    <input
                                                        type="number" min="0" max="4"
                                                        className="w-12 bg-transparent text-center border-b-2 border-red-800/30 text-xs font-bold text-red-900 outline-none focus:border-red-800"
                                                        value={improvementsCount}
                                                        onChange={(e) => setImprovementsCount(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <h4 className="text-[#8b0000] font-bold text-xs uppercase mb-4 tracking-widest border-b border-[#8b0000]/20 pb-1 w-max">Informações Técnicas</h4>

                                    <div className="space-y-2 text-sm text-[#3e2723]">
                                        {Object.entries(computedItem.regras || computedItem.regras_tecnicas || computedItem.attributes).map(([key, val]) => {
                                            // Efeito Visual de Highlight se a Prop foi alterada por Materiais Especiais
                                            const isChanged = selectedMaterial && content.regras && content.regras[key] !== val;
                                            return (
                                                <div key={key} className="flex justify-between border-b border-black/5 pb-1 items-end">
                                                    <span className="font-bold uppercase text-[10px] text-zinc-700 tracking-tight">{key.replace('_', ' ')}:</span>
                                                    <span className={`text-right text-xs ml-2 font-black ${isChanged ? 'text-green-700 bg-green-50 px-1 rounded' : ''}`}>{String(val)}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Efeito da Magia / Habilidade / Item */}
                            {(computedItem.efeito || computedItem.efeito_base) && (
                                <div className="mt-8">
                                    <h3 className="text-[#8b0000] font-serif font-black text-lg mb-2 uppercase tracking-tight">Efeito</h3>
                                    <p className="text-zinc-800 text-sm leading-snug font-serif text-justify bg-white/50 p-3 rounded border border-black/10">
                                        {computedItem.efeito || computedItem.efeito_base}
                                    </p>
                                </div>
                            )}

                            {/* Bazar do Aventureiro (Botão de Compra) */}
                            {drawerContentType === 'item' && (
                                <div className="mt-12 pt-6 border-t border-black/10 pb-10">
                                    <button
                                        onClick={handleBuy}
                                        className="w-full relative group overflow-hidden bg-gradient-to-r from-arton-red to-red-900 border-2 border-[#c5a059] text-white p-4 font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(139,0,0,0.3)] hover:shadow-[0_10px_30px_rgba(139,0,0,0.5)] transition-all transform hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply opacity-20 pointer-events-none" />
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />

                                        <ShoppingCart className="w-5 h-5 relative z-10" />
                                        <span className="relative z-10 flex flex-col items-start leading-none gap-1">
                                            <span>Adicionar ao Inventário</span>
                                            <span className="text-[10px] text-[#f4e4bc] mb-[-4px]">Valor: {computedItem.regras?.Preço}</span>
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Aprimoramentos (se houver) */}
                            {computedItem.aprimoramentos && computedItem.aprimoramentos.length > 0 && (
                                <div className="mt-8 pt-6 border-t-2 border-[#8b0000]/10">
                                    <h3 className="text-[#8b0000] font-black font-serif text-sm uppercase mb-4 tracking-widest">Aprimoramentos</h3>
                                    <div className="space-y-3">
                                        {computedItem.aprimoramentos.map((aprim: any, i: number) => (
                                            <div key={i} className="bg-white/40 p-3 rounded border border-black/5 hover:border-red-900/30 transition-all">
                                                <p className="text-xs text-zinc-800 font-serif leading-tight">{aprim.efeito}</p>
                                                <span className="text-[10px] font-black text-red-700 mt-1 block uppercase">Custo: +{aprim.custo} PM</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ataques (no caso de monstros) */}
                            {computedItem.attacks && computedItem.attacks.length > 0 && (
                                <div className="mt-8 pt-6 border-t-2 border-[#8b0000]/10">
                                    <h3 className="text-[#8b0000] font-black font-serif text-sm uppercase mb-4 tracking-widest">Ataques</h3>
                                    <div className="space-y-3">
                                        {computedItem.attacks.map((atk: any, i: number) => (
                                            <div key={i} className="bg-red-900/5 p-3 rounded border border-red-900/20">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-xs uppercase text-[#8b0000]">{atk.name}</span>
                                                    <span className="font-black text-sm text-[#c5a059]">+{atk.bonus}</span>
                                                </div>
                                                <p className="text-xs font-serif text-zinc-700">{atk.damage} (Crit: {atk.critical}) - {atk.type}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-zinc-500 font-serif italic">Nenhum conhecimento acessado...</span>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #8b0000;
                    border-radius: 4px;
                }
            `}</style>
        </>
    );
}
