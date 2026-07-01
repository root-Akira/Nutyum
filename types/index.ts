// === Products ===
export type ProductCategory = 'classic' | 'spicy' | 'sweet' | 'gift';

export const VIBE_TAGS = [
  'A Sweet Treat', 'Evening Munch', 'High Protein', 'Guilt-Free',
  'Crunchy & Light', 'Over Popcorn', 'Perfect Gift', 'Savory Twist',
  'Classic Flavors', 'Whole Grain', 'Focused & Clear', 'Bold Heat',
  'Lightly Salted', 'Snack Ritual', 'Calm & Cozy', 'Zero Guilt',
] as const;
export type VibeTag = typeof VIBE_TAGS[number];

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
  };
  images: string[];
  bgColor: string;
  category: ProductCategory;
  vibes: VibeTag[];
  isNew: boolean;
  isBestSeller: boolean;
  isComingSoon: boolean;
  launchDate?: string;
  rating: number;
  reviewCount: number;
  weight: string;
  badgeLabel?: string;
}

// === Cart ===
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

// === UI ===
export interface UIStore {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  activeVibe: VibeTag | null;
  toggleSearch: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveVibe: (vibe: VibeTag | null) => void;
}

// === Navigation ===
export interface MegaNavColumn {
  heading: string;
  items: { label: string; href: string }[];
}

export interface MegaNavItem {
  label: string;
  href: string;
  kind: 'mega';
  columns: MegaNavColumn[];
  featured: { label: string; href: string; bg: string }[];
  cta: { label: string; href: string };
}

export interface DropdownNavItem {
  label: string;
  href: string;
  kind: 'dropdown';
  items: { label: string; href: string }[];
}

export interface PlainNavItem {
  label: string;
  href: string;
  kind: 'plain';
  icon?: React.ElementType;
}

export type LeftNavItem = MegaNavItem | DropdownNavItem | PlainNavItem;

// === Footer ===
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

// === Newsletter ===
export interface NewsletterForm {
  email: string;
}

// === Order (Phase 2+) ===
export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  createdAt: string;
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}
