import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, ProductCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  SlidersHorizontal,
  Check,
  ShieldCheck,
  Briefcase,
  Grid3X3,
  LayoutGrid,
  Columns2,
  Percent,
  Layers,
  Tag,
  ArrowRight
} from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onOpenNFTModal: () => void;
  onOpenAdminManager?: () => void;
  selectedCategory?: ProductCategory;
  onCategoryChange?: (category: ProductCategory) => void;
}

interface ProductCardItemProps {
  product: Product;
  index: number;
  gridCols: 2 | 3 | 4;
  isDistributor: boolean;
  isAdmin: boolean;
  isAdded: boolean;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  onOpenNFTModal: () => void;
}

const ProductCardItem: React.FC<ProductCardItemProps> = ({
  product,
  index,
  gridCols,
  isDistributor,
  isAdmin,
  isAdded,
  onSelectProduct,
  onQuickAdd,
  onOpenNFTModal,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [product.id]);

  const effectivePrice = isDistributor && product.distributorPrice
    ? product.distributorPrice
    : product.price;
  const isCombo = product.category === 'combos';
  const staggerDelay = (index % gridCols) * 75;

  return (
    <div
      ref={cardRef}
      onClick={() => onSelectProduct(product)}
      style={{
        transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
      }}
      className={`group relative flex flex-col bg-white dark:bg-[#090e1a] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden hover:border-slate-900 dark:hover:border-sky-400 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl cursor-pointer will-change-[transform,opacity] ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-[0.97]'
      }`}
    >
      {/* Minimalist Image Canvas */}
      <div className={`relative ${gridCols === 2 ? 'aspect-16/11' : 'aspect-4/5'} w-full bg-slate-100 dark:bg-slate-900 overflow-hidden`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Corner Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-950/85 text-white rounded-md backdrop-blur-md border border-white/10">
              {product.badge}
            </span>
          )}

          {product.isNFTReady && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenNFTModal();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono tracking-wider font-semibold text-sky-400 bg-sky-950/85 border border-sky-400/30 rounded-md backdrop-blur-md hover:bg-sky-900 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Digital Twin</span>
            </button>
          )}

          {/* Admin status tag */}
          {isAdmin && product.isPublished === false && (
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 rounded backdrop-blur-md">
              Draft (Unpublished)
            </span>
          )}
        </div>

        {/* Floating Minimalist Savings Badge */}
        {product.comboSavingsUSD && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 shadow-md">
              -${product.comboSavingsUSD} OFF
            </span>
          </div>
        )}

        {/* Hover Actions: Clean Minimal Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="p-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-transform hover:scale-110 cursor-pointer"
            title="Inspect Product & Recommendations"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => onQuickAdd(product, e)}
            className="p-3 rounded-full bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 shadow-xl transition-transform hover:scale-110 cursor-pointer font-bold"
            title="Quick Add to Bag"
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Card Editorial Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Header line: Category & Color Swatches */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">
              {isCombo ? 'Curated Combo Set' : product.category}
            </span>

            {/* Swatches */}
            <div className="flex items-center gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
            {product.name}
          </h3>

          {/* Combo Included Items List */}
          {product.comboItems && (
            <div className="mt-2 py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                Includes {product.comboItems.length} Pieces:
              </span>
              {product.comboItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 truncate">
                  <span className="w-1 h-1 rounded-full bg-sky-400" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Clean Price & Quick Add Button */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                ${effectivePrice}
              </span>
              {product.originalPrice && !isDistributor && (
                <span className="text-xs font-mono text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {isDistributor && (
                <span className="text-[10px] font-mono text-purple-400 font-bold">
                  B2B
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate max-w-[170px]">
              {product.sustainabilityNote}
            </span>
          </div>

          <button
            onClick={(e) => onQuickAdd(product, e)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 font-mono ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:hover:bg-sky-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
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
};

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onOpenNFTModal,
  onOpenAdminManager,
  selectedCategory: controlledCategory,
  onCategoryChange,
}) => {
  const { isAdmin, isDistributor } = useAuth();
  
  // Internal category state with optional external control
  const [internalCategory, setInternalCategory] = useState<ProductCategory>('recommended');
  const selectedCategory = controlledCategory ?? internalCategory;

  const handleSelectCategory = (cat: ProductCategory) => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'savings'>('featured');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);
  
  // Minimalist Grid View state: 2 (Editorial), 3 (Curated), 4 (Compact)
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);

  const categories: { key: ProductCategory; label: string; count: number; badge?: string }[] = [
    { 
      key: 'recommended', 
      label: 'Recommended', 
      count: products.filter(p => p.isRecommended).length 
    },
    { 
      key: 'combos', 
      label: 'Combos & Sets', 
      count: products.filter(p => p.category === 'combos').length,
      badge: 'Save 20%'
    },
    { 
      key: 'shirts', 
      label: 'Shirts', 
      count: products.filter(p => p.category === 'shirts').length 
    },
    { 
      key: 'tees', 
      label: 'Tees', 
      count: products.filter(p => p.category === 'tees').length 
    },
    { 
      key: 'trousers', 
      label: 'Trousers', 
      count: products.filter(p => p.category === 'trousers').length 
    },
    { 
      key: 'accessories', 
      label: 'Accessories', 
      count: products.filter(p => p.category === 'accessories').length 
    },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (selectedCategory === 'recommended') {
      list = list.filter((p) => p.isRecommended);
    } else {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by offers only if toggled
    if (onlyOffers) {
      list = list.filter((p) => p.originalPrice || p.comboSavingsUSD || p.category === 'combos');
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          (p.comboItems && p.comboItems.some(item => item.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'savings') {
      list.sort((a, b) => {
        const savA = a.comboSavingsUSD || (a.originalPrice ? a.originalPrice - a.price : 0);
        const savB = b.comboSavingsUSD || (b.originalPrice ? b.originalPrice - b.price : 0);
        return savB - savA;
      });
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy, onlyOffers]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'One Size';
    onAddToCart(product, defaultSize);
    setAddedNoticeId(product.id);
    setTimeout(() => {
      setAddedNoticeId((current) => (current === product.id ? null : current));
    }, 1800);
  };

  // Determine grid CSS based on selected view
  const gridClasses = {
    2: 'grid grid-cols-1 md:grid-cols-2 gap-10',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  }[gridCols];

  return (
    <section id="products" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Distributor Wholesale Notice Banner */}
      {isDistributor && (
        <div className="mb-8 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Distributor Tier Active
              </h4>
              <p className="text-xs text-purple-200">
                Exclusive wholesale volume pricing & B2B allocation unlocked for your verified distributor account.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold shrink-0">
            Wholesale B2B
          </span>
        </div>
      )}

      {/* Minimalist Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-blue-600 dark:text-sky-400 uppercase mb-1">
            <span className="w-2 h-px bg-sky-400" />
            <span>Curated Minimalist Wardrobe // SS26</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
            Essential Form & Curated Sets
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-light">
            Algorithmic zero-waste tailoring sculpted from regenerative organic fibers. Explore individual silhouettes or bundled head-to-toe combo editions.
          </p>
        </div>

        {/* Minimal Controls: Search, Sort, Admin Manager */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Private Product Manager Button */}
          {isAdmin && onOpenAdminManager && (
            <button
              onClick={onOpenAdminManager}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              title="Private Product Upload & Inventory Management"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>+ Add / Manage Products</span>
            </button>
          )}

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search garments, combos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 w-44 sm:w-56 font-mono"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer appearance-none font-mono"
            >
              <option value="featured">Sort: Curated</option>
              <option value="savings">Sort: Highest Savings</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & MINIMALIST GRID SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-slate-100 dark:border-slate-800/60">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleSelectCategory(cat.key)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-md'
                    : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive 
                      ? 'bg-sky-500 text-slate-950' 
                      : 'bg-sky-500/15 text-sky-400'
                  }`}>
                    {cat.badge}
                  </span>
                )}
                <span className={`text-[10px] font-mono px-1 rounded ${
                  isActive 
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-slate-950' 
                    : 'text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minimalist Grid Switcher & Special Offers Filter Toggle */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {/* Quick Offers Filter Button */}
          <button
            onClick={() => setOnlyOffers(!onlyOffers)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
              onlyOffers
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-bold'
                : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Offers & Bundles</span>
          </button>

          {/* Minimal Grid Column Switcher (2, 3, 4 cols) */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                gridCols === 2
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Editorial (2-Column Large)"
            >
              <Columns2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                gridCols === 3
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Curated (3-Column Standard)"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                gridCols === 4
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Compact (4-Column Gallery)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SPECIAL COMBO PRIVILEGE HIGHLIGHT BANNER */}
      {selectedCategory === 'combos' && (
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                  Curated Head-To-Toe Combinations
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Save up to $180
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Harmonized Silhouettes with Bundled Savings
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Each combo unites matching organic textiles, coordinated zero-waste cuts, and complimentary Web3 digital twin assets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-mono text-xs text-slate-300">
              <span className="text-sky-400 font-bold block">Free Express Courier</span>
              <span>Complimentary NFC Card</span>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED MINIMALIST PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-base text-slate-500 font-light">
            No garments found matching your current filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleSelectCategory('recommended');
              setOnlyOffers(false);
            }}
            className="mt-4 text-xs font-mono text-blue-600 dark:text-sky-400 underline cursor-pointer"
          >
            Reset filter criteria
          </button>
        </div>
      ) : (
        <div className={`${gridClasses} mt-8`}>
          {filteredProducts.map((product, index) => (
            <ProductCardItem
              key={product.id}
              product={product}
              index={index}
              gridCols={gridCols}
              isDistributor={isDistributor}
              isAdmin={isAdmin}
              isAdded={addedNoticeId === product.id}
              onSelectProduct={onSelectProduct}
              onQuickAdd={handleQuickAdd}
              onOpenNFTModal={onOpenNFTModal}
            />
          ))}
        </div>
      )}
    </section>
  );
};
