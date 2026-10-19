import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as BASE_PRODUCTS } from '../data/products';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

export function useProducts(isAdmin: boolean = false, isDistributor: boolean = false) {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Real-time listener for Firestore products
    const productsRef = collection(db, 'products');

    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const loaded: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            name: data.name || 'Untitled Product',
            category: data.category || 'shirts',
            price: Number(data.price) || 0,
            originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
            description: data.description || '',
            details: Array.isArray(data.details) ? data.details : [],
            fabric: data.fabric || '',
            sustainabilityNote: data.sustainabilityNote || '',
            image: data.image || '/src/assets/images/litus_technical_overshirt_1792166677796.jpg',
            sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['S', 'M', 'L'],
            colors: Array.isArray(data.colors) && data.colors.length > 0 
              ? data.colors 
              : [{ name: 'Default', hex: '#0f2b48' }],
            isRecommended: Boolean(data.isRecommended),
            isNFTReady: Boolean(data.isNFTReady),
            badge: data.badge || undefined,
            stockQuantity: typeof data.stockQuantity === 'number' ? data.stockQuantity : 50,
            isPublished: data.isPublished !== false, // default true
            distributorOnly: Boolean(data.distributorOnly),
            distributorPrice: data.distributorPrice ? Number(data.distributorPrice) : undefined,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
          });
        });

        setFirestoreProducts(loaded);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to products collection:', err);
        setError('Failed to sync live products from Firestore.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Merge base products with Firestore products (Firestore products take precedence by ID)
  // If Firestore has uploaded products, they blend seamlessly.
  const allProducts: Product[] = (() => {
    const firestoreMap = new Map<string, Product>();
    firestoreProducts.forEach((p) => firestoreMap.set(p.id, p));

    const combined: Product[] = [...firestoreProducts];

    // Add base products that are not already overwritten in Firestore
    BASE_PRODUCTS.forEach((baseP) => {
      if (!firestoreMap.has(baseP.id)) {
        combined.push({
          ...baseP,
          stockQuantity: 45,
          isPublished: true,
          distributorOnly: false,
          distributorPrice: Math.round(baseP.price * 0.65), // 35% B2B margin
        });
      }
    });

    return combined;
  })();

  // Visible products filter based on user role:
  // 1. Admin sees everything (including drafts and unpublished products)
  // 2. Distributor sees published products + distributor exclusives, with distributor pricing
  // 3. Customer sees only published products that are not distributorOnly
  const visibleProducts = allProducts.filter((product) => {
    if (isAdmin) return true; // Admin sees all
    if (!product.isPublished) return false; // Non-admin cannot see unpublished
    if (product.distributorOnly && !isDistributor) return false;
    return true;
  });

  // Admin mutation helpers
  const saveProduct = async (productData: Partial<Product> & { name: string; price: number; category: string; description: string; image: string }) => {
    const productId = productData.id || `lts-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const productRef = doc(db, 'products', productId);

    const payload = {
      id: productId,
      name: productData.name,
      category: productData.category,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      description: productData.description || '',
      details: productData.details || [],
      fabric: productData.fabric || 'Sustainable closed-loop organic fiber',
      sustainabilityNote: productData.sustainabilityNote || 'Low-impact reactive dye with closed-loop recycling',
      image: productData.image,
      sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
      colors: productData.colors || [{ name: 'Marine Navy', hex: '#0f2b48' }],
      isRecommended: Boolean(productData.isRecommended),
      isNFTReady: Boolean(productData.isNFTReady),
      badge: productData.badge || null,
      stockQuantity: typeof productData.stockQuantity === 'number' ? productData.stockQuantity : 50,
      isPublished: productData.isPublished !== false,
      distributorOnly: Boolean(productData.distributorOnly),
      distributorPrice: productData.distributorPrice ? Number(productData.distributorPrice) : Math.round(Number(productData.price) * 0.65),
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(productRef, payload, { merge: true });
      return productId;
    } catch (err) {
      console.error('Failed to save product to Firestore:', err);
      handleFirestoreError(err, OperationType.WRITE, `products/${productId}`);
      throw err;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
    } catch (err) {
      console.error('Failed to delete product from Firestore:', err);
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
      throw err;
    }
  };

  return {
    products: visibleProducts,
    allProducts, // for admin inventory management
    loading,
    error,
    saveProduct,
    deleteProduct,
  };
}
