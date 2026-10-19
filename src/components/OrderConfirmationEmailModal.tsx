import React, { useState } from 'react';
import { Order } from '../types';
import { 
  X, 
  Mail, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Send,
  Printer,
  CheckCircle2,
  Package
} from 'lucide-react';

interface OrderConfirmationEmailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderConfirmationEmailModal: React.FC<OrderConfirmationEmailModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [activeView, setActiveView] = useState<'preview' | 'raw'>('preview');

  if (!isOpen || !order) return null;

  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(order.createdAt || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentLabel = order.paymentMethod === 'cod' 
    ? 'Cash on Delivery (Pending at Doorstep)' 
    : order.paymentMethod === 'gpay_upi'
    ? 'Google Pay UPI (Confirmed Settlement)'
    : 'Razorpay Secure Checkout (Card / NetBanking)';

  const handleResendEmail = async () => {
    setIsSending(true);
    try {
      await fetch('/api/notifications/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to resend confirmation email:', err);
    } finally {
      setIsSending(false);
    }
  };

  const copyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#0a1220] to-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-white">
                  Order Confirmation Notification
                </h3>
                <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Dispatched
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Delivered to: <span className="text-sky-300">{order.customerEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView(activeView === 'preview' ? 'raw' : 'preview')}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {activeView === 'preview' ? 'View Text' : 'View Preview'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast if resent */}
        {sendSuccess && (
          <div className="p-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Order confirmation email successfully re-dispatched to {order.customerEmail}!</span>
          </div>
        )}

        {/* Email Body Viewport */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-slate-100 dark:bg-[#04070d]">
          {activeView === 'preview' ? (
            /* Luxury Branded Email Client Render */
            <div className="max-w-xl mx-auto bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
              {/* Email Banner */}
              <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 text-white text-center">
                <div className="text-2xl font-black font-display tracking-widest uppercase">
                  LITUS
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-sky-200 mt-1">
                  Atelier Sustainable Luxury · SS26 Archive
                </div>
              </div>

              {/* Email Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Your Atelier Order is Confirmed
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Dear <strong className="text-slate-800 dark:text-slate-200">{order.customerName || 'Valued Patron'}</strong>, thank you for acquiring our conscious technical garments. Your pieces are currently undergoing master inspection and tailored dispatch.
                  </p>
                </div>

                {/* Order Details Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Order Reference</span>
                    <span className="font-bold text-sky-500">#{order.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date & Time</span>
                    <span className="text-slate-700 dark:text-slate-300">{formattedDate} ({formattedTime})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Payment Method</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{paymentLabel}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Payment Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Settled (Paid)' : 'Pending Doorstep Settlement'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Courier Logistics</span>
                    <span className="text-slate-700 dark:text-slate-300">{order.carrier || 'DHL Carbon-Neutral Express'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tracking Code</span>
                    <div className="flex items-center gap-1.5 font-bold text-sky-400">
                      <span>{order.trackingNumber || 'Allocation in progress'}</span>
                      {order.trackingNumber && (
                        <button
                          onClick={copyTracking}
                          className="hover:text-white p-0.5"
                          title="Copy tracking"
                        >
                          {copiedTracking ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] mb-0.5">Shipping Destination</span>
                    <span className="text-slate-700 dark:text-slate-300 font-sans">{order.shippingAddress}</span>
                  </div>

                  {order.customerPhone && (
                    <div className="flex items-center justify-between pt-1 text-xs font-mono">
                      <span className="text-slate-400">Phone / WhatsApp</span>
                      <span className="text-emerald-500 font-bold">{order.customerPhone}</span>
                    </div>
                  )}

                  {order.paymentReference && (
                    <div className="flex items-center justify-between pt-1 text-xs font-mono">
                      <span className="text-slate-400">Payment Reference</span>
                      <span className="text-sky-400">{order.paymentReference}</span>
                    </div>
                  )}
                </div>

                {/* Items Acquired */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Acquired Garments
                  </div>

                  <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-12 object-cover rounded bg-slate-900 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Size {item.size} · {item.color} · Qty {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          ${item.price * item.quantity} USD
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Total Charged (Incl. Carbon-Offset Delivery):</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      ${order.totalAmount} USD
                    </span>
                  </div>
                </div>

                {/* Sustainable Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 text-center text-[10px] font-mono text-slate-400 space-y-1">
                  <div>LITUS Couture Lab · Zero-Waste Carbon-Negative Fashion</div>
                  <div>Milan · Paris · Tokyo · Web3 Digital Wardrobe</div>
                </div>
              </div>
            </div>
          ) : (
            /* Raw Text representation */
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 whitespace-pre-wrap">
              {`SUBJECT: Order Confirmed: #${order.id} — LITUS Atelier SS26
TO: ${order.customerEmail}
DATE: ${formattedDate}

LITUS ATELIER CONFIRMATION
Order ID: #${order.id}
Customer: ${order.customerName}
Delivery Address: ${order.shippingAddress}
Payment: ${paymentLabel} (${order.paymentStatus})
Courier: ${order.carrier} (Tracking: ${order.trackingNumber})

ITEMS:
${order.items.map((i) => `- ${i.name} [Size: ${i.size}, Color: ${i.color}, Qty: ${i.quantity}] -> $${i.price * i.quantity}`).join('\n')}

TOTAL: $${order.totalAmount} USD
Thank you for supporting sustainable luxury craftsmanship.`}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-white dark:bg-[#070b12] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            Tracking: <span className="text-sky-400 font-bold">{order.trackingNumber || 'Pending'}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleResendEmail}
              disabled={isSending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer disabled:opacity-75"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending Dispatch...' : 'Resend Email Notification'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
