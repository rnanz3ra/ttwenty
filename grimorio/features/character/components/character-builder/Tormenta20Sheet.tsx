
import { useState } from "react";
import { useCharacterStore } from "@/core/store/character-store";
import { calculateInitialHP, calculateInitialMP } from "@/core/lib/rules";
import { AttributeBonus } from "@/core/types";
import { Shield, Sword } from "lucide-react";
import { cn } from "@/core/lib/utils";

// --- HELPER COMPONENTS ---
const EditableInput = ({
    value,
    onChange,
    className,
    placeholder,
    label
}: {
    value: string | number;
    onChange?: (val: string) => void;
    className?: string;
    placeholder?: string;
    label?: string;
}) => (
    <div className="relative w-full">
        {label && <label className="block text-[8px] uppercase font-bold text-gray-500 mb-0.5">{label}</label>}
        <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
                "w-full bg-transparent border-b border-gray-300 focus:border-tormenta-red outline-none px-1 font-serif font-bold text-gray-800 placeholder:text-gray-300 print:border-none print:placeholder:transparent",
                className
            )}
            placeholder={placeholder}
        />
    </div>
);

const EditableArea = ({
    value,
    className,
    label
}: {
    value: string;
    className?: string;
    label?: string;
}) => (
    <div className="flex flex-col h-full">
        {label && <span className="block text-[10px] uppercase font-bold text-gray-500 mb-1 border-b border-gray-300">{label}</span>}
        <textarea
            className={cn(
                "w-full flex-1 bg-transparent resize-none outline-none leading-tight font-serif text-sm text-gray-800 placeholder:text-gray-300 p-1 border border-transparent focus:border-gray-200 rounded print:border-none",
                className
            )}
            defaultValue={value}
        />
    </div>
);

const AttributeBox = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">{label}</span>
        <div className="w-16 h-20 border-2 border-black rounded-lg flex flex-col items-center justify-center bg-white relative">
            {/* The Modifier IS the attribute in T20 */}
            <input
                type="number"
                defaultValue={value}
                className="w-full text-center text-3xl font-black font-serif bg-transparent outline-none appearance-none"
            />
            <div className="w-full border-t border-black mt-1 pt-1 text-center text-[10px] text-gray-400">
                TOTAL
            </div>
        </div>
    </div>
);

