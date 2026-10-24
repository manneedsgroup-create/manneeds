import { 
  supabase, 
  isSupabaseConfigured, 
  type Product, 
  type ProductVariant, 
  type QuizLead,
  type StockItem,
  type NewStockInventoryItem,
  type SoldItem,
  type InventorySummary,
  type Order,
  type OrderItem
} from './supabase';

export type { Order, OrderItem, InventorySummary };

// Helper function to strip any redundant "ManNeeds " prefix from product names
export function cleanProductName(name: string): string {
  if (!name) return '';
  return name.replace(/^ManNeeds\s+/i, '').trim();
}

// All 23 real products from inventory with product-to-product customizable weight variants
export const DEFAULT_PRODUCTS: Product[] = [
  // --- HEALTHY SNACKS ---
  {
    id: 1,
    name: 'Peri Peri Snacks',
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
    folder: '1-peri-peri-snacks',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹149', originalPrice: '₹199', stock: 30 },
      { weight: '200g', price: '₹269', originalPrice: '₹379', stock: 15 }
    ]
  },
  {
    id: 2,
    name: 'Chat Masala Snacks',
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
    folder: '2-chat-masala-snacks',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹149', originalPrice: '₹199', stock: 25 },
      { weight: '200g', price: '₹269', originalPrice: '₹379', stock: 18 }
    ]
  },
  {
    id: 3,
    name: 'Salted Snacks',
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
    folder: '3-salted-snacks',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹139', originalPrice: '₹179', stock: 10 },
      { weight: '200g', price: '₹249', originalPrice: '₹349', stock: 7 }
    ]
  },

  // --- REAL FRUIT CANDIES ---
  {
    id: 4,
    name: 'Mango Candy',
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
    folder: '4-mango-candy',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹199', originalPrice: '₹249', stock: 5 },
      { weight: '200g', price: '₹369', originalPrice: '₹479', stock: 3 }
    ]
  },
  {
    id: 5,
    name: 'Jackfruit Candy',
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
    folder: '5-jackfruit-candy',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹219', originalPrice: '₹269', stock: 16 },
      { weight: '200g', price: '₹399', originalPrice: '₹499', stock: 10 }
    ]
  },
  {
    id: 6,
    name: 'Banana Candy',
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
    folder: '6-banana-candy',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹179', originalPrice: '₹219', stock: 8 },
      { weight: '200g', price: '₹329', originalPrice: '₹419', stock: 4 }
    ]
  },
  {
    id: 7,
    name: 'Pumpkin Candy',
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
    folder: '7-pumpkin-candy',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹189', originalPrice: '₹239', stock: 15 },
      { weight: '200g', price: '₹349', originalPrice: '₹449', stock: 8 }
    ]
  },

  // --- DRIED FRUIT CHIPS ---
  {
    id: 8,
    name: 'Dried Mango Chips',
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
    folder: '8-dried-mango-chips',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹249', originalPrice: '₹329', stock: 31 },
      { weight: '200g', price: '₹459', originalPrice: '₹629', stock: 20 }
    ]
  },
  {
    id: 9,
    name: 'Dried Jackfruit Chips',
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
    folder: '9-dried-jackfruit-chips',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹229', originalPrice: '₹299', stock: 70 },
      { weight: '200g', price: '₹419', originalPrice: '₹569', stock: 41 }
    ]
  },
  {
    id: 10,
    name: 'Dried Banana Chips',
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
    folder: '10-dried-banana-chips',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹199', originalPrice: '₹259', stock: 25 },
      { weight: '200g', price: '₹369', originalPrice: '₹489', stock: 13 }
    ]
  },

  // --- HERBAL & SUPERFOOD POWDERS ---
  {
    id: 11,
    name: 'Mango Powder',
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
    folder: '11-mango-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹299', originalPrice: '₹399', stock: 70 },
      { weight: '200g', price: '₹549', originalPrice: '₹749', stock: 50 }
    ]
  },
  {
    id: 12,
    name: 'Thankuni Powder',
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
    folder: '12-thankuni-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹349', originalPrice: '₹449', stock: 2 },
      { weight: '200g', price: '₹649', originalPrice: '₹849', stock: 0 }
    ]
  },
  {
    id: 13,
    name: 'Chalkumro Powder',
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
    folder: '13-chalkumro-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹319', originalPrice: '₹419', stock: 46 },
      { weight: '200g', price: '₹589', originalPrice: '₹799', stock: 30 }
    ]
  },
  {
    id: 14,
    name: 'Lemon Powder',
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
    folder: '14-lemon-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹269', originalPrice: '₹349', stock: 8 },
      { weight: '200g', price: '₹489', originalPrice: '₹649', stock: 3 }
    ]
  },
  {
    id: 15,
    name: 'Moringa Powder',
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
    folder: '15-moringa-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹329', originalPrice: '₹429', stock: 15 },
      { weight: '200g', price: '₹599', originalPrice: '₹799', stock: 9 }
    ]
  },
  {
    id: 16,
    name: 'Banana Powder',
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
    folder: '16-banana-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹279', originalPrice: '₹359', stock: 7 },
      { weight: '200g', price: '₹519', originalPrice: '₹689', stock: 3 }
    ]
  },

  // --- NEW ITEMS ADDED FROM CHAT ---
  {
    id: 17,
    name: 'Okra Powder',
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
    folder: '17-okra-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹289', originalPrice: '₹379', stock: 20 },
      { weight: '200g', price: '₹529', originalPrice: '₹699', stock: 10 }
    ]
  },
  {
    id: 18,
    name: 'Kulekhara Powder',
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
    folder: '18-kulekhara-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹319', originalPrice: '₹419', stock: 30 },
      { weight: '200g', price: '₹589', originalPrice: '₹799', stock: 15 }
    ]
  },
  {
    id: 19,
    name: 'Chalta Powder',
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
    folder: '19-chalta-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹279', originalPrice: '₹369', stock: 15 },
      { weight: '200g', price: '₹499', originalPrice: '₹699', stock: 10 }
    ]
  },
  {
    id: 20,
    name: 'Protein & Vitamin Powder',
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
    folder: '20-protein-and-vitamin-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '200g', price: '₹599', originalPrice: '₹799', stock: 30 },
      { weight: '500g', price: '₹1,299', originalPrice: '₹1,699', stock: 20 }
    ]
  },
  {
    id: 21,
    name: 'Amla Powder',
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
    folder: '21-amla-powder',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '100g', price: '₹229', originalPrice: '₹299', stock: 40 },
      { weight: '200g', price: '₹399', originalPrice: '₹549', stock: 20 }
    ]
  },
  {
    id: 22,
    name: 'Premium Honey',
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
    folder: '22-premium-honey',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '250g', price: '₹399', originalPrice: '₹499', stock: 25 },
      { weight: '500g', price: '₹729', originalPrice: '₹949', stock: 15 }
    ]
  },
  {
    id: 23,
    name: 'Pure Ajwain Honey',
    category: 'Raw Honey & Pure Elixirs',
    flavour: 'Ajwain Blossom Nectar',
    price: '₹449',
    originalPrice: '₹549',
    discount: '18% OFF',
    rating: 4.9,
    reviews: '290',
    badge: 'Acidity & Digestion',
    desc: 'Unprocessed, unheated raw monofloral honey harvested from blooming Ajwain (Carom) fields. Powerful natural digestive aid that soothes acidity, cough, and throat irritation.',
    stockQuantity: 35,
    inStock: true,
    folder: '23-pure-ajwain-honey',
    image: '',
    images: [],
    videos: [],
    variants: [
      { weight: '250g', price: '₹449', originalPrice: '₹549', stock: 20 },
      { weight: '500g', price: '₹799', originalPrice: '₹999', stock: 15 }
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

      const masterStock = item.stock_quantity !== undefined && item.stock_quantity !== null
        ? Number(item.stock_quantity)
        : (item.stock ?? 0);

      // If variants exist, normalize fields; if none, generate default variants
      if (variants && variants.length > 0) {
        variants = variants.map((v: any, idx: number) => ({
          weight: v.weight || '100g',
          price: v.price || item.price,
          originalPrice: v.originalPrice || v.original_price || item.original_price,
          stock: idx === 0 ? masterStock : (v.stock !== undefined && v.stock !== null ? Number(v.stock) : Math.max(1, Math.floor(masterStock / 2)))
        }));
      } else {
        variants = [
          { weight: '100g', price: item.price, originalPrice: item.original_price, stock: masterStock },
          { weight: '200g', price: item.price ? `₹${Math.round(parseInt(item.price.replace(/\D/g, '') || '200') * 1.8)}` : '₹349', stock: Math.max(1, Math.floor(masterStock / 2)) }
        ];
      }

      const defaultProd = DEFAULT_PRODUCTS.find((p) => p.id === item.id);
      const images = item.images && Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : (item.image ? [item.image] : (defaultProd?.images || []));

      return {
        id: item.id,
        name: cleanProductName(item.name),
        category: item.category,
        flavour: item.flavour,
        price: item.price,
        originalPrice: item.original_price,
        discount: item.discount,
        rating: item.rating ? Number(item.rating) : 4.9,
        reviews: item.reviews ? String(item.reviews) : '100+',
        badge: item.badge,
        desc: item.desc || item.description,
        stockQuantity: masterStock,
        inStock: item.in_stock !== false && (masterStock > 0),
        folder: defaultProd?.folder || `${item.id}-${cleanProductName(item.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        image: images[0] || item.image || item.image_url || '',
        images,
        videos: defaultProd?.videos || [],
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

// ==============================================================================
// 3-TABLE INVENTORY MANAGEMENT & MATH FORMULA
// Formula: stock_items + new_stock_inventory - sold_items = available_quantity
// ==============================================================================

/**
 * Pure calculation helper: Initial Stock + New Stock - Sold Items = Available Quantity
 */
export function calculateAvailableStock(initialStock: number, newStock: number, soldItems: number): number {
  return Math.max(0, (Number(initialStock) || 0) + (Number(newStock) || 0) - (Number(soldItems) || 0));
}

/**
 * Fetch inventory summary across all products or for a single product.
 * Returns initial stock, new inward stock, sold stock, and net available stock.
 */
export async function getInventorySummary(productId?: number): Promise<InventorySummary[]> {
  if (!isSupabaseConfigured) {
    return DEFAULT_PRODUCTS
      .filter((p) => (productId ? p.id === productId : true))
      .map((p) => {
        const qty = p.stockQuantity || 0;
        return {
          product_id: p.id,
          product_name: cleanProductName(p.name),
          category: p.category,
          price: p.price,
          initial_stock: qty,
          new_stock: 0,
          sold_stock: 0,
          available_quantity: qty,
          in_stock: qty > 0
        };
      });
  }

  try {
    let query = supabase.from('inventory_summary').select('*');
    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      // Fallback: If view does not exist yet in Supabase, compute from products table
      const products = await getProducts();
      return products
        .filter((p) => (productId ? p.id === productId : true))
        .map((p) => {
          const qty = p.stockQuantity || 0;
          return {
            product_id: p.id,
            product_name: cleanProductName(p.name),
            category: p.category,
            price: p.price,
            initial_stock: qty,
            new_stock: 0,
            sold_stock: 0,
            available_quantity: qty,
            in_stock: qty > 0
          };
        });
    }

    return data.map((row: any) => ({
      product_id: Number(row.product_id),
      product_name: cleanProductName(String(row.product_name)),
      category: String(row.category),
      price: String(row.price),
      initial_stock: Number(row.initial_stock || 0),
      new_stock: Number(row.new_stock || 0),
      sold_stock: Number(row.sold_stock || 0),
      available_quantity: Number(row.available_quantity || 0),
      in_stock: Boolean(row.in_stock)
    }));
  } catch (err) {
    console.warn('[Inventory] Failed to fetch inventory summary:', err);
    return [];
  }
}

/**
 * Fetch Table 1: stock_items (Opening Baseline Stock)
 */
export async function getStockItems(productId?: number): Promise<StockItem[]> {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase.from('stock_items').select('*').order('created_at', { ascending: false });
    if (productId) query = query.eq('product_id', productId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as StockItem[];
  } catch (err) {
    console.warn('[Inventory] Could not fetch stock_items:', err);
    return [];
  }
}

/**
 * Fetch Table 2: new_stock_inventory (Incoming Batches / Restocked Units)
 */
export async function getNewStockInventory(productId?: number): Promise<NewStockInventoryItem[]> {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase.from('new_stock_inventory').select('*').order('created_at', { ascending: false });
    if (productId) query = query.eq('product_id', productId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as NewStockInventoryItem[];
  } catch (err) {
    console.warn('[Inventory] Could not fetch new_stock_inventory:', err);
    return [];
  }
}

/**
 * Fetch Table 3: sold_items (Sales Transactions & Deducted Stock)
 */
export async function getSoldItems(productId?: number): Promise<SoldItem[]> {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase.from('sold_items').select('*').order('created_at', { ascending: false });
    if (productId) query = query.eq('product_id', productId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as SoldItem[];
  } catch (err) {
    console.warn('[Inventory] Could not fetch sold_items:', err);
    return [];
  }
}

/**
 * Add a new stock entry into Table 2: new_stock_inventory
 * Automatically updates available stock via PostgreSQL triggers!
 */
export async function addNewStock(params: {
  productId: number;
  variantWeight?: string;
  quantity: number;
  batchNumber?: string;
  supplier?: string;
  costPerUnit?: number;
  notes?: string;
}): Promise<{ success: boolean; data?: any; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured in .env' };
  }
  if (!params.productId || params.quantity <= 0) {
    return { success: false, message: 'Valid product ID and positive quantity are required.' };
  }

  try {
    const { data, error } = await supabase
      .from('new_stock_inventory')
      .insert([{
        product_id: params.productId,
        variant_weight: params.variantWeight || 'all',
        quantity: Math.floor(params.quantity),
        batch_number: params.batchNumber || null,
        supplier: params.supplier || null,
        cost_per_unit: params.costPerUnit || null,
        notes: params.notes || 'Inward stock batch'
      }])
      .select();

    if (error) return { success: false, message: error.message };
    return { success: true, data, message: `Successfully added ${params.quantity} units to new stock!` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to add new stock' };
  }
}

/**
 * Record a sale entry into Table 3: sold_items
 * Automatically deducts from available stock via PostgreSQL triggers!
 */
export async function recordSoldItem(params: {
  productId: number;
  variantWeight?: string;
  quantity: number;
  orderId?: string;
  unitPrice?: number;
  notes?: string;
}): Promise<{ success: boolean; data?: any; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured in .env' };
  }
  if (!params.productId || params.quantity <= 0) {
    return { success: false, message: 'Valid product ID and positive quantity are required.' };
  }

  try {
    const { data, error } = await supabase
      .from('sold_items')
      .insert([{
        product_id: params.productId,
        variant_weight: params.variantWeight || 'all',
        quantity: Math.floor(params.quantity),
        order_id: params.orderId || null,
        unit_price: params.unitPrice || null,
        notes: params.notes || 'Direct sales deduction'
      }])
      .select();

    if (error) return { success: false, message: error.message };
    return { success: true, data, message: `Successfully recorded ${params.quantity} sold units!` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to record sold item' };
  }
}

/**
 * Set or update initial opening baseline stock in Table 1: stock_items
 */
export async function updateInitialStock(params: {
  productId: number;
  variantWeight?: string;
  quantity: number;
  unitCost?: number;
  notes?: string;
}): Promise<{ success: boolean; data?: any; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured in .env' };
  }
  if (!params.productId || params.quantity < 0) {
    return { success: false, message: 'Valid product ID and non-negative quantity are required.' };
  }

  try {
    const { data, error } = await supabase
      .from('stock_items')
      .upsert({
        product_id: params.productId,
        variant_weight: params.variantWeight || 'all',
        quantity: Math.floor(params.quantity),
        unit_cost: params.unitCost || null,
        notes: params.notes || 'Opening baseline stock',
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id,variant_weight' })
      .select();

    if (error) return { success: false, message: error.message };
    return { success: true, data, message: `Initial stock updated to ${params.quantity} units!` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to update initial stock' };
  }
}

/**
 * Place a customer order and automatically record sold units in Table 3: sold_items
 * Triggers realtime product stock deductions via PostgreSQL triggers.
 */
export async function createOrder(orderData: Order): Promise<{
  success: boolean;
  orderId: string;
  data?: any;
  message: string;
}> {
  const subtotal = Number(orderData.subtotal) || 0;
  const discount = Number(orderData.discount_amount) || 0;
  const shipping = Number(orderData.shipping_fee) || 0;
  const total = Number(orderData.total_amount) || Math.max(0, subtotal - discount + shipping);

  // Generate clean Indian D2C Order ID format (e.g. MN-894201)
  const readableId = `MN-${Math.floor(100000 + Math.random() * 900000)}`;

  if (isSupabaseConfigured) {
    try {
      // 1. Insert order record into public.orders
      const { data: orderRecord, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_email: orderData.customer_email || `${orderData.customer_phone}@guest.manneeds.in`,
          shipping_address: orderData.shipping_address,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status || (orderData.payment_method === 'cod' ? 'cod_pending' : 'paid'),
          subtotal: subtotal,
          discount_amount: discount,
          discount_code: orderData.discount_code || null,
          shipping_fee: shipping,
          total_amount: total,
          items: orderData.items,
          status: 'confirmed',
          notes: orderData.notes || `ManNeeds Web Order ${readableId}`
        }])
        .select()
        .single();

      let assignedOrderId = orderRecord?.id ? String(orderRecord.id) : readableId;

      if (orderError) {
        console.warn('Supabase extended order insert error, attempting basic columns:', orderError.message);
        // Fallback for older schema if migration columns haven't been run yet
        const { data: fallbackOrder, error: fallbackError } = await supabase
          .from('orders')
          .insert([{
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email || `${orderData.customer_phone}@guest.manneeds.in`,
            items: orderData.items,
            total_amount: total,
            status: 'confirmed'
          }])
          .select()
          .single();

        if (fallbackError) {
          console.error('Order creation failed:', fallbackError.message);
          return {
            success: false,
            orderId: readableId,
            message: `Supabase orders insert failed: ${orderError.message || fallbackError.message}`
          };
        } else if (fallbackOrder?.id) {
          assignedOrderId = String(fallbackOrder.id);
        }
      }

      // 2. Insert items into Table 3: sold_items
      // This immediately fires trg_sync_sold_items to subtract quantities from products.stock_quantity!
      if (orderData.items && orderData.items.length > 0) {
        const soldRows = orderData.items.map((item) => {
          const numericPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
          const numId = typeof item.id === 'string' ? parseInt(item.id.replace(/\D/g, ''), 10) || 1 : item.id;
          return {
            product_id: numId,
            variant_weight: item.weight || 'all',
            quantity: Math.max(1, Math.floor(item.quantity || 1)),
            order_id: assignedOrderId,
            unit_price: numericPrice,
            notes: `Web Checkout Order #${readableId} (${orderData.customer_name})`
          };
        });

        const { error: soldError } = await supabase
          .from('sold_items')
          .insert(soldRows);

        if (soldError) {
          console.error('sold_items insert error:', soldError.message);
          return {
            success: false,
            orderId: readableId,
            message: `Supabase sold_items insert failed: ${soldError.message}`
          };
        }
      }

      return {
        success: true,
        orderId: readableId,
        data: orderRecord,
        message: 'Order confirmed! Deducted from 3-table inventory in Supabase.'
      };
    } catch (err: any) {
      console.error('Order creation error:', err);
      return {
        success: false,
        orderId: readableId,
        message: `Checkout error: ${err?.message || 'Database error'}`
      };
    }
  }

  // Demo / fallback mode (when Supabase is offline or awaiting setup)
  return {
    success: true,
    orderId: readableId,
    message: 'Order confirmed successfully (Demo mode).'
  };
}

/**
 * Fetch an order by ID or phone number
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !data) return null;
    return data as Order;
  } catch {
    return null;
  }
}

