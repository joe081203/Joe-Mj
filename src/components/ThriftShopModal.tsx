import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ShoppingBag, 
  Tag, 
  Check, 
  DollarSign, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Info, 
  Search,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Sparkles,
  Layers,
  Flame,
  Award,
  Trash2,
  Lock
} from 'lucide-react';

export interface ThriftItem {
  id: string;
  brand: string; // e.g. "Carhartt", "Nike", "Levi's", "Stüssy", "Ralph Lauren", "Arc'teryx", etc.
  title: string;
  category: 'outerwear' | 'hoodies' | 'tees' | 'jeans_pants' | 'shirts' | 'accessories';
  era?: string; // e.g. "90s Vintage", "Y2K", "80s Classic", "Modern Pre-Loved"
  condition: 'pristine' | 'near_mint' | 'gently_loved' | 'vintage_patina';
  conditionScore: string; // e.g. "9.8/10", "Distressed Patina (8.5/10)"
  resalePrice: number;
  originalPrice: number;
  size: string;
  color: string;
  image: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  payoutMode: 'cash_70' | 'credit_85';
  flawsNote?: string;
  description: string;
  isVerified: boolean;
  createdAt: string;
}

const INITIAL_MULTI_BRAND_THRIFT_ITEMS: ThriftItem[] = [
  {
    id: 'thrift-carhartt-01',
    brand: 'Carhartt',
    title: '90s J97 Blanket-Lined Detroit Duck Jacket',
    category: 'outerwear',
    era: '90s Vintage',
    condition: 'vintage_patina',
    conditionScore: '8.8/10 Distressed Patina',
    resalePrice: 165,
    originalPrice: 280,
    size: 'L',
    color: 'Carhartt Brown Duck',
    image: '/src/assets/images/litus_hero_streetwear_1792166656226.jpg',
    sellerName: 'Marcus T. (Vintage Curator)',
    sellerPhone: '+91 98765 43210',
    sellerEmail: 'marcus.vintage@thrift.co',
    payoutMode: 'cash_70',
    flawsNote: 'Beautiful natural fading on elbows; corduroy collar intact with no rips.',
    description: 'Iconic heavyweight Detroit work jacket with striped blanket lining and brass zip. Genuine 90s union-made piece sourced from Denver vintage warehouse.',
    isVerified: true,
    createdAt: '2026-10-18',
  },
  {
    id: 'thrift-nike-02',
    brand: 'Nike',
    title: 'Y2K Center Mini-Swoosh Heavyweight Boxy Hoodie',
    category: 'hoodies',
    era: 'Y2K (Early 2000s)',
    condition: 'near_mint',
    conditionScore: '9.4/10 Near Mint',
    resalePrice: 78,
    originalPrice: 130,
    size: 'XL (Boxy Fit)',
    color: 'Washed Heather Grey',
    image: '/src/assets/images/litus_oversized_tee_1792166677289.jpg',
    sellerName: 'Arjun V. (Street Archive)',
    sellerPhone: '+91 94441 22334',
    sellerEmail: 'arjun.vault@gmail.com',
    payoutMode: 'cash_70',
    flawsNote: 'Very minor fading on drawstrings, zero holes or stains.',
    description: 'Extremely sought-after embroidered center-swoosh chest fleece. Substantial heavyweight cotton fleece with wide drop-shoulder silhouette.',
    isVerified: true,
    createdAt: '2026-10-19',
  },
  {
    id: 'thrift-levis-03',
    brand: "Levi's",
    title: 'Vintage 501 Made in USA Selvedge Raw Denim',
    category: 'jeans_pants',
    era: '80s / 90s Vintage',
    condition: 'near_mint',
    conditionScore: '9.2/10',
    resalePrice: 95,
    originalPrice: 195,
    size: '32 x 32',
    color: 'Deep Indigo Tint',
    image: '/src/assets/images/litus_cargo_trousers_1792166677989.jpg',
    sellerName: 'Mia C. (Denim Hunter)',
    sellerPhone: '+91 98822 11009',
    sellerEmail: 'mia.denim@thrift.co',
    payoutMode: 'credit_85',
    flawsNote: 'Naturally honeycombed behind knees; original chain-stitched hems intact.',
    description: 'Original red-tab button-fly 501s crafted in vintage American mills. 100% rigid unwashed cotton denim with decades of life remaining.',
    isVerified: true,
    createdAt: '2026-10-17',
  },
  {
    id: 'thrift-stussy-04',
    brand: 'Stüssy',
    title: 'Archive 8-Ball Mohair Blend Knit Cardigan',
    category: 'outerwear',
    era: 'Modern Streetwear',
    condition: 'pristine',
    conditionScore: '9.8/10 Pristine',
    resalePrice: 135,
    originalPrice: 220,
    size: 'M',
    color: 'Bone Off-White & Black',
    image: '/src/assets/images/litus_product_showcase_1792166656612.jpg',
    sellerName: 'Devika P. (Tokyo Consign)',
    sellerPhone: '+91 97711 44556',
    sellerEmail: 'devika.curator@gmail.com',
    payoutMode: 'cash_70',
    flawsNote: 'Worn once indoors; dry-cleaned and folded flat in cedar box.',
    description: 'Sold-out signature Stüssy mohair cardigan featuring jacquard 8-ball graphic on back. Relaxed drop-shoulder cut with horn button closure.',
    isVerified: true,
    createdAt: '2026-10-18',
  },
  {
    id: 'thrift-ralph-05',
    brand: 'Ralph Lauren',
    title: 'Polo Country Hand-Knit Cable Fisherman Sweater',
    category: 'hoodies',
    era: '90s Classic',
    condition: 'near_mint',
    conditionScore: '9.5/10 Flawless',
    resalePrice: 88,
    originalPrice: 210,
    size: 'L',
    color: 'Cream Oatmeal',
    image: '/src/assets/images/litus_technical_overshirt_1792166677796.jpg',
    sellerName: 'Rohan K. (Heritage Vault)',
    sellerPhone: '+91 91234 56789',
    sellerEmail: 'rohan.heritage@thrift.co',
    payoutMode: 'credit_85',
    flawsNote: 'No pulls or snags; 100% thick Scottish wool knit.',
    description: 'Timeless thick ribbed Aran cable knit from Ralph Lauren Polo Country vintage line. Incredible warmth and weighty drape.',
    isVerified: true,
    createdAt: '2026-10-19',
  },
  {
    id: 'thrift-arcteryx-06',
    brand: "Arc'teryx",
    title: 'Beta AR Gore-Tex Pro Technical Mountain Shell',
    category: 'outerwear',
    era: 'Technical Archive',
    condition: 'near_mint',
    conditionScore: '9.4/10 Seams Intact',
    resalePrice: 275,
    originalPrice: 600,
    size: 'M',
    color: 'Graphite Black',
    image: '/src/assets/images/litus_hero_streetwear_1792166656226.jpg',
    sellerName: 'Kaelen R. (Gorpcore Reseller)',
    sellerPhone: '+91 99887 76655',
    sellerEmail: 'kaelen.gorp@thrift.co',
    payoutMode: 'credit_85',
    flawsNote: 'Fully DWR refreshed with Nikwax; laser seam tapes tight with zero peeling.',
    description: 'High-performance 3-layer Gore-Tex Pro shell with Cohaesive cord locks, helmet-compatible DropHood, and watertight pit zips. Legendary weather armor.',
    isVerified: true,
    createdAt: '2026-10-19',
  },
  {
    id: 'thrift-patagonia-07',
    brand: 'Patagonia',
    title: '90s Retro-X Deep-Pile Windproof Sherpa Fleece',
    category: 'outerwear',
    era: '90s Made in USA',
    condition: 'gently_loved',
    conditionScore: '8.9/10 Plump Sherpa',
    resalePrice: 110,
    originalPrice: 229,
    size: 'L',
    color: 'Hunter Green & Navy',
    image: '/src/assets/images/litus_lotus_sustainability_1792166656259.jpg',
    sellerName: 'Sarah M.',
    sellerPhone: '+91 98112 33445',
    sellerEmail: 'sarah.thrift@gmail.com',
    payoutMode: 'cash_70',
    flawsNote: 'Slight fleece flattening on cuffs from vintage wear, super warm and plush.',
    description: 'Iconic Made in USA Retro-X with internal barrier membrane and nylon chest contrast pocket. Classic 90s boxy fit.',
    isVerified: true,
    createdAt: '2026-10-18',
  },
  {
    id: 'thrift-diesel-08',
    brand: 'Diesel',
    title: 'Archive Multi-Pocket Parachute Cargo Trousers',
    category: 'jeans_pants',
    era: 'Y2K Cyber Era',
    condition: 'near_mint',
    conditionScore: '9.3/10',
    resalePrice: 92,
    originalPrice: 240,
    size: '31 / 32',
    color: 'Washed Military Olive',
    image: '/src/assets/images/litus_cargo_trousers_1792166677989.jpg',
    sellerName: 'Zane B. (Archive Store)',
    sellerPhone: '+91 93322 11990',
    sellerEmail: 'zane.cyber@thrift.co',
    payoutMode: 'cash_70',
    flawsNote: 'All 8 zips and snaps glide effortlessly; zero fraying at cuffs.',
    description: 'Volumetric Y2K modular military trousers with adjustable ankle cinch ties and articulated knee stitching.',
    isVerified: true,
    createdAt: '2026-10-19',
  }
];

