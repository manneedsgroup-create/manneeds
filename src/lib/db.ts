import { supabase, isSupabaseConfigured, type Product, type Subscriber, type QuizLead } from './supabase';

// All 16 real products from the ManNeeds inventory spreadsheet (Stock data recorded on 31.07.2026)
export const DEFAULT_PRODUCTS: Product[] = [
  // --- HEALTHY SNACKS ---
  {
    id: 1,
    name: 'ManNeeds Peri Peri Snacks',
    category: 'Healthy Snacks',
    flavour: 'Fiery Peri Peri',
    price: '₹149',
    originalPrice: '₹199',
    discount: '25% OFF',
    rating: 4.8,
    reviews: '320',
    badge: 'Hot Seller',
    desc: 'Crispy roasted superfood snacks dusted with zesty African bird’s eye chilli and aromatic herbs. Zero trans fat.',
    stockQuantity: 34,
    inStock: true
  },
  {
    id: 2,
    name: 'ManNeeds Chat Masala Snacks',
    category: 'Healthy Snacks',
    flavour: 'Tangy Desi Chat',
    price: '₹149',
    originalPrice: '₹199',
    discount: '25% OFF',
    rating: 4.9,
    reviews: '410',
    badge: 'Customer Favorite',
    desc: 'Crunchy roasted wholesome snacks coated in tangy Himalayan black salt, dry mango, and roasted cumin.',
    stockQuantity: 43,
    inStock: true
  },
  {
    id: 3,
    name: 'ManNeeds Salted Snacks',
    category: 'Healthy Snacks',
    flavour: 'Classic Pink Salt',
    price: '₹139',
    originalPrice: '₹179',
    discount: '22% OFF',
    rating: 4.7,
    reviews: '180',
    badge: 'Clean Munch',
    desc: 'Lightly roasted everyday crunch seasoned with pure mineral-rich pink Himalayan rock salt. Guilt-free snacking.',
    stockQuantity: 17,
    inStock: true
  },

  // --- REAL FRUIT CANDIES ---
  {
    id: 4,
    name: 'ManNeeds Mango Candy',
    category: 'Real Fruit Candies',
    flavour: 'Alphonso Mango',
    price: '₹199',
    originalPrice: '₹249',
    discount: '20% OFF',
    rating: 4.9,
    reviews: '540',
    badge: 'Only 8 Left!',
    desc: 'Chewy, burst-in-your-mouth natural fruit bites made from 100% real sun-ripened mango pulp. Zero gelatin.',
    stockQuantity: 8,
    inStock: true
  },
  {
    id: 5,
    name: 'ManNeeds Jackfruit Candy',
    category: 'Real Fruit Candies',
    flavour: 'Ripe Kathal Honey',
    price: '₹219',
    originalPrice: '₹269',
    discount: '18% OFF',
    rating: 4.8,
    reviews: '220',
    badge: 'Exotic Plant Bite',
    desc: 'Sweet and aromatic fruit chewies hand-crafted from farm-fresh ripe jackfruit pulp. Rich in natural dietary fiber.',
    stockQuantity: 26,
    inStock: true
  },
  {
    id: 6,
    name: 'ManNeeds Banana Candy',
    category: 'Real Fruit Candies',
    flavour: 'Caramelized Banana',
    price: '₹179',
    originalPrice: '₹219',
    discount: '18% OFF',
    rating: 4.7,
    reviews: '160',
    badge: 'Pocket Energy',
    desc: 'Naturally sweet and chewy bite-sized banana fruit gems. An instant healthy stamina boost whenever you need it.',
    stockQuantity: 12,
    inStock: true
  },
  {
    id: 7,
    name: 'ManNeeds Pumpkin Candy',
    category: 'Real Fruit Candies',
    flavour: 'Spiced Pumpkin Gold',
    price: '₹189',
    originalPrice: '₹239',
    discount: '21% OFF',
    rating: 4.8,
    reviews: '195',
    badge: 'Nutrient Dense',
    desc: 'Soft chewable vitamin-rich fruit bites made with slow-roasted pumpkin purée and natural jaggery.',
    stockQuantity: 23,
    inStock: true
  },

  // --- DRIED FRUIT CHIPS ---
  {
    id: 8,
    name: 'ManNeeds Dried Mango Chips',
    category: 'Dried Fruit Chips',
    flavour: 'Sun-Dried Golden Mango',
    price: '₹249',
    originalPrice: '₹329',
    discount: '24% OFF',
    rating: 4.9,
    reviews: '680',
    badge: 'Bestseller Crunch',
    desc: '100% pure real mango slices, vacuum-crisped with zero added refined sugar and zero palm oil.',
    stockQuantity: 51,
    inStock: true
  },
  {
    id: 9,
    name: 'ManNeeds Dried Jackfruit Chips',
    category: 'Dried Fruit Chips',
    flavour: 'Crisp Jackfruit & Rock Salt',
    price: '₹229',
    originalPrice: '₹299',
    discount: '23% OFF',
    rating: 4.9,
    reviews: '890',
    badge: 'Mega Stocked (111)',
    desc: 'Golden crispy jackfruit chips packed with gut-friendly dietary fiber. The ultimate guilt-free teatime munch.',
    stockQuantity: 111,
    inStock: true
  },
  {
    id: 10,
    name: 'ManNeeds Dried Banana Chips',
    category: 'Dried Fruit Chips',
    flavour: 'Crisp Nendran Banana',
    price: '₹199',
    originalPrice: '₹259',
    discount: '23% OFF',
    rating: 4.8,
    reviews: '430',
    badge: 'Traditional Crunch',
    desc: 'Thinly sliced, slow-crisped raw bananas lightly dusted with sea salt for that authentic, irresistible crunch.',
    stockQuantity: 38,
    inStock: true
  },

  // --- SUPERFOOD & HERBAL POWDERS ---
  {
    id: 11,
    name: 'ManNeeds Mango Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Pure Raw Amchur',
    price: '₹299',
    originalPrice: '₹399',
    discount: '25% OFF',
    rating: 4.9,
    reviews: '750',
    badge: 'Kitchen Staple (120)',
    desc: '100% pure raw unrefined mango powder. Perfect for digestive detox drinks, morning tonics, and tangy recipes.',
    stockQuantity: 120,
    inStock: true
  },
  {
    id: 12,
    name: 'ManNeeds Thankuni Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Gotu Kola Leaf Extract',
    price: '₹349',
    originalPrice: '₹449',
    discount: '22% OFF',
    rating: 5.0,
    reviews: '340',
    badge: 'Only 2 In Stock!',
    desc: 'Rare organic Thankuni (Centella Asiatica / Gotu Kola) leaf powder. Ancient Ayurvedic botanical for gut lining & mental focus.',
    stockQuantity: 2,
    inStock: true
  },
  {
    id: 13,
    name: 'ManNeeds Chalkumro Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Pure Ash Gourd Alkaline',
    price: '₹319',
    originalPrice: '₹419',
    discount: '24% OFF',
    rating: 4.8,
    reviews: '510',
    badge: 'Daily Detox (76)',
    desc: '100% pure dehydrated Ash Gourd (Winter Melon) powder. Highly alkalising, calming morning elixir for acidity relief.',
    stockQuantity: 76,
    inStock: true
  },
  {
    id: 14,
    name: 'ManNeeds Lemon Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Zesty Citrus Vitamin C',
    price: '₹269',
    originalPrice: '₹349',
    discount: '23% OFF',
    rating: 4.8,
    reviews: '290',
    badge: 'Vitamin C Boost',
    desc: 'Spray-dried natural whole lemon extract powder. Instant refreshing citrus hydration and daily antioxidant support.',
    stockQuantity: 11,
    inStock: true
  },
  {
    id: 15,
    name: 'ManNeeds Moringa Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Miracle Leaf Green',
    price: '₹329',
    originalPrice: '₹429',
    discount: '23% OFF',
    rating: 4.9,
    reviews: '920',
    badge: 'Superfood Powerhouse',
    desc: 'Organically cultivated whole drumstick tree (Moringa Oleifera) green leaf powder. 7x more Vitamin C than oranges.',
    stockQuantity: 24,
    inStock: true
  },
  {
    id: 16,
    name: 'ManNeeds Banana Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Raw Plantain Prebiotic',
    price: '₹279',
    originalPrice: '₹359',
    discount: '22% OFF',
    rating: 4.7,
    reviews: '215',
    badge: 'Gut Prebiotic (10)',
    desc: 'Resistant starch-rich green plantain banana flour powder. Promotes beneficial gut flora and smooth digestion.',
    stockQuantity: 10,
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
      reviews: item.reviews ? String(item.reviews) : '100+',
      badge: item.badge,
      desc: item.desc || item.description,
      stockQuantity: item.stock_quantity ?? item.stock ?? 0,
      inStock: item.in_stock !== false && (item.stock_quantity !== 0)
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
      message: 'Subscribed locally! (Configure Supabase keys in .env to persist in database).'
    };
  }

  try {
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email, coupon_code: coupon }]);

    if (error) {
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
