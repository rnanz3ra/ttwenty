import Link from "next/link";
import { cn } from "@/core/lib/utils";

const modules = [
  { 
    title: "Grimório", 
    description: "Magias, rituais e preces de todos os círculos", 
    icon: "auto_stories", 
    href: "/magias",
    image: "/assets/generated/module_grimorio.png",
    color: "#8B0000"
  },
  { 
    title: "Bestiário", 
    description: "Catálogo de criaturas e ameaças de Arton", 
    icon: "skull", 
    href: "/monstros",
    image: "/assets/generated/module_bestiario.png",
    color: "#500000"
  },
  { 
    title: "Forja", 
    description: "Criação de fichas e equipamentos épicos", 
    icon: "construction", 
    href: "/forja",
    image: "/assets/generated/module_forja.png",
    color: "#4A3728"
  },
  { 
    title: "Templo", 
    description: "Panteão, divindades e obrigações", 
    icon: "church", 
    href: "/panteao",
    image: "/assets/generated/module_templo.png",
    color: "#A6894A"
  },
  { 
    title: "Condições", 
    description: "Status, debuffs e efeitos de jogo", 
    icon: "healing", 
    href: "/condicoes",
    image: "/assets/generated/module_condicoes.png",
    color: "#8B0000"
  },
];


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0D0202]">
      {/* Hero Section - Grimório Style */}
      <section className="relative h-[500px] w-full overflow-hidden flex-shrink-0 border-b border-[#A6894A]/30">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110"
          style={{ backgroundImage: "url('/assets/generated/hero_battle.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0202] via-[#0D0202]/40 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-10" />
        
        <div className="relative h-full flex flex-col justify-center items-center text-center p-6 md:p-12 max-w-5xl mx-auto z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-[#A6894A]" />
            <span className="text-[#A6894A] font-display font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
              O Destino de Arton
            </span>
            <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-[#A6894A]" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-[#E8DCC4] mb-6 leading-tight drop-shadow-[0_0_20px_rgba(139,0,0,0.4)] uppercase tracking-tighter">
            Grimório de <span className="text-[#8B0000]">Arton</span>
          </h1>

          <p className="text-[#A6894A] text-base md:text-xl mb-10 max-w-2xl font-serif italic leading-relaxed drop-shadow-md">
            "Que o conhecimento aqui contido seja sua espada e seu escudo contra a Tormenta que avança sobre o mundo."
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/forja" className="group relative px-10 py-4 bg-[#8B0000] text-[#E8DCC4] font-display font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#A60000] hover:shadow-[0_0_30px_rgba(139,0,0,0.6)] rounded-sm active:scale-95">
              <span>Iniciar Jornada</span>
              <div className="absolute -inset-1 border border-[#A6894A]/30 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <button className="px-10 py-4 bg-transparent border border-[#A6894A]/40 text-[#A6894A] font-display font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#A6894A]/10 hover:border-[#A6894A]">
              Anais do Mundo
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 hidden lg:block opacity-20">
          <span className="material-symbols-outlined text-8xl text-[#A6894A] rotate-[-15deg]">menu_book</span>
        </div>
        <div className="absolute top-10 right-10 hidden lg:block opacity-20">
          <span className="material-symbols-outlined text-8xl text-[#A6894A] rotate-[15deg]">shield</span>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="p-6 md:p-12 lg:p-20 space-y-24 max-w-8xl mx-auto">
        
        {/* Modules Section */}
        <section>
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#E8DCC4] uppercase tracking-[0.2em] mb-4">Módulos de Campanha</h2>
            <div className="flex items-center gap-4 w-64">
              <div className="h-px bg-gradient-to-r from-transparent to-[#A6894A] flex-1" />
              <div className="rotate-45 size-2 bg-[#8B0000] border border-[#A6894A]" />
              <div className="h-px bg-gradient-to-l from-transparent to-[#A6894A] flex-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {modules.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="group relative h-[380px] flex flex-col rounded-sm overflow-hidden border border-[#A6894A]/20 transition-all hover:border-[#A6894A] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-40 grayscale group-hover:grayscale-0"
                  style={{ backgroundImage: `url('${mod.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0202] via-[#0D0202]/60 to-transparent" />
                
                <div className="mt-auto p-6 relative z-10">
                  <div className="size-10 rounded-sm bg-[#0D0202]/80 border border-[#A6894A]/40 flex items-center justify-center text-[#A6894A] mb-4 group-hover:border-[#8B0000] group-hover:text-[#E8DCC4] transition-all">
                    <span className="material-symbols-outlined text-xl">{mod.icon}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#E8DCC4] mb-2 group-hover:text-[#8B0000] transition-colors uppercase tracking-tight">{mod.title}</h3>
                  <p className="text-[11px] font-serif italic text-[#A6894A] group-hover:text-slate-300 transition-colors leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                {/* Decorative Scroll Look */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#A6894A]/10" />
              </Link>
            ))}
          </div>
        </section>

        {/* Highlight Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group overflow-hidden rounded-sm border border-[#A6894A]/30 aspect-video">
             <div className="absolute inset-0 bg-cover bg-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" style={{ backgroundImage: "url('/assets/generated/monster_aharadak.png')" }} />
             <div className="absolute inset-0 bg-gradient-to-r from-[#0D0202] to-transparent" />
             <div className="relative h-full p-10 flex flex-col justify-center">
                <span className="text-[#8B0000] font-display font-bold text-xs uppercase tracking-[0.3em] mb-2">Ameaça Suprema</span>
                <h3 className="text-5xl font-display font-bold text-[#E8DCC4] uppercase mb-4 tracking-tighter">Aharadak</h3>
                <p className="text-[#A6894A] font-serif italic text-lg max-w-md mb-8">"O Deus da Corrupção. A Tormenta não é um desastre natural, é uma vontade nefasta que consome a realidade."</p>
                <Link href="/monstros" className="w-fit px-8 py-3 border border-[#8B0000] text-[#8B0000] font-display font-bold text-xs uppercase tracking-widest hover:bg-[#8B0000] hover:text-[#E8DCC4] transition-all">
                  Consultar Bestiário
                </Link>
             </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl text-[#8B0000]">history_edu</span>
                <h2 className="text-3xl font-display font-bold text-[#E8DCC4] uppercase tracking-widest">Crônicas de Arton</h2>
             </div>
             
             <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-6 p-6 bg-white/[0.02] border border-[#A6894A]/10 hover:border-[#A6894A]/40 transition-all group">
                     <div className="size-20 bg-[#0D0202] border border-[#A6894A]/20 flex-shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-[#A6894A]/40 group-hover:text-[#8B0000] transition-colors">{i === 1 ? "swords" : "magic_button"}</span>
                     </div>
                     <div>
                        <h4 className="text-xl font-display font-bold text-[#E8DCC4] uppercase mb-1 group-hover:text-[#8B0000] transition-colors">
                          {i === 1 ? "Novas Regras: Ambientes Hostis" : "O Despertar da Magia Selvagem"}
                        </h4>
                        <p className="text-xs text-[#A6894A] font-serif italic line-clamp-2">Descubra como sobreviver aos ambientes mais hostis de Arton com o novo guia oficial da Jambô Editora.</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#A6894A]/20 bg-[#050101] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
             <img src="/logo-natro.png" className="w-32 opacity-40 grayscale mb-4" alt="Natro" />
             <p className="text-[10px] font-display text-[#A6894A]/40 uppercase tracking-[0.4em]">© 2026 Natro • Sistema Tormenta 20</p>
          </div>
          <div className="flex gap-8 text-[10px] font-display font-bold uppercase tracking-widest text-[#A6894A]/60">
             <a href="#" className="hover:text-[#8B0000] transition-colors">Sobre</a>
             <a href="#" className="hover:text-[#8B0000] transition-colors">Discord</a>
             <a href="#" className="hover:text-[#8B0000] transition-colors">Apoie</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

