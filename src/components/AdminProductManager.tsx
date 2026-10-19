import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory, Order, ShippingStatus, PaymentStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { uploadProductImage, db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { OrderConfirmationEmailModal } from './OrderConfirmationEmailModal';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon,
  Save,
  AlertCircle,
  Tag,
  Layers,
  Box,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  Truck,
  Mail,
  Send,
  Bot,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Package,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Copy,
  Phone,
  MessageSquare
} from 'lucide-react';

interface AdminProductManagerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProduct: (product: Partial<Product> & { name: string; price: number; category: string; description: string; image: string }) => Promise<string>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const { user, isAdmin, ownerEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalog' | 'product-dashboard' | 'income-dashboard' | 'ai-assistant'>('product-dashboard');
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time Orders & Income state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [orderShippingFilter, setOrderShippingFilter] = useState<'all' | ShippingStatus>('all');
  const [previewEmailOrder, setPreviewEmailOrder] = useState<Order | null>(null);
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState<string | null>(null);
  const [trackingInputValue, setTrackingInputValue] = useState('');

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Good day, Executive. I am your Atelier AI Strategist. I have access to your live product inventory, income metrics, and order logistics. How may I assist your business decisions today?',
      time: 'Atelier Core',
    },
  ]);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'shirts' | 'tees' | 'trousers' | 'accessories' | 'combos'>('shirts');
  const [price, setPrice] = useState<number>(220);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [distributorPrice, setDistributorPrice] = useState<number | undefined>(145);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('100% GOTS Certified Organic Aegean Cotton');
  const [sustainabilityNote, setSustainabilityNote] = useState('Low-impact cold reactive dye saves 42L water per garment');
  const [imageUrl, setImageUrl] = useState('');
  const [details, setDetails] = useState<string[]>([
    'Bonded water-repellent laser seams',
    'Concealed magnetic utility hardware',
    'Embedded NFC authenticity chip in left hem'
  ]);
  const [newDetailText, setNewDetailText] = useState('');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Marine Navy', hex: '#0f2b48' },
    { name: 'Obsidian Black', hex: '#111827' }
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1e3a8a');
  const [isPublished, setIsPublished] = useState(true);
  const [distributorOnly, setDistributorOnly] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isNFTReady, setIsNFTReady] = useState(true);
  const [badge, setBadge] = useState('SS26 New');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch real-time orders from Firestore for the Income & Fulfillment Dashboard
  useEffect(() => {
    if (!isOpen || !isAdmin) return;

    setIsLoadingOrders(true);
    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const loaded: Order[] = [];
        snapshot.forEach((d) => {
          loaded.push({ id: d.id, ...d.data() } as Order);
        });
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(loaded);
        setIsLoadingOrders(false);
      },
      (err) => {
        console.error('Error fetching admin orders:', err);
        setIsLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, isAdmin]);

  useEffect(() => {
    if (activeTab === 'ai-assistant') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory, activeTab]);

  if (!isOpen) return null;

  // STRICT ACCESS CONTROL CHECK:
  if (!isAdmin || !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-md w-full bg-[#0c1322] border border-rose-500/40 p-6 rounded-2xl text-center space-y-4 text-white">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold font-display">Access Denied</h3>
          <p className="text-xs text-slate-400">
            This private product management interface is strictly restricted to the authorized owner account (<strong className="text-white">{ownerEmail}</strong>).
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // --- Metrics Computations ---
  // Product & Inventory Metrics
  const totalProductsCount = products.length;
  const publishedCount = products.filter((p) => p.isPublished !== false).length;
  const draftCount = totalProductsCount - publishedCount;
  const lowStockProducts = products.filter((p) => (p.stockQuantity ?? 0) <= 10);
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stockQuantity ?? 50), 0);
  const retailInventoryValuation = products.reduce((sum, p) => sum + p.price * (p.stockQuantity ?? 50), 0);
  const wholesaleInventoryValuation = products.reduce((sum, p) => sum + (p.distributorPrice || Math.round(p.price * 0.65)) * (p.stockQuantity ?? 50), 0);

  // Category counts
  const categoryCounts = {
    combos: products.filter((p) => p.category === 'combos').length,
    shirts: products.filter((p) => p.category === 'shirts').length,
    tees: products.filter((p) => p.category === 'tees').length,
    trousers: products.filter((p) => p.category === 'trousers').length,
    accessories: products.filter((p) => p.category === 'accessories').length,
  };

  // Income Metrics
  const grossRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const settledRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCodRevenue = orders
    .filter((o) => o.paymentStatus === 'pending')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const averageOrderValue = orders.length > 0 ? Math.round(grossRevenue / orders.length) : 0;

  // Payment Breakdown
  const paymentMethodBreakdown = {
    razorpay: {
      count: orders.filter((o) => o.paymentMethod === 'razorpay').length,
      amount: orders.filter((o) => o.paymentMethod === 'razorpay').reduce((s, o) => s + (o.totalAmount || 0), 0),
    },
    gpay_upi: {
      count: orders.filter((o) => o.paymentMethod === 'gpay_upi').length,
      amount: orders.filter((o) => o.paymentMethod === 'gpay_upi').reduce((s, o) => s + (o.totalAmount || 0), 0),
    },
    cod: {
      count: orders.filter((o) => o.paymentMethod === 'cod').length,
      amount: orders.filter((o) => o.paymentMethod === 'cod').reduce((s, o) => s + (o.totalAmount || 0), 0),
    },
  };

  // Order filters
  const filteredOrders = orders.filter((ord) => {
    if (orderPaymentFilter !== 'all' && ord.paymentStatus !== orderPaymentFilter) return false;
    if (orderShippingFilter !== 'all' && ord.shippingStatus !== orderShippingFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchEmail = (ord.customerEmail || '').toLowerCase().includes(q);
      const matchName = (ord.customerName || '').toLowerCase().includes(q);
      const matchTrk = (ord.trackingNumber || '').toLowerCase().includes(q);
      const matchPhone = (ord.customerPhone || '').toLowerCase().includes(q);
      if (!matchId && !matchEmail && !matchName && !matchTrk && !matchPhone) return false;
    }
    return true;
  });

  // Handlers for Products
  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setName('');
    setCategory('shirts');
    setPrice(220);
    setOriginalPrice(undefined);
    setDistributorPrice(145);
    setStockQuantity(50);
    setDescription('');
    setFabric('100% GOTS Certified Organic Aegean Cotton');
    setSustainabilityNote('Low-impact cold reactive dye saves 42L water per garment');
    setImageUrl('/src/assets/images/litus_technical_overshirt_1792166677796.jpg');
    setDetails([
      'Bonded water-repellent laser seams',
      'Concealed magnetic utility hardware',
      'Embedded NFC authenticity chip in left hem'
    ]);
    setSizes(['S', 'M', 'L', 'XL']);
    setColors([
      { name: 'Marine Navy', hex: '#0f2b48' },
      { name: 'Obsidian Black', hex: '#111827' }
    ]);
    setIsPublished(true);
    setDistributorOnly(false);
    setIsRecommended(false);
    setIsNFTReady(true);
    setBadge('SS26 New');
    setActiveTab('catalog');
    setActiveView('form');
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice);
    setDistributorPrice(prod.distributorPrice || Math.round(prod.price * 0.65));
    setStockQuantity(prod.stockQuantity ?? 50);
    setDescription(prod.description);
    setFabric(prod.fabric);
    setSustainabilityNote(prod.sustainabilityNote);
    setImageUrl(prod.image);
    setDetails(prod.details || []);
    setSizes(prod.sizes || ['S', 'M', 'L']);
    setColors(prod.colors || [{ name: 'Default', hex: '#0f2b48' }]);
    setIsPublished(prod.isPublished !== false);
    setDistributorOnly(Boolean(prod.distributorOnly));
    setIsRecommended(Boolean(prod.isRecommended));
    setIsNFTReady(Boolean(prod.isNFTReady));
    setBadge(prod.badge || '');
    setActiveTab('catalog');
    setActiveView('form');
  };

  const handleQuickStockAdjust = async (prod: Product, delta: number) => {
    const newQty = Math.max(0, (prod.stockQuantity ?? 50) + delta);
    try {
      await onSaveProduct({
        ...prod,
        stockQuantity: newQty,
      });
      setSaveSuccessMsg(`Updated inventory for "${prod.name}" to ${newQty} units.`);
      setTimeout(() => setSaveSuccessMsg(null), 2000);
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const handleQuickPublishToggle = async (prod: Product) => {
    const updatedState = prod.isPublished === false;
    try {
      await onSaveProduct({
        ...prod,
        isPublished: updatedState,
      });
      setSaveSuccessMsg(`Garment "${prod.name}" marked as ${updatedState ? 'Published' : 'Draft'}.`);
      setTimeout(() => setSaveSuccessMsg(null), 2000);
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setErrorMessage(null);
    try {
      const tempId = editingProduct?.id || `upload-${Date.now()}`;
      const downloadUrl = await uploadProductImage(file, tempId);
      setImageUrl(downloadUrl);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMessage('Failed to upload image to Firebase Storage.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }
    if (!imageUrl) {
      setErrorMessage('Please upload or provide an image for the product.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        id: editingProduct?.id,
        name: name.trim(),
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        distributorPrice: distributorPrice ? Number(distributorPrice) : undefined,
        stockQuantity: Number(stockQuantity),
        description: description.trim(),
        fabric: fabric.trim(),
        sustainabilityNote: sustainabilityNote.trim(),
        image: imageUrl,
        details,
        sizes,
        colors,
        isPublished,
        distributorOnly,
        isRecommended,
        isNFTReady,
        badge: badge.trim() || undefined,
        createdBy: user.email || ownerEmail,
      };

      await onSaveProduct(payload);
      setSaveSuccessMsg(`Product "${name}" successfully saved and published to Firebase!`);
      setTimeout(() => {
        setSaveSuccessMsg(null);
        setActiveView('list');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setErrorMessage('Error saving to Cloud Firestore. Please check Firebase security rules.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (prodId: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${prodName}" from Firebase?`)) {
      return;
    }
    try {
      await onDeleteProduct(prodId);
      setSaveSuccessMsg(`Deleted "${prodName}" from Firebase.`);
      setTimeout(() => setSaveSuccessMsg(null), 2500);
    } catch (err) {
      console.error('Failed to delete product:', err);
      setErrorMessage('Failed to delete product from Firestore.');
    }
  };

  // Handlers for Live Order Management
  const handleUpdateShippingStatus = async (orderId: string, newStatus: ShippingStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        shippingStatus: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setSaveSuccessMsg(`Updated shipping status for order #${orderId} to "${newStatus}".`);
      setTimeout(() => setSaveSuccessMsg(null), 2000);
    } catch (err) {
      console.error('Failed to update shipping status:', err);
      setErrorMessage('Failed to update shipping status in Firestore.');
    }
  };

  const handleTogglePaymentStatus = async (orderId: string, currentStatus: PaymentStatus) => {
    const newStatus: PaymentStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setSaveSuccessMsg(`Marked order #${orderId} payment as "${newStatus}".`);
      setTimeout(() => setSaveSuccessMsg(null), 2000);
    } catch (err) {
      console.error('Failed to update payment status:', err);
      setErrorMessage('Failed to update payment status in Firestore.');
    }
  };

  const handleSaveTrackingNumber = async (orderId: string) => {
    if (!trackingInputValue.trim()) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        trackingNumber: trackingInputValue.trim(),
        updatedAt: new Date().toISOString(),
      });
      setEditingTrackingOrderId(null);
      setTrackingInputValue('');
      setSaveSuccessMsg(`Saved tracking code for #${orderId}.`);
      setTimeout(() => setSaveSuccessMsg(null), 2000);
    } catch (err) {
      console.error('Failed to save tracking number:', err);
    }
  };

  // Handlers for AI Assistant
  const handleSendAiPrompt = async (promptToSend?: string) => {
    const text = promptToSend || aiPrompt;
    if (!text.trim() || isAiLoading) return;

    const userMsg = { sender: 'user' as const, text: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiChatHistory((prev) => [...prev, userMsg]);
    setAiPrompt('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/admin/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: {
            catalogSummary: {
              totalProducts: totalProductsCount,
              publishedCount,
              draftCount,
              lowStockCount: lowStockProducts.length,
              totalUnits: totalStockUnits,
              inventoryValuationUSD: retailInventoryValuation,
            },
            revenueSummary: {
              grossRevenueUSD: grossRevenue,
              settledRevenueUSD: settledRevenue,
              pendingCodUSD: pendingCodRevenue,
              averageOrderValueUSD: averageOrderValue,
              totalOrders: orders.length,
              paymentSplit: paymentMethodBreakdown,
            },
            recentOrdersCount: orders.slice(0, 5).length,
          },
        }),
      });

      const data = await response.json();
      const aiMsg = {
        sender: 'ai' as const,
        text: data.reply || data.error || 'Atelier response generated.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiChatHistory((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI assistant error:', err);
      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Atelier communication temporarily unavailable. Please verify connection and retry.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
        <div 
          className="relative w-full max-w-6xl bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 rounded-3xl border border-sky-500/40 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#0a1220] to-slate-900 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-white">
                    LITUS Private Executive Suite
                  </h2>
                  <span className="text-[10px] font-mono uppercase bg-sky-950/80 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded font-bold">
                    Owner Access
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Verified Admin: <span className="text-sky-300 font-semibold">{user.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Product</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 px-6 pt-3 bg-slate-50 dark:bg-[#070b12] border-b border-slate-200 dark:border-slate-800 text-xs font-mono overflow-x-auto shrink-0">
            <button
              onClick={() => {
                setActiveTab('product-dashboard');
                setActiveView('list');
              }}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'product-dashboard'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Product Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('income-dashboard');
                setActiveView('list');
              }}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'income-dashboard'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Income & Orders Dashboard ({orders.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ai-assistant');
                setActiveView('list');
              }}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'ai-assistant'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>Atelier AI Assistant</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('catalog');
                setActiveView('list');
              }}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Catalog & Upload ({totalProductsCount})</span>
            </button>
          </div>

          {/* Status Alert Banner */}
          {saveSuccessMsg && (
            <div className="p-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 px-6">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-2.5 bg-rose-500/15 border-b border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 px-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Content Area */}
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* TAB 1: PRODUCT DASHBOARD & INVENTORY ANALYTICS */}
            {activeTab === 'product-dashboard' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Product Dashboard & Inventory Velocity
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time stock valuation, category distribution, and low-inventory warnings.
                  </p>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Styles</span>
                    <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
                      {totalProductsCount} <span className="text-xs font-mono font-normal text-slate-400">GARMENTS</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
                      <span>{publishedCount} Published</span> · <span className="text-amber-500">{draftCount} Drafts</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Units In Stock</span>
                    <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
                      {totalStockUnits} <span className="text-xs font-mono font-normal text-slate-400">UNITS</span>
                    </div>
                    <div className="text-[11px] font-mono text-sky-400">
                      Average {Math.round(totalStockUnits / (totalProductsCount || 1))} per silhouette
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Inventory Valuation (Retail)</span>
                    <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
                      ${retailInventoryValuation.toLocaleString()} <span className="text-xs font-mono font-normal text-slate-400">USD</span>
                    </div>
                    <div className="text-[11px] font-mono text-purple-400">
                      Wholesale B2B: ${wholesaleInventoryValuation.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Low Stock Alerts (≤10)</span>
                    <div className="text-2xl font-black font-display text-rose-500">
                      {lowStockProducts.length} <span className="text-xs font-mono font-normal text-slate-400">STYLES</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {lowStockProducts.length > 0 ? 'Requires replenishment' : 'All styles well-stocked'}
                    </div>
                  </div>
                </div>

                {/* Category Distribution Breakdown */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wider">
                      Category Distribution & Share
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">SS26 Collection Catalog</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { key: 'shirts', label: 'Shirts & Overshirts', count: categoryCounts.shirts, color: 'bg-blue-500' },
                      { key: 'tees', label: 'Tees & Tops', count: categoryCounts.tees, color: 'bg-sky-400' },
                      { key: 'trousers', label: 'Trousers & Bottoms', count: categoryCounts.trousers, color: 'bg-indigo-500' },
                      { key: 'accessories', label: 'Accessories', count: categoryCounts.accessories, color: 'bg-emerald-500' },
                    ].map((cat) => {
                      const pct = totalProductsCount > 0 ? Math.round((cat.count / totalProductsCount) * 100) : 0;
                      return (
                        <div key={cat.key} className="p-3 rounded-xl bg-white dark:bg-[#070b12] border border-slate-200 dark:border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-500 dark:text-slate-400 truncate">{cat.label}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{cat.count}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${cat.color}`} style={{ width: `${pct}%` }} />
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 text-right">{pct}% of catalog</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Fast Restock Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wider">
                      Quick Stock & Publishing Controls
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Updates live to Firestore</span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0c1322]">
                    <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
                      {products.map((p) => (
                        <div key={p.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3 min-w-[200px] flex-1">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-12 object-cover rounded bg-slate-900 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono capitalize">
                                {p.category} · ${p.price} USD
                              </div>
                            </div>
                          </div>

                          {/* Stock Counter with Quick +5 and -1 */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-mono block">Units</span>
                              <span className={`font-mono font-bold text-sm ${
                                (p.stockQuantity ?? 50) <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-white'
                              }`}>
                                {p.stockQuantity ?? 50}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 font-mono">
                              <button
                                onClick={() => handleQuickStockAdjust(p, -1)}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                                title="Decrease 1 unit"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleQuickStockAdjust(p, 5)}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                                title="Add 5 units"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => handleQuickStockAdjust(p, 25)}
                                className="px-2 py-1 rounded bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 text-xs cursor-pointer font-bold"
                                title="Restock 25 units"
                              >
                                +25
                              </button>
                            </div>
                          </div>

                          {/* Status and Edit */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuickPublishToggle(p)}
                              className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded cursor-pointer ${
                                p.isPublished !== false
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                              }`}
                              title="Toggle public visibility"
                            >
                              {p.isPublished !== false ? 'Published' : 'Draft'}
                            </button>

                            <button
                              onClick={() => handleOpenEditForm(p)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 text-slate-600 dark:text-slate-300 cursor-pointer"
                              title="Edit Garment"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INCOME & REVENUE DASHBOARD */}
            {activeTab === 'income-dashboard' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Income Dashboard & Orders Ledger
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live revenue metrics, payment method distributions, and real-time shipping fulfillment.
                  </p>
                </div>

                {/* 4 Income Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Gross Revenue</span>
                    <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
                      ${grossRevenue.toLocaleString()} <span className="text-xs font-mono font-normal text-slate-400">USD</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400">
                      {orders.length} total customer orders
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Settled Digital Revenue</span>
                    <div className="text-2xl font-black font-display text-emerald-400">
                      ${settledRevenue.toLocaleString()} <span className="text-xs font-mono font-normal text-slate-400">USD</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Razorpay & confirmed digital transfers
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Pending Doorstep (COD)</span>
                    <div className="text-2xl font-black font-display text-amber-400">
                      ${pendingCodRevenue.toLocaleString()} <span className="text-xs font-mono font-normal text-slate-400">USD</span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-500">
                      Awaiting delivery collection
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Average Order Value (AOV)</span>
                    <div className="text-2xl font-black font-display text-sky-400">
                      ${averageOrderValue.toLocaleString()} <span className="text-xs font-mono font-normal text-slate-400">USD</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Luxury basket benchmark
                    </div>
                  </div>
                </div>

                {/* Payment Methods Split */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wider">
                      Payment Channels & Settlement Volume
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Direct Firestore Analytics</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Razorpay Card */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-400" />
                          <span>Razorpay Checkout</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          ONLINE
                        </span>
                      </div>
                      <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                        ${paymentMethodBreakdown.razorpay.amount.toLocaleString()} USD
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {paymentMethodBreakdown.razorpay.count} successful transactions
                      </div>
                    </div>

                    {/* GPay UPI Card */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-sky-400" />
                          <span>Google Pay UPI</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">
                          INSTANT
                        </span>
                      </div>
                      <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                        ${paymentMethodBreakdown.gpay_upi.amount.toLocaleString()} USD
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {paymentMethodBreakdown.gpay_upi.count} UPI settlements
                      </div>
                    </div>

                    {/* Cash on Delivery (COD) Card */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-amber-400" />
                          <span>Cash on Delivery (COD)</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                          DOORSTEP
                        </span>
                      </div>
                      <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                        ${paymentMethodBreakdown.cod.amount.toLocaleString()} USD
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {paymentMethodBreakdown.cod.count} parcel orders
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-Time Orders Ledger */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wider">
                        Live Orders Fulfillment & Dispatch Ledger
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Changes to shipping status update customer tracking immediately.
                      </p>
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          placeholder="Search Order ID, Email..."
                          className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b12] text-slate-900 dark:text-white font-mono w-48"
                        />
                      </div>

                      <select
                        value={orderPaymentFilter}
                        onChange={(e) => setOrderPaymentFilter(e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b12] text-xs font-mono text-slate-700 dark:text-slate-300"
                      >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid Only</option>
                        <option value="pending">Pending (COD)</option>
                      </select>

                      <select
                        value={orderShippingFilter}
                        onChange={(e) => setOrderShippingFilter(e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b12] text-xs font-mono text-slate-700 dark:text-slate-300"
                      >
                        <option value="all">All Shipping Stages</option>
                        <option value="processing">Processing</option>
                        <option value="tailored">Tailored</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {isLoadingOrders ? (
                    <div className="py-12 text-center text-xs font-mono text-slate-500">
                      Loading orders from Firestore...
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-xs text-slate-500 font-mono">
                      No orders matched the selected filters.
                    </div>
                  ) : (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0c1322]">
                      <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
                        {filteredOrders.map((ord) => (
                          <div key={ord.id} className="p-4 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sky-400 text-xs">
                                  #{ord.id}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                  ord.paymentStatus === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {ord.paymentMethod} ({ord.paymentStatus})
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleTogglePaymentStatus(ord.id, ord.paymentStatus)}
                                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                                  title="Toggle paid / pending status"
                                >
                                  {ord.paymentStatus === 'paid' ? 'Mark Pending' : 'Mark Paid (Collected)'}
                                </button>

                                <button
                                  onClick={() => setPreviewEmailOrder(ord)}
                                  className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 text-xs font-mono flex items-center gap-1 transition-colors"
                                  title="View / Dispatch Confirmation Email"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email Notice</span>
                                </button>
                              </div>
                            </div>

                            {/* Customer & Shipping Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-slate-50 dark:bg-[#070b12] p-3 rounded-xl border border-slate-200 dark:border-slate-800/60">
                              <div>
                                <span className="text-[10px] text-slate-400 block">Customer</span>
                                <div className="font-bold text-slate-800 dark:text-slate-200">{ord.customerName}</div>
                                <div className="text-[11px] text-slate-500 truncate">{ord.customerEmail}</div>
                                {ord.customerPhone ? (
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                                      <Phone className="w-3 h-3 text-emerald-400" />
                                      <span>{ord.customerPhone}</span>
                                    </span>
                                    <a
                                      href={`https://wa.me/${ord.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${ord.customerName}, this is LITUS Atelier verifying your COD order #${ord.id}.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[9px] font-mono font-bold transition-colors flex items-center gap-1"
                                      title="Open WhatsApp Chat to verify COD"
                                    >
                                      <MessageSquare className="w-2.5 h-2.5" />
                                      <span>WhatsApp</span>
                                    </a>
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-slate-500 font-mono mt-1">No phone provided</div>
                                )}
                              </div>

                              <div>
                                <span className="text-[10px] text-slate-400 block">Delivery Destination</span>
                                <div className="text-slate-700 dark:text-slate-300 truncate">{ord.shippingAddress}</div>
                                <div className="text-[10px] text-slate-500">Carrier: {ord.carrier || 'DHL Express'}</div>
                              </div>

                              <div>
                                <span className="text-[10px] text-slate-400 block">Live Shipping Stage</span>
                                <select
                                  value={ord.shippingStatus}
                                  onChange={(e) => handleUpdateShippingStatus(ord.id, e.target.value as ShippingStatus)}
                                  className="mt-0.5 w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-sky-500 cursor-pointer"
                                >
                                  <option value="processing">Processing (Atelier Queued)</option>
                                  <option value="tailored">Tailored (Inspection Complete)</option>
                                  <option value="in_transit">In Transit (Dispatched)</option>
                                  <option value="delivered">Delivered (Completed)</option>
                                </select>
                              </div>
                            </div>

                            {/* Tracking Number Editor */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">Tracking Code:</span>
                                {editingTrackingOrderId === ord.id ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={trackingInputValue}
                                      onChange={(e) => setTrackingInputValue(e.target.value)}
                                      placeholder="e.g. LTS-EXP-928471"
                                      className="px-2 py-0.5 rounded border border-sky-400 bg-black text-white text-xs font-mono"
                                    />
                                    <button
                                      onClick={() => handleSaveTrackingNumber(ord.id)}
                                      className="px-2 py-0.5 rounded bg-sky-500 text-slate-950 text-xs font-bold"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingTrackingOrderId(null)}
                                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-sky-400">{ord.trackingNumber || 'Unassigned'}</span>
                                    <button
                                      onClick={() => {
                                        setEditingTrackingOrderId(ord.id);
                                        setTrackingInputValue(ord.trackingNumber || '');
                                      }}
                                      className="p-1 hover:text-sky-400 text-slate-500 cursor-pointer"
                                      title="Edit Tracking Code"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="text-right">
                                <span className="text-slate-400 mr-2 text-[11px]">Total:</span>
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                                  ${ord.totalAmount} USD
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ATELIER AI ASSISTANT (Powered by Gemini) */}
            {activeTab === 'ai-assistant' && (
              <div className="space-y-4 flex flex-col h-[65vh]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-sky-400" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        LITUS Atelier AI Executive
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Full-Stack Strategic Intelligence · Real-time Catalog & Income Context
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAiChatHistory([
                        {
                          sender: 'ai',
                          text: 'Atelier session reset. Current store context re-synchronized. How can I guide you?',
                          time: 'Atelier Core',
                        },
                      ]);
                    }}
                    className="text-xs font-mono px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Reset Chat
                  </button>
                </div>

                {/* Quick Action Prompt Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono shrink-0">
                  <span className="text-[11px] text-slate-400">Quick Directives:</span>
                  {[
                    'Analyze revenue & margins',
                    'Recommend restock priorities',
                    'Draft luxury product description',
                    'Evaluate COD vs Razorpay share',
                    'Draft courier dispatch email',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendAiPrompt(chip)}
                      className="px-2.5 py-1 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-500/30 transition-colors cursor-pointer text-[11px]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat History Viewport */}
                <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800">
                  {aiChatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800/90 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.sender === 'ai' && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400 mb-1 font-bold">
                            <Bot className="w-3 h-3" />
                            <span>ATELIER AI STRATEGIST</span>
                          </div>
                        )}
                        <div>{msg.text}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="flex items-center gap-2 p-3 text-xs font-mono text-sky-400 animate-pulse">
                      <Bot className="w-4 h-4 animate-spin" />
                      <span>Synthesizing atelier intelligence...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Prompt Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiPrompt();
                  }}
                  className="flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask the Atelier AI about product pricing, inventory optimization, marketing, or email copy..."
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-slate-900 dark:text-white placeholder:text-slate-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiPrompt.trim()}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-md shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: GARMENT CATALOG & UPLOAD FORM */}
            {activeTab === 'catalog' && (
              <div>
                {activeView === 'list' ? (
                  /* Catalog List */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Total Live Products: <strong className="text-white">{products.length}</strong></span>
                      <button
                        onClick={handleOpenAddForm}
                        className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Garment</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-sky-500/40 transition-colors"
                        >
                          <div>
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 mb-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase backdrop-blur-md ${
                                  prod.isPublished !== false
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {prod.isPublished !== false ? 'Published' : 'Draft'}
                                </span>
                                {prod.distributorOnly && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-purple-950/80 text-purple-400 border border-purple-500/30 backdrop-blur-md">
                                    B2B Only
                                  </span>
                                )}
                              </div>
                              <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-200">
                                Stock: {prod.stockQuantity ?? 50}
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <span className="text-[10px] font-mono uppercase text-sky-500 font-bold">
                                {prod.category}
                              </span>
                              <div className="text-right">
                                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                                  ${prod.price}
                                </span>
                                {prod.distributorPrice && (
                                  <span className="text-[10px] font-mono text-purple-400 block">
                                    B2B: ${prod.distributorPrice}
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {prod.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                              ID: {prod.id}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditForm(prod)}
                                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-sky-400 text-slate-700 dark:text-slate-300 hover:text-sky-400 cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(prod.id, prod.name)}
                                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-rose-500 text-slate-700 dark:text-slate-300 hover:text-rose-400 cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmitForm} className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {editingProduct ? `Edit Garment: ${editingProduct.name}` : 'Upload New Sustainable Product'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveView('list')}
                        className="text-xs font-mono text-slate-400 hover:text-white"
                      >
                        ← Back to Inventory
                      </button>
                    </div>

                    {/* Image Upload */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-sky-400" />
                          <span>Product Image (Firebase Storage)</span>
                        </label>
                        <span className="text-[11px] font-mono text-slate-400">
                          High-Res PNG, JPG, or WebP
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {imageUrl ? (
                          <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-slate-900 border border-sky-400/50 shrink-0">
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute bottom-1 right-1 p-1.5 rounded-md bg-black/80 text-white hover:text-sky-400 text-xs"
                              title="Replace Image"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-36 h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-400 flex flex-col items-center justify-center text-slate-400 hover:text-sky-400 cursor-pointer shrink-0 transition-colors"
                          >
                            <Upload className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-mono">Upload Photo</span>
                          </div>
                        )}

                        <div className="flex-1 w-full space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />

                          <button
                            type="button"
                            disabled={isUploadingImage}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-medium cursor-pointer transition-colors"
                          >
                            {isUploadingImage ? 'Uploading to Firebase Storage...' : 'Browse Local Image File'}
                          </button>

                          <div className="text-[11px] text-slate-400 font-mono">
                            Or manually provide Image URL / CDN path:
                          </div>
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="/src/assets/images/... or https://..."
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Core Product Attributes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Garment Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Atelier Marine Modular Overshirt"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium capitalize"
                        >
                          <option value="combos">Combos & Curated Sets</option>
                          <option value="shirts">Shirts & Overshirts</option>
                          <option value="tees">Tees & Tops</option>
                          <option value="trousers">Trousers & Bottoms</option>
                          <option value="accessories">Accessories</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Stock Inventory Count
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Customer Retail Price (USD) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Original Price (USD, Optional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={originalPrice || ''}
                          onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g. 280"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Distributor Wholesale Price (USD)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={distributorPrice || ''}
                          onChange={(e) => setDistributorPrice(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g. 145"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-purple-400 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Collection Badge Tag
                        </label>
                        <input
                          type="text"
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          placeholder="e.g. SS26 New"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Description & Specs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Product Description *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe the architectural cut, silhouette, utility features..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Fabric Composition
                          </label>
                          <input
                            type="text"
                            value={fabric}
                            onChange={(e) => setFabric(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Sustainability Impact Note
                          </label>
                          <input
                            type="text"
                            value={sustainabilityNote}
                            onChange={(e) => setSustainabilityNote(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setActiveView('list')}
                        className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-sky-500/25 disabled:opacity-75"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving to Firebase...' : 'Save Product in Firebase'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Confirmation Email Viewer & Dispatch Modal */}
      <OrderConfirmationEmailModal
        order={previewEmailOrder}
        isOpen={Boolean(previewEmailOrder)}
        onClose={() => setPreviewEmailOrder(null)}
      />
    </>
  );
};
