import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Eye, 
  Check,
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
  const [addedId, setAddedId] = useState<string | null>(null);

  // Filter products marked as new releases or combos
  const newReleases = products.filter(p => p.isNewRelease || p.category === 'combos').slice(0, 4);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'One Size';
    onAddToCart(product, defaultSize);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="relative z-20 pt-10 sm:pt-16 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
