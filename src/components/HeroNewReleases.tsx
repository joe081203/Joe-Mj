import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Eye, 
  Tag, 
  Flame, 
  Percent, 
  ShieldCheck, 
  RefreshCw, 
  Check,
  Zap,
  Layers
} from 'lucide-react';

interface HeroNewReleasesProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onViewCombos: () => void;
}

export const HeroNewReleases: React.FC<HeroNewReleasesProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onViewCombos,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Filter products marked as new releases or combos
  const newReleases = products.filter(p => p.isNewRelease || p.category === 'combos').slice(0, 4);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'One Size';
    onAddToCart(product, defaultSize);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="relative z-20 -mt-10 sm:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dynamic Offers & Atelier Perks Strip */}
      <div className="bg-[#0b1120]/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl p-4 sm:p-6 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-600/30 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0 shadow-lg">
              <Zap className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400 font-bold">
                  Exclusive Atelier Perks // SS26
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-400/20">
                  Active
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Curated Combo Savings & Lotus Launch Privilege
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Promo Code Box */}
            <div 
              onClick={() => handleCopyCode('LOTUS20')}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-sky-400/50 cursor-pointer transition-all"
              title="Click to copy voucher code"
            >
              <Tag className="w-3.5 h-3.5 text-sky-400" />
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-400 block leading-none">Code: $20 OFF &gt; $150</span>
                <span className="text-xs font-bold text-white group-hover:text-sky-300">LOTUS20</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 ml-1">
                {copiedCode ? 'Copied!' : 'Copy'}
              </span>
            </div>

            <button
              onClick={onViewCombos}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg hover:shadow-sky-500/20 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-950" />
              <span>Explore Combos (Save up to $85)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/40">
            <Percent className="w-4 h-4 text-sky-400 shrink-0" />
            <p className="text-slate-300">
              <span className="font-semibold text-white">Bundle Privilege:</span> Up to 20% discount baked into head-to-toe combo sets.
            </p>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/40">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <p className="text-slate-300">
              <span className="font-semibold text-white">Web3 Digital Twin:</span> Free encrypted Polygon collectible with core releases.
            </p>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/40">
            <RefreshCw className="w-4 h-4 text-sky-400 shrink-0" />
            <p className="text-slate-300">
              <span className="font-semibold text-white">Circular Take-Back:</span> 30% lifetime credit upon return for zero-waste recycling.
            </p>
          </div>
        </div>
      </div>

      {/* NEW RELEASES SPOTLIGHT */}
      <div className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-sky-400 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Drop 04 // Just Released</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
              New Releases & Signature Combos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Freshly engineered silhouettes embodying the lotus aesthetic: zero-waste origami tailoring and curated wardrobe bundles.
            </p>
          </div>

          <button
            onClick={onViewCombos}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-500 hover:text-sky-400 cursor-pointer self-start sm:self-auto font-mono group"
          >
            <span>View All Curated Sets</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cards Grid with Clean Minimalist Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newReleases.map((product) => {
            const isAdded = addedId === product.id;
            const isCombo = product.category === 'combos';

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative flex flex-col bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/90 rounded-2xl overflow-hidden hover:border-sky-400/60 transition-all duration-300 hover:shadow-2xl cursor-pointer"
              >
                {/* Visual Area */}
                <div className="relative aspect-4/5 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest font-bold bg-slate-950/80 text-white border border-white/10 backdrop-blur-md">
                      {isCombo ? 'Curated Combo' : 'New Release'}
                    </span>
                    {product.comboSavingsUSD && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                        Save ${product.comboSavingsUSD}
                      </span>
                    )}
                  </div>

                  {/* Subtle Hover Action Layer */}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="p-2.5 rounded-full bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-md transition-transform hover:scale-110 cursor-pointer font-bold"
                      title="Quick Add to Bag"
                    >
                      {isAdded ? <Check className="w-4 h-4 text-slate-950" /> : <ShoppingBag className="w-4 h-4 text-slate-950" />}
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="uppercase text-sky-400 font-semibold">{product.category}</span>
                      <span>{product.sizes.join(' · ')}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs font-mono text-slate-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 block truncate max-w-[130px]">
                        {product.sustainabilityNote}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add +</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
