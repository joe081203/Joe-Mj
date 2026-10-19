import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  Hammer, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Lock
} from 'lucide-react';

interface NFTUnderConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NFTUnderConstructionModal: React.FC<NFTUnderConstructionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [emailOrWallet, setEmailOrWallet] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrWallet.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#090d16] text-white rounded-2xl border border-sky-500/40 shadow-2xl overflow-hidden p-6 sm:p-8 electric-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent cyber line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Under Construction Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Hammer className="w-3.5 h-3.5" />
            <span>Under Construction // Phase 2 Protocol</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800">
            <Lock className="w-3 h-3" />
            <span>Smart Contracts Auditing</span>
          </span>
        </div>

        {/* Headline Quote */}
        <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white mt-2">
          “More Than a Brand, Own an Asset”
        </h3>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed font-light">
          The LITUS NFT Marketplace is currently undergoing security audits and zero-knowledge rollup integration. Physical garments from Collection 01 will link directly to verified digital twins on-chain.
        </p>

        {/* Interactive Feature Sneak Peek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">Garment NFC Pairing</div>
              <div className="text-slate-400 text-[11px] mt-0.5 font-sans">
                Scan sewn-in NFC microchips to claim your immutable ERC-721 token.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Layers className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">Metaverse Ready 3D</div>
              <div className="text-slate-400 text-[11px] mt-0.5 font-sans">
                Interoperable .GLB & .USDZ wearables for virtual avatars.
              </div>
            </div>
          </div>
        </div>

        {/* Whitelist Priority Sign-up Form */}
        <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/20">
          {isSubmitted ? (
            <div className="flex items-center gap-3 py-2 text-sky-300 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-sm">Whitelist Reservation Confirmed</div>
                <div className="text-xs text-slate-300">
                  You are registered for Early Genesis Minting. We will notify you when deployment goes live.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Request Whitelist & Private Beta Invitation
                </span>
                <span className="text-[10px] text-sky-400 font-mono">0 Gas Fees on Mint</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter email or 0x / Solana wallet..."
                  value={emailOrWallet}
                  onChange={(e) => setEmailOrWallet(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-medium rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors cursor-pointer whitespace-nowrap shadow-md shadow-sky-500/20"
                >
                  Join Genesis Whitelist
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer controls */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
          <span>Target Launch: Q3 2026</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
