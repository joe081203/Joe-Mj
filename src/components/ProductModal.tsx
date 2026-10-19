import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Leaf, 
  RotateCcw,
  Truck,
  Maximize2,
  Minimize2,
  Share2,
  Heart,
  Ruler,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onOpenNFTModal: () => void;
  onOpenCart?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  allProducts = PRODUCTS,
  onSelectProduct,
  onClose,
  onAddToCart,
  onOpenNFTModal,
  onOpenCart,
}) => {
  const { isDistributor } = useAuth();
  
  // View states
  const [isFullScreen, setIsFullScreen] = useState(true); // Full Page Preview by default as requested
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'sustainability' | 'digital-twin' | 'care'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'inches' | 'cm'>('inches');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [recommendationFilter, setRecommendationFilter] = useState<'pairings' | 'similar' | 'trending'>('pairings');
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize options whenever a new product is selected
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedColor(product.colors?.[0]?.name || 'Default');
      setQuantity(1);
      setIsAdded(false);
      setSelectedImageIndex(0);
      setIsZoomed(false);
      
      // Smooth scroll to top of preview when switching products
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [product]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Gallery images generation
  const galleryImages = useMemo(() => {
    if (!product) return [];
    
    const list = [product.image];
    
    // Curated secondary shots based on category
    if (product.category === 'shirts') {
      list.push('/src/assets/images/litus_rampage_model_shirt_1792170433026.jpg');
      list.push('/src/assets/images/litus_product_showcase_1792166656612.jpg');
      list.push('/src/assets/images/litus_lotus_sustainability_1792166656259.jpg');
    } else if (product.category === 'tees') {
      list.push('/src/assets/images/litus_editorial_monochrome_1792170430996.jpg');
      list.push('/src/assets/images/litus_product_showcase_1792166656612.jpg');
      list.push('/src/assets/images/litus_lotus_sustainability_1792166656259.jpg');
    } else if (product.category === 'trousers') {
      list.push('/src/assets/images/litus_editorial_monochrome_1792170430996.jpg');
      list.push('/src/assets/images/litus_lotus_sustainability_1792166656259.jpg');
    } else {
      list.push('/src/assets/images/litus_sculptural_sneakers_1792169497514.jpg');
      list.push('/src/assets/images/litus_minimal_accessory_1792166678035.jpg');
    }

    if (product.isNFTReady) {
      list.push('/src/assets/images/litus_nft_digital_fashion_1792166656272.jpg');
    }

    return Array.from(new Set(list));
  }, [product]);

  // Recommendations and Similar Products computation
  const recommendations = useMemo(() => {
    if (!product) return [];
    const pool = (allProducts && allProducts.length > 0 ? allProducts : PRODUCTS).filter(
      (p) => p.id !== product.id
    );

    if (recommendationFilter === 'similar') {
      // Same category items
      const sameCategory = pool.filter((p) => p.category === product.category);
      return sameCategory.length >= 3 ? sameCategory : [...sameCategory, ...pool.filter((p) => p.category !== product.category)].slice(0, 4);
    } else if (recommendationFilter === 'pairings') {
      // Complimentary pieces from other categories to complete the atelier outfit
      const complimentary = pool.filter((p) => p.category !== product.category);
      return complimentary.slice(0, 4);
    } else {
      // Trending & recommended pieces
      const trending = pool.filter((p) => p.isRecommended);
      return (trending.length >= 3 ? trending : pool).slice(0, 4);
    }
  }, [product, allProducts, recommendationFilter]);

  if (!product) return null;

  const currentPrice = isDistributor && product.distributorPrice 
    ? product.distributorPrice 
    : product.price;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleInstantBuy = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const handleQuickAddRecommendation = (item: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item, item.sizes?.[0] || 'M', item.colors?.[0]?.name || 'Default', 1);
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1600);
  };

  const handleSelectRecommendation = (item: Product) => {
    if (onSelectProduct) {
      onSelectProduct(item);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LITUS SS26 — ${product.name}`,
          text: `Inspect the conscious technical ${product.name} at LITUS Atelier.`,
          url: shareUrl,
        });
      } catch {
        // Fallback to copy
        await navigator.clipboard.writeText(shareUrl);
        setCopiedShareLink(true);
        setTimeout(() => setCopiedShareLink(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 ${
        isFullScreen ? 'p-0 md:p-0' : 'p-3 sm:p-6'
      }`}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        className={`relative bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 shadow-2xl overflow-y-auto flex flex-col transition-all duration-300 ${
          isFullScreen 
            ? 'w-full h-full rounded-none border-none' 
            : 'w-full max-w-5xl max-h-[92vh] rounded-2xl border border-slate-200 dark:border-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Bar / Breadcrumb Navigation */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/95 dark:bg-[#070b12]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Catalog</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="uppercase text-slate-500 dark:text-slate-400 hidden sm:inline">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
              title="Share Product"
            >
              {copiedShareLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Toggle Full Page / Modal Mode */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors text-xs font-mono cursor-pointer"
              title={isFullScreen ? 'Switch to Compact Modal' : 'Expand to Full Page'}
            >
              {isFullScreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Compact View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Page</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Product Showcase Section */}
        <section className={`px-4 sm:px-8 py-6 sm:py-8 ${isFullScreen ? 'max-w-7xl mx-auto w-full' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Interactive Gallery & Imagery (lg: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
              
              {/* Thumbnails Navigator */}
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[580px] pb-2 sm:pb-0 shrink-0">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx 
                        ? 'border-blue-600 dark:border-sky-400 ring-2 ring-blue-500/20' 
                        : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`View ${idx + 1}`} 
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 text-[8px] font-mono bg-black/70 text-white rounded">
                        Main
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Main Active Image Showcase with Zoom */}
              <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0b111c] border border-slate-200/80 dark:border-slate-800/80 group">
                <div 
                  className={`relative w-full h-[380px] sm:h-[500px] md:h-[580px] overflow-hidden flex items-center justify-center cursor-zoom-in ${
                    isZoomed ? 'cursor-zoom-out' : ''
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={galleryImages[selectedImageIndex] || product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out select-none ${
                      isZoomed ? 'scale-150' : 'group-hover:scale-105'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Zoom hint badge */}
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-slate-950/70 text-slate-300 border border-slate-700/50 rounded-md backdrop-blur-md">
                      {isZoomed ? 'Click to Reset Zoom' : 'Click to Inspect Weave'}
                    </span>
                  </div>

                  {/* Digital Twin Ready Tag */}
                  {product.isNFTReady && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenNFTModal();
                      }}
                      className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-slate-950/85 hover:bg-slate-900 text-sky-400 border border-sky-400/40 rounded-lg backdrop-blur-md transition-all shadow-lg hover:border-sky-400 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                      <span>Digital Twin On-Chain</span>
                    </button>
                  )}

                  {/* Wishlist toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWishlisted(!isWishlisted);
                    }}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isWishlisted 
                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40' 
                        : 'bg-slate-950/60 text-slate-300 hover:text-white border border-slate-700/50'
                    }`}
                    title="Add to Atelier Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Commerce, Specs & Checkout Module (lg: 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                
                {/* Atelier Metadata & Badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-2.5">
                  <span className="font-bold tracking-wider text-blue-600 dark:text-sky-400">
                    LITUS SS26
                  </span>
                  <span>·</span>
                  <span>{product.category}</span>
                  {product.badge && (
                    <>
                      <span>·</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20 font-bold">
                        {product.badge}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Social Proof */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    4.9 / 5.0 (58 Verified Collectors)
                  </span>
                </div>

                {/* Pricing & Distributor B2B view */}
                <div className="flex items-baseline gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 font-mono tabular-nums">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    ${currentPrice}
                  </span>
                  {isDistributor && product.distributorPrice ? (
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 font-bold uppercase">
                      Wholesale B2B Rate (MSRP: ${product.price})
                    </span>
                  ) : (
                    product.originalPrice && (
                      <span className="text-base text-slate-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )
                  )}
                  {product.originalPrice && !isDistributor && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Save ${(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* Shipping tag */}
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Complimentary Carbon-Neutral Express Dispatch + COD & UPI Included</span>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Combo Bundle Inclusions if Combo */}
                {product.comboItems && (
                  <div className="mt-4 p-3.5 rounded-xl bg-sky-500/10 border border-sky-400/25">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400 mb-2">
                      <span className="uppercase tracking-wider">Bundle Inclusions ({product.comboItems.length} Items)</span>
                      {product.comboSavingsUSD && (
                        <span className="text-emerald-400">Save ${product.comboSavingsUSD} Total</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {product.comboItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>Selected Shade: <strong className="text-slate-900 dark:text-white font-bold">{selectedColor}</strong></span>
                    <span className="font-mono text-slate-400 text-[11px]">{product.colors.length} options</span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 cursor-pointer flex items-center justify-center ${
                          selectedColor === c.name
                            ? 'border-blue-600 dark:border-sky-400 scale-110 shadow-md ring-2 ring-blue-500/20'
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="block w-full h-full rounded-full border border-slate-300 dark:border-slate-700"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector & Fit Guide Trigger */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>Select Size: <strong className="text-slate-900 dark:text-white">{selectedSize}</strong></span>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer font-mono text-[11px]"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{showSizeGuide ? 'Hide Fit Guide' : 'Size & Fit Guide'}</span>
                    </button>
                  </div>

                  {/* Size Guide Drawer / Inset table */}
                  {showSizeGuide && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">Unisex Tailored Measurement Table</span>
                        <div className="flex rounded-md bg-slate-200 dark:bg-slate-800 p-0.5 text-[10px] font-mono">
                          <button 
                            onClick={() => setSizeUnit('inches')} 
                            className={`px-2 py-0.5 rounded cursor-pointer ${sizeUnit === 'inches' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-500'}`}
                          >
                            Inches
                          </button>
                          <button 
                            onClick={() => setSizeUnit('cm')} 
                            className={`px-2 py-0.5 rounded cursor-pointer ${sizeUnit === 'cm' ? 'bg-white dark:bg-slate-700 font-bold' : 'text-slate-500'}`}
                          >
                            CM
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto font-mono text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-slate-400">
                              <th className="py-1">Size</th>
                              <th>Chest</th>
                              <th>Length</th>
                              <th>Sleeve</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                            {sizeUnit === 'inches' ? (
                              <>
                                <tr><td className="py-1 font-bold">S</td><td>38 - 40"</td><td>28.5"</td><td>33.5"</td></tr>
                                <tr><td className="py-1 font-bold">M</td><td>40 - 42"</td><td>29.5"</td><td>34.5"</td></tr>
                                <tr><td className="py-1 font-bold">L</td><td>43 - 45"</td><td>30.5"</td><td>35.5"</td></tr>
                                <tr><td className="py-1 font-bold">XL</td><td>46 - 48"</td><td>31.5"</td><td>36.5"</td></tr>
                              </>
                            ) : (
                              <>
                                <tr><td className="py-1 font-bold">S</td><td>96 - 101 cm</td><td>72 cm</td><td>85 cm</td></tr>
                                <tr><td className="py-1 font-bold">M</td><td>102 - 107 cm</td><td>75 cm</td><td>88 cm</td></tr>
                                <tr><td className="py-1 font-bold">L</td><td>109 - 114 cm</td><td>77 cm</td><td>90 cm</td></tr>
                                <tr><td className="py-1 font-bold">XL</td><td>117 - 122 cm</td><td>80 cm</td><td>93 cm</td></tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Size buttons */}
                  <div className="flex flex-wrap gap-2.5 mt-2.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] py-2 px-3.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'border-blue-600 bg-blue-600 text-white dark:border-sky-400 dark:bg-sky-500 dark:text-slate-950 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material & Circularity Summary Card */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <Leaf className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Regenerative Composition:</span>{' '}
                      {product.fabric}
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <RotateCcw className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Circular Impact:</span>{' '}
                      {product.sustainabilityNote}
                    </div>
                  </div>
                </div>

              </div>

              {/* Purchase Module: Quantity + Dual Checkout Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 mr-2 sm:hidden">Qty:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Bag (Main CTA) */}
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 dark:electric-glow"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Added to Atelier Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag — ${(currentPrice * quantity).toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  {/* Instant Buy with UPI & COD */}
                  <button
                    onClick={handleInstantBuy}
                    className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                    title="Checkout immediately using UPI or Cash on Delivery"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {/* Dispatch & Trust Indicators */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] sm:text-[11px] text-slate-500 font-mono text-center pt-2">
                  <div className="flex items-center justify-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>24h Dispatch</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>COD & UPI Ready</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>30-Day Circular Returns</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* LOWER SECTION 1: Deep Craftsmanship Tabs */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 shrink-0 ${
                  activeTab === 'details'
                    ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Atelier Craftsmanship
              </button>
              <button
                onClick={() => setActiveTab('sustainability')}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 shrink-0 ${
                  activeTab === 'sustainability'
                    ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Regenerative Provenance
              </button>
              <button
                onClick={() => setActiveTab('digital-twin')}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 shrink-0 ${
                  activeTab === 'digital-twin'
                    ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Digital Twin & Web3 NFC
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border-b-2 shrink-0 ${
                  activeTab === 'care'
                    ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Care & Circular Return
              </button>
            </div>

            {/* Tab contents */}
            <div className="py-6">
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase font-mono text-xs">
                      Sculptural Construction Specifications
                    </h4>
                    <ul className="space-y-2">
                      {product.details?.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <span className="font-mono text-blue-600 dark:text-sky-400 font-bold block uppercase">
                      LITUS Modular Design Philosophy
                    </span>
                    <p className="leading-relaxed">
                      Every piece is engineered to dismantle at the end of its life cycle into monomaterial constituent yarns. We avoid blended synthetics and non-recyclable coatings, ensuring circular regeneration.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'sustainability' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                    <span className="font-mono font-bold block uppercase">Water Conserved</span>
                    <span className="text-xl font-mono font-extrabold block text-emerald-900 dark:text-emerald-200">
                      -42 Liters
                    </span>
                    <p className="text-[11px] opacity-80">
                      Utilizes closed-loop biological dye bath technology with 98% recycled graywater.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 space-y-1">
                    <span className="font-mono font-bold block uppercase">Carbon Offset Metric</span>
                    <span className="text-xl font-mono font-extrabold block text-blue-900 dark:text-blue-200">
                      100% Certified
                    </span>
                    <p className="text-[11px] opacity-80">
                      Neutralized via verified mangrove restoration in the Sundarbans coastal delta.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-800 dark:text-purple-300 space-y-1">
                    <span className="font-mono font-bold block uppercase">Organic Certification</span>
                    <span className="text-xl font-mono font-extrabold block text-purple-900 dark:text-purple-200">
                      GOTS & Oeko-Tex
                    </span>
                    <p className="text-[11px] opacity-80">
                      Zero harmful chemical sizing, microplastic shedding, or heavy metal fixatives.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'digital-twin' && (
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-sky-950/20 border border-sky-400/30">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-8 h-8 text-sky-400" />
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <h4 className="text-sm font-bold font-mono uppercase text-sky-400">
                      Verifiable On-Chain Digital Twin Asset
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      When you acquire this piece, the encrypted NFC chip sewn into the garment hem unlocks a 1-of-1 digital collectible twin on Polygon. Show proof of ownership, access private atelier trunk shows, and inspect carbon offsets directly.
                    </p>
                  </div>
                  <button
                    onClick={onOpenNFTModal}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-md shadow-sky-600/30"
                  >
                    Inspect NFT Market
                  </button>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="font-mono font-bold block text-slate-900 dark:text-white">Cold Wash</span>
                      <span className="text-[11px] text-slate-500">Max 30°C / 85°F</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="font-mono font-bold block text-slate-900 dark:text-white">Line Dry</span>
                      <span className="text-[11px] text-slate-500">Preserves natural fibers</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="font-mono font-bold block text-slate-900 dark:text-white">Warm Iron</span>
                      <span className="text-[11px] text-slate-500">Reverse side only</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="font-mono font-bold block text-slate-900 dark:text-white">Circular Buyback</span>
                      <span className="text-[11px] text-slate-500">20% credit upon return</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LOWER SECTION 2: RECOMMENDATIONS & SIMILAR PRODUCTS DOWN WITH IT */}
          <section className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-sky-400 font-bold mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Curated Atelier Recommendations</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                  Similar Pieces & Complete The Look
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Technical garments and conscious accessories crafted to complement the {product.name}.
                </p>
              </div>

              {/* Recommendation category selector */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 text-xs font-mono">
                <button
                  onClick={() => setRecommendationFilter('pairings')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    recommendationFilter === 'pairings'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Complete The Look
                </button>
                <button
                  onClick={() => setRecommendationFilter('similar')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    recommendationFilter === 'similar'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Similar in {product.category}
                </button>
                <button
                  onClick={() => setRecommendationFilter('trending')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    recommendationFilter === 'trending'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Trending Pieces
                </button>
              </div>
            </div>

            {/* Grid of Recommended Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectRecommendation(item)}
                  className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0b111c] border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-sky-400/50 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
                >
                  {/* Card Image */}
                  <div className="relative aspect-4/5 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Tag badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold bg-slate-950/80 text-white rounded backdrop-blur-md border border-slate-700/40">
                        {item.badge || item.category}
                      </span>
                    </div>

                    {/* Quick Add Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRecommendation(item);
                        }}
                        className="p-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-lg transition-transform hover:scale-110 cursor-pointer"
                        title="Inspect Preview"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleQuickAddRecommendation(item, e)}
                        className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-110 cursor-pointer dark:electric-glow"
                        title="Quick Add to Bag"
                      >
                        {quickAddedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-300" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Color swatches */}
                      <div className="flex items-center gap-1 mb-2">
                        {item.colors.slice(0, 3).map((col) => (
                          <span
                            key={col.name}
                            className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700"
                            style={{ backgroundColor: col.hex }}
                          />
                        ))}
                        {item.colors.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-mono ml-0.5">
                            +{item.colors.length - 3}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {item.fabric}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                      <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        ${isDistributor && item.distributorPrice ? item.distributorPrice : item.price}
                      </div>

                      <button
                        onClick={(e) => handleQuickAddRecommendation(item, e)}
                        className="text-xs font-mono font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {quickAddedId === item.id ? (
                          <span className="text-emerald-500 font-bold">Added ✓</span>
                        ) : (
                          <span>+ Add to Bag</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Guarantee Banner at bottom of page */}
          <div className="mt-12 mb-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% GOTS Certified Biological Fibers</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Instant Razorpay, UPI & COD Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-500" />
              <span>Circular Zero-Waste Stewardship</span>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};
