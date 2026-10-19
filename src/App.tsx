import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductSection } from './components/ProductSection';
import { StorySection } from './components/StorySection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { ContactModal } from './components/ContactModal';
import { NFTMarketplacePage } from './components/NFTMarketplacePage';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminProductManager } from './components/AdminProductManager';
import { HeroNewReleases } from './components/HeroNewReleases';
import { ThriftShopModal } from './components/ThriftShopModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useProducts } from './hooks/useProducts';
import { Product, CartItem, ProductCategory } from './types';
import { PRODUCTS } from './data/products';

function AppContent() {
  const { user, isAdmin, isDistributor } = useAuth();
  const { products, allProducts, saveProduct, deleteProduct } = useProducts(isAdmin, isDistributor);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentView, setCurrentView] = useState<'store' | 'nft-marketplace'>('store');
  const [cart, setCart] = useState<CartItem[]>(() => {
    return [
      {
        id: 'initial-item-1',
        product: PRODUCTS[0],
        size: 'L',
        color: 'Marine Navy',
        quantity: 1,
      },
    ];
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('recommended');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);
  const [isThriftShopOpen, setIsThriftShopOpen] = useState(false);

  const handleViewCombos = () => {
    setSelectedCategory('combos');
    scrollToSection('products');
  };

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync URL hash with current view
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#nft-marketplace') {
        setCurrentView('nft-marketplace');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('store');
      }
    };

    if (window.location.hash === '#nft-marketplace') {
      setCurrentView('nft-marketplace');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openNFTMarketplace = () => {
    setCurrentView('nft-marketplace');
    window.location.hash = '#nft-marketplace';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToStore = () => {
    setCurrentView('store');
    window.location.hash = '#store';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAddToCart = (
    product: Product,
    size: string = 'M',
    color?: string,
    quantity: number = 1
  ) => {
    const chosenColor = color || product.colors[0]?.name || 'Default';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          id: `${product.id}-${size}-${chosenColor}-${Date.now()}`,
          product,
          size,
          color: chosenColor,
          quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToSection = (id: string) => {
    if (currentView === 'nft-marketplace') {
      setCurrentView('store');
      window.location.hash = '#store';
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // View: NFT Marketplace Webpage (Shirts Collection only, with Firebase Auth & Razorpay)
  if (currentView === 'nft-marketplace') {
    return (
      <div className="min-h-screen bg-white text-slate-900 dark:bg-[#070b12] dark:text-slate-100 transition-colors duration-300">
        <NFTMarketplacePage onBackToStore={returnToStore} />
      </div>
    );
  }

  // View: Main Brand Store
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#070b12] dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        openNFTMarketplace={openNFTMarketplace}
        openUserProfile={() => setIsUserProfileOpen(true)}
        openContactModal={() => setIsContactModalOpen(true)}
        openThriftShop={() => setIsThriftShopOpen(true)}
        scrollToSection={scrollToSection}
        onOpenAdminManager={() => setIsAdminManagerOpen(true)}
      />

      <main>
        {/* Full Screen 3-Slide Scrolling Parallax Carousel */}
        <HeroCarousel
          onShopClick={() => scrollToSection('products')}
          onNFTClick={openNFTMarketplace}
          onStoryClick={() => scrollToSection('story')}
        />

        {/* Hero Page: Exclusive Offers & New Releases Spotlight */}
        <HeroNewReleases
          products={products}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={(product, size) => handleAddToCart(product, size)}
          onViewCombos={handleViewCombos}
        />

        {/* Product Catalog Grid with Minimalist View, Category Filters & Curated Combos */}
        <ProductSection
          products={products}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={(product, size) => handleAddToCart(product, size)}
          onOpenNFTModal={openNFTMarketplace}
          onOpenAdminManager={() => setIsAdminManagerOpen(true)}
        />

        {/* Story Section: Brand Motto, Sustainable Craftsmanship, and Full Logo Explanation */}
        <StorySection
          onExploreClick={() => scrollToSection('products')}
        />
      </main>

      {/* Footer with Socials & Useful Links */}
      <Footer
        onOpenNFTModal={openNFTMarketplace}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Modals & Slide-overs */}
      {/* Product Preview & Full-Page Modal with Recommendations Down Below */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          allProducts={products}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenNFTModal={() => {
            setSelectedProduct(null);
            openNFTMarketplace();
          }}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Shopping Bag Slide-over with Razorpay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenOrderHistory={() => setIsUserProfileOpen(true)}
      />

      {/* VIP Concierge / Sizing Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* User Profile Component Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onOpenNFTMarketplace={openNFTMarketplace}
        onOpenAdminManager={() => setIsAdminManagerOpen(true)}
      />

      {/* LITUS Certified Thrift Shop & Reseller Vault Modal */}
      <ThriftShopModal
        isOpen={isThriftShopOpen}
        onClose={() => setIsThriftShopOpen(false)}
        onAddToCart={(product, size) => handleAddToCart(product, size)}
      />

      {/* Private Admin Product Upload & Management Modal (Owner Only) */}
      {isAdmin && (
        <AdminProductManager
          isOpen={isAdminManagerOpen}
          onClose={() => setIsAdminManagerOpen(false)}
          products={allProducts}
          onSaveProduct={saveProduct}
          onDeleteProduct={deleteProduct}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
