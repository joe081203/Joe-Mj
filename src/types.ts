export type ProductCategory = 'recommended' | 'combos' | 'shirts' | 'tees' | 'trousers' | 'accessories';

export type UserRole = 'customer' | 'distributor' | 'admin';

export type PaymentMethod = 'razorpay' | 'cod' | 'gpay_upi';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type ShippingStatus = 'processing' | 'tailored' | 'in_transit' | 'delivered';

export interface Product {
  id: string;
  name: string;
  category: 'shirts' | 'tees' | 'trousers' | 'accessories' | 'combos';
  price: number;
  originalPrice?: number;
  description: string;
  details: string[];
  fabric: string;
  sustainabilityNote: string;
  image: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  isRecommended: boolean;
  isNFTReady: boolean;
  badge?: string;
  comboItems?: string[];
  comboSavingsUSD?: number;
  isNewRelease?: boolean;
  stockQuantity?: number;
  isPublished?: boolean;
  distributorOnly?: boolean;
  distributorPrice?: number;
  createdAt?: string;
  createdBy?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  shippingStatus: ShippingStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  shippingAddress: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HeroSlideData {
  id: number;
  quote?: string;
  subquote?: string;
  heading: string;
  kicker: string;
  description: string;
  bgImage: string;
  ctaText: string;
  ctaAction: 'shop' | 'nft' | 'story';
  themeTone: 'marine' | 'electric' | 'ethereal';
}
