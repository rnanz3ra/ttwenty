"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "grimorio_favoritos";

function loadFromStorage(): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? new Set<string>(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [hydrated, setHydrated] = useState(false);

    // Hydrate from localStorage on mount (avoids SSR mismatch)
    useEffect(() => {
        setFavorites(loadFromStorage());
        setHydrated(true);
    }, []);

    // Persist whenever favorites change
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
    }, [favorites, hydrated]);

    const toggle = useCallback((id: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const isFavorite = useCallback(
        (id: string) => favorites.has(id),
        [favorites]
    );

    return { favorites, toggle, isFavorite, hydrated };
}
