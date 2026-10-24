import { supabase, isSupabaseConfigured, type Product, type ProductVariant, type Subscriber, type QuizLead } from './supabase';

// All 22 real products from ManNeeds inventory with product-to-product customizable weight variants
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
    stockQuantity: 45,
    inStock: true,
    variants: [
      { weight: '100g', price: '₹149', originalPrice: '₹199', stock: 30 },
      { weight: '200g', price: '₹269', originalPrice: '₹379', stock: 15 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹149', originalPrice: '₹199', stock: 25 },
      { weight: '200g', price: '₹269', originalPrice: '₹379', stock: 18 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹139', originalPrice: '₹179', stock: 10 },
      { weight: '200g', price: '₹249', originalPrice: '₹349', stock: 7 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹199', originalPrice: '₹249', stock: 5 },
      { weight: '200g', price: '₹369', originalPrice: '₹479', stock: 3 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹219', originalPrice: '₹269', stock: 16 },
      { weight: '200g', price: '₹399', originalPrice: '₹499', stock: 10 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹179', originalPrice: '₹219', stock: 8 },
      { weight: '200g', price: '₹329', originalPrice: '₹419', stock: 4 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹189', originalPrice: '₹239', stock: 15 },
      { weight: '200g', price: '₹349', originalPrice: '₹449', stock: 8 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹249', originalPrice: '₹329', stock: 31 },
      { weight: '200g', price: '₹459', originalPrice: '₹629', stock: 20 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹229', originalPrice: '₹299', stock: 70 },
      { weight: '200g', price: '₹419', originalPrice: '₹569', stock: 41 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹199', originalPrice: '₹259', stock: 25 },
      { weight: '200g', price: '₹369', originalPrice: '₹489', stock: 13 }
    ]
  },

  // --- HERBAL & SUPERFOOD POWDERS ---
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
    badge: 'Kitchen Staple',
    desc: '100% pure raw unrefined mango powder. Perfect for digestive detox drinks, morning tonics, and tangy recipes.',
    stockQuantity: 120,
    inStock: true,
    variants: [
      { weight: '100g', price: '₹299', originalPrice: '₹399', stock: 70 },
      { weight: '200g', price: '₹549', originalPrice: '₹749', stock: 50 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹349', originalPrice: '₹449', stock: 2 },
      { weight: '200g', price: '₹649', originalPrice: '₹849', stock: 0 }
    ]
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
    badge: 'Daily Detox',
    desc: '100% pure dehydrated Ash Gourd (Winter Melon) powder. Highly alkalising, calming morning elixir for acidity relief.',
    stockQuantity: 76,
    inStock: true,
    variants: [
      { weight: '100g', price: '₹319', originalPrice: '₹419', stock: 46 },
      { weight: '200g', price: '₹589', originalPrice: '₹799', stock: 30 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹269', originalPrice: '₹349', stock: 8 },
      { weight: '200g', price: '₹489', originalPrice: '₹649', stock: 3 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹329', originalPrice: '₹429', stock: 15 },
      { weight: '200g', price: '₹599', originalPrice: '₹799', stock: 9 }
    ]
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
    inStock: true,
    variants: [
      { weight: '100g', price: '₹279', originalPrice: '₹359', stock: 7 },
      { weight: '200g', price: '₹519', originalPrice: '₹689', stock: 3 }
    ]
  },

  // --- NEW ITEMS ADDED FROM CHAT ---
  {
    id: 17,
    name: 'ManNeeds Okra Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Pure Ladyfinger Extract',
    price: '₹289',
    originalPrice: '₹379',
    discount: '24% OFF',
    rating: 4.8,
    reviews: '140',
    badge: 'Blood Sugar & Fiber',
    desc: '100% dehydrated green Okra (Bhindi) pod powder. Rich in natural mucilage and dietary fiber for optimal digestive balance.',
    stockQuantity: 30,
    inStock: true,
    variants: [
      { weight: '100g', price: '₹289', originalPrice: '₹379', stock: 20 },
      { weight: '200g', price: '₹529', originalPrice: '₹699', stock: 10 }
    ]
  },
  {
    id: 18,
    name: 'ManNeeds Kulekhara Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Ayurvedic Iron Elixir',
    price: '₹319',
    originalPrice: '₹419',
    discount: '24% OFF',
    rating: 4.9,
    reviews: '380',
    badge: 'Hemoglobin Booster',
    desc: 'Potent wild Kulekhara (Hygrophila spinosa) leaf powder. Celebrated in traditional wellness for boosting natural iron and hemoglobin levels.',
    stockQuantity: 45,
    inStock: true,
    variants: [
      { weight: '100g', price: '₹319', originalPrice: '₹419', stock: 30 },
      { weight: '200g', price: '₹589', originalPrice: '₹799', stock: 15 }
    ]
  },
  {
    id: 19,
    name: 'ManNeeds Chalta Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Elephant Apple Tang',
    price: '₹279',
    originalPrice: '₹369',
    discount: '24% OFF',
    rating: 4.7,
    reviews: '110',
    badge: 'Traditional Digestive',
    desc: 'Sun-dried and powdered wild Chalta (Elephant Apple / Dillenia indica). Abundant in natural fruit tannins, antioxidants, and vitamin C.',
    stockQuantity: 25,
    inStock: true,
    variants: [
      { weight: '100g', price: '₹279', originalPrice: '₹369', stock: 15 },
      { weight: '200g', price: '₹499', originalPrice: '₹699', stock: 10 }
    ]
  },
  {
    id: 20,
    name: 'ManNeeds Protein & Vitamin Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Vanilla Malt Berry',
    price: '₹599',
    originalPrice: '₹799',
    discount: '25% OFF',
    rating: 4.9,
    reviews: '640',
    badge: 'Complete Daily Nutrition',
    desc: 'Plant-powered complete multi-protein blend enriched with 21 essential micronutrients, vitamins, and minerals. Zero lactose & zero bloating.',
    stockQuantity: 50,
    inStock: true,
    variants: [
      { weight: '200g', price: '₹599', originalPrice: '₹799', stock: 30 },
      { weight: '500g', price: '₹1,299', originalPrice: '₹1,699', stock: 20 }
    ]
  },
  {
    id: 21,
    name: 'ManNeeds Amla Powder',
    category: 'Herbal & Superfood Powders',
    flavour: 'Pure Indian Gooseberry',
    price: '₹229',
    originalPrice: '₹299',
    discount: '23% OFF',
    rating: 4.9,
    reviews: '890',
    badge: 'Vitamin C Powerhouse',
    desc: 'Cold-processed raw organic Amla fruit powder. Packed with high-bioavailability vitamin C, polyphenols, and collagen-boosting antioxidants.',
    stockQuantity: 60,
    inStock: true,
    variants: [
      { weight: '100g', price: '₹229', originalPrice: '₹299', stock: 40 },
      { weight: '200g', price: '₹399', originalPrice: '₹549', stock: 20 }
    ]
  },
  {
    id: 22,
    name: 'ManNeeds Premium Honey',
    category: 'Raw Honey & Pure Elixirs',
    flavour: 'Wild Sundarban Floral',
    price: '₹399',
    originalPrice: '₹499',
    discount: '20% OFF',
    rating: 5.0,
    reviews: '520',
    badge: '100% Pure Forest Raw',
    desc: 'Unprocessed, unpasteurized natural wild forest honey. Retains all natural pollen, enzymes, and medicinal antibacterial properties.',
    stockQuantity: 40,
    inStock: true,
    variants: [
      { weight: '250g', price: '₹399', originalPrice: '₹499', stock: 25 },
      { weight: '500g', price: '₹729', originalPrice: '₹949', stock: 15 }
    ]
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

    const mapped = data.map((item: any) => {
      // Safely parse variants from Supabase
      let variants: ProductVariant[] = [];
      if (item.variants) {
        if (typeof item.variants === 'string') {
          try {
            variants = JSON.parse(item.variants);
          } catch {
            variants = [];
          }
        } else if (Array.isArray(item.variants)) {
          variants = item.variants;
        }
      }

      // If variants exist, normalize fields; if none, generate default variants
      if (variants && variants.length > 0) {
        variants = variants.map((v: any) => ({
          weight: v.weight || '100g',
          price: v.price || item.price,
          originalPrice: v.originalPrice || v.original_price || item.original_price,
          stock: v.stock !== undefined ? Number(v.stock) : (item.stock_quantity ?? 0)
        }));
      } else {
        variants = [
          { weight: '100g', price: item.price, originalPrice: item.original_price, stock: item.stock_quantity ?? 20 },
          { weight: '200g', price: item.price ? `₹${Math.round(parseInt(item.price.replace(/\D/g, '') || '200') * 1.8)}` : '₹349', stock: 10 }
        ];
      }

      return {
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
        inStock: item.in_stock !== false && (item.stock_quantity !== 0),
        variants
      };
    });

    // Merge any products from DEFAULT_PRODUCTS that are not yet in Supabase table
    const existingIds = new Set(mapped.map((p) => p.id));
    const missingDefaults = DEFAULT_PRODUCTS.filter((p) => !existingIds.has(p.id));
    return [...mapped, ...missingDefaults];
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
