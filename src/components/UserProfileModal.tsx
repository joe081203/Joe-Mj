import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order } from '../types';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc,
  onSnapshot 
} from 'firebase/firestore';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  LogOut, 
  Sparkles, 
  Shirt, 
  ExternalLink, 
  CreditCard, 
  Box, 
  Edit3, 
  Save,
  CheckCircle2,
  Lock,
  Wallet,
  Briefcase,
  Layers,
  ArrowRight,
  Truck,
  Package,
  Banknote,
  Phone
} from 'lucide-react';
import { NFT_SHIRTS_COLLECTION } from '../data/nftShirts';
import { OrderConfirmationEmailModal } from './OrderConfirmationEmailModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNFTMarketplace: () => void;
  onOpenAdminManager?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenNFTMarketplace,
  onOpenAdminManager,
}) => {
  const { user, signOut, walletAddress, role, isAdmin, isDistributor, setRole, ownerEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'nfts' | 'details' | 'access' | 'billing'>('orders');
  const [copiedUID, setCopiedUID] = useState(false);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [previewEmailOrder, setPreviewEmailOrder] = useState<Order | null>(null);
  
  // Editable profile state
  const [bio, setBio] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch user data, NFT history, and physical order tracking from Firestore
  useEffect(() => {
    if (!isOpen || !user) return;

    setIsLoadingData(true);

    // 1. Fetch user profile from Firestore /users/{userId}
    const fetchProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.bio) setBio(data.bio);
          if (data.shippingAddress) setShippingAddress(data.shippingAddress);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();

    // 2. Real-time listener for Orders collection (/orders where userId == user.uid)
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loadedOrders: Order[] = [];
        snapshot.forEach((d) => {
          loadedOrders.push({ id: d.id, ...d.data() } as Order);
        });
        // Sort newest first
        loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(loadedOrders);
        setIsLoadingData(false);
      },
      (err) => {
        console.error('Error loading orders:', err);
        setIsLoadingData(false);
      }
    );

    // 3. Fetch purchased NFT history from /minted_nfts
    const fetchNFTs = async () => {
      try {
        const q = query(
          collection(db, 'minted_nfts'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const items: any[] = [];
        querySnapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() });
        });
        setMintedNFTs(items);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
      }
    };
    fetchNFTs();

    return () => {
      unsubOrders();
    };
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const copyToClipboard = (text: string, type: 'uid' | 'hash' | 'trk', id?: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'uid') {
      setCopiedUID(true);
      setTimeout(() => setCopiedUID(false), 2000);
    } else if (type === 'hash' && id) {
      setCopiedHashId(id);
      setTimeout(() => setCopiedHashId(null), 2000);
    } else if (type === 'trk' && id) {
      setCopiedTrackingId(id);
      setTimeout(() => setCopiedTrackingId(null), 2000);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Collector',
          bio,
          shippingAddress,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update user profile in Firestore:', err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const getShippingStepIndex = (status: string) => {
    switch (status) {
      case 'processing': return 1;
      case 'tailored': return 2;
      case 'in_transit': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
        <div
          className="relative w-full max-w-4xl bg-white dark:bg-[#090e17] text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner & Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 p-6 sm:p-8 text-white flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Profile Avatar */}
                <div className="relative">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User Avatar'}
                      className="w-18 h-18 rounded-2xl object-cover border-2 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-2xl bg-slate-900 text-sky-400 border-2 border-white flex items-center justify-center text-2xl font-bold font-display">
                      {user.displayName ? user.displayName[0] : 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-white" title="Firebase Authenticated">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* User Identity Details */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                      {user.displayName || 'LITUS Collector'}
                    </h2>
                    
                    {/* Access Level Badge */}
                    {isAdmin ? (
                      <span className="text-[10px] font-mono uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black tracking-wider shadow-sm">
                        Owner / Admin
                      </span>
                    ) : isDistributor ? (
                      <span className="text-[10px] font-mono uppercase bg-purple-400 text-slate-950 px-2 py-0.5 rounded font-black tracking-wider shadow-sm">
                        Distributor Tier
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                        Customer
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-sky-100 flex items-center gap-1.5 mt-1 font-mono">
                    <Mail className="w-3.5 h-3.5 text-sky-300" />
                    <span>{user.email}</span>
                  </p>

                  {/* UID with copy button */}
                  <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-sky-200/90">
                    <span>UID: {user.uid.slice(0, 10)}...</span>
                    <button
                      onClick={() => copyToClipboard(user.uid, 'uid')}
                      className="hover:text-white cursor-pointer"
                      title="Copy Full UID"
                    >
                      {copiedUID ? (
                        <Check className="w-3 h-3 text-emerald-300" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <span className="opacity-40">|</span>
                    <span className="text-white font-bold">{walletAddress}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Sign Out */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 p-3 sm:p-0 bg-black/20 sm:bg-transparent rounded-xl">
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-sky-200 block">
                    Total Purchases
                  </span>
                  <span className="text-2xl font-black font-display text-white">
                    {orders.length} <span className="text-xs font-mono font-normal">ORDERS</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && onOpenAdminManager && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdminManager();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Hub</span>
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      await signOut();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b12] text-xs font-medium overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Order History & Tracking ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('nfts')}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'nfts'
                  ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>NFT Wardrobe ({mintedNFTs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Profile & Address</span>
            </button>

            <button
              onClick={() => setActiveTab('access')}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'access'
                  ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Access Levels</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`pb-3 px-3 transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === 'billing'
                  ? 'border-blue-600 dark:border-sky-400 text-blue-600 dark:text-sky-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Razorpay & COD</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* TAB 1: Real-time Order History & Live Tracking */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Live Purchase History & Shipping Tracker
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time order statuses and payment receipts synchronized directly with Cloud Firestore.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Firestore Live Sync
                  </span>
                </div>

                {isLoadingData ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-500">
                      Querying your orders from Firestore...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center max-w-md mx-auto space-y-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8">
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-sky-950/50 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                      <Package className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No Purchase Orders Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Place an order from our sustainable luxury catalog using Razorpay, GPay UPI, or Cash on Delivery (COD) to track live shipments here.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Browse Garment Collection
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((ord) => {
                      const stepIdx = getShippingStepIndex(ord.shippingStatus);

                      return (
                        <div
                          key={ord.id}
                          className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 space-y-5"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-blue-600 dark:text-sky-400">
                                  #{ord.id}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                                  {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                                {ord.items.length} {ord.items.length === 1 ? 'Garment' : 'Garments'} · Destination: {ord.shippingAddress}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Payment badge */}
                              <span className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-md ${
                                ord.paymentMethod === 'cod'
                                  ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                                  : ord.paymentMethod === 'gpay_upi'
                                  ? 'bg-sky-950/60 text-sky-400 border border-sky-500/30'
                                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {ord.paymentMethod === 'cod' 
                                  ? 'Cash on Delivery' 
                                  : ord.paymentMethod === 'gpay_upi' 
                                  ? 'GPay UPI' 
                                  : 'Razorpay'} ({ord.paymentStatus})
                              </span>

                              {/* View Email confirmation trigger */}
                              <button
                                onClick={() => setPreviewEmailOrder(ord)}
                                className="px-2.5 py-1 text-[10px] font-mono text-slate-700 dark:text-slate-300 hover:text-white bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                                title="View Email Confirmation"
                              >
                                <Mail className="w-3 h-3 text-sky-400" />
                                <span>Email Receipt</span>
                              </button>
                            </div>
                          </div>

                          {/* 4-Step Shipping Stepper */}
                          <div className="py-2">
                            <div className="flex items-center justify-between relative">
                              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0" />
                              <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-sky-500 transition-all duration-500 z-0" 
                                style={{ width: `${((stepIdx - 1) / 3) * 100}%` }}
                              />

                              {[
                                { step: 1, label: 'Order Placed' },
                                { step: 2, label: 'Quality Tailored' },
                                { step: 3, label: 'In Transit' },
                                { step: 4, label: 'Delivered' },
                              ].map((s) => {
                                const isPassed = stepIdx >= s.step;
                                const isCurrent = stepIdx === s.step;

                                return (
                                  <div key={s.step} className="relative z-10 flex flex-col items-center">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                                        isCurrent
                                          ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-500/30 scale-110 shadow-lg'
                                          : isPassed
                                          ? 'bg-emerald-500 text-slate-950'
                                          : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                                      }`}
                                    >
                                      {isPassed ? <Check className="w-3.5 h-3.5" /> : s.step}
                                    </div>
                                    <span className={`text-[10px] font-mono mt-1.5 uppercase ${
                                      isCurrent
                                        ? 'text-sky-400 font-bold'
                                        : isPassed
                                        ? 'text-slate-800 dark:text-slate-200 font-medium'
                                        : 'text-slate-400'
                                    }`}>
                                      {s.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Live Logistics Details */}
                          <div className="p-3.5 rounded-xl bg-white dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Carrier Tracking</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-bold text-sky-400">{ord.trackingNumber || 'Pending Allocation'}</span>
                                {ord.trackingNumber && (
                                  <button
                                    onClick={() => copyToClipboard(ord.trackingNumber || '', 'trk', ord.id)}
                                    className="hover:text-white p-0.5"
                                    title="Copy Tracking Number"
                                  >
                                    {copiedTrackingId === ord.id ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-slate-400" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[10px]">Carrier Logistics</span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">{ord.carrier || 'DHL Express'}</span>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[10px]">Estimated Delivery</span>
                              <span className="text-emerald-500 font-semibold">{ord.estimatedDelivery || '5 Business Days'}</span>
                            </div>
                          </div>

                          {/* Items Purchased in this order */}
                          <div className="space-y-2 pt-2">
                            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                              Order Items
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {ord.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-14 object-cover rounded bg-slate-950 shrink-0"
                                  />
                                  <div className="min-w-0 flex-1 text-xs">
                                    <div className="font-bold text-slate-900 dark:text-white truncate">
                                      {item.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                      {item.size} · {item.color} · Qty: {item.quantity}
                                    </div>
                                    <div className="text-[11px] font-mono text-sky-500 font-bold">
                                      ${item.price * item.quantity} USD
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Total Breakdown */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-slate-500">
                                Ref: <span className="text-sky-400 font-semibold">{ord.paymentReference || 'N/A'}</span>
                              </span>
                              {ord.customerPhone && (
                                <span className="text-emerald-500 flex items-center gap-1 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  <span>{ord.customerPhone}</span>
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400 mr-2 text-[11px]">Total:</span>
                              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                ${ord.totalAmount} USD
                              </span>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Purchased NFT Wardrobe */}
            {activeTab === 'nfts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                    Owned Digital Twin Shirts
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Synchronized with Firestore
                  </span>
                </div>

                {mintedNFTs.length === 0 ? (
                  <div className="py-16 text-center max-w-md mx-auto space-y-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8">
                    <Shirt className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No NFT Shirts in Vault
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our exclusive digital couture shirts collection and claim your physical-paired asset.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenNFTMarketplace();
                      }}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer"
                    >
                      Open NFT Shirts Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mintedNFTs.map((item) => {
                      const shirtCatalog = NFT_SHIRTS_COLLECTION.find((s) => s.id === item.nftShirtId);
                      return (
                        <div
                          key={item.id}
                          className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start gap-4">
                              {shirtCatalog?.image && (
                                <img
                                  src={shirtCatalog.image}
                                  alt={item.name}
                                  className="w-20 h-24 object-cover rounded-xl bg-slate-900 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
                                    {item.tokenId || '#001'}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                                    ${item.priceUSD} USD
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                                  Minted: {new Date(item.mintedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400 text-[11px] truncate max-w-[140px]">
                              Tx: {item.txHash}
                            </span>
                            <span className="text-emerald-500 text-[11px] flex items-center gap-1">
                              <Box className="w-3 h-3" />
                              <span>Garment Paired</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Profile & Delivery Address */}
            {activeTab === 'details' && (
              <form onSubmit={handleSaveProfile} className="max-w-xl space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Collector Details & Atelier Dispatch Address
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your physical purchases and paired garments are delivered to this address.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Profile updated in Firestore successfully!</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.displayName || 'Collector'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Collector Bio
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Sustainable streetwear enthusiast..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Default Shipping Delivery Address
                  </label>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter full shipping address..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile in Firestore'}</span>
                </button>
              </form>
            )}

            {/* TAB 4: Access Levels */}
            {activeTab === 'access' && (
              <div className="max-w-2xl space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Three-Tier Role & Access Control
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Verified through Firebase Authentication and Firestore Security Rules.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border ${role === 'customer' ? 'border-blue-500/50 bg-blue-50/20' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">Customer Tier</div>
                    <p className="text-slate-500 mt-1">Standard retail ordering, live shipping tracking, and digital twin claims.</p>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isDistributor ? 'border-purple-500/50 bg-purple-50/20' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-sm text-purple-400">Distributor Tier (B2B)</div>
                      {!isDistributor && (
                        <button onClick={() => setRole('distributor')} className="text-purple-400 underline cursor-pointer">
                          Activate Distributor View
                        </button>
                      )}
                    </div>
                    <p className="text-slate-500 mt-1">Wholesale pricing (35% B2B margin) and bulk allocations.</p>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isAdmin ? 'border-amber-500/50 bg-amber-50/20' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="font-bold text-sm text-amber-400">Owner / Admin ({ownerEmail})</div>
                    <p className="text-slate-500 mt-1">Full private management: Product uploads, Income Dashboard, and AI Assistant.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Razorpay & COD Billing Overview */}
            {activeTab === 'billing' && (
              <div className="max-w-xl space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Supported Payment Gateways
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    LITUS accepts multiple flexible payment channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-sky-400" />
                      <span className="font-bold text-slate-900 dark:text-white">Razorpay / GPay UPI</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Instant digital settlement via UPI, Google Pay, credit/debit cards, and netbanking with automated receipts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Zero upfront payment. Pay with cash or doorstep UPI when your packaged garments arrive.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Confirmation Email Preview Modal */}
      <OrderConfirmationEmailModal
        order={previewEmailOrder}
        isOpen={Boolean(previewEmailOrder)}
        onClose={() => setPreviewEmailOrder(null)}
      />
    </>
  );
};
