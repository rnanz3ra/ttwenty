"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/core/lib/utils";
import { BookOpen, Shield, Sword, Scroll, Skull, Zap, Ghost, Sparkles, Map as MapIcon, Menu, X, User, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/core/ui/button";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

const navItems = [
    {
        title: "Compêndio",
        icon: BookOpen,
        categories: [
            {
                title: "Personagem",
                items: [
                    { title: "Raças", href: "/racas", icon: Ghost, desc: "Humanos, Elfos..." },
                    { title: "Classes", href: "/classes", icon: Sword, desc: "Guerreiros, Magos..." },
                    { title: "Origens", href: "/origens", icon: Sparkles, desc: "Históricos de vida" },
                    { title: "Divindades", href: "/divindades", icon: Crown, desc: "O Panteão" },
                ]
            },
            {
                title: "Regras",
                items: [
                    { title: "Magias", href: "/magias", icon: Scroll, desc: "Lista completa" },
                    { title: "Poderes", href: "/poderes", icon: Zap, desc: "Talentos" },
                    { title: "Livro Básico", href: "/manual", icon: BookOpen, desc: "Regras fundamentais" },
                ]
            }
        ]
    },
    {
        title: "Mestre",
        icon: Shield,
        categories: [
            {
                title: "Ferramentas",
                items: [
                    { title: "Bestiário", href: "/monstros", icon: Skull, desc: "Ameaças" },
                    { title: "Escudo do Mestre", href: "/escudo", icon: Shield, desc: "Tabelas rápidas" },
                    { title: "Atlas", href: "/atlas", icon: MapIcon, desc: "Mapas de Arton" },
                ]
            }
        ]
    }
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5",
                isScrolled
                    ? "backdrop-blur-md shadow-lg py-3"
                    : "bg-gradient-to-b from-black/20 to-transparent py-5"
            )}
            style={{ backgroundColor: isScrolled ? 'var(--sidebar-item)' : 'transparent' }}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group relative z-50">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-tormenta-red rounded-lg transform group-hover:rotate-3 transition-transform duration-300 shadow-[0_0_15px_-3px_rgba(208,32,32,0.5)]">
                        <Crown className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-xl font-bold tracking-tight leading-none group-hover:text-tormenta-red transition-colors" style={{ color: 'var(--sidebar-text)' }}>
                            GRIMÓRIO
                        </span>
                        <span className="text-[10px] opacity-50 font-medium tracking-[0.2em] uppercase" style={{ color: 'var(--sidebar-text)' }}>
                            Tormenta 20
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation (Mega Menu) */}
                <div className="hidden lg:flex items-center gap-6">
                    {navItems.map((menu) => (
                        <div key={menu.title} className="group relative">
                            <button className="flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wide py-2">
                                <menu.icon className="w-4 h-4 text-tormenta-red opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110" />
                                {menu.title}
                            </button>

                            {/* Mega Menu Content */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto w-[600px]">
                                <div className="border rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-8 relative overflow-hidden" style={{ backgroundColor: 'var(--sidebar-item)', borderColor: 'var(--border-color)' }}>
                                    {/* Decorative Icon Background */}
                                    <menu.icon className="absolute -right-12 -bottom-12 w-64 h-64 text-white/[0.02] pointer-events-none rotate-12" />

                                    {menu.categories.map((cat, idx) => (
                                        <div key={cat.title + idx} className="relative z-10">
                                            <h4 className="text-tormenta-red text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ borderBottomColor: 'var(--border-color)' }}>
                                                {cat.title}
                                            </h4>
                                            <div className="space-y-2">
                                                {cat.items.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group/item"
                                                    >
                                                        <div className="mt-1 p-1.5 bg-black/40 rounded border border-white/5 group-hover/item:border-tormenta-red/30 transition-colors">
                                                            <item.icon className="w-4 h-4 text-tormenta-red" />
                                                        </div>
                                                        <div>
                                                            <div className="font-serif font-bold text-sm group-hover:text-tormenta-red transition-colors" style={{ color: 'var(--sidebar-text)' }}>
                                                                {item.title}
                                                            </div>
                                                            <div className="text-[10px] text-white/40 mt-0.5 leading-tight">
                                                                {item.desc}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="w-px h-8 bg-white/10 mx-2" />

                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        <Link href="/ficha">
                            <Button variant="default" className="bg-tormenta-red hover:bg-red-700 text-white font-bold uppercase tracking-wider shadow-[0_0_15px_-5px_rgba(220,38,38,0.5)] hover:shadow-[0_0_20px_-5px_rgba(220,38,38,0.8)] transition-all">
                                <User className="w-4 h-4 mr-2" /> Criar Personagem
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-2 lg:hidden relative z-50">
                    <ThemeSwitcher />
                    <button
                        className="p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 lg:hidden transition-transform duration-300 pt-24 px-6 overflow-y-auto shadow-2xl",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
                style={{ backgroundColor: 'var(--bg-global)' }}
            >
                <div className="space-y-8 pb-10">
                    {navItems.map((menu) => (
                        <div key={menu.title} className="space-y-6">
                            <h3 className="font-serif text-2xl font-bold text-tormenta-red flex items-center gap-3 border-b border-white/10 pb-2">
                                <menu.icon className="w-6 h-6" /> {menu.title}
                            </h3>

                            {menu.categories.map((cat, idx) => (
                                <div key={idx} className="space-y-3 pl-4 border-l-2 border-white/5">
                                    <h4 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
                                        {cat.title}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {cat.items.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                            >
                                                <item.icon className="w-5 h-5 text-tormenta-red" />
                                                <div>
                                                    <div className="font-bold">{item.title}</div>
                                                    <div className="text-xs text-white/50">{item.desc}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <Link href="/ficha" onClick={() => setMobileMenuOpen(false)} className="block pt-6">
                        <Button className="w-full font-bold uppercase py-6 text-lg shadow-lg" size="lg">
                            <User className="w-5 h-5 mr-2" /> Criar Personagem
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
