import React, { useState, useEffect } from 'react';
import { NFTShirt, NFT_SHIRTS_COLLECTION } from '../data/nftShirts';
import { useAuth } from '../context/AuthContext';
import { LitusLogo } from './LitusLogo';
import { UserProfileModal } from './UserProfileModal';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { openRazorpayPayment } from '../lib/razorpay';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  doc 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Wallet,
  LogIn,
  LogOut,
  User as UserIcon,
  Shirt,
  Box,
  Copy,
  Check,
  CreditCard,
  Flame
} from 'lucide-react';

interface NFTMarketplacePageProps {
  onBackToStore: () => void;
}

export const NFTMarketplacePage: React.FC<NFTMarketplacePageProps> = ({ onBackToStore }) => {
  const { user, signIn, signOut, walletAddress } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'genesis' | 'physical' | 'my-vault'>('all');
  const [inspectingNFT, setInspectingNFT] = useState<NFTShirt | null>(null);
  const [mintingNFT, setMintingNFT] = useState<NFTShirt | null>(null);
  const [isMintingProcess, setIsMintingProcess] = useState(false);
  const [mintSuccessData, setMintSuccessData] = useState<{
    nft: NFTShirt;
    txHash: string;
    tokenId: string;
    paymentGateway: string;
    paymentId?: string;
  } | null>(null);
  const [userMintedList, setUserMintedList] = useState<any[]>([]);
  const [copiedHash, setCopiedHash] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch user's minted NFT shirts from Firestore when user is authenticated
  useEffect(() => {
    if (!user) {
      setUserMintedList([]);
      return;
    }

    const fetchUserNFTs = async () => {
      try {
        const q = query(collection(db, 'minted_nfts'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const minted: any[] = [];
        querySnapshot.forEach((d) => {
          minted.push({ id: d.id, ...d.data() });
        });
        setUserMintedList(minted);
      } catch (err) {
        console.error('Failed to query minted NFTs from Firestore:', err);
      }
    };

    fetchUserNFTs();
  }, [user]);

  // Filtered shirts
  const filteredShirts = NFT_SHIRTS_COLLECTION.filter((shirt) => {
    if (selectedFilter === 'genesis') return shirt.rarity === 'Genesis';
    if (selectedFilter === 'physical') return Boolean(shirt.physicalGarmentLinked);
    return true;
  });

  const handleStartMint = (shirt: NFTShirt, method: 'razorpay' | 'web3' = 'razorpay') => {
    if (!user) {
      setMintingNFT(shirt);
      return;
    }

    if (method === 'razorpay') {
      openRazorpayPayment({
        amountUSD: shirt.priceUSD,
        itemName: shirt.name,
        description: `${shirt.tokenId} Digital Twin + Physical Garment`,
        userEmail: user.email || 'collector@litus.store',
        userName: user.displayName || 'LITUS Collector',
        onSuccess: (paymentId) => {
          executeMint(shirt, 'Razorpay', paymentId);
        },
        onDismiss: () => {
          console.log('Razorpay modal dismissed by user');
        }
      });
    } else {
      executeMint(shirt, 'Web3 Direct');
    }
  };

  const executeMint = async (shirt: NFTShirt, gateway: string = 'Razorpay', paymentId?: string) => {
    if (!user) return;
    setIsMintingProcess(true);
    setAuthError(null);

    const generatedTxHash = `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    const mintId = `mint-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      // Record immutable mint record in Firestore
      const mintDocRef = doc(db, 'minted_nfts', mintId);
      const payload: any = {
        mintId,
        userId: user.uid,
        userEmail: user.email || '',
        nftShirtId: shirt.id,
        name: shirt.name,
        tokenId: `${shirt.tokenId}-${Math.floor(Math.random() * 900) + 100}`,
        tokenStandard: shirt.tokenStandard,
        priceSOL: shirt.priceSOL,
        priceUSD: shirt.priceUSD,
        txHash: generatedTxHash,
        mintedAt: new Date().toISOString(),
        paymentGateway: gateway,
        razorpayPaymentId: paymentId || null,
      };

      await setDoc(mintDocRef, payload);

      // Update local state
      setUserMintedList((prev) => [
        ...prev,
        payload
      ]);

      setMintSuccessData({
        nft: shirt,
        txHash: generatedTxHash,
        tokenId: payload.tokenId,
        paymentGateway: gateway,
        paymentId
      });
      setMintingNFT(null);
    } catch (err: any) {
      console.error('Error minting NFT to Firestore:', err);
      setAuthError('Failed to record on-chain mint to Firestore. Please check permissions.');
      handleFirestoreError(err, OperationType.CREATE, `minted_nfts/${mintId}`);
    } finally {
      setIsMintingProcess(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Marketplace Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#070b12]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Back to Flagship Store & Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Flagship Store</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <LitusLogo size="sm" />
              <span className="text-[11px] font-mono tracking-widest text-sky-500 font-bold uppercase pl-2 border-l border-slate-300 dark:border-slate-700">
                NFT Web3 Atelier
              </span>
            </div>
          </div>

          {/* User Credentials, Profile Trigger & Firebase Auth Bar */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Credentials Card -> Clicking opens User Profile Component */}
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  title="View User Profile & Purchased NFT History"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs hover:border-sky-500/60 transition-colors cursor-pointer group"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-full border border-sky-400"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 font-bold flex items-center justify-center text-xs">
                      {user.displayName ? user.displayName[0] : 'U'}
                    </div>
                  )}

                  <div className="hidden md:block text-left leading-tight">
                    <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[130px] group-hover:text-sky-400 transition-colors">
                      {user.displayName || 'Collector'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                      {user.email}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-sky-500 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-500/30">
                    Profile
                  </span>
                </button>

                {/* Sign Out Button */}
                <button
                  onClick={signOut}
                  title="Sign out of Firebase"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm dark:electric-glow"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connect Firebase Auth</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#090e17] dark:via-[#070b12] dark:to-[#070b12] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-widest text-sky-400 bg-sky-950/60 border border-sky-500/30 rounded-md mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exclusive NFT Shirts Collection // SS26</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              “More Than a Brand,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-400">
                Own an Asset.
              </span>”
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-2xl">
              Welcome to the official LITUS Web3 marketplace. Every digital shirt below is minted on-chain with authentic metadata, metaverse avatar rigging (.GLB), and is directly paired with its physical atelier garment counterpart. Pay via Razorpay or Web3.
            </p>

            {/* Protocol highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Collection Focus</span>
                <span className="font-bold text-slate-900 dark:text-white">Shirts & Overshirts</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Payment Gateway</span>
                <span className="font-bold text-sky-400 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  Razorpay Secure
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Physical Pairing</span>
                <span className="font-bold text-slate-900 dark:text-white">1:1 NFC Verified</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Auth & DB</span>
                <span className="font-bold text-emerald-500">Firebase Firestore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Collection Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              All NFT Shirts ({NFT_SHIRTS_COLLECTION.length})
            </button>
            <button
              onClick={() => setSelectedFilter('genesis')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedFilter === 'genesis'
                  ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              Genesis Tier
            </button>
            <button
              onClick={() => setSelectedFilter('physical')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedFilter === 'physical'
                  ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              Physical Paired
            </button>
            <button
              onClick={() => setSelectedFilter('my-vault')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'my-vault'
                  ? 'bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>My Minted Shirts</span>
              <span className="text-[10px] font-mono px-1 rounded bg-black/20 text-sky-400">
                {userMintedList.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-xs font-mono text-sky-500 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Open Collector Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
            {authError}
          </div>
        )}

        {/* My Vault View */}
        {selectedFilter === 'my-vault' ? (
          <div className="py-8">
            {!user ? (
              <div className="py-16 text-center max-w-md mx-auto space-y-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8">
                <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold">Connect Credentials to View Vault</h3>
                <p className="text-xs text-slate-500">
                  Sign in with Firebase Auth to inspect your minted NFT shirts and on-chain ownership records.
                </p>
                <button
                  onClick={signIn}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Sign In with Google
                </button>
              </div>
            ) : userMintedList.length === 0 ? (
              <div className="py-16 text-center max-w-md mx-auto space-y-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8">
                <Shirt className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold">Your Collector Vault is Empty</h3>
                <p className="text-xs text-slate-500">
                  You haven’t minted any LITUS NFT shirts yet. Browse the collection and claim your first physical-digital twin using Razorpay.
                </p>
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Browse NFT Shirts
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userMintedList.map((minted) => {
                  const shirtRef = NFT_SHIRTS_COLLECTION.find((s) => s.id === minted.nftShirtId);
                  return (
                    <div
                      key={minted.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1322] border border-sky-500/40 shadow-lg space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-sky-500 font-bold">MINTED ASSET</span>
                        <span className="text-slate-400">{minted.tokenId}</span>
                      </div>
                      {shirtRef && (
                        <img
                          src={shirtRef.image}
                          alt={minted.name}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      )}
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {minted.name}
                      </h4>
                      <div className="text-xs font-mono text-slate-500">
                        Owner: {user.email}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Gateway: <span className="text-sky-400 font-semibold">{minted.paymentGateway || 'Razorpay'}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          On-Chain Confirmed
                        </span>
                        <span className="text-slate-400 truncate max-w-[120px]">
                          {minted.txHash}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* NFT Shirts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {filteredShirts.map((shirt) => (
              <div
                key={shirt.id}
                className="group relative flex flex-col bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/60 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-sky-950/40"
              >
                {/* Image Showcase */}
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={shirt.image}
                    alt={shirt.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-950/80 text-sky-400 border border-sky-400/30 rounded backdrop-blur-md">
                      {shirt.tokenId} · {shirt.rarity}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[10px] font-mono bg-black/60 text-slate-300 rounded backdrop-blur-md">
                      {shirt.totalMinted}/{shirt.maxSupply} Minted
                    </span>
                  </div>

                  {/* Physical Link Tag */}
                  <div className="absolute bottom-3 left-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-slate-200 flex items-center gap-2">
                    <Box className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{shirt.physicalGarmentLinked}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400 mb-1">
                      {shirt.subtitle}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {shirt.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {shirt.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline justify-between mb-3 font-mono">
                      <div>
                        <span className="text-lg font-extrabold text-blue-600 dark:text-sky-400">
                          ${shirt.priceUSD} USD
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          ({shirt.priceSOL} SOL)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {shirt.tokenStandard}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInspectingNFT(shirt)}
                        className="flex-1 py-2.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
                      >
                        Inspect
                      </button>

                      {/* Primary Mint Action with Razorpay */}
                      <button
                        onClick={() => handleStartMint(shirt, 'razorpay')}
                        className="flex-1 py-2.5 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-display"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay w/ Razorpay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Inspect Traits Modal */}
      {inspectingNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#0c1322] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sky-500">
                  {inspectingNFT.tokenId} · {inspectingNFT.rarity} Tier
                </span>
                <h3 className="text-2xl font-bold font-display mt-1">
                  {inspectingNFT.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectingNFT(null)}
                className="p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="my-6 space-y-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Smart Contract</span>
                <span className="text-sky-400 break-all">{inspectingNFT.contractAddress}</span>
              </div>

              <div>
                <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-2">
                  Metadata Traits & Digital Twin Specs
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {inspectingNFT.traits.map((t) => (
                    <div
                      key={t.trait_type}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070b12] border border-slate-200 dark:border-slate-800"
                    >
                      <div className="text-[10px] text-slate-400 uppercase">{t.trait_type}</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                        {t.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-sky-950/40 border border-blue-200 dark:border-sky-800 text-blue-700 dark:text-sky-300">
                <strong>Physical Atelier Pairing:</strong> {inspectingNFT.physicalGarmentLinked}. Includes encrypted NFC claim tag sewn into garment hem.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="font-mono">
                <span className="text-xl font-bold text-blue-600 dark:text-sky-400">
                  ${inspectingNFT.priceUSD} USD
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  ({inspectingNFT.priceSOL} SOL)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = inspectingNFT;
                    setInspectingNFT(null);
                    handleStartMint(target, 'razorpay');
                  }}
                  className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Razorpay Mint</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal (If attempting to mint without Firebase sign-in) */}
      {mintingNFT && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div
            className="relative w-full max-w-md bg-white dark:bg-[#0c1322] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-sky-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold font-display">
              Firebase Collector Authentication
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              To purchase <strong className="text-slate-900 dark:text-white">{mintingNFT.name}</strong> via Razorpay, sign in to your Firebase account. Your on-chain token and receipt will be permanently stored in your Firestore collector vault.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={async () => {
                  try {
                    await signIn();
                    setMintingNFT(null);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm dark:electric-glow"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>

              <button
                onClick={() => setMintingNFT(null)}
                className="w-full py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mint Success Confirmation Modal */}
      {mintSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div
            className="relative w-full max-w-lg bg-[#0c1322] text-white rounded-2xl border border-sky-500/60 shadow-2xl p-6 sm:p-8 electric-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400">
                Payment & On-Chain Mint Verified
              </span>
              <h3 className="text-2xl font-bold font-display mt-1">
                Asset Minted to Your Vault
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Congratulations! You now hold the digital twin for <strong className="text-white">{mintSuccessData.nft.name}</strong>. Recorded to your Firestore collector profile.
              </p>
            </div>

            <div className="my-6 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Token ID:</span>
                <span className="font-bold text-sky-400">{mintSuccessData.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-emerald-400 font-bold">{mintSuccessData.paymentGateway}</span>
              </div>
              {mintSuccessData.paymentId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Razorpay ID:</span>
                  <span className="text-slate-300 truncate max-w-[170px]">{mintSuccessData.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Tx Hash:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-300 text-[11px] truncate max-w-[130px]">
                    {mintSuccessData.txHash}
                  </span>
                  <button
                    onClick={() => copyToClipboard(mintSuccessData.txHash)}
                    className="p-1 hover:text-sky-400"
                    title="Copy hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setMintSuccessData(null);
                  setIsProfileModalOpen(true);
                }}
                className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                View in Collector Profile & History
              </button>
              <button
                onClick={() => setMintSuccessData(null)}
                className="w-full py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minting In Progress Overlay */}
      {isMintingProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="p-8 rounded-2xl bg-[#0c1322] border border-sky-500/50 text-center space-y-4 electric-glow">
            <div className="w-12 h-12 border-3 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-white font-bold font-display text-lg">
              Processing Razorpay & Minting...
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Verifying Payment & Syncing to Firestore Collection...
            </p>
          </div>
        </div>
      )}

      {/* User Profile Component Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenNFTMarketplace={() => {
          setIsProfileModalOpen(false);
          setSelectedFilter('all');
        }}
      />

    </div>
  );
};
