import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Box, Disc, Layers } from 'lucide-react';

interface DigitalCollectiblesSectionProps {
  onExploreNFT: () => void;
}

export const DigitalCollectiblesSection: React.FC<DigitalCollectiblesSectionProps> = ({
  onExploreNFT,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isGlitching, setIsGlitching] = useState(false);

  const avatars = [
    {
      id: 0,
      name: 'NEO-01 // CYBER HOODIE',
      unit: 'UNIT #0077',
      edition: 'EDITION 1 OF 150',
      img: '/src/assets/images/litus_digital_collectible_avatar_1792170433151.jpg',
      quote: 'I don’t crash the system. I show its truth.',
      specs: 'ERC-721 Digital Twin · NFC Paired',
      rarity: 'MYTHIC ARCHIVE',
      meta: 'METAVERSE RIGGED & READY',
    },
    {
      id: 1,
      name: 'VIBRAM-RUNNER // 3D ASSET',
      unit: 'UNIT #0088',
      edition: 'EDITION 1 OF 100',
      img: '/src/assets/images/litus_sculptural_sneakers_1792169497514.jpg',
      quote: 'Wear physical gravity. Hold sovereign digital code.',
      specs: 'Interoperable .GLB Metaverse Asset',
      rarity: 'LEGENDARY RUN',
      meta: 'AR VIRTUAL TRY-ON CERTIFIED',
    },
    {
      id: 2,
      name: 'ATELIER PARKA // BIO-SHELL',
      unit: 'UNIT #0099',
      edition: 'EDITION 1 OF 75',
      img: '/src/assets/images/litus_mannequin_dummy_product_1792169497272.jpg',
      quote: 'Engineered in the atelier, immutable in the vault.',
      specs: 'Zero Carbon Rollup Mint',
      rarity: 'APEX ATELIER',
      meta: 'PHYSICAL GARMENT CLAIMED',
    },
  ];

  const current = avatars[selectedAvatar];

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 400);
  };

  return (
    <section 
      id="collectibles" 
      aria-label="Section 2: Digital Collectibles"
      className="relative w-full min-h-screen bg-gradient-to-br from-[#0c2069] via-[#143cd4] to-[#06113b] text-white overflow-hidden flex flex-col justify-between pt-24 pb-12 select-none border-b border-blue-900/60"
    >
      {/* Dynamic Electric Blue & Cyan Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[400px] bg-blue-600/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Scanline Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '100% 4px' }}
      />

      {/* Top Bar / Manifesto (Reference 2: GLYTCH / TOKYO) */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="max-w-md">
            <p className="text-sm sm:text-base font-light tracking-wide text-white/90 italic">
              “{current.quote}”
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-mono tracking-wider uppercase border border-white/20 text-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>COLLECTIBLE WEARABLES // SS26</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Center Stage with Streetwear Character & Giant Layered Typography */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto py-6 flex items-center justify-center">
        
        {/* Layer 1: Giant Experimental Typography BEHIND Character (Reference 2: TOKYO GLITCH) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 overflow-hidden">
          <div 
            className={`text-[15vw] sm:text-[17vw] font-black tracking-widest text-white/15 font-display uppercase leading-none transform -translate-y-8 transition-transform duration-200 ${
              isGlitching ? 'translate-x-3 skew-x-2 text-cyan-300/30' : ''
            }`}
          >
            TOKYO
          </div>
          <div 
            className={`text-[15vw] sm:text-[17vw] font-black tracking-widest text-white/20 font-display uppercase leading-none transform translate-y-6 transition-transform duration-200 ${
              isGlitching ? '-translate-x-3 -skew-x-2 text-sky-400/40' : ''
            }`}
          >
            LITUS
          </div>

          {/* Elliptical Orbital Trajectory Line around Character */}
          <svg className="absolute w-[980px] h-[360px] pointer-events-none opacity-45 overflow-visible" viewBox="0 0 980 360">
            <ellipse cx="490" cy="180" rx="460" ry="95" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" transform="rotate(-6 490 180)" />
            <circle cx="780" cy="205" r="7" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="780" cy="205" r="5" fill="#ffffff" />
            <circle cx="210" cy="155" r="4" fill="#00f0ff" />
          </svg>
        </div>

        {/* Floating Digital Graphics / Matrix Elements Left & Right */}
        <div className="hidden lg:flex flex-col gap-3 absolute left-12 top-1/2 -translate-y-1/2 z-20 text-[10px] font-mono text-sky-200/80">
          <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 space-y-1">
            <div className="text-white font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>NFC CHIP LINKED</span>
            </div>
            <div className="text-sky-300">0x7F...8A92 (VERIFIED)</div>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 space-y-1">
            <div className="text-white font-bold">SMART CONTRACT</div>
            <div className="text-white/60">ERC-721 PROTOCOL</div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-3 absolute right-12 top-1/2 -translate-y-1/2 z-20 text-[10px] font-mono text-sky-200/80">
          <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-right space-y-1">
            <div className="text-cyan-300 font-bold">{current.rarity}</div>
            <div className="text-white/80">{current.edition}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-right space-y-1">
            <div className="text-white font-bold">METAVERSE ASSET</div>
            <div className="text-sky-300">GLB · FBX · AR READY</div>
          </div>
        </div>

        {/* Layer 2: Central Streetwear Collectible Character */}
        <div className="relative z-20 flex items-center justify-center">
          <div 
            onClick={triggerGlitch}
            className="relative w-64 sm:w-80 md:w-96 max-h-[520px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 group cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/30 hover:scale-[1.02]"
          >
            <img
              src={current.img}
              alt={current.name}
              className={`w-full h-[460px] sm:h-[530px] object-cover object-center transition-all duration-500 ${
                isGlitching ? 'filter hue-rotate-60 invert-[0.1]' : ''
              }`}
              loading="eager"
              referrerPolicy="no-referrer"
            />
            {/* Holographic Cyber Sheen */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06113b]/90 via-transparent to-transparent pointer-events-none" />

            {/* Glowing Corner Accents */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-400/30">
              {current.unit}
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-mono text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {current.rarity}
            </div>

            {/* In-Card Character Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
              <div>
                <div className="text-white font-bold tracking-wider">{current.name}</div>
                <div className="text-cyan-300 text-[10px]">{current.specs}</div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] text-white font-bold border border-white/20">
                INSPECT
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Interactive Area (Reference 2: Bottom-Left Narrative & Character Selector) */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 border-t border-white/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Bottom Left: Collectible Narrative & EXPLORE Button */}
          <div className="max-w-lg space-y-3">
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>// LITUS DIGITAL TWIN — CODED TO ENDURE</span>
            </div>
            <p className="text-xs sm:text-sm text-white/90 font-sans leading-relaxed font-light">
              LITUS bridges physical streetwear craftsmanship with sovereign digital collectibles. Every garment pairs with an on-chain 3D digital twin—ready for avatars, spatial computing, and digital archives.
            </p>
            <div className="pt-1 flex items-center gap-4">
              <button
                onClick={onExploreNFT}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-blue-950 font-bold font-mono text-xs tracking-wider uppercase hover:bg-cyan-100 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20 hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>EXPLORE DIGITAL COLLECTIONS</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Bottom Right: Character Avatar Selector & Collect Action (Reference 2 Bottom-Right) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            {/* Avatar Thumbnails */}
            <div className="flex items-center gap-2.5">
              {avatars.map((av, idx) => (
                <button
                  key={av.id}
                  onClick={() => {
                    setSelectedAvatar(idx);
                    triggerGlitch();
                  }}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedAvatar === idx
                      ? 'border-cyan-400 scale-110 shadow-lg shadow-cyan-400/40 ring-2 ring-cyan-400/30'
                      : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white/60'
                  }`}
                  title={av.name}
                >
                  <img src={av.img} alt={av.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

            {/* Quantity Stepper & Action */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-mono">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 text-white/70 hover:text-white cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-2 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 text-white/70 hover:text-white cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={onExploreNFT}
                className="px-5 py-2.5 rounded-xl bg-cyan-400 text-blue-950 font-bold font-mono text-xs hover:bg-cyan-300 transition-colors cursor-pointer shadow-md"
              >
                Inspect Asset
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
