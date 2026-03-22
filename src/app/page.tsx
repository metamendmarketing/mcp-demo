import Wizard from "@/components/wizard/Wizard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#1e293b] font-sans">
      {/* Official Marquis Header */}
      <header className="w-full bg-[#181818] py-4 border-b border-white/5 sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-8 group cursor-pointer">
             <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-500" />
             <div className="hidden lg:flex flex-col text-[9px] uppercase font-black tracking-[0.2em] text-white/50 border-l border-white/20 pl-8 h-10 justify-center leading-tight">
               <span>The Ultimate</span>
               <span>Hot Tub</span>
               <span>Experience®</span>
             </div>
          </div>
          
          <nav className="hidden xl:flex items-center gap-12 text-[11px] uppercase font-black tracking-[0.1em] text-white">
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Hot<br/>Tubs</span>
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Swim<br/>Spas</span>
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Options &<br/>Accessories</span>
            <span className="hover:text-marquis-green cursor-pointer transition-colors tracking-[0.2em] ml-8">Dealers</span>
            <span className="hover:text-marquis-green cursor-pointer transition-colors flex items-center gap-2">Menu <span className="text-lg leading-none">☰</span></span>
          </nav>

          <div className="flex gap-4">
            <button className="bg-[#88a65e] px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white hover:brightness-110 active:scale-95 transition-all leading-tight text-center">
              Find<br/>Dealer
            </button>
          </div>
        </div>
      </header>
      
      {/* Subheader / Breadcrumbs */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex gap-3 overflow-x-auto whitespace-nowrap italic">
          <Link href="/" className="hover:text-marquis-blue cursor-pointer transition-colors">Home</Link> <span className="text-slate-300">/</span>
          <Link href="/products" className="hover:text-marquis-blue cursor-pointer transition-colors">Products</Link> <span className="text-slate-300">/</span>
          <span className="text-marquis-blue font-black underline decoration-marquis-blue/30 decoration-2 underline-offset-4">Buying Assistant</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
           {/* Primary Content Area */}
           <Wizard />
        </div>
      </div>

      {/* Corporate Footer */}
      <footer className="w-full bg-[#0a0a0a] py-12 mt-10 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
          <div className="col-span-2">
            <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 mb-8 opacity-80" />
            <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-sm italic">
              Marquis® is an employee-owned company that manufactures extraordinary hot tubs and swim spas in Nevada, USA. 
              Meticulous refinement and obsessive attention to detail for the ultimate hydration experience.
            </p>
          </div>
          <div>
             <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10 italic">Digital Connection</h4>
             <div className="flex flex-col gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                <span className="hover:text-white cursor-pointer transition-colors">Facebook Protocol</span>
                <span className="hover:text-white cursor-pointer transition-colors">Instagram Insights</span>
             </div>
          </div>
          <div>
             <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10 italic">Ownership Care</h4>
             <ul className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black space-y-5">
                <li className="hover:text-white cursor-pointer transition-colors">Warranty & Registration</li>
                <li className="hover:text-white cursor-pointer transition-colors">Operations Manuals</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Engineering</li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">
          <span>© 2024 Marquis Spas. All Rights Reserved.</span>
          <span>Crafted in Nevada, USA</span>
        </div>
      </footer>
    </main>
  );
}
