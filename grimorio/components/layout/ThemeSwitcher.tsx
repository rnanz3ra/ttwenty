"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/core/lib/utils";

export function ThemeSwitcher() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("arton-theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.classList.toggle("light-mode", savedTheme === "light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("arton-theme", newTheme);
        document.body.classList.toggle("light-mode", newTheme === "light");
    };

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2 rounded-full border-2 transition-all flex items-center gap-2 px-4 font-serif text-[10px] font-black uppercase tracking-widest",
                theme === "dark"
                    ? "bg-black/40 border-arton-gold/30 text-arton-gold hover:bg-arton-gold/10"
                    : "bg-[#fdf5e6] border-[#8b0000]/30 text-[#8b0000] hover:bg-[#8b0000]/5 shadow-sm"
            )}
            title={theme === "dark" ? "Ativar Modo Azgher (Claro)" : "Ativar Modo Tenebra (Escuro)"}
        >
            {theme === "dark" ? (
                <>
                    <Moon className="w-4 h-4" />
                    Modo Tenebra
                </>
            ) : (
                <>
                    <Sun className="w-4 h-4" />
                    Modo Azgher
                </>
            )}
        </button>
    );
}
