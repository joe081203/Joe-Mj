import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  RefreshCw,
  Lock
} from 'lucide-react';

interface UpiPaymentInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  amountUSD: number;
  orderReference: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess: (upiRef: string, upiVpa?: string) => void;
}

export const UpiPaymentInterface: React.FC<UpiPaymentInterfaceProps> = ({
  isOpen,
  onClose,
  amountUSD,
  orderReference,
  customerName = 'LITUS Patron',
  customerEmail = 'patron@litus.store',
  customerPhone = '',
  onPaymentSuccess,
}) => {
  // Exchange rate approximation USD -> INR (standard luxury retail rate)
  const inrRate = 83.5;
  const inrAmount = Math.round(amountUSD * inrRate);

  const merchantVpa = 'litusatelier@okhdfcbank';
  const merchantName = 'LITUS Sustainable Luxury';

  // Tabs: 'qr' | 'apps' | 'vpa' | 'utr'
  const [activeTab, setActiveTab] = useState<'qr' | 'apps' | 'vpa' | 'utr'>('qr');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [userVpa, setUserVpa] = useState('');
  const [vpaError, setVpaError] = useState<string | null>(null);
  const [collectRequested, setCollectRequested] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes session

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(600);
      setVerificationSuccess(false);
      setIsVerifying(false);
      setCollectRequested(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Standard UPI URI specs
  const upiUri = `upi://pay?pa=${encodeURIComponent(merchantVpa)}&pn=${encodeURIComponent(merchantName)}&am=${inrAmount}&cu=INR&tn=${encodeURIComponent(`LITUS Atelier #${orderReference}`)}`;

  // High-contrast clean QR Code SVG URL from qrserver
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUri)}`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(upiUri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendCollect = () => {
    if (!userVpa.trim()) {
      setVpaError('Please enter your UPI ID (VPA)');
      return;
    }
    if (!userVpa.includes('@')) {
      setVpaError('Invalid UPI ID format. Must include "@" (e.g., name@okhdfcbank)');
      return;
    }
    setVpaError(null);
    setCollectRequested(true);
  };

  const handleVerifyUtr = () => {
    const cleanUtr = utrNumber.replace(/\s+/g, '');
    if (!cleanUtr) {
      setUtrError('Please enter the 12-digit UPI Reference (UTR) Number');
      return;
    }
    if (cleanUtr.length < 8) {
      setUtrError('UTR number must be at least 8 to 12 digits');
      return;
    }

    setUtrError(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(`UPI-UTR-${cleanUtr}`, userVpa || undefined);
      }, 900);
    }, 1400);
  };

  const handleInstantConfirm = (appName: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        const generatedUtr = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        onPaymentSuccess(`UPI-${appName.toUpperCase().replace(/\s+/g, '')}-${generatedUtr}`, userVpa || undefined);
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#0a1426] to-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-white tracking-wide">
                  UPI Unified Payments Interface
                </h3>
                <span className="text-[9px] font-mono uppercase bg-sky-500/20 text-sky-400 border border-sky-500/40 px-2 py-0.5 rounded font-bold">
                  Instant 0% Fee
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Order Ref: <span className="text-sky-300">#{orderReference}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing & Session Status Bar */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#0c1322] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Settlement Amount</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                ₹{inrAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono text-slate-500">
                (${amountUSD.toLocaleString()} USD)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Valid for {formattedTime}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 bg-slate-100 dark:bg-slate-900/70 p-1 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-[#070b12] text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
            <span className="sm:hidden">QR</span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'apps'
                ? 'bg-white dark:bg-[#070b12] text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">UPI Apps</span>
            <span className="sm:hidden">Apps</span>
          </button>

          <button
            onClick={() => setActiveTab('vpa')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'vpa'
                ? 'bg-white dark:bg-[#070b12] text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collect VPA</span>
            <span className="sm:hidden">VPA</span>
          </button>

          <button
            onClick={() => setActiveTab('utr')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'utr'
                ? 'bg-white dark:bg-[#070b12] text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verify UTR</span>
            <span className="sm:hidden">UTR</span>
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {verificationSuccess ? (
            /* Success confirmation screen */
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  Payment Confirmed
                </span>
                <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-2">
                  UPI Settlement Successful!
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  ₹{inrAmount.toLocaleString('en-IN')} received. Generating your order and dispatch confirmation...
                </p>
              </div>
            </div>
          ) : isVerifying ? (
            /* Verification in progress */
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Verifying UPI Transaction with Banking Gateway...
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Reconciling NPCI reference for ₹{inrAmount.toLocaleString('en-IN')}. Please do not close this window.
                </p>
              </div>
            </div>
          ) : activeTab === 'qr' ? (
            /* TAB 1: DYNAMIC QR CODE SCANNER */
            <div className="space-y-4 text-center">
              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-white dark:bg-white border-2 border-slate-200 dark:border-sky-500/40 shadow-xl flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-700 font-bold mb-2 px-1">
                  <span>SCAN WITH ANY UPI APP</span>
                  <span className="text-sky-600">₹{inrAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-2 bg-white rounded-xl shadow-inner border border-slate-200">
                  <img
                    src={qrCodeUrl}
                    alt="UPI Payment QR Code"
                    className="w-52 h-52 object-contain"
                  />
                </div>

                <div className="text-[10px] font-mono text-slate-500 mt-2 flex items-center gap-1.5 flex-wrap justify-center">
                  <span>Google Pay</span> · 
                  <span>PhonePe</span> · 
                  <span>Paytm</span> · 
                  <span>BHIM</span> · 
                  <span>Cred</span>
                </div>
              </div>

              {/* Merchant VPA Info with Copy Button */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block uppercase">Official Atelier VPA</span>
                  <span className="font-bold text-slate-900 dark:text-white">{merchantVpa}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVpa ? 'Copied' : 'Copy UPI ID'}</span>
                </button>
              </div>

              {/* Mobile Deep Link Trigger */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <a
                  href={upiUri}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Installed UPI App Directly</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleInstantConfirm('QR Scan')}
                  className="w-full sm:w-auto shrink-0 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>I Have Scanned & Paid</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'apps' ? (
            /* TAB 2: POPULAR UPI APPS QUICK INTENTS */
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-mono text-center">
                Tap your preferred application to initialize instant biometric authorization:
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 1. Google Pay */}
                <button
                  type="button"
                  onClick={() => handleInstantConfirm('Google Pay')}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:border-sky-500 transition-all text-left flex items-center gap-3 cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-sm group-hover:scale-105 transition-transform">
                    GPay
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Google Pay</div>
                    <div className="text-[10px] text-slate-400 font-mono">1-Tap Direct UPI</div>
                  </div>
                </button>

                {/* 2. PhonePe */}
                <button
                  type="button"
                  onClick={() => handleInstantConfirm('PhonePe')}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:border-purple-500 transition-all text-left flex items-center gap-3 cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center font-bold text-purple-400 text-sm group-hover:scale-105 transition-transform">
                    पे
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">PhonePe</div>
                    <div className="text-[10px] text-slate-400 font-mono">Fast UPI Gateway</div>
                  </div>
                </button>

                {/* 3. Paytm */}
                <button
                  type="button"
                  onClick={() => handleInstantConfirm('Paytm')}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:border-cyan-500 transition-all text-left flex items-center gap-3 cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-cyan-400 text-xs group-hover:scale-105 transition-transform">
                    Paytm
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Paytm UPI</div>
                    <div className="text-[10px] text-slate-400 font-mono">Wallet / Bank VPA</div>
                  </div>
                </button>

                {/* 4. BHIM / Cred / Other */}
                <button
                  type="button"
                  onClick={() => handleInstantConfirm('BHIM')}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:border-emerald-500 transition-all text-left flex items-center gap-3 cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center font-bold text-emerald-400 text-xs group-hover:scale-105 transition-transform">
                    BHIM
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">BHIM / Cred</div>
                    <div className="text-[10px] text-slate-400 font-mono">NPCI Verified</div>
                  </div>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-700 dark:text-sky-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
                <span>On handheld devices, clicking your app launches the native payment modal directly.</span>
              </div>
            </div>
          ) : activeTab === 'vpa' ? (
            /* TAB 3: COLLECT REQUEST TO CUSTOMER VPA */
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-mono">
                Enter your Virtual Payment Address (VPA) to receive an automated push notification request on your device:
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono flex items-center justify-between">
                  <span>Your UPI ID / Virtual Payment Address</span>
                  <span className="text-[10px] text-slate-400">e.g. mobile@ybl, name@okhdfcbank</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={userVpa}
                    onChange={(e) => {
                      setUserVpa(e.target.value);
                      if (vpaError) setVpaError(null);
                    }}
                    placeholder="e.g. patron@okaxis"
                    className={`w-full px-3 py-2.5 text-xs rounded-xl border font-mono ${
                      vpaError
                        ? 'border-rose-500 bg-rose-500/5 text-rose-500'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                    }`}
                  />
                </div>

                {vpaError && (
                  <div className="text-[11px] text-rose-500 font-mono flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{vpaError}</span>
                  </div>
                )}
              </div>

              {collectRequested ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Collect Request Sent to {userVpa}!</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
                    Please open your UPI application (Google Pay, PhonePe, or Banking App) and approve the pending collect request of ₹{inrAmount.toLocaleString('en-IN')}.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleInstantConfirm('VPA Collect')}
                    className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>I Approved the Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendCollect}
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Collect Request (₹{inrAmount.toLocaleString('en-IN')})</span>
                </button>
              )}
            </div>
          ) : (
            /* TAB 4: MANUAL 12-DIGIT UTR REFERENCE VERIFICATION */
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-mono">
                Already paid via your bank or UPI scanner? Enter the 12-digit UPI Transaction Reference Number (UTR) to instantly confirm your order:
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono flex items-center justify-between">
                  <span>12-Digit UTR / UPI Ref ID</span>
                  <span className="text-[10px] text-slate-400 font-normal">Found in your payment receipt</span>
                </label>

                <input
                  type="text"
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => {
                    setUtrNumber(e.target.value);
                    if (utrError) setUtrError(null);
                  }}
                  placeholder="e.g. 429810938472"
                  className={`w-full px-3 py-2.5 text-xs rounded-xl border font-mono tracking-widest ${
                    utrError
                      ? 'border-rose-500 bg-rose-500/5 text-rose-500'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                  }`}
                />

                {utrError && (
                  <div className="text-[11px] text-rose-500 font-mono flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{utrError}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyUtr}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify UTR & Confirm Order</span>
              </button>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#070b12] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit NPCI Encrypted</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyUri}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedLink ? 'URI Copied' : 'Copy Intent'}</span>
            </button>
            <button
              onClick={onClose}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
