"use client";

import { useSearchParams } from "next/navigation";
import { searchGrimoire } from "@/core/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { ArrowLeft, Scroll, Skull } from "lucide-react";
import Link from "next/link";
import { cn } from "@/core/lib/utils";
import { Suspense } from "react";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const { spells, monsters } = searchGrimoire(query);
    const hasResults = spells.length > 0 || monsters.length > 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-tormenta-red transition-colors w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
                </Link>
                <h1 className="font-serif text-4xl md:text-5xl font-black uppercase tracking-tighter">
                    &quot;{query}&quot;
                </h1>
            </div>

            {
                !hasResults && (
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-6 text-tormenta-red">Resultados da Busca</h1>
                        <p className="text-muted-foreground">Nenhum resultado para &quot;{query}&quot;</p>
                    </div>
                )
            }

            {/* Spells Results */}
            {
                spells.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold border-b border-border pb-2 flex items-center gap-2">
                            <Scroll className="w-6 h-6 text-tormenta-gold" /> Magias Encontradas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spells.map((spell) => {
                                const slug = (spell.name || (spell as any).nome)
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .toLowerCase()
                                    .trim()
                                    .replace(/\s+/g, "-")
                                    .replace(/[^\w-]/g, "");
                                const imagePath = `/assets/spells/${slug}.jpg`;

                                return (
                                    <Card key={spell.id} className="h-full hover:border-tormenta-red group flex flex-col overflow-hidden bg-background-dark/40 border-primary/20">
                                        <div className={cn(
                                            "relative h-24 w-full shrink-0 border-b border-primary/20 bg-gradient-to-br",
                                            spell.type === "Divina" ? "from-amber-900/40 to-background-dark" :
                                            spell.type === "Arcana" ? "from-purple-900/40 to-background-dark" :
                                            "from-primary/40 to-background-dark"
                                        )}>
                                            <img 
                                                src={imagePath} 
                                                alt={spell.name}
                                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 opacity-0"
                                                onLoad={(e) => {
                                                    (e.target as HTMLImageElement).classList.remove('opacity-0');
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).remove();
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        </div>
                                        <CardHeader className="pb-2 relative z-10 -mt-8">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg text-white group-hover:text-tormenta-red transition-colors drop-shadow-md">{spell.name}</CardTitle>
                                                <span className="px-2 py-0.5 bg-tormenta-red/80 text-white font-mono text-[10px] border border-white/20 rounded shadow-lg backdrop-blur-sm">{spell.circle}º Circ</span>
                                            </div>
                                            <div className="text-[10px] text-tormenta-gold font-bold uppercase tracking-widest opacity-80">{spell.school}</div>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <p className="text-xs line-clamp-3 text-muted-foreground italic leading-relaxed">
                                                &quot;{spell.description.replace(/(<([^>]+)>)/gi, "")}&quot;
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                )
            }

            {/* Monsters Results */}
            {
                monsters.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold border-b border-border pb-2 flex items-center gap-2">
                            <Skull className="w-6 h-6 text-tormenta-red" /> Bestiário
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {monsters.map((monster) => (
                                <Card key={monster.id} variant="dark" className="h-full group hover:border-tormenta-red">
                                    <CardHeader className="pb-2 border-b border-white/10 mb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl group-hover:text-tormenta-red transition-colors">{monster.name}</CardTitle>
                                            <span className="px-2 py-1 bg-tormenta-red font-bold text-xs text-white">ND {monster.level}</span>
                                        </div>
                                        <div className="text-sm text-tormenta-gold font-medium">{monster.type} • {monster.role}</div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-2 text-center text-sm mb-2">
                                            <div className="bg-white/5 p-1"><span className="text-[10px] uppercase block text-gray-500">PV</span><span className="text-tormenta-red font-bold">{monster.hp}</span></div>
                                            <div className="bg-white/5 p-1"><span className="text-[10px] uppercase block text-gray-500">Def</span><span className="text-white font-bold">{monster.defense}</span></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )
            }
        </div >
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <Suspense fallback={<div className="text-center py-20">Consultando os oráculos...</div>}>
                    <SearchResults />
                </Suspense>
            </div>
        </main>
    );
}
