import React, { useState, useRef } from 'react';
import { CartItem, Order, PaymentMethod } from '../types';
import { useAuth } from '../context/AuthContext';
import { openRazorpayPayment } from '../lib/razorpay';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { OrderConfirmationEmailModal } from './OrderConfirmationEmailModal';
import { UpiPaymentInterface } from './UpiPaymentInterface';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  Mail,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  LogIn,
  Package,
  Phone,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenOrderHistory?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenOrderHistory,
}) => {
  const { user, signIn } = useAuth();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');
  const [shippingAddress, setShippingAddress] = useState(
    '742 Atelier Boulevard, Suite 500, Milan / New York'
  );
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [customerEmailInput, setCustomerEmailInput] = useState('');
  const [customerNameInput, setCustomerNameInput] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [currentOrderRef, setCurrentOrderRef] = useState<string>(() => 
    `LTS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`
  );

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 250;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const totalAmount = subtotal + (subtotal >= freeShippingThreshold ? 0 : 15);

  const saveOrderToFirestore = async (method: PaymentMethod, paymentRef?: string) => {
    const orderId = currentOrderRef || `LTS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const trackingNumber = `LTS-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload: Order = {
      id: orderId,
      userId: user?.uid || 'guest_collector',
      customerName: user?.displayName || customerNameInput.trim() || 'LITUS Patron',
      customerEmail: user?.email || customerEmailInput.trim() || 'patron@litus.store',
      customerPhone: customerPhone.trim() || undefined,
      items: items.map((i) => ({
        id: i.id,
        productId: i.product.id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
      totalAmount,
      subtotal,
      shippingFee: subtotal >= freeShippingThreshold ? 0 : 15,
      paymentMethod: method,
      paymentStatus: method === 'cod' ? 'pending' : 'paid',
      paymentReference: paymentRef || (method === 'cod' ? `COD-${orderId}` : `UPI-${Date.now().toString().slice(-6)}`),
      shippingStatus: 'processing',
      trackingNumber,
      carrier: 'DHL Carbon-Neutral Express',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      shippingAddress: shippingAddress.trim() || '742 Atelier Boulevard, Suite 500, Milan',
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Save to Firestore collection /orders
      await setDoc(doc(db, 'orders', orderId), orderPayload);

      // 2. Dispatch simulated order confirmation email via backend
      try {
        await fetch('/api/notifications/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: orderPayload }),
        });
      } catch (emailErr) {
        console.warn('Email notification route call failed:', emailErr);
      }

      setCreatedOrder(orderPayload);
      setOrderConfirmed(true);
      onClearCart();
    } catch (err) {
      console.error('Failed to record order to Firestore:', err);
    } finally {
      setIsCheckingOut(false);
      setIsUpiModalOpen(false);
    }
  };

  const handleProcessCheckout = () => {
    // Strict Validation: Phone number or WhatsApp is strictly MANDATORY for COD orders
    if (selectedMethod === 'cod') {
      const trimmed = customerPhone.trim();
      const digitsOnly = customerPhone.replace(/\D/g, '');
      if (!trimmed || digitsOnly.length < 10) {
        setPhoneError('Phone number or WhatsApp is strictly mandatory for Cash on Delivery (COD) orders to confirm physical delivery and dispatch verification. Please enter at least 10 digits.');
        setTimeout(() => {
          phoneInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          phoneInputRef.current?.focus();
        }, 100);
        return;
      }
    }
    setPhoneError(null);
    setCheckoutError(null);

    // Refresh order reference for this attempt
    const newRef = `LTS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    setCurrentOrderRef(newRef);

    if (selectedMethod === 'razorpay') {
      setIsCheckingOut(true);
      const itemNames = items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ');

      openRazorpayPayment({
        amountUSD: totalAmount,
        itemName: 'LITUS Atelier Order',
        description: itemNames.length > 50 ? `${items.length} Curated Garments` : itemNames,
        userEmail: user?.email || customerEmailInput || 'patron@litus.store',
        userName: user?.displayName || customerNameInput || 'LITUS Customer',
        contact: customerPhone || undefined,
        onSuccess: (paymentId) => {
          saveOrderToFirestore('razorpay', paymentId);
        },
        onError: (errMsg) => {
          setIsCheckingOut(false);
          setCheckoutError(errMsg);
        },
        onDismiss: () => {
          setIsCheckingOut(false);
        },
      });
    } else if (selectedMethod === 'gpay_upi') {
      // Launch the full-featured interactive UPI payment interface
      setIsUpiModalOpen(true);
    } else {
      // Cash on Delivery (COD) - validated phone number present
      setIsCheckingOut(true);
      setTimeout(() => {
        saveOrderToFirestore('cod');
      }, 700);
    }
  };

  const copyTracking = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div className="w-screen max-w-md bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-sky-950 text-blue-600 dark:text-sky-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white">
                    Atelier Wardrobe
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    {items.length} {items.length === 1 ? 'Garment' : 'Garments'} Curated
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Carbon-Neutral Shipping Unlocked
                    </span>
                  ) : (
                    <span>Add <strong className="text-slate-900 dark:text-white">${remainingForFreeShipping}</strong> for Complimentary Delivery</span>
                  )}
                </span>
                <span className="font-mono text-slate-500 text-[11px]">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {orderConfirmed && createdOrder ? (
                /* Order Confirmed Screen */
                <div className="py-6 text-center space-y-5 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      Order Placed & Dispatched
                    </span>
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-2">
                      Thank You, Patron
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      Your sustainable garments are being prepared. An order confirmation notification has been dispatched to{' '}
                      <strong className="text-slate-800 dark:text-slate-200">{createdOrder.customerEmail}</strong>.
                    </p>
                  </div>

                  {/* Order Receipt Box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400">Order ID</span>
                      <span className="font-bold text-sky-400">#{createdOrder.id}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Method</span>
                      <span className="text-slate-700 dark:text-slate-300 capitalize font-bold">
                        {createdOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Doorstep)' : createdOrder.paymentMethod === 'gpay_upi' ? 'GPay UPI' : 'Razorpay Secure'}
                      </span>
                    </div>

                    {createdOrder.customerPhone && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Phone / WhatsApp</span>
                        <span className="text-emerald-400 font-bold">{createdOrder.customerPhone}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        createdOrder.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {createdOrder.paymentStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">DHL Express Tracking</span>
                      <div className="flex items-center gap-1.5 font-bold text-sky-400">
                        <span>{createdOrder.trackingNumber}</span>
                        <button
                          onClick={() => copyTracking(createdOrder.trackingNumber || '')}
                          className="hover:text-white"
                          title="Copy tracking"
                        >
                          {copiedTracking ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400">Total Investment</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">${createdOrder.totalAmount} USD</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>View Email Confirmation Receipt</span>
                    </button>

                    {onOpenOrderHistory && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenOrderHistory();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4 text-sky-400" />
                        <span>Track Live Shipping in Profile</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setOrderConfirmed(false);
                        setCreatedOrder(null);
                        setPhoneError(null);
                        onClose();
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1"
                    >
                      Continue Exploring Store
                    </button>
                  </div>
                </div>
              ) : items.length === 0 ? (
                /* Empty Cart */
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Your Wardrobe is Empty
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      Explore our zero-waste architectural garments and sustainable luxury essentials.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                /* Active Cart Items & Checkout Setup */
                <div className="space-y-4">
                  {/* Google Auth Prompt Banner if not signed in */}
                  {!user && (
                    <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <LogIn className="w-3.5 h-3.5 text-sky-400" />
                          <span>Track with Firebase Auth</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Sign in to save order history & track live</div>
                      </div>
                      <button
                        type="button"
                        onClick={signIn}
                        className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 flex gap-3 relative group"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-20 object-cover rounded-lg bg-slate-900 shrink-0"
                        />

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.product.name}
                              </h4>
                              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white shrink-0">
                                ${item.product.price * item.quantity}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              Size {item.size} · {item.color}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-slate-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Method Selector (Razorpay vs GPay UPI vs COD) */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                        Select Payment Method
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Instant & COD Supported</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {/* 1. Razorpay */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMethod('razorpay');
                          setPhoneError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedMethod === 'razorpay'
                            ? 'border-sky-500 bg-sky-950/40 text-white font-semibold ring-1 ring-sky-500'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <CreditCard className="w-4 h-4 text-sky-400" />
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">CARDS</span>
                        </div>
                        <div>
                          <div className="text-slate-900 dark:text-white text-[11px] font-bold">Razorpay</div>
                          <div className="text-[9px] text-slate-400 leading-tight">Card / NetBank</div>
                        </div>
                      </button>

                      {/* 2. GPay UPI */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMethod('gpay_upi');
                          setPhoneError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedMethod === 'gpay_upi'
                            ? 'border-sky-500 bg-sky-950/40 text-white font-semibold ring-1 ring-sky-500'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <QrCode className="w-4 h-4 text-sky-400" />
                          <span className="text-[9px] font-mono text-sky-400 font-bold">UPI</span>
                        </div>
                        <div>
                          <div className="text-slate-900 dark:text-white text-[11px] font-bold">GPay UPI</div>
                          <div className="text-[9px] text-slate-400 leading-tight">GPay / QR / VPA</div>
                        </div>
                      </button>

                      {/* 3. Cash on Delivery (COD) */}
                      <button
                        type="button"
                        onClick={() => setSelectedMethod('cod')}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          selectedMethod === 'cod'
                            ? 'border-amber-500 bg-amber-950/30 text-white font-semibold ring-1 ring-amber-500'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Banknote className="w-4 h-4 text-amber-400" />
                          <span className="text-[9px] font-mono text-amber-400 font-bold">COD</span>
                        </div>
                        <div>
                          <div className="text-slate-900 dark:text-white text-[11px] font-bold">Doorstep</div>
                          <div className="text-[9px] text-amber-300 leading-tight">Phone/WhatsApp req.</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Customer Information (if guest) */}
                  {!user && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Recipient Name</label>
                        <input
                          type="text"
                          value={customerNameInput}
                          onChange={(e) => setCustomerNameInput(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Receipt Email</label>
                        <input
                          type="email"
                          value={customerEmailInput}
                          onChange={(e) => setCustomerEmailInput(e.target.value)}
                          placeholder="email@domain.com"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery Address Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Shipping Delivery Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street, City, Postal Code, Country..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  {/* MANDATORY Phone Number / WhatsApp Input (Mandatory for COD) */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    selectedMethod === 'cod'
                      ? phoneError
                        ? 'border-rose-500 bg-rose-500/10'
                        : 'border-amber-500/60 bg-amber-950/20 dark:bg-amber-950/30 ring-1 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                        <Phone className={`w-3.5 h-3.5 ${selectedMethod === 'cod' ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>Phone / WhatsApp Number</span>
                        {selectedMethod === 'cod' && (
                          <span className="text-rose-500 font-black text-sm">*</span>
                        )}
                      </label>
                      {selectedMethod === 'cod' ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 uppercase tracking-wider animate-pulse">
                          Mandatory for COD
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">Optional for Updates</span>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        required={selectedMethod === 'cod'}
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (phoneError) setPhoneError(null);
                        }}
                        placeholder={selectedMethod === 'cod' ? '+91 98765 43210 or WhatsApp number (Required)' : '+1 (555) 000-0000 or WhatsApp number'}
                        className={`w-full px-3 py-2 text-xs rounded-lg border font-mono transition-colors ${
                          phoneError && selectedMethod === 'cod'
                            ? 'border-rose-500 bg-rose-500/5 text-rose-500 placeholder:text-rose-400 focus:outline-rose-500 ring-2 ring-rose-500/30'
                            : selectedMethod === 'cod'
                            ? 'border-amber-500/40 bg-white dark:bg-slate-950 text-slate-900 dark:text-white'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                        }`}
                      />
                    </div>

                    {selectedMethod === 'cod' ? (
                      <div className="text-[10px] text-amber-600 dark:text-amber-300 font-mono mt-1.5 flex items-center gap-1.5 leading-relaxed">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>A verification message will be sent via WhatsApp/SMS to this number before courier dispatch.</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        Receive real-time courier dispatch SMS / WhatsApp updates.
                      </div>
                    )}

                    {phoneError && selectedMethod === 'cod' && (
                      <div className="text-[11px] text-rose-500 dark:text-rose-400 font-mono mt-2 flex items-start gap-1.5 bg-rose-500/10 p-2 rounded-lg border border-rose-500/40 animate-in fade-in">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                        <span>{phoneError}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout Trigger */}
            {items.length > 0 && !orderConfirmed && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090e17] space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900 dark:text-white font-medium tabular-nums">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon-Neutral Shipping</span>
                    <span className="font-mono text-slate-900 dark:text-white font-medium">
                      {subtotal >= freeShippingThreshold ? 'FREE' : '$15'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Investment</span>
                    <span className="font-mono text-base tabular-nums">
                      ${totalAmount.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs font-mono flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <span className="font-bold block uppercase text-[10px]">Payment Notice</span>
                      <span>{checkoutError}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProcessCheckout}
                  disabled={isCheckingOut}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-75 disabled:cursor-not-allowed ${
                    selectedMethod === 'cod'
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25'
                  }`}
                >
                  {isCheckingOut ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Securing Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>
                        {selectedMethod === 'razorpay'
                          ? `Pay with Razorpay ($${totalAmount})`
                          : selectedMethod === 'gpay_upi'
                          ? `Pay with GPay UPI ($${totalAmount})`
                          : `Confirm Cash on Delivery ($${totalAmount})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> End-to-End Encrypted
                  </span>
                  <span>·</span>
                  <span>DHL Express Tracking</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Featured Interactive UPI Payment Interface */}
      <UpiPaymentInterface
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        amountUSD={totalAmount}
        orderReference={currentOrderRef}
        customerName={user?.displayName || customerNameInput.trim() || 'LITUS Patron'}
        customerEmail={user?.email || customerEmailInput.trim() || 'patron@litus.store'}
        customerPhone={customerPhone}
        onPaymentSuccess={(upiRef) => {
          saveOrderToFirestore('gpay_upi', upiRef);
        }}
      />

      {/* Order Confirmation Email Viewer Modal */}
      <OrderConfirmationEmailModal
        order={createdOrder}
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </>
  );
};
