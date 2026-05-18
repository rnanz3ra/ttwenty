import { GMScreen } from "@/components/gm-screen";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EscudoPage() {
    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-tormenta-red transition-colors w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Grimório
                    </Link>
                    <h1 className="font-serif text-5xl md:text-6xl font-black text-tormenta-red uppercase tracking-tighter">
                        Escudo do Mestre
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        "O destino de Arton está em suas mãos. Use-o com sabedoria."
                    </p>
                </div>

                {/* Dynamic Content */}
                <GMScreen />
            </div>
        </main>
    );
}
