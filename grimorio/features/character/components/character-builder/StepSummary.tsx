"use client";

import { useCharacterStore } from "@/core/store/character-store";
import { Button } from '@/core/ui/button';
import { Download, Printer, FileText } from "lucide-react";
import Tormenta20Sheet from "./Tormenta20Sheet";
import { generatePDF } from "@/features/character/services/pdf-generator";

export default function StepSummary() {
    const store = useCharacterStore();

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        try {
            console.log("Iniciando geração de PDF Visual...");
            // Dynamic import to avoid SSR issues with html2canvas
            const { generateVisualPDF } = await import('@/features/character/services/visual-pdf');
            await generateVisualPDF('character-sheet-container', `Ficha_T20_${store.name || "Personagem"}.pdf`);
            console.log("PDF gerado com sucesso!");
        } catch (error) {
            console.error("Failed to generate PDF", error);
            alert("Erro ao gerar PDF: " + (error as Error).message);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div className="text-center space-y-2 no-print">
                <h2 className="text-3xl font-serif font-bold text-tormenta-red">Ficha de Personagem</h2>
                <p className="text-muted-foreground">Sua lenda está pronta. Revise e exporte.</p>
            </div>

            {/* CHARACTER SHEET CONTAINER */}
            <div id="character-sheet-container" className="flex justify-center overflow-x-auto py-4 px-2 md:px-0 bg-stone-100/50 rounded-lg border border-white/10">
                <Tormenta20Sheet />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-center gap-4 no-print mt-8">
                <Button onClick={handleDownloadPDF} variant="outline" className="gap-2 border-tormenta-red text-tormenta-red hover:bg-red-50">
                    <FileText className="w-4 h-4" /> Baixar PDF Oficial (Visual)
                </Button>
                <Button onClick={handlePrint} className="gap-2 bg-tormenta-red hover:bg-red-700 text-white shadow-lg shadow-red-900/20">
                    <Printer className="w-4 h-4" /> Imprimir Ficha
                </Button>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: A4; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                    header, footer { display: none !important; } /* Hide app header/footer */
                    .animate-in { animation: none !important; }
                }
            `}</style>
        </div>
    );
}
