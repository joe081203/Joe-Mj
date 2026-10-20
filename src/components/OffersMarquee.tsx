import React, { useState } from 'react';
import { 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  Layers, 
  RefreshCw, 
  Truck, 
  Zap, 
  ArrowRight,
  Flame,
  Percent
} from 'lucide-react';

interface OffersMarqueeProps {
  onViewCombos?: () => void;
  onOpenThriftShop?: () => void;
  onShopClick?: () => void;
}

export const OffersMarquee: React.FC<OffersMarqueeProps> = ({
  onViewCombos,
  onOpenThriftShop,
  onShopClick,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const OFFERS = [
    {
      id: 'coupon',
      badge: 'PROMO CODE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Tag,
      text: '$20 OFF orders over $150 with code',
      highlight: 'LOTUS20',
      actionType: 'copy',
      actionText: 'Click to Copy',
      codeToCopy: 'LOTUS20'
    },
    {
      id: 'combos',
      badge: 'BUNDLE DEALS',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      icon: Layers,
      text: 'Curated Lotus Combos: Save up to $85 & 20% on Full Wardrobe Sets',
      highlight: 'Explore Bundles',
      actionType: 'combos',
      actionText: 'View Combos →'
    },
    {
      id: 'shipping',
      badge: 'FREE DELIVERY',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      icon: Truck,
      text: 'Complimentary Express Courier on orders over $200 worldwide',
      highlight: 'Free Shipping',
      actionType: 'shop',
      actionText: 'Shop Catalog'
    },
    {
      id: 'nft',
      badge: 'WEB3 TWIN',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      icon: Sparkles,
      text: 'Complimentary on-chain encrypted Polygon digital twin with core garments',
      highlight: 'NFC On-Chain',
      actionType: 'info'
    },
    {
      id: 'circular',
      badge: 'CIRCULAR ATELIER',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
      icon: RefreshCw,
      text: 'Zero-Waste Takeback: Return pre-worn LITUS anytime for 30% lifetime credit',
      highlight: '30% Credit',
      actionType: 'info'
    },
    {
      id: 'thrift',
      badge: 'THRIFT SHOP',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      icon: Flame,
      text: 'Pre-Loved Vintage Vault: Authenticated Carhartt, Nike, Levi’s, Arc’teryx archive',
      highlight: 'Curated Drops',
      actionType: 'thrift',
      actionText: 'Open Thrift →'
    }
  ];

  const renderOfferItem = (offer: typeof OFFERS[0], keyPrefix: string) => {
    const Icon = offer.icon;
    const isCopied = copiedCode === offer.codeToCopy;

    return (
      <div 
        key={`${keyPrefix}-${offer.id}`}
        className="inline-flex items-center gap-2.5 px-6 shrink-0 group select-none"
      >
        {/* Badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border ${offer.badgeColor}`}>
          <Icon className="w-2.5 h-2.5 shrink-0" />
          <span>{offer.badge}</span>
        </span>

        {/* Text */}
        <span className="text-[11px] font-sans font-medium text-slate-200">
          {offer.text}
        </span>

        {/* Interactive Action Pill */}
        {offer.actionType === 'copy' && offer.codeToCopy && (
          <button
            onClick={(e) => handleCopyCode(offer.codeToCopy!, e)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-mono text-[10px] font-bold border border-slate-700 hover:border-emerald-400 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Click to copy voucher code"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-300 group-hover:text-slate-950" />
                <span>LOTUS20 Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-emerald-400" />
                <span>{offer.highlight}</span>
                <span className="text-[9px] text-slate-400 opacity-80 underline">Copy</span>
              </>
            )}
          </button>
        )}

        {offer.actionType === 'combos' && onViewCombos && (
          <button
            onClick={onViewCombos}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 hover:bg-sky-400 hover:text-slate-950 text-sky-300 font-mono text-[10px] font-bold border border-sky-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>{offer.actionText}</span>
          </button>
        )}

        {offer.actionType === 'thrift' && onOpenThriftShop && (
          <button
            onClick={onOpenThriftShop}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/80 hover:bg-rose-400 hover:text-slate-950 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>{offer.actionText}</span>
          </button>
        )}

        {offer.actionType === 'shop' && onShopClick && (
          <button
            onClick={onShopClick}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 hover:bg-amber-400 hover:text-slate-950 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>{offer.actionText}</span>
          </button>
        )}

        {/* Separator Diamond */}
        <span className="text-slate-600 font-mono text-xs pl-2">✦</span>
      </div>
    );
  };

  return (
    <div className="relative w-full bg-[#050811]/95 dark:bg-[#03060d]/95 backdrop-blur-xl border-b border-sky-500/20 text-white overflow-hidden py-1.5 z-50">
      {/* Edge gradient mask for luxury fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#050811] via-[#050811]/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#050811] via-[#050811]/80 to-transparent z-10" />

      {/* Marquee Track */}
      <div className="flex items-center overflow-hidden">
        {/* Continuous Looping Container */}
        <div className="animate-marquee-scroll flex items-center whitespace-nowrap">
          {/* First Copy */}
          {OFFERS.map((offer) => renderOfferItem(offer, 'copy1'))}
          {/* Second Duplicate Copy for Seamless Infinite Loop */}
          {OFFERS.map((offer) => renderOfferItem(offer, 'copy2'))}
        </div>
      </div>
    </div>
  );
};
