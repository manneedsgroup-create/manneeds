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
  variants?: ProductVariant[];
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

// Read from Astro environment (PUBLIC_ prefix allows both client and server access)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

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
