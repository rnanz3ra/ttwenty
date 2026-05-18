
import { getAllDeities } from "@/core/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DivindadesList } from "@/components/divindades/DivindadesList";

export default function DivinitiesPage() {
    const deities = getAllDeities();

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Diegético */}
                <div className="flex flex-col gap-6">
                    <Link href="/" className="inline-flex items-center text-arton-gold hover:text-arton-red transition-all font-serif font-black uppercase text-xs tracking-widest group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Retornar ao Reinado
                    </Link>

                    <div className="space-y-2">
                        <h1 className="font-serif text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                            O Panteão <span className="text-arton-red block md:inline">de Arton</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-serif italic max-w-3xl">
                            "Os Vinte Deuses Maiores que regem o destino do mundo, do sol de Azgher à escuridão de Tenebra."
                        </p>
                    </div>
                </div>

                {/* Listagem Diegética */}
                <DivindadesList initialDeities={deities} />

                {/* Rodapé Decorativo */}
                <div className="pt-24 pb-12 text-center opacity-20">
                    <div className="h-px bg-gradient-to-r from-transparent via-arton-gold to-transparent w-full mb-8" />
                    <p className="font-serif text-sm uppercase tracking-[0.5em] text-arton-gold">
                        Consulte o destino • Tormenta 20
                    </p>
                </div>
            </div>
        </main>
    );
}
