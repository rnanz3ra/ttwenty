"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/core/ui/button";
import { Crown, Sparkles, Scroll, ArrowRight, Zap, Play, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/core/lib/utils";

export function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!heroRef.current) return;
            const { innerWidth, innerHeight } = window;
            setMousePosition({
                x: (e.clientX / innerWidth - 0.5) * 20, // -10 to 10
                y: (e.clientY / innerHeight - 0.5) * 20, // -10 to 10
            });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative w-full h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-[#0c0a09]"
        >
            {/* 
         LAYER 1: Background Image 
         Parallax Effect based on Scroll
      */}
            <div
                className="absolute inset-0 z-0 scale-110"
                style={{
                    transform: `translateY(${scrollY * 0.5}px)`,
                }}
            >
                <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/80 z-20" /> {/* Vignette */}
                <img
                    src="/hero-background.png"
                    alt="Tormenta Landscape"
                    className="w-full h-full object-cover object-top opacity-80"
                />
            </div>

            {/* 
         LAYER 2: Floating Particles/Effects 
         Mouse Movement Parallax
      */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
                }}
            >
                {/* Animated Fog/Clouds would go here */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tormenta-red/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* 
         LAYER 3: Main Content 
         Slight Mouse Movement for 3D feel
      */}
            <div
                className="relative z-30 text-center max-w-5xl px-4 space-y-8"
                style={{
                    transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                }}
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                    <Zap className="w-4 h-4 text-tormenta-gold" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                        O Definitivo Digital
                    </span>
                </div>

                {/* Title Group */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center mb-6">
                        <Crown className="w-24 h-24 text-tormenta-gold drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] animate-pulse" />
                    </div>

                    <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
                        Grimório <span className="text-tormenta-red text-glow">T20</span>
                    </h1>

                    <p className="font-serif text-xl md:text-2xl text-white/70 italic max-w-3xl mx-auto leading-relaxed">
                        "Para onde quer que você olhe, há monstros. Cabe a você ser o herói que Arton precisa."
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                    <Link href="/ficha">
                        <Button size="xl" className="h-16 px-8 text-lg font-bold uppercase tracking-widest bg-tormenta-red hover:bg-red-700 shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.8)] transition-all transform hover:scale-105">
                            <Play className="w-5 h-5 mr-3 fill-current" /> Começar Aventura
                        </Button>
                    </Link>

                    <Link href="/manual">
                        <Button size="xl" variant="outline" className="h-16 px-8 text-lg font-bold uppercase tracking-widest border-white/20 hover:bg-white/5 text-white hover:text-tormenta-gold transition-all backdrop-blur-sm">
                            <BookOpen className="w-5 h-5 mr-3" /> Ler Regras
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 
         LAYER 4: Scroll Indicator 
      */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
                    <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll-down" />
                </div>
            </div>

            {/* Decorative Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0c0a09] to-transparent z-20 pointer-events-none" />
        </section>
    );
}