const POPULAR_BRANDS = [
  'All Brands',
  'Carhartt',
  'Nike',
  "Levi's",
  'Stüssy',
  'Ralph Lauren',
  "Arc'teryx",
  'Patagonia',
  'Diesel',
  'Champion',
  'Zara',
  'Vintage Archive'
];

interface ThriftShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string) => void;
}

export const ThriftShopModal: React.FC<ThriftShopModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'sell'>('browse');
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [thriftItems, setThriftItems] = useState<ThriftItem[]>(INITIAL_MULTI_BRAND_THRIFT_ITEMS);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  // Enforce: only admin can view or access sell tab
  useEffect(() => {
    if (!isAdmin && activeTab === 'sell') {
      setActiveTab('browse');
    }
  }, [isAdmin, activeTab]);

  // Form State for "Sell Thrifted Item" (Admin Only)
  const [brand, setBrand] = useState('Carhartt');
  const [customBrand, setCustomBrand] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ThriftItem['category']>('outerwear');
  const [era, setEra] = useState('90s Vintage');
  const [condition, setCondition] = useState<ThriftItem['condition']>('near_mint');
  const [conditionScore, setConditionScore] = useState('9.5 / 10 Near Mint');
  const [resalePrice, setResalePrice] = useState<number>(85);
  const [originalPrice, setOriginalPrice] = useState<number>(180);
  const [size, setSize] = useState('L');
  const [color, setColor] = useState('Vintage Wash');
  const [sellerName, setSellerName] = useState(user?.displayName || 'Store Owner');
  const [sellerPhone, setSellerPhone] = useState('+91 98765 43210');
  const [sellerEmail, setSellerEmail] = useState(user?.email || 'mjjoe1614@gmail.com');
  const [payoutMode, setPayoutMode] = useState<'cash_70' | 'credit_85'>('cash_70');
  const [flawsNote, setFlawsNote] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/litus_hero_streetwear_1792166656226.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccessId, setSubmissionSuccessId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleDeleteThriftItem = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!window.confirm('Delete this thrift listing from the shop?')) return;
    try {
      const docRef = doc(db, 'thrift_listings', itemId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Could not delete from Firestore:', err);
    }
    setThriftItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Real-time Firestore sync
  useEffect(() => {
    if (!isOpen) return;

    try {
      const colRef = collection(db, 'thrift_listings');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteItems: ThriftItem[] = [];
            snapshot.forEach((docSnap) => {
              remoteItems.push({ id: docSnap.id, ...docSnap.data() } as ThriftItem);
            });
            const remoteIds = new Set(remoteItems.map(i => i.id));
            const merged = [...remoteItems, ...INITIAL_MULTI_BRAND_THRIFT_ITEMS.filter(item => !remoteIds.has(item.id))];
            setThriftItems(merged);
          }
        },
        (error) => {
          console.warn('Firestore thrift sync fallback:', error.message);
        }
      );
      return () => unsubscribe();
    } catch {
      // Offline fallback
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter products by Brand, Category, and Search
  const filteredItems = thriftItems.filter((item) => {
    if (selectedBrand !== 'All Brands' && item.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchEra = (item.era || '').toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchBrand && !matchTitle && !matchEra && !matchDesc) return false;
    }
    return true;
  });

  const handleBuyThriftItem = (item: ThriftItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Map ThriftItem into Product for standard checkout
    const virtualProduct: Product = {
      id: item.id,
      name: `${item.brand} — ${item.title} [Thrift / ${item.conditionScore}]`,
      category: item.category === 'outerwear' || item.category === 'hoodies' ? 'shirts' : item.category === 'jeans_pants' ? 'trousers' : 'tees',
      price: item.resalePrice,
      originalPrice: item.originalPrice,
      description: `${item.brand} (${item.era || 'Vintage'}). ${item.description}`,
      details: [
        `Brand: ${item.brand}`,
        `Era: ${item.era || 'Curated Vintage'}`,
        `Condition Rating: ${item.conditionScore}`,
        `Seller: ${item.sellerName}`,
        `Condition Flaws: ${item.flawsNote || 'No notable defects'}`
      ],
      fabric: 'Authentic Multi-Brand Vintage Garment',
      sustainabilityNote: '100% circular second-hand thrift · 0 new manufacturing footprint',
      image: item.image,
      sizes: [item.size],
      colors: [{ name: item.color, hex: '#1e3a8a' }],
      isRecommended: false,
      isNFTReady: false,
      badge: `${item.brand} Vintage`
    };

    onAddToCart(virtualProduct, item.size);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  const handleResellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isAdmin) {
      setFormError('Uploading and selling on the Thrift Shop is restricted exclusively to the store admin.');
      return;
    }

    const finalBrand = brand === 'Other' ? customBrand.trim() : brand;

    if (!finalBrand) {
      setFormError('Please select or specify the brand of your thrift item.');
      return;
    }

    if (!sellerPhone.trim()) {
      setFormError('Phone or WhatsApp number is required to verify seller authenticity and payout transfers.');
      return;
    }

    if (!title.trim() || !resalePrice) {
      setFormError('Please enter the item title and your asking resale price.');
      return;
    }

    setIsSubmitting(true);
    const newId = `thrift-${Date.now().toString(36)}`;

    const newItem: ThriftItem = {
      id: newId,
      brand: finalBrand,
      title: title.trim(),
      category,
      era: era.trim() || 'Curated Vintage',
      condition,
      conditionScore,
      resalePrice: Number(resalePrice),
      originalPrice: Number(originalPrice) || Number(resalePrice) * 1.5,
      size,
      color,
      image: imageUrl.trim() || '/src/assets/images/litus_hero_streetwear_1792166656226.jpg',
      sellerName: sellerName.trim() || 'Independent Thrift Seller',
      sellerPhone: sellerPhone.trim(),
      sellerEmail: sellerEmail.trim() || 'seller@thrift.co',
      payoutMode,
      flawsNote: flawsNote.trim() || 'Inspected vintage piece; natural signs of authentic wear.',
      description: description.trim() || `Authentic ${finalBrand} thrifted item in ${conditionScore} condition.`,
      isVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      const docRef = doc(db, 'thrift_listings', newId);
      await setDoc(docRef, newItem);
    } catch (err) {
      console.warn('Saved to local state (Firestore offline fallback):', err);
    }

    setThriftItems(prev => [newItem, ...prev]);
    setSubmissionSuccessId(newId);
    setIsSubmitting(false);

    // Reset Form
    setTitle('');
    setDescription('');
    setFlawsNote('');
  };

  const getConditionColor = (cond: ThriftItem['condition']) => {
    switch (cond) {
      case 'pristine': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'near_mint': return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'gently_loved': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'vintage_patina': return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-[#080d19] border border-slate-800 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-gradient-to-r from-[#0d1628] to-[#080d19]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-lg">
              <Tag className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold">
                  Multi-Brand Thrift & Vintage Vault
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  All Brands Welcome
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-white mt-0.5">
                The Thrift Shop // Curated Resale Marketplace
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Thrift Vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs: Browse Multi-Brand Thrift vs Sell / Consign */}
        <div className="px-6 pt-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTab('browse');
                setSubmissionSuccessId(null);
              }}
              className={`pb-3 px-4 transition-all cursor-pointer flex items-center gap-2 border-b-2 font-bold ${
                activeTab === 'browse'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Multi-Brand Thrift ({filteredItems.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('sell');
                setSubmissionSuccessId(null);
              }}
              className={`pb-3 px-4 transition-all cursor-pointer flex items-center gap-2 border-b-2 font-bold ${
                activeTab === 'sell'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Sell Thrifted Items (Any Brand)</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold">
                List & Earn
              </span>
            </button>
          </div>

          <span className="hidden sm:inline text-[11px] font-mono text-slate-400">
            Carhartt · Nike · Levi's · Stüssy · Ralph Lauren · Arc'teryx
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: BROWSE THRIFT SHOP */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              
              {/* Value Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#0b1424] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400 shrink-0" />
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">Curated Multi-Brand Thrift Archive:</strong> 100% authentic second-hand streetwear, vintage outerwear, selvedge denim, and deadstock classics from Carhartt, Nike, Stüssy, Levi's, and independent thrift resellers.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('sell')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
                >
                  <span>Sell on Thrift Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Brand Filter Pills & Search */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Nike, Carhartt, Levi's, hoodies, jackets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  {/* Category Filter Dropdown */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">Category:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="outerwear">Jackets & Outerwear</option>
                      <option value="hoodies">Hoodies & Sweaters</option>
                      <option value="jeans_pants">Jeans & Trousers</option>
                      <option value="tees">Tees & Tops</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Popular Brand Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-mono">
                  {POPULAR_BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all ${
                        selectedBrand === b
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thrift Cards Grid */}
              {filteredItems.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm font-light">
                  <p>No thrifted items found matching "{searchQuery || selectedBrand}".</p>
                  <button
                    onClick={() => {
                      setSelectedBrand('All Brands');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 text-xs text-amber-400 underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const isAdded = addedItemId === item.id;
                    const savings = item.originalPrice - item.resalePrice;

                    return (
                      <div
                        key={item.id}
                        className="group relative flex flex-col bg-[#0c1424] border border-slate-800/90 rounded-2xl overflow-hidden hover:border-amber-400/60 transition-all duration-300 shadow-lg flex-1"
                      >
                        {/* Photo Canvas */}
                        <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
                          <img
                            src={item.image}
                            alt={`${item.brand} ${item.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Brand & Era Pill */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                            <span className="px-2.5 py-1 text-[11px] font-mono font-extrabold uppercase rounded-md bg-slate-950/90 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md">
                              {item.brand}
                            </span>
                            {item.era && (
                              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-900/80 text-slate-300 rounded border border-white/10 backdrop-blur-md">
                                {item.era}
                              </span>
                            )}
                          </div>

                          {/* Savings / Condition */}
                          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 shadow-md">
                              Save ${savings}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border backdrop-blur-md ${getConditionColor(item.condition)}`}>
                              {item.conditionScore}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                              <span className="uppercase text-amber-400 font-semibold">{item.category.replace('_', ' ')}</span>
                              <span>Size: <strong className="text-white">{item.size}</strong> · {item.color}</span>
                            </div>

                            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
                              {item.description}
                            </p>

                            {item.flawsNote && (
                              <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                                <span className="text-amber-400 font-semibold">Wear Details:</span> {item.flawsNote}
                              </div>
                            )}

                            {/* Reseller Info Strip & WhatsApp */}
                            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                              <span className="truncate max-w-[140px]">Seller: {item.sellerName}</span>
                              <a
                                href={`https://wa.me/${item.sellerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${item.sellerName}, I am inquiring about the thrifted ${item.brand} "${item.title}" on the Thrift Shop.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                                title="Chat with Seller on WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* Price & Buy Button */}
                          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-base font-extrabold font-mono text-white">
                                  ${item.resalePrice}
                                </span>
                                <span className="text-xs font-mono text-slate-400 line-through">
                                  ${item.originalPrice}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                                Verified Second-Life Thrift
                              </span>
                            </div>

                            <button
                              onClick={(e) => handleBuyThriftItem(item, e)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>In Bag</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Buy Thrift</span>
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: SELL ON THRIFT SHOP (ANY BRAND) */}
          {activeTab === 'sell' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Success Banner */}
              {submissionSuccessId && (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-white shadow-xl animate-fadeIn space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Thrift Item Successfully Published!
                      </h3>
                      <p className="text-xs text-emerald-200 mt-0.5">
                        Thrift Listing ID: <span className="font-mono font-bold text-white">{submissionSuccessId}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Your thrifted piece is now live across the multi-brand thrift shop. Buyers can purchase it directly or message you on WhatsApp for sizing details.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-300 transition-colors"
                    >
                      View in Thrift Shop
                    </button>
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello, I just listed a thrifted piece #${submissionSuccessId} on the Thrift Shop.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-mono transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Atelier Support</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Intro Banner */}
              <div className="p-5 rounded-2xl bg-[#0c1424] border border-slate-800">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Sell Your Thrifted Outfits Across ANY Brand
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      This is your personal thrift marketplace! List thrifted gems, vintage streetwear, band tees, workwear jackets, selvedge denim, or pre-loved designer garments from Carhartt, Nike, Levi's, Stüssy, Ralph Lauren, Zara, or any brand.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reseller Form */}
              <form onSubmit={handleResellerSubmit} className="space-y-5 bg-[#0a101e] p-6 rounded-2xl border border-slate-800 shadow-xl">
                
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Brand Selection */}
                <div>
                  <label className="block text-xs font-medium text-amber-400 mb-1.5 font-bold uppercase tracking-wider">
                    Brand Name * (Choose or Enter Any Brand)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                    {['Carhartt', 'Nike', "Levi's", 'Stüssy', 'Ralph Lauren', "Arc'teryx", 'Patagonia', 'Other'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBrand(b)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                          brand === b
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  {brand === 'Other' && (
                    <input
                      type="text"
                      required
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      placeholder="Type any brand name (e.g. Zara, Supreme, Stone Island, Champion, Vintage)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/50 text-white text-xs placeholder:text-slate-500 focus:outline-none font-mono"
                    />
                  )}
                </div>

                {/* Garment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Thrift Item Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 90s Detroit Duck Canvas Blanket-Lined Jacket"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Garment Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-400 font-mono capitalize cursor-pointer"
                    >
                      <option value="outerwear">Jackets & Outerwear</option>
                      <option value="hoodies">Hoodies & Sweaters</option>
                      <option value="jeans_pants">Jeans & Trousers</option>
                      <option value="tees">Tees & Tops</option>
                      <option value="shirts">Shirts & Button-Downs</option>
                      <option value="accessories">Bags & Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Vintage Era / Decade
                    </label>
                    <input
                      type="text"
                      value={era}
                      onChange={(e) => setEra(e.target.value)}
                      placeholder="e.g. 90s Vintage, Y2K, 80s, Modern Pre-Loved"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Condition Grade *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => {
                        const val = e.target.value as ThriftItem['condition'];
                        setCondition(val);
                        if (val === 'pristine') setConditionScore('10 / 10 Deadstock / Pristine');
                        else if (val === 'near_mint') setConditionScore('9.5 / 10 Near Mint');
                        else if (val === 'gently_loved') setConditionScore('8.5 / 10 Gently Loved');
                        else setConditionScore('Vintage Distressed Patina');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-400 font-mono cursor-pointer"
                    >
                      <option value="pristine">Deadstock / Pristine (10/10)</option>
                      <option value="near_mint">Near Mint / Flawless (9.5/10)</option>
                      <option value="gently_loved">Gently Loved (8.5/10)</option>
                      <option value="vintage_patina">Vintage Distressed / Patina (Workwear Fade)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Size & Color *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        placeholder="Size (e.g. M, L, 32x32)"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        required
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Color / Wash"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Thrift Asking Price (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                      <input
                        type="number"
                        min="5"
                        required
                        value={resalePrice}
                        onChange={(e) => setResalePrice(Number(e.target.value))}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Estimated Original Retail Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                      <input
                        type="number"
                        min="5"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Seller Contact Details (Mandatory Phone/WhatsApp) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Seller Name / Thrift Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="e.g. Vintage Vault Mumbai"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1 font-bold">
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Phone * (Mandatory)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      placeholder="seller@thrift.co"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Flaws & Photos */}
                <div className="space-y-4 pt-3 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Garment Photo URL
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/src/assets/images/... or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Wear Details / Flaws (if any)
                    </label>
                    <input
                      type="text"
                      value={flawsNote}
                      onChange={(e) => setFlawsNote(e.target.value)}
                      placeholder="e.g. Natural fade on cuffs, zero holes, vintage distressing on pocket"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Thrift Story & Provenance Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell buyers where you thrifted this, the fit, vintage tags, or why it's a grail..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Publishing to Thrift Shop...</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4 text-slate-950" />
                      <span>Publish Item to Thrift Shop</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
