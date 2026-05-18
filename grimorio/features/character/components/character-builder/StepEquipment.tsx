
import { useState } from "react";
import { useCharacterStore } from "@/core/store/character-store";
import { Card, CardHeader, CardTitle, CardContent } from '@/core/ui/card';
import { Button } from '@/core/ui/button';
import { Input } from '@/core/ui/input';
import { Plus, Trash2, Package, Coins } from "lucide-react";
import { cn } from "@/core/lib/utils";

const COMMON_ITEMS = [
    "Mochila",
    "Saco de Dormir",
    "Corda (15m)",
    "Tocha",
    "Ração de Viagem (1 dia)",
    "Pederneira",
    "Cantil"
];

export default function StepEquipment() {
    const { inventory, addItem, removeItem } = useCharacterStore();
    const [newItem, setNewItem] = useState("");

    const handleAdd = () => {
        if (newItem.trim()) {
            addItem(newItem.trim());
            setNewItem("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-bold text-tormenta-red">Equipamento Inicial</h2>
                <p className="text-muted-foreground">Escolha seus itens e prepare-se para a aventura.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[60vh]">
                {/* Available Items / Quick Add */}
                <Card className="col-span-1 border-white/10 bg-black/20 backdrop-blur overflow-hidden flex flex-col">
                    <CardHeader className="bg-muted/50 pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Itens Comuns</CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {COMMON_ITEMS.map((item) => (
                            <button
                                key={item}
                                onClick={() => addItem(item)}
                                className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-tormenta-red/50 transition-all flex items-center justify-between group"
                            >
                                <span className="font-serif">{item}</span>
                                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-tormenta-red" />
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Current Inventory */}
                <Card className="col-span-1 lg:col-span-2 border-white/10 bg-black/40 backdrop-blur relative overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-white/10 pb-4 bg-black/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-stone-500/20 text-stone-400 rounded-lg border border-stone-500/20">
                                <Package className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-serif font-bold text-white">Mochila</CardTitle>
                                <p className="text-sm text-muted-foreground">{inventory.length} itens</p>
                            </div>
                            <div className="flex items-center gap-2 bg-black/50 p-2 rounded border border-white/10">
                                <Coins className="w-5 h-5 text-yellow-500" />
                                <span className="text-yellow-500 font-bold font-serif">T$ 100</span>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Add Custom Item */}
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <div className="flex gap-2">
                            <Input
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Adicionar item personalizado..."
                                className="bg-black/50 border-white/10 text-white"
                            />
                            <Button onClick={handleAdd} className="bg-tormenta-red hover:bg-red-700 text-white">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Inventory List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {inventory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center opacity-50">
                                <Package className="w-16 h-16 mb-4" />
                                <p className="font-serif">Sua mochila está vazia.</p>
                            </div>
                        ) : (
                            inventory.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 group hover:border-white/20 transition-all"
                                >
                                    <span className="font-serif text-white">{typeof item === 'string' ? item : (item as any).nome}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(index)}
                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-50 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
