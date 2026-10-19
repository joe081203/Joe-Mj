import React, { useState } from 'react';
import { 
  Sparkles, 
  Recycle, 
  ArrowUpRight,
  Droplets,
  Layers,
  Sun,
  Shield,
  Feather,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface StorySectionProps {
  onExploreClick: () => void;
}

type LotusDimension = 'effect' | 'purity' | 'fiber' | 'eternity';

export const StorySection: React.FC<StorySectionProps> = ({ onExploreClick }) => {
  const [activeDimension, setActiveDimension] = useState<LotusDimension>('effect');

  const lotusDimensions: {
    key: LotusDimension;
    title: string;
    subtitle: string;
    latinName: string;
    description: string;
    scienceQuote: string;
    metrics: { value: string; label: string }[];
    bullets: string[];
    bgAccent: string;
  }[] = [
    {
      key: 'effect',
      title: 'The Lotus Effect (Superhydrophobia)',
      subtitle: 'Biomimetic Weather Armor Without PFC Toxins',
      latinName: 'Nelumbo Nucifera // Nanostructure Papillae',
      description: 
        'On the surface of a lotus leaf, microscopic epidermal papillae create a contact angle exceeding 160°. Raindrops bead into perfect spheres, rolling across the leaf and gathering dirt particles with zero toxic residue. LITUS models this biological perfection in our outerwear: zero fluorochemicals (PFC/PFAS-free), self-cleaning water repellency, and zero runoff into freshwater rivers.',
      scienceQuote: 
        '“Nature engineered supreme weather protection millions of years before synthetic fluoropolymers existed.”',
      metrics: [
        { value: '162°', label: 'Water Contact Angle' },
        { value: '0.0%', label: 'Fluorocarbon / PFC' },
        { value: '20,000mm', label: 'Hydrostatic Shield' },
      ],
      bullets: [
        'Biomimetic nanostructured weaves replicate microscopic lotus epidermal wax crystals',
        'Raindrops roll off freely without requiring toxic persistent forever chemicals',
        'Laser-welded bonded seams eliminate needle punctures and seam-tape degradation',
      ],
      bgAccent: 'from-sky-500/20 via-blue-600/10 to-transparent',
    },
    {
      key: 'purity',
      title: 'Rising Unsullied From Silt',
      subtitle: 'The Manifesto Against Fast Fashion Murk',
      latinName: 'Radical Supply Chain Transparency',
      description: 
        'Rooted in murky sediment, the lotus rises through deep waters to unfurl its petals at dawn—completely pristine, without a speck of mud clinging to its form. In an industry defined by opaque sweatshops and disposable polyester, LITUS blooms with uncompromised ethics. Every cotton ball, dye vat, and artisan signature is logged with cryptographic provenance.',
      scienceQuote: 
        '“Just as the lotus emerges unsullied from the silt, conscious design rises untouched by the ephemeral rush of disposable fashion.”',
      metrics: [
        { value: '100%', label: 'GOTS & Supima Traceable' },
        { value: '42 Liters', label: 'Water Saved per Shirt' },
        { value: 'Fair-Trade', label: 'Certified Artisan Mills' },
      ],
      bullets: [
        'Single-origin organic Supima cotton grown with zero synthetic pesticide runoff',
        'Natural indigo, cold-reactive low-impact bio-dyes free from heavy metal mordants',
        'On-chain encrypted authenticity passport bound to physical NFC hardware chips',
      ],
      bgAccent: 'from-teal-500/20 via-emerald-600/10 to-transparent',
    },
    {
      key: 'fiber',
      title: 'Sacred Lotus Stem Microfiber',
      subtitle: 'Ancient Handloom Wisdom Meets Technical Streetwear',
      latinName: 'Botanical Fiber Alchemy',
      description: 
        'For centuries, Southeast Asian and Indian artisans extracted fine filaments from the stems of lotus flowers to weave rare sacred robes. LITUS synthesizes this heritage with contemporary high-density circular knitting. By blending harvested lotus microfibers with organic bamboo lyocell and recycled Econyl, we produce a fabric that breathes like silk while offering the durability of technical cordura.',
      scienceQuote: 
        '“An organic drape so light it floats on air, yet engineered to endure a lifetime of daily architectural wear.”',
      metrics: [
        { value: '300 GSM', label: 'Substantial Drape' },
        { value: '100%', label: 'Biodegradable Inks' },
        { value: 'Zero Cut', label: 'Algorithmic Origami' },
      ],
      bullets: [
        'Featherlight micro-porous fibers regulate skin temperature across all climates',
        'Hypoallergenic and naturally antibacterial due to innate lotus botanical compounds',
        'Computational origami pattern-making ensures zero wasted fabric remnants',
      ],
      bgAccent: 'from-purple-500/20 via-indigo-600/10 to-transparent',
    },
    {
      key: 'eternity',
      title: 'The 1,300-Year Dormant Seed',
      subtitle: 'Perpetual Circular Return & Regeneration',
      latinName: 'Nelumbo Longevity & Circular Takeback',
      description: 
        'Botanists in China recovered Nelumbo nucifera lotus seeds buried in ancient dry lake beds for over 1,300 years—and they germinated into healthy blossoms. Longevity is the truest form of sustainability. LITUS rejects planned obsolescence. Every garment is crafted to last decades, and backed by our perpetual 30% Circular Return Program.',
      scienceQuote: 
        '“True sustainability is not consuming slightly greener disposable clothes; it is wearing armor that refuses to die.”',
      metrics: [
        { value: '1,300 Yrs', label: 'Lotus Seed Longevity' },
        { value: '30%', label: 'Lifetime Return Credit' },
        { value: 'Zero Waste', label: 'Circular Fiber Takeback' },
      ],
      bullets: [
        'Return any worn LITUS garment anytime for 30% store credit toward future drops',
        'Post-consumer returned garments are mechanically broken down into fresh fiber blends',
        'Every customer joins an enduring guild of planetary guardians',
      ],
      bgAccent: 'from-amber-500/20 via-sky-600/10 to-transparent',
    },
  ];

  const currentDim = lotusDimensions.find(d => d.key === activeDimension) || lotusDimensions[0];

  return (
    <section id="story" className="relative py-28 bg-[#050811] text-white overflow-hidden border-t border-slate-800/80">
      {/* Background Sacred Lotus Geometry & Water Wave Flourishes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <svg 
          viewBox="0 0 1200 800" 
          className="absolute -right-64 -top-32 w-[900px] h-[900px] text-sky-500/15"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.2"
        >
          {/* Sacred Lotus Petal Concentric Geometry */}
          <circle cx="600" cy="400" r="120" strokeDasharray="4 6" />
          <circle cx="600" cy="400" r="220" strokeDasharray="6 8" />
          <circle cx="600" cy="400" r="340" strokeDasharray="8 12" />
          <path d="M600 180 C540 280, 540 380, 600 400 C660 380, 660 280, 600 180 Z" />
          <path d="M600 620 C540 520, 540 420, 600 400 C660 420, 660 520, 600 620 Z" />
          <path d="M380 400 C480 340, 580 340, 600 400 C580 460, 480 460, 380 400 Z" />
          <path d="M820 400 C720 340, 620 340, 600 400 C620 460, 720 460, 820 400 Z" />
          <path d="M440 240 C520 310, 580 370, 600 400 C570 420, 480 350, 440 240 Z" />
          <path d="M760 240 C680 310, 620 370, 600 400 C630 420, 720 350, 760 240 Z" />
          <path d="M440 560 C520 490, 580 430, 600 400 C570 380, 480 450, 440 560 Z" />
          <path d="M760 560 C680 490, 620 430, 600 400 C630 380, 720 450, 760 560 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker & Main Headline */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-400/30 text-sky-400 text-xs font-mono uppercase tracking-[0.25em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>The Lotus Philosophy & Craft // Nelumbo Nucifera</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-[1.08]">
            Born in Murk.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-teal-300">
              Blossoming in Pure Radiance.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            The lotus is Earth’s supreme teacher of resilience. Rooted in anaerobic river silt, it rises through dark water to unfold petals of immaculate cleanliness. LITUS was founded on this singular botanical principle: creating architectural armor that elevates human form without leaving a trace of industrial pollution.
          </p>
        </div>

        {/* INTERACTIVE LOTUS PETAL ARCHITECTURE SELECTOR */}
        <div className="mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lotusDimensions.map((dim) => {
              const isActive = activeDimension === dim.key;
              return (
                <button
                  key={dim.key}
                  onClick={() => setActiveDimension(dim.key)}
                  className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-sky-950/80 to-[#0e1628] border-sky-400 shadow-xl shadow-sky-500/10'
                      : 'bg-[#090e1a]/80 border-slate-800 hover:border-slate-700 hover:bg-[#0c1322]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono tracking-widest uppercase ${isActive ? 'text-sky-400 font-bold' : 'text-slate-500'}`}>
                        Petal {dim.key === 'effect' ? '01' : dim.key === 'purity' ? '02' : dim.key === 'fiber' ? '03' : '04'}
                      </span>
                      {dim.key === 'effect' && <Droplets className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-600'}`} />}
                      {dim.key === 'purity' && <Sun className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-600'}`} />}
                      {dim.key === 'fiber' && <Feather className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-600'}`} />}
                      {dim.key === 'eternity' && <Recycle className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-600'}`} />}
                    </div>
                    <h3 className={`text-sm sm:text-base font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {dim.title.split(' (')[0]}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 mt-2 block truncate">
                    {dim.subtitle}
                  </span>

                  {isActive && (
                    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-1 bg-sky-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE LOTUS DIMENSION DETAIL CARD */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1426] to-[#070b14] border border-slate-800 p-6 sm:p-10 mb-20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono tracking-widest text-sky-400 uppercase">
                  {currentDim.latinName}
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {currentDim.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                  {currentDim.description}
                </p>
              </div>

              {/* Quote Block */}
              <div className="p-4 rounded-xl bg-slate-900/70 border-l-2 border-sky-400 italic text-xs sm:text-sm text-sky-200/90 font-light">
                {currentDim.scienceQuote}
              </div>

              {/* Bullet Points */}
              <div className="space-y-2.5 pt-2">
                {currentDim.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 font-mono">
                {currentDim.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-xl sm:text-3xl font-extrabold text-sky-400">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Image & Botanical Motif */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src={
                    activeDimension === 'effect'
                      ? '/src/assets/images/litus_technical_overshirt_1792166677796.jpg'
                      : activeDimension === 'purity'
                      ? '/src/assets/images/litus_lotus_sustainability_1792166656259.jpg'
                      : activeDimension === 'fiber'
                      ? '/src/assets/images/litus_oversized_tee_1792166677289.jpg'
                      : '/src/assets/images/litus_hero_streetwear_1792166656226.jpg'
                  }
                  alt={currentDim.title}
                  className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
                    Lotus Atelier Archives // SS26
                  </span>
                  <h4 className="text-lg font-bold mt-1 text-white">{currentDim.subtitle}</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Verified zero-waste craftsmanship tagged with on-chain cryptographic passport.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LOGO DECONSTRUCTION: THE SYNTHESIS OF FLAME & LOTUS PETAL */}
        <div id="craftsmanship" className="pt-8 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase">
              Brand Identity Synthesis
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white mt-1.5">
              The Sacred Meaning of <span className="text-sky-400">LIT</span><span className="text-white">US</span>
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              The transformative flame of personal purpose nurtured inside the sacred lotus petal of community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LIT */}
            <div className="p-8 rounded-2xl bg-[#090e1a] border border-slate-800 hover:border-sky-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6 text-sky-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
                  Part I // The Fire
                </span>
                <span className="text-sm font-bold font-mono text-sky-400">“LIT”</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-2">
                Inner Fire & Enlightenment
              </h4>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-light">
                “LIT” represents primordial fire: the spark of conscious awakeness, the refusal to settle for disposable synthetic trends, and the fire of total transparency across our atelier supply chain.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                Visual Emblem: The ascending cyan flame core
              </div>
            </div>

            {/* US */}
            <div className="p-8 rounded-2xl bg-[#090e1a] border border-slate-800 hover:border-teal-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-400/10 text-teal-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6 text-teal-300" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-teal-400">
                  Part II // The Petal
                </span>
                <span className="text-sm font-bold font-mono text-white">“US”</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-2">
                Collective Lotus Petals & Earth
              </h4>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-light">
                “US” embodies the protective blooming petal: embracing our weavers, organic farmers, and the living ecosystem. Individual fire requires collective shelter to endure and blossom.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                Visual Emblem: The embracing circular lotus petal
              </div>
            </div>

            {/* LITUS */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-[#0c1628] to-[#090e1a] border border-sky-400/40 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-sky-300" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
                  Synthesis // The Union
                </span>
                <span className="text-sm font-bold font-mono text-sky-400">“LITUS”</span>
              </div>
              <h4 className="text-xl font-bold text-white mt-2">
                Fire Sheltered in the Lotus
              </h4>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-light">
                When individual spark is sheltered within the sacred lotus of mindful community, architectural clothing transcends fashion to become a living legacy of regenerative human dignity.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                The Lotus & Flame: Eternal purity in motion
              </div>
            </div>

          </div>

          {/* Guarantee Callout Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <Recycle className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <span className="font-semibold text-white">Lotus Circular Guarantee:</span> Return any worn LITUS garment anytime for 30% credit toward new editions. 100% of the fiber is spun into next-generation yarns.
              </p>
            </div>

            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>Explore Wardrobe & Combos</span>
              <ArrowUpRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
