import React, { useState } from 'react';
import { LitusLogo } from './LitusLogo';
import { 
  ArrowRight, 
  Check, 
  Globe, 
  Instagram, 
  Twitter, 
  Disc as Discord, 
  Share2,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onOpenNFTModal: () => void;
  onOpenContactModal: () => void;
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenNFTModal,
  onOpenContactModal,
  onScrollToSection,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="bg-slate-900 text-white dark:bg-[#04070c] border-t border-slate-800 transition-colors pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          
          <div className="lg:col-span-6 space-y-4">
            <LitusLogo size="lg" />
            <p className="text-sm text-slate-300 max-w-md leading-relaxed font-light mt-3">
              <strong className="text-white font-medium">LIT</strong> represents our transformative inner fire; <strong className="text-white font-medium">US</strong> represents our global conscious community. Sustainable luxury tailored with closed-loop engineering and digital twin immutability.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span>Atelier: Milan · Tokyo</span>
              <span aria-hidden="true">·</span>
              <span>Global Dispatch</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
                Atelier Dispatch Bulletin
              </span>
              <h4 className="text-xl font-bold font-display text-white mt-1">
                Receive Private Drop Notifications
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Strictly limited editions and private Web3 mint previews. No promotional noise.
              </p>
            </div>

            <div className="mt-4">
              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3 bg-sky-950/50 border border-sky-500/30 rounded-lg text-xs text-sky-300 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>You are subscribed to the private LITUS bulletin.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-xs rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer whitespace-nowrap shadow-sm dark:electric-glow"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-slate-800 text-xs">
          
          <div>
            <h5 className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
              Collection
            </h5>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  onClick={() => onScrollToSection('products')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Featured Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('products')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Shirts & Overshirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('products')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Heavyweight Tees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('products')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Tailored Trousers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('products')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Modular Accessories
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
              Brand & Ethos
            </h5>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  onClick={() => onScrollToSection('story')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  The LITUS Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('craftsmanship')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Logo Deconstruction (Fire & Community)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('story')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Zero-Waste Patterning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('story')}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Circular Take-Back Program
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
              Web3 & Innovation
            </h5>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  onClick={onOpenNFTModal}
                  className="hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>NFT Marketplace</span>
                  <span className="text-[9px] font-mono uppercase bg-sky-950 text-sky-400 px-1 rounded">Beta</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenNFTModal}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Digital Twin NFC Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenNFTModal}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Solana Verified Contracts
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenNFTModal}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Smart Contract Audits
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
              Concierge & Legal
            </h5>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  onClick={onOpenContactModal}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Bespoke Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContactModal}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Sizing Guide
                </button>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer">
                  Sustainability Audit 2026
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer">
                  Terms & Intellectual Property
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} LITUS ARCHIVE. ALL RIGHTS RESERVED. ZERO-LANDFILL CERTIFIED.</p>

          <div className="flex items-center gap-5 text-slate-400">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-sky-400 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter X"
              className="hover:text-sky-400 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="hover:text-sky-400 transition-colors"
            >
              <Discord className="w-4 h-4" />
            </a>
            <button
              onClick={onOpenNFTModal}
              title="Web3 Vault Portal"
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
