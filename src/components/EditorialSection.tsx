import React from 'react';
import { ArrowRight, ShieldCheck, Box, Layers, Sparkles } from 'lucide-react';

interface EditorialSectionProps {
  onShopClick: () => void;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({ onShopClick }) => {
  return (
    <section 
      id="editorial" 
      aria-label="Section 1: Fashion Editorial"
      className="relative w-full min-h-screen bg-[#07080b] text-neutral-100 overflow-hidden flex flex-col justify-between pt-24 pb-12 select-none border-b border-neutral-800"
    >
      {/* Subtle Digital Grid / Halftone Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      {/* Ambient Dark Spotlight Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Editorial Metadata Bar (Theory .Iron Reference) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="uppercase font-bold text-white tracking-wider">LITUS.THEORY // ISSUE 01</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-neutral-400">
            <span>CADENCE: STRICT LIMITED RUNS</span>
            <span className="text-neutral-600">/</span>
            <span>SPEC: 100% RECYCLED HEAVYWEIGHT</span>
          </div>
          <span className="uppercase text-neutral-300 font-bold">MILAN · TOKYO · 2026</span>
        </div>
      </div>

      {/* Main Editorial Hero Split (Theory .Iron Reference) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Oversized Bold Typography, Introduction, Drop Cards */}
          <div className="lg:col-span-7 space-y-7">
            {/* Giant Monolithic Editorial Wordmark */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                [ ARCHIVE // ATELIER DROP 01 ]
              </div>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white font-display leading-[0.88] uppercase">
                LITUS
                <br />
                <span className="text-neutral-400 tracking-tight">.THEORY</span>
              </h1>
            </div>

            {/* Brand Manifesto & Short Introduction */}
            <div className="max-w-xl space-y-2.5">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
                LITUS IS AN INDEPENDENT STREETWEAR ARCHIVE CRAFTED FOR THE OUTSIDERS.
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                Not just clothing. A raw collective of subcultures, monochrome aesthetics, and architectural precision. Engineered in Milan and Tokyo for those who lead in the shadows and define tomorrow.
              </p>
            </div>

            {/* Prominent Editorial SHOP NOW Button */}
            <div className="pt-2">
              <button
                onClick={onShopClick}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg shadow-white/10 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </button>
            </div>

            {/* Drop 01 // City Armor Layout Cards (Exact Theory .Iron Match) */}
            <div className="pt-4 border-t border-neutral-800/80">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  DROP 01 // CITY ARMOR [INCOMING]
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg">
                <div className="p-3.5 bg-neutral-900/90 rounded-xl border border-neutral-800 space-y-1.5 backdrop-blur-sm hover:border-neutral-700 transition-colors">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
                    <span>[ AVAILABILITY & ARCHIVE ]</span>
                    <span className="text-sky-400 font-bold">150 PCS</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug font-sans">
                    Strict quantities. 100% closed-loop fibers. Once claimed, zero restocks. Archived forever in our ledger.
                  </p>
                </div>

                <div className="p-3.5 bg-neutral-900/90 rounded-xl border border-neutral-800 space-y-1.5 backdrop-blur-sm hover:border-neutral-700 transition-colors">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
                    <span>[ CADENCE & STRUCTURE ]</span>
                    <span className="text-white font-bold">SS26</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug font-sans">
                    5-piece technical wave: bonded trench coats, 300GSM core tees, pleated cargo trousers, and Vibram runners.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dramatic Streetwear Model Photography with Layered Editorial Texture */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 group">
              <img
                src="/src/assets/images/litus_editorial_monochrome_1792170430996.jpg"
                alt="LITUS Dramatic Streetwear Editorial Model"
                className="w-full h-[520px] sm:h-[580px] object-cover object-top filter grayscale contrast-115 group-hover:scale-103 transition-transform duration-700 ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
              />

              {/* Monochrome Scrim & Layered Digital Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />

              {/* Floating Editorial Architectural Markers */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-white/70 tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                FRAME // 001-A
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-white/70 tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                [ + 45° 27′ N, 9° 11′ E ]
              </div>

              {/* Editorial Model Caption */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white font-mono text-[11px]">
                <div>
                  <div className="font-bold tracking-wider text-white">LOOK 01 // OVERSIZED CLOAK</div>
                  <div className="text-neutral-400 text-[10px]">WATERPROOF BONDED COTTON</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md text-[10px] text-white font-bold border border-white/20">
                  SS26 ARCHIVE
                </div>
              </div>
            </div>

            {/* Subtle decorative shadow card underneath */}
            <div className="absolute -inset-2 bg-gradient-to-r from-neutral-800/20 to-transparent rounded-3xl -z-10 blur-xl" />
          </div>

        </div>
      </div>

      {/* Bottom Editorial Lineup Strip (Reference 1 Bottom Section) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 border-t border-neutral-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-mono font-bold tracking-widest text-neutral-300 uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
            <span>[ DROP 01 — CITY ARMOR // RELEASING WORLDWIDE ]</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-mono text-neutral-400">
            <span className="text-neutral-300 font-semibold">W01 — UNLOCKED</span>
            <span>·</span>
            <span className="text-neutral-300 font-semibold">W02 — UNLOCKED</span>
            <span>·</span>
            <span className="text-white font-bold bg-neutral-800 px-2.5 py-0.5 rounded border border-neutral-700">
              W03 — NEXT UP [23:14:00]
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
