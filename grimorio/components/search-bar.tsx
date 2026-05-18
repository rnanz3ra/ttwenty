"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/core/lib/utils";

export function SearchBar({ className }: { className?: string }) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/busca?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={cn("relative w-full max-w-2xl group", className)}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-tormenta-red transition-colors">
                <Search className="w-6 h-6" />
            </div>
            <input
                type="text"
                placeholder="Busque por magias, monstros ou regras..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-background border-2 border-border text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:border-tormenta-red focus:shadow-brutalist transition-all"
            />
            <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-tormenta-red text-white font-bold uppercase tracking-wider hover:bg-tormenta-red/90 transition-colors"
            >
                Buscar
            </button>
        </form>
    );
}
