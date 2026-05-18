import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/core/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { NavMobile } from "@/components/layout/NavMobile";

export const metadata: Metadata = {
  title: "Natro | Um portal T20",
  description: "O Destino de Arton está em suas mãos. Portal definitivo para Tormenta 20. Fichas, magias, monstros e ferramentas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Crimson+Pro:ital,wght@0,400..700;1,400..700&family=Montserrat:wght@400..700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased text-slate-100 bg-background-dark overflow-hidden parchment-texture selection:bg-primary selection:text-white"
      )}>
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header - Context aware */}
            <Header />
            
            <main className="flex-1 overflow-y-auto scrollbar-hide">
              {children}
            </main>

            {/* Mobile Bottom Nav */}
            <NavMobile />
          </div>
        </div>
      </body>
    </html>
  );
}
