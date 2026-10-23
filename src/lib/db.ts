import { supabase, isSupabaseConfigured, type Product, type Subscriber, type QuizLead } from './supabase';

// Default flagship products used if database is empty or connection is pending
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'ManNeeds Apple Cider Vinegar Effervescent Fizz',
    category: 'Drop & Fizz',
    flavour: 'Pomegranate Burst',
    price: '₹699',
    originalPrice: '₹999',
    discount: '30% OFF',
    rating: 4.9,
    reviews: '8,420',
    badge: 'India’s #1 ACV Fizz',
    desc: 'Pure Himalayan ACV with "The Mother", Vitamin B6 & B12 for gut detox and healthy weight management without the pungent taste.',
    inStock: true
  },
  {
    id: 2,
    name: 'ManNeeds Rosemary Advanced Hair Growth Serum',
    category: 'Hair Care',
    flavour: 'Scalp Actives',
    price: '₹849',
    originalPrice: '₹1,199',
    discount: '29% OFF',
    rating: 4.8,
    reviews: '5,910',
    badge: 'Clinical Favorite',
    desc: 'Targeted scalp concentrate powered by 3% Redensyl, 4% Baicapil, and pure Rosemary extract to stimulate dormant follicles.',
    inStock: true
  },
  {
    id: 3,
    name: 'ManNeeds Glutathione Skin Glow Effervescent Drink',
    category: 'Skin Glow',
    flavour: 'Fruity Strawberry',
    price: '₹999',
    originalPrice: '₹1,400',
    discount: '28% OFF',
    rating: 4.9,
    reviews: '12,300',
    badge: 'Mega Bestseller',
    desc: '500mg L-Glutathione, Hyaluronic Acid & Berry Extracts for radiant skin luminosity and reduced dark spots from within.',
    inStock: true
  },
  {
    id: 4,
    name: 'ManNeeds Super Greens & Debloat Effervescent',
    category: 'Daily Wellness',
    flavour: 'Zesty Green Citrus',
    price: '₹649',
    originalPrice: '₹899',
    discount: '27% OFF',
    rating: 4.7,
    reviews: '4,150',
    badge: 'Instant Debloat',
    desc: '35+ alkalising superfoods, spirulina, wheatgrass & digestive enzymes that ease acidity and bloating in minutes.',
    inStock: true
  }
];

/**
 * Fetch products from Supabase 'products' table with fallback
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return DEFAULT_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('[Supabase] Products query error:', error.message);
      return DEFAULT_PRODUCTS;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      flavour: item.flavour,
      price: item.price,
      originalPrice: item.original_price,
      discount: item.discount,
      rating: item.rating ? Number(item.rating) : 4.9,
      reviews: item.reviews ? String(item.reviews) : '1,000+',
      badge: item.badge,
      desc: item.desc || item.description,
      inStock: item.in_stock !== false
    }));
  } catch (err) {
    console.error('[Supabase] Failed to fetch products:', err);
    return DEFAULT_PRODUCTS;
  }
}

/**
 * Save new newsletter subscriber in Supabase 'subscribers' table
 */
export async function addSubscriber(email: string, coupon = 'MANNEEDS15'): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: 'Subscribed locally! (Configure Supabase keys to persist in database).'
    };
  }

  try {
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email, coupon_code: coupon }]);

    if (error) {
      // 23505 is PostgreSQL unique constraint code (already subscribed)
      if (error.code === '23505') {
        return { success: true, message: 'You are already part of the ManNeeds Tribe! Coupon: MANNEEDS15' };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Welcome to the ManNeeds Tribe! Use coupon MANNEEDS15 for 15% off.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to subscribe.' };
  }
}

/**
 * Record a Quiz Lead and recommendation in Supabase 'quiz_leads' table
 */
export async function saveQuizLead(lead: QuizLead): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: true, message: 'Quiz response saved locally!' };
  }

  try {
    const { error } = await supabase
      .from('quiz_leads')
      .insert([lead]);

    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Your personalized routine is ready!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to save quiz response.' };
  }
}
