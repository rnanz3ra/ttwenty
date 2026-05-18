"use client";

import { useState } from "react";
import { Power } from "@/core/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Search, Zap } from "lucide-react";

interface PowersListProps {
    initialPowers: Power[];
}

const TYPES = ["Geral", "Combate", "Destino", "Magia", "Concedido", "Tormenta", "Classe"];

export function PowersList({ initialPowers }: PowersListProps) {
    const [query, setQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("");

    const filteredPowers = initialPowers.filter(power => {
        const matchesQuery = power.name.toLowerCase().includes(query.toLowerCase()) ||
            power.description.toLowerCase().includes(query.toLowerCase());
        const matchesType = selectedType ? power.type === selectedType : true;

        return matchesQuery && matchesType;
    });

    return (
        <div className="w-full space-y-8">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 p-6 border-b-2 border-border/10 bg-background/50 backdrop-blur-sm sticky top-0 z-10 transition-all">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar poder..."
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border focus:border-tormenta-red outline-none transition-colors"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <select
                    className="p-2 bg-background border border-border focus:border-tormenta-red outline-none"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="">Todos os Tipos</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {filteredPowers.map((power, index) => (
                    <Card key={`${power.id}-${index}`} className="h-full hover:border-tormenta-red group flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl group-hover:text-tormenta-red transition-colors">{power.name}</CardTitle>
                                <span className={
                                    power.type === "Tormenta"
                                        ? "px-2 py-1 bg-tormenta-red text-white font-bold text-xs"
                                        : "px-2 py-1 bg-muted font-mono text-xs border border-border"
                                }>{power.type}</span>
                            </div>
                            {power.prerequisite && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    <strong className="text-tormenta-gold">Pré-requisito:</strong> {power.prerequisite}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm line-clamp-4 text-muted-foreground">
                                {power.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPowers.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-xl font-serif">Nenhum poder encontrado com estes critérios.</p>
                </div>
            )}
        </div>
    );
}
