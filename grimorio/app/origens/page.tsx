import { OrigensList } from "@/features/origins/components/origens-list";
import { baseOrigens } from "@/core/lib/t20_data";

export default function OrigensPage() {
    return (
        <main className="min-h-screen bg-[#0c0a09] pt-24 pb-12 px-4 selection:bg-[#60a5fa]/30">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-wider title-glow" style={{ textShadow: "0 0 40px rgba(96, 165, 250, 0.4)" }}>
                        Origens
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        O passado molda o aventureiro. O que você fazia antes de decidir enfrentar a Tormenta?
                    </p>
                </header>

                <OrigensList initialOrigens={baseOrigens} />
            </div>
        </main>
    );
}
