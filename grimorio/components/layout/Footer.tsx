"use client";

import Link from "next/link";
import { Crown, Heart, Github, Twitter, Instagram, Mail, Shield, BookOpen, Sword } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#0c0a09] border-t border-white/10 relative overflow-hidden">
            {/* Decorative Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-tormenta-red/50 to-transparent" />

            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative w-12 h-12 flex items-center justify-center bg-tormenta-red rounded-xl shadow-[0_0_20px_-5px_rgba(208,32,32,0.5)]">
                                <Crown className="text-white w-7 h-7" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-2xl font-bold text-white tracking-tight leading-none">
                                    GRIMÓRIO
                                </span>
                                <span className="text-[10px] text-white/50 font-medium tracking-[0.3em] uppercase">
                                    Tormenta 20
                                </span>
                            </div>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                            O compêndio definitivo para aventureiros de Arton.
                            Gerencie fichas, consulte regras e prepare suas campanhas com ferramentas digitais modernas.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-tormenta-red hover:text-white text-white/60 transition-all">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-tormenta-red hover:text-white text-white/60 transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-tormenta-red hover:text-white text-white/60 transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif font-bold text-white text-lg mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-tormenta-red" /> Explorar
                        </h4>
                        <ul className="space-y-3">
                            <li><Link href="/manual" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Livro Básico</Link></li>
                            <li><Link href="/racas" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Raças de Arton</Link></li>
                            <li><Link href="/classes" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Classes & Trilhas</Link></li>
                            <li><Link href="/magias" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Círculos de Magia</Link></li>
                            <li><Link href="/atlas" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Mapa do Reinado</Link></li>
                        </ul>
                    </div>

                    {/* Tools */}
                    <div>
                        <h4 className="font-serif font-bold text-white text-lg mb-6 flex items-center gap-2">
                            <Sword className="w-5 h-5 text-tormenta-red" /> Ferramentas
                        </h4>
                        <ul className="space-y-3">
                            <li><Link href="/ficha" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Criador de Personagem</Link></li>
                            <li><Link href="/escudo" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Escudo do Mestre</Link></li>
                            <li><Link href="/monstros" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Bestiário</Link></li>
                            <li><Link href="/dados" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Rolador de Dados</Link></li>
                            <li><Link href="/iniciativa" className="text-white/60 hover:text-tormenta-red transition-colors text-sm">Rastreador de Combate</Link></li>
                        </ul>
                    </div>

                    {/* Legal / Social Proof */}
                    <div className="bg-[#1c1917] rounded-xl p-6 border border-white/5">
                        <h4 className="font-serif font-bold text-white text-lg mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-tormenta-red" /> Comunidade
                        </h4>
                        <p className="text-xs text-white/50 mb-6">
                            Este é um projeto de fã sem fins lucrativos. Tormenta 20 é propriedade da Jambô Editora.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[75%] bg-tormenta-red rounded-full" />
                                </div>
                                <span className="text-xs font-bold text-white">v0.1.0 Beta</span>
                            </div>
                            <div className="text-xs text-white/40 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Sistemas Operacionais
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 rounded border border-white/10 text-white/60 text-xs hover:bg-white/5 hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-2">
                            <Mail className="w-3 h-3" /> Reportar Bug
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30 text-center md:text-left">
                        &copy; {new Date().getFullYear()} Fan Grimório. Feito com <Heart className="w-3 h-3 inline text-tormenta-red mx-1" /> por fãs de T20.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-xs text-white/30 hover:text-white transition-colors">Termos de Uso</Link>
                        <Link href="#" className="text-xs text-white/30 hover:text-white transition-colors">Privacidade</Link>
                        <Link href="#" className="text-xs text-white/30 hover:text-white transition-colors">Jambô Editora</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