export default function Tormenta20Sheet() {
    const store = useCharacterStore();

    // Local state for "Manual Overrides" (In a real app, this should be in the store or a Formik/ReactHookForm context)
    // For now, we seed it with Store data but let user change it freely in the UI (non-persistent for this MVP step)
    const [name, setName] = useState(store.name);

    // We calculate defaults but allow editing
    const finalAttributes: AttributeBonus = { ...store.attributes };
    if (store.race?.bonus) {
        Object.keys(store.race.bonus).forEach(k => {
            const key = k as keyof AttributeBonus;
            if (finalAttributes[key] !== undefined) finalAttributes[key] += store.race!.bonus![key] || 0;
        });
    }

    const initialMaxHP = store.class ? calculateInitialHP(store.class, finalAttributes.con) : 0;
    const initialMaxMP = store.class ? calculateInitialMP(store.class, finalAttributes.int) : 0;

    const SKILLS = [
        "Acrobacia", "Adestramento", "Atletismo", "Atuação", "Cavalgar", "Conhecimento",
        "Cura", "Diplomacia", "Enganação", "Fortitude", "Guerra", "Iniciativa",
        "Intimidação", "Intuição", "Investigação", "Jogatina", "Ladinagem", "Luta",
        "Malandragem", "Misticismo", "Nobreza", "Ofício", "Percepção", "Pilotagem",
        "Pontaria", "Reflexos", "Religião", "Sobrevivência", "Vontade"
    ];

    // Cálculos de Inventário & Carga (Módulo Lote 34 / Bazar Lote 86)
    const inventoryText = store.inventory.map((item: any) => {
        if (typeof item === 'string') return item;
        const badges = [];
        if (item.material) badges.push(item.material);
        if (item.encantos && item.encantos.length > 0) badges.push(...item.encantos);

        let name = item.nome;
        if (badges.length > 0) name += ` [${badges.join(', ')}]`;
        return name;
    }).join('\n');

    const currentLoad = store.inventory.reduce((acc: number, item: any) => {
        if (typeof item === 'string') return acc;
        let espaco = 0;
        const rawSpace = item.regras?.Espaço || item.regras?.Espaços;
        if (rawSpace) {
            const val = parseFloat(rawSpace.toString().replace(',', '.'));
            if (!isNaN(val)) espaco = val;
        }
        return acc + espaco;
    }, 0);

    const maxLoad = finalAttributes.for * 2 + 10;
    const isOverloaded = currentLoad > maxLoad;

    return (
        <div className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black p-8 shadow-2xl print:shadow-none print:m-0 print:p-0 relative font-sans">

            {/* LOGO WATERMARK OR HEADER */}
            <div className="absolute top-8 right-8 text-right opacity-50 z-0 pointer-events-none">
                <h1 className="text-6xl font-black text-gray-100 italic tracking-tighter uppercase transform -rotate-2">Tormenta<span className="text-red-100">20</span></h1>
            </div>

            {/* --- HEADER BLOCK --- */}
            <div className="grid grid-cols-12 gap-4 mb-6 relative z-10">
                <div className="col-span-6">
                    <EditableInput label="Nome do Personagem" value={name} onChange={setName} className="text-2xl" />
                </div>
                <div className="col-span-4">
                    <EditableInput
                        label="Jogador"
                        value={store.playerName || ""}
                        onChange={(val) => store.setPlayerName(val)}
                        placeholder="Seu nome"
                    />
                </div>
                <div className="col-span-2">
                    <EditableInput label="Nível" value={store.level.toString()} className="text-center" />
                </div>

                <div className="col-span-3">
                    <EditableInput label="Raça" value={store.race?.name || ""} />
                </div>
                <div className="col-span-3">
                    <EditableInput label="Classe" value={store.class?.name || ""} />
                </div>
                <div className="col-span-3">
                    <EditableInput label="Origem" value={store.origin?.nome || ""} />
                </div>
                <div className="col-span-3">
                    <EditableInput label="Divindade" value={store.divinity?.nome || ""} />
                </div>
            </div>

            {/* --- ATTRIBUTES --- */}
            <div className="flex justify-between gap-2 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200 print:border-black print:bg-transparent">
                {Object.entries(finalAttributes).map(([key, val]) => (
                    <AttributeBox key={key} label={key} value={val} />
                ))}
            </div>

            {/* --- MAIN GRID --- */}
            <div className="grid grid-cols-12 gap-6 h-[800px]">

                {/* --- LEFT COL (Skills & Defense) --- */}
                <div className="col-span-5 flex flex-col gap-4">

                    {/* DEFENSE BLOCK */}
                    <div className="border-2 border-black rounded-lg p-2">
                        <div className="flex justify-between items-end mb-1">
                            <span className="font-bold uppercase text-sm flex items-center gap-1"><Shield className="w-4 h-4" /> Defesa</span>
                            <span className="text-3xl font-black leading-none">{10 + finalAttributes.des}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 text-center uppercase">
                            <div className="flex-1 border-t border-gray-300 pt-1">10 Base</div>
                            <div className="flex-1 border-t border-gray-300 pt-1 border-l">+ Mod. Des</div>
                            <div className="flex-1 border-t border-gray-300 pt-1 border-l">+ Armadura</div>
                            <div className="flex-1 border-t border-gray-300 pt-1 border-l">+ Escudo</div>
                            <div className="flex-1 border-t border-gray-300 pt-1 border-l">+ Outros</div>
                        </div>
                    </div>

                    {/* Alerta de Sobrecarga */}
                    {isOverloaded && (
                        <div className="bg-red-500/10 border-2 border-red-500 rounded p-2 text-center animate-pulse">
                            <span className="text-xs font-black text-red-700 uppercase">⚠️ Sobrecarga Ativa</span>
                            <p className="text-[10px] text-red-600 font-bold leading-tight mt-1">
                                Deslocamento -3m<br /> Perícias de For/Des -5
                            </p>
                        </div>
                    )}

                    {/* VITALS BLOCK */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-black rounded-lg p-2 bg-gray-50 print:bg-transparent">
                            <span className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Pontos de Vida</span>
                            <div className="flex gap-2 text-center">
                                <div className="w-1/2">
                                    <input type="number" defaultValue={initialMaxHP} className="w-full text-center text-xl font-bold bg-transparent border-b border-gray-300" />
                                    <span className="text-[9px]">MÁXIMO</span>
                                </div>
                                <div className="w-1/2">
                                    <input type="number" className="w-full text-center text-xl font-bold bg-transparent border-b border-gray-300" />
                                    <span className="text-[9px]">ATUAL</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-2 border-black rounded-lg p-2 bg-gray-50 print:bg-transparent">
                            <span className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Pontos de Mana</span>
                            <div className="flex gap-2 text-center">
                                <div className="w-1/2">
                                    <input type="number" defaultValue={initialMaxMP} className="w-full text-center text-xl font-bold bg-transparent border-b border-gray-300" />
                                    <span className="text-[9px]">MÁXIMO</span>
                                </div>
                                <div className="w-1/2">
                                    <input type="number" className="w-full text-center text-xl font-bold bg-transparent border-b border-gray-300" />
                                    <span className="text-[9px]">ATUAL</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SKILLS LIST */}
                    <div className="flex-1 border-2 border-black rounded-lg p-3 flex flex-col">
                        <div className="flex justify-between text-[9px] uppercase font-bold border-b border-black pb-1 mb-2">
                            <span>Perícia</span>
                            <span className="w-8 text-center">Total</span>
                        </div>
                        <div className="flex-1 overflow-hidden space-y-1">
                            {SKILLS.map(skill => (
                                <div key={skill} className="flex items-center justify-between text-xs border-b border-gray-100 py-0.5">
                                    <span className="font-semibold truncate flex-1">{skill}</span>
                                    <input type="text" className="w-8 text-center bg-transparent border-b border-gray-200 focus:border-red-500 outline-none" placeholder="+0" />
                                </div>
                            ))}
                            {/* Empty slots for custom skills */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between text-xs border-b border-gray-100 py-0.5 opacity-50">
                                    <input type="text" className="w-24 bg-transparent italic" placeholder="Outra..." />
                                    <input type="text" className="w-8 text-center bg-transparent border-b border-gray-200" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COL (Combat, Gear, Powers) --- */}
                <div className="col-span-7 flex flex-col gap-4">

                    {/* ATTACKS TABLE */}
                    <div className="border-2 border-black rounded-lg p-2 min-h-[150px]">
                        <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex gap-1"><Sword className="w-3 h-3" /> Ataques</h3>
                        <div className="grid grid-cols-12 gap-1 mb-1 text-[9px] uppercase font-bold text-center bg-gray-100 rounded p-1 print:bg-transparent print:border-b print:rounded-none">
                            <div className="col-span-4 text-left">Arma</div>
                            <div className="col-span-2">Ataque</div>
                            <div className="col-span-3">Dano</div>
                            <div className="col-span-1">Crit</div>
                            <div className="col-span-2">Tipo</div>
                        </div>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="grid grid-cols-12 gap-1 mb-1 text-xs">
                                <input type="text" className="col-span-4 bg-transparent border-b border-gray-200 outline-none" />
                                <input type="text" className="col-span-2 bg-transparent border-b border-gray-200 text-center outline-none" />
                                <input type="text" className="col-span-3 bg-transparent border-b border-gray-200 text-center outline-none" />
                                <input type="text" className="col-span-1 bg-transparent border-b border-gray-200 text-center outline-none" />
                                <input type="text" className="col-span-2 bg-transparent border-b border-gray-200 text-center outline-none" />
                            </div>
                        ))}
                    </div>

                    {/* ABILITIES & POWERS */}
                    <div className="flex-1 border-2 border-black rounded-lg p-2 flex flex-col">
                        <EditableArea
                            label="Habilidades de Raça e Classe"
                            className="h-1/2 border-b border-dashed border-gray-300 mb-2 pb-2"
                            value={[
                                ...(store.race?.abilities.map(a => `${a.name}: ${a.description}`) || []),
                                ...(store.class?.abilities.map(a => `${a.name}: ${a.description}`) || [])
                            ].join('\n\n')}
                        />
                        <EditableArea
                            label="Poderes e Habilidades"
                            className="h-1/2"
                            value={[
                                store.origin ? `Origem (${store.origin.nome}): ${store.origin.beneficios ? Object.values(store.origin.beneficios).join(", ") : ""}` : "",
                                store.divinity ? `Devoto de ${store.divinity.nome}: ${store.divinity.poderes_concedidos?.map(p => p.nome).join(", ")}` : ""
                            ].filter(Boolean).join('\n\n')}
                        />
                    </div>

                    {/* INVENTORY & MONEY */}
                    <div className="h-[200px] grid grid-cols-12 gap-4">
                        <div className="col-span-8 border-2 border-black rounded-lg p-2 flex flex-col">
                            <span className="block text-[10px] uppercase font-bold text-gray-500 mb-1 border-b border-gray-300">Equipamento</span>
                            <textarea
                                className="w-full flex-1 bg-transparent resize-none outline-none leading-tight font-serif text-sm text-gray-800 placeholder:text-gray-300 p-1 border border-transparent focus:border-gray-200 rounded print:border-none"
                                value={inventoryText}
                                readOnly
                            />
                        </div>
                        <div className="col-span-4 border-2 border-black rounded-lg p-2 flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-bold text-gray-500 flex justify-between">
                                Tibares (T$)
                                <span className="text-gray-400 font-normal">[{store.tibares}]</span>
                            </span>
                            <input
                                type="number"
                                className="flex-1 w-full bg-transparent border-b border-gray-200 text-right text-lg font-serif outline-none"
                                value={store.tibares}
                                onChange={(e) => store.setTibares(Number(e.target.value))}
                            />

                            <span className="text-[10px] uppercase font-bold text-gray-500 mt-2">Carga</span>
                            <div className={cn(
                                "text-right text-xl font-bold transition-colors",
                                isOverloaded ? "text-red-600" : ""
                            )}>
                                {currentLoad} <span className="text-xs font-normal text-gray-400">/ {maxLoad}kg</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* COPYRIGHT FOOTER */}
            <div className="mt-4 text-center text-[9px] text-gray-400 uppercase tracking-widest font-sans">
                Ficha de Personagem não oficial para Tormenta20 • Criado com Grimório Digital
            </div>

            <style jsx global>{`
                @media print {
                    @page { 
                        size: A4; 
                        margin: 0;
                    }
                    body { 
                        background: white; 
                        color: black; 
                        -webkit-print-color-adjust: exact;
                    }
                    /* Ensure inputs look like text when printed */
                    input, textarea {
                        border: none !important;
                        background: transparent !important;
                        resize: none;
                    }
                    /* But keep basic structural borders */
                    .border-2 {
                        border-width: 2px !important;
                        border-color: black !important;
                    }
                }
            `}</style>
        </div>
    );
}
