import React, { useState, useEffect } from 'react';
import { LitusLogo } from './LitusLogo';
import { OffersMarquee } from './OffersMarquee';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  Recycle,
  Tag 
} from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cartCount: number;
  openCart: () => void;
  openNFTMarketplace: () => void;
  openUserProfile: () => void;
  openContactModal: () => void;
  openThriftShop: () => void;
  scrollToSection: (id: string) => void;
  onOpenAdminManager?: () => void;
  onViewCombos?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  cartCount,
  openCart,
  openNFTMarketplace,
  openUserProfile,
  openContactModal,
  openThriftShop,
  scrollToSection,
  onOpenAdminManager,
  onViewCombos,
}) => {
  const { user, signIn, signOut, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#070b12]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white'
        }`}
      >
        {/* Continuous Offers Marquee at the Top of Navbar */}
        <OffersMarquee
          onViewCombos={onViewCombos}
          onOpenThriftShop={openThriftShop}
          onShopClick={() => handleNavClick('products')}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark & Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
          >
            <LitusLogo size="md" />
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button
              onClick={() => handleNavClick('products')}
              className={`hover:text-blue-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap cursor-pointer ${
                isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-slate-100 hover:text-white'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className={`hover:text-blue-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap cursor-pointer ${
                isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-slate-100 hover:text-white'
              }`}
            >
              Our Story & Logo
            </button>
            <button
              onClick={() => handleNavClick('craftsmanship')}
              className={`hover:text-blue-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap cursor-pointer ${
                isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-slate-100 hover:text-white'
              }`}
            >
              Craftsmanship
            </button>
            
            {/* Working NFT Market Navbar Button */}
            <button
              onClick={openNFTMarketplace}
              title="Open LITUS NFT Marketplace (Shirts Collection)"
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono tracking-wider uppercase rounded-md border transition-all cursor-pointer ${
                isScrolled
                  ? 'border-blue-600 bg-blue-50/80 text-blue-600 dark:border-sky-400 dark:bg-sky-950/40 dark:text-sky-400 hover:bg-blue-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950'
                  : 'border-sky-400/80 text-white hover:bg-sky-400 hover:text-slate-950 bg-black/40 backdrop-blur-md'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold">NFT Market</span>
              <span className="text-[9px] font-mono px-1 rounded bg-sky-500/20 text-sky-300">Shirts</span>
            </button>

            {/* Multi-Brand Thrift Shop & Reseller Navbar Button */}
            <button
              onClick={openThriftShop}
              title={isAdmin ? "Multi-Brand Thrift Shop - Admin Reseller & Vault" : "Multi-Brand Thrift Shop - Curated Multi-Brand Pre-Loved Archive"}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono tracking-wider uppercase rounded-md border transition-all cursor-pointer ${
                isScrolled
                  ? 'border-amber-500 bg-amber-50/80 text-amber-800 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950'
                  : 'border-amber-400/80 text-white hover:bg-amber-400 hover:text-slate-950 bg-black/40 backdrop-blur-md shadow-md'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">Thrift Shop</span>
              <span className="text-[9px] font-mono px-1 rounded bg-amber-400/20 text-amber-300">
                {isAdmin ? 'Admin Resell' : 'Curated'}
              </span>
            </button>

            <button
              onClick={openContactModal}
              className={`hover:text-blue-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap cursor-pointer ${
                isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-slate-100 hover:text-white'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Interactive Controls (Admin Upload, Firebase Auth, Theme Toggle, Bag Drawer, Hamburger) */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Private Admin Upload Button (strictly for authorized owner email) */}
            {isAdmin && onOpenAdminManager && (
              <button
                onClick={onOpenAdminManager}
                title="Private Product Upload & Inventory (Owner Only)"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Upload System</span>
              </button>
            )}

            {/* Firebase Auth Account Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={openUserProfile}
                  title={`Signed in as ${user.email} · View Collector Profile & History`}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-xs"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-sky-400" />
                  )}
                  <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate">
                    {user.displayName || (isAdmin ? 'Admin' : 'Profile')}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                title="Sign in with Firebase Auth"
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isScrolled
                    ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-800" />
              ) : (
                <Sun className="w-5 h-5 text-sky-400" />
              )}
            </button>

            {/* Shopping Bag Button with Badge */}
            <button
              onClick={openCart}
              aria-label="View Shopping Bag"
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 dark:bg-sky-400 text-white dark:text-slate-950 font-mono text-[11px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in-50">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled
                  ? 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 p-6 flex flex-col justify-between shadow-2xl border-l border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                <LitusLogo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Auth Status */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {user ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openUserProfile();
                      }}
                      className="flex items-center gap-2 text-left cursor-pointer flex-1"
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="User" className="w-7 h-7 rounded-full" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-sky-400" />
                      )}
                      <div className="text-left text-xs">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{user.displayName || 'Collector'}</span>
                          <span className="text-[9px] font-mono text-sky-500">(View Profile)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{user.email}</div>
                      </div>
                    </button>
                    <button
                      onClick={signOut}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signIn();
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Firebase Auth</span>
                  </button>
                )}
              </div>

              {/* Private Admin Upload Mobile Action (strictly for owner) */}
              {isAdmin && onOpenAdminManager && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdminManager();
                  }}
                  className="w-full mt-3 py-2.5 px-3 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-between shadow-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Private Product Upload</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded">Owner</span>
                </button>
              )}

              <div className="flex flex-col gap-4 mt-6 text-base font-medium">
                <button
                  onClick={() => handleNavClick('products')}
                  className="text-left py-2 hover:text-blue-600 dark:hover:text-sky-400 flex items-center justify-between group"
                >
                  <span>Collection & Catalog</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-sky-400" />
                </button>
                <button
                  onClick={() => handleNavClick('story')}
                  className="text-left py-2 hover:text-blue-600 dark:hover:text-sky-400 flex items-center justify-between group"
                >
                  <span>Our Story & Logo Origin</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-sky-400" />
                </button>
                <button
                  onClick={() => handleNavClick('craftsmanship')}
                  className="text-left py-2 hover:text-blue-600 dark:hover:text-sky-400 flex items-center justify-between group"
                >
                  <span>Sustainable Craftsmanship</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-sky-400" />
                </button>
                
                {/* Mobile Working NFT Trigger */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openNFTMarketplace();
                  }}
                  className="text-left py-3 px-3 rounded-lg bg-blue-50 dark:bg-sky-950/40 border border-blue-200 dark:border-sky-800/60 text-blue-600 dark:text-sky-400 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">NFT Marketplace (Shirts)</span>
                  </div>
                  <span className="text-xs font-mono uppercase bg-blue-600 text-white dark:bg-sky-400 dark:text-slate-950 px-2 py-0.5 rounded font-bold">Open</span>
                </button>

                {/* Mobile Multi-Brand Thrift Shop Trigger */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openThriftShop();
                  }}
                  className="text-left py-3 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold">Thrift Shop (Multi-Brand)</span>
                  </div>
                  <span className="text-xs font-mono uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                    {isAdmin ? 'Admin Resell' : 'Browse Vault'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openContactModal();
                  }}
                  className="text-left py-2 hover:text-blue-600 dark:hover:text-sky-400 flex items-center justify-between group"
                >
                  <span>VIP Concierge & Contact</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-sky-400" />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-slate-800" />
                    <span>Dark Theme</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-sky-400" />
                    <span>Light Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
