import { createClient } from '@supabase/supabase-js';

export interface ProductVariant {
  weight: string; // e.g. '100g', '200g', '250g', '500g', '1kg'
  price: string;
  originalPrice?: string;
  stock?: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  flavour?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: string;
  badge?: string;
  desc: string;
  inStock?: boolean;
  stockQuantity?: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  videos?: string[];
  folder?: string;
  variants?: ProductVariant[];
}

// ==========================================
// 3-TABLE INVENTORY DATA MODEL
// Formula: stock_items + new_stock_inventory - sold_items = available_quantity
// ==========================================

export interface StockItem {
  id?: number;
  product_id: number;
  variant_weight?: string; // e.g. '100g', '200g', 'all'
  quantity: number;
  unit_cost?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewStockInventoryItem {
  id?: number;
  product_id: number;
  variant_weight?: string;
  quantity: number;
  batch_number?: string;
  supplier?: string;
  cost_per_unit?: number;
  received_date?: string;
  notes?: string;
  created_at?: string;
}

export interface SoldItem {
  id?: number;
  product_id: number;
  variant_weight?: string;
  quantity: number;
  order_id?: string;
  unit_price?: number;
  sold_date?: string;
  notes?: string;
  created_at?: string;
}

export interface InventorySummary {
  product_id: number;
  product_name: string;
  category: string;
  price: string;
  initial_stock: number;
  new_stock: number;
  sold_stock: number;
  available_quantity: number;
  in_stock: boolean;
}

export interface Subscriber {
  id?: string;
  email: string;
  coupon_code?: string;
  created_at?: string;
}

export interface QuizLead {
  id?: string;
  email: string;
  concern?: string;
  preferred_format?: string;
  recommendation?: string;
  created_at?: string;
}

export interface OrderItem {
  id: number | string;
  name: string;
  weight: string;
  price: string;
  originalPrice?: string;
  quantity: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: 'cod' | 'online_upi' | 'card';
  payment_status?: 'pending' | 'paid' | 'cod_pending';
  subtotal: number;
  discount_amount: number;
  discount_code?: string;
  shipping_fee: number;
  total_amount: number;
  items: OrderItem[];
  status?: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  created_at?: string;
}

// Read from environment (supports both Astro PUBLIC_ and Next/Supabase NEXT_PUBLIC_ prefixes)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

// Fallback dummy client for build time / when keys are pending setup
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);
