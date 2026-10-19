import React from 'react';
import { ArrowRight, ShieldCheck, Shirt, Sparkles, Award } from 'lucide-react';
import { LitusLogo } from './LitusLogo';

interface BrandCampaignSectionProps {
  onShopClick: () => void;
}

export const BrandCampaignSection: React.FC<BrandCampaignSectionProps> = ({ onShopClick }) => {
  return (
    <section 
      id="campaign" 
      aria-label="Section 3: LITUS Brand Showcase"
      className="relative w-full min-h-screen bg-[#050508] text-white overflow-hidden flex flex-col justify-between pt-24 pb-12 select-none border-b border-slate-800"
    >
      {/* Dynamic Electric Blue Graphic Accents & Brush Strokes (Reference 3: RAMPAGE) */}
      <div className="absolute top-0 right-0 w-[50vw] h-[60vh] pointer-events-none opacity-90 overflow-hidden">
        <svg viewBox="0 0 650 520" className="w-full h-full">
          <defs>
            <linearGradient id="brushGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="45%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="brushGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Main dynamic bristle paint slash across top right */}
          <path
            d="M 120 0 Q 340 70, 650 30 L 650 190 Q 440 150, 180 230 Q 360 100, 650 130 L 650 260 Q 320 190, 60 70 Z"
            fill="url(#brushGradRight)"
            filter="url(#brushGlow)"
          />
          <path
            d="M 260 30 Q 460 110, 650 90 L 650 160 Q 420 130, 200 60 Z"
            fill="#38bdf8"
            className="opacity-70"
          />
          {/* Streetwear splatter drops */}
          <circle cx="210" cy="90" r="5" fill="#00f0ff" className="opacity-90" />
          <circle cx="160" cy="140" r="3.5" fill="#38bdf8" className="opacity-80" />
          <circle cx="290" cy="180" r="4.5" fill="#2563eb" className="opacity-75" />
          <circle cx="130" cy="210" r="2.5" fill="#00f0ff" className="opacity-60" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-[45vw] h-[50vh] pointer-events-none opacity-85 overflow-hidden">
        <svg viewBox="0 0 520 420" className="w-full h-full">
          <defs>
            <linearGradient id="brushGradLeft" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="60%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* Textured energetic paint stroke along bottom left */}
          <path
            d="M 0 400 Q 190 290, 500 350 L 440 420 Q 170 370, 0 420 Z"
            fill="url(#brushGradLeft)"
          />
          <path
            d="M 0 330 Q 240 230, 400 280 L 330 330 Q 150 280, 0 380 Z"
            fill="#2563eb"
            className="opacity-75"
          />
          {/* Splatter particles */}
          <circle cx="340" cy="240" r="4" fill="#00f0ff" className="opacity-80" />
          <circle cx="420" cy="290" r="5.5" fill="#38bdf8" className="opacity-70" />
          <circle cx="260" cy="200" r="3" fill="#60a5fa" className="opacity-60" />
        </svg>
      </div>

      {/* Main Campaign Stage: Logo + Typography on Left, Confident Model Wearing LITUS Shirt on Right */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Prominent LITUS Logo, Arched Varsity Lockup, Headline, Badges */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* The LITUS Logo Displayed Prominently with Sub-label */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-neutral-900/90 border border-sky-500/40 shadow-lg shadow-sky-500/20 backdrop-blur-md">
                <LitusLogo size="lg" showWordmark={false} />
              </div>
              <div>
                <div className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                  OFFICIAL LITUS ATELIER // SS26
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  LIT AS FIRE · US AS COMMUNITY
                </div>
              </div>
            </div>

            {/* Arched Varsity LITUS Typography with Script Overlay (Exact Reference 3 Match) */}
            <div className="relative inline-block w-full max-w-xl">
              {/* Giant Arched Varsity Brand Name */}
              <div 
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white font-display uppercase leading-none select-none drop-shadow-[0_12px_36px_rgba(0,0,0,0.95)]"
                style={{
                  WebkitTextStroke: '2.5px rgba(255, 255, 255, 0.95)',
                  color: 'transparent',
                }}
              >
                LITUS
              </div>

              {/* Electric Cyan Script Overlay: "established twenty-six" */}
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none transform -rotate-5 pl-4">
                <span 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-cyan-300 font-bold drop-shadow-[0_0_24px_rgba(0,240,255,0.9)] tracking-wider"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  established twenty-six
                </span>
              </div>
            </div>

            {/* Campaign Headline: "BOLD ROOTS. RELENTLESS FUTURE." */}
            <div className="space-y-2.5">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
                BOLD ROOTS.
                <br />
                <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(37,99,235,0.8)]">
                  RELENTLESS FUTURE.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 font-light max-w-lg leading-relaxed">
                Premium streetwear built for those who lead. Every garment tailored from 300GSM organic heavyweight fibers with closed-loop engineering and lifetime circular warranty.
              </p>
            </div>

            {/* Prominent Blue SHOP LITUS Button */}
            <div className="pt-1">
              <button
                onClick={onShopClick}
                className="inline-flex items-center gap-3.5 px-9 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all shadow-xl shadow-blue-600/40 hover:shadow-blue-500/70 hover:-translate-y-0.5 cursor-pointer electric-glow"
              >
                <span>SHOP LITUS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Three Value Feature Badges (Exact Reference 3 Icons: Premium Quality, Modern Fit, Built to Last) */}
            <div className="pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono">
              <div className="flex items-center gap-3 text-neutral-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">PREMIUM QUALITY</div>
                  <div className="text-[10px] text-neutral-400">100% GOTS COTTON</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">MODERN FIT</div>
                  <div className="text-[10px] text-neutral-400">BOXY ATELIER DRAPE</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">BUILT TO LAST</div>
                  <div className="text-[10px] text-neutral-400">LIFETIME CIRCULAR GUARANTEE</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Confident Streetwear Model Wearing LITUS Shirt */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-[#0a0f1d] group">
              <img
                src="/src/assets/images/litus_rampage_model_shirt_1792170433026.jpg"
                alt="Confident Model wearing LITUS Shirt"
                className="w-full h-[520px] sm:h-[600px] object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
              />

              {/* Edge Gradient Lighting */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

              {/* Floating Verified Brand Tag */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/40 text-[10px] font-mono text-sky-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>AUTHENTIC LITUS SHIRT</span>
              </div>

              {/* Shirt Label Tag */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-mono bg-black/70 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div>
                  <div className="font-bold text-white">THE ARCHIVE CORE TEE</div>
                  <div className="text-cyan-400 text-[10px]">300GSM COMBED HEAVYWEIGHT</div>
                </div>
                <button
                  onClick={onShopClick}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  View Garment
                </button>
              </div>
            </div>

            {/* Glowing cyan backlight under the model container */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 via-sky-500/10 to-transparent rounded-3xl -z-10 blur-xl" />
          </div>

        </div>
      </div>

      {/* Bottom Footer Accent Strip */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
        <span>COLLECTION 01 // AVAILABLE NOW WORLDWIDE</span>
        <div className="flex items-center gap-2 text-sky-400">
          <LitusLogo size="sm" showWordmark={false} />
          <span className="font-bold">LITUS ARCHIVE SS26</span>
        </div>
      </div>
    </section>
  );
};
