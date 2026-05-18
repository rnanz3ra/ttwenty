import { ClassesList } from "@/features/classes/components/classes-list";
import { baseClasses } from "@/core/lib/t20_data";

export default function ClassesPage() {
    return (
        <main className="min-h-screen bg-[#0c0a09] pt-24 pb-12 px-4 selection:bg-tormenta-red/30">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-wider title-glow">
                        Classes Heroicas
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Do Bárbaro furioso ao Arcanista moldador de mundos. Aulas de guerra, fé e magia de Arton.
                    </p>
                </header>

                <ClassesList initialClasses={baseClasses} />
            </div>
        </main>
    );
}
