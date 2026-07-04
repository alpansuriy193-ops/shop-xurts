export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  heroImage?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  description: string;
  longDescription: string;
  materials: string;
  dimensions?: string;
  images: string[];
  featured?: boolean;
  new?: boolean;
  /** Selectable sizes (fashion, sepatu) */
  sizes?: string[];
  /** Selectable color options */
  colors?: { name: string; hex: string }[];
  /** Fragrance notes for parfum */
  notes?: { top?: string; heart?: string; base?: string };
  /** Volume / bottle size for parfum */
  volume?: string;
  /** Care instructions for fashion / textiles */
  care?: string;
  /** Fit description for fashion */
  fit?: string;
  /** Key/value specs for elektronik */
  specs?: { label: string; value: string }[];
  /** What ships in the box (elektronik) */
  inTheBox?: string[];
  /** Warranty text (elektronik / jam) */
  warranty?: string;
}

export const collections: Collection[] = [
  {
    id: "parfum",
    name: "Parfum",
    slug: "parfum",
    description: "Signature scents crafted for lasting impressions",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80",
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Modern silhouettes with timeless character",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
  },
  {
    id: "sepatu",
    name: "Sepatu",
    slug: "sepatu",
    description: "Footwear that moves with your every step",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80",
  },
  {
    id: "aksesoris",
    name: "Aksesoris",
    slug: "aksesoris",
    description: "The finishing touches that define a look",
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1920&q=80",
  },
  {
    id: "elektronik",
    name: "Elektronik",
    slug: "elektronik",
    description: "Smart devices designed for everyday life",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=80",
  },
  {
    id: "tas",
    name: "Tas",
    slug: "tas",
    description: "Bags built for form, function, and every journey",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920&q=80",
  },
  {
    id: "jam",
    name: "Jam Tangan",
    slug: "jam-tangan",
    description: "Precision timepieces with enduring style",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1920&q=80",
  },
  {
    id: "beauty",
    name: "Beauty",
    slug: "beauty",
    description: "Skincare and cosmetics for radiant confidence",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80",
  },
];

export const products: Product[] = [
  // Parfum
  {
    id: "noir-eau-de-parfum",
    name: "Noir Eau de Parfum",
    slug: "noir-eau-de-parfum",
    collection: "parfum",
    price: 185,
    description: "Warm amber, oud, and smoked vanilla",
    longDescription: "Noir opens with bergamot and pink pepper before settling into a rich heart of oud, amber, and smoked vanilla. A signature scent designed for evenings that linger.",
    materials: "Eau de Parfum, 50ml",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    ],
    featured: true,
  },
  {
    id: "blanc-cologne",
    name: "Blanc Cologne",
    slug: "blanc-cologne",
    collection: "parfum",
    price: 120,
    description: "Fresh citrus with clean musk",
    longDescription: "A crisp everyday cologne of Italian lemon, neroli, and soft white musk. Effortlessly clean, unmistakably refined.",
    materials: "Eau de Cologne, 100ml",
    images: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80",
    ],
    new: true,
  },
  // Fashion
  {
    id: "wool-overcoat",
    name: "Tailored Wool Overcoat",
    slug: "tailored-wool-overcoat",
    collection: "fashion",
    price: 650,
    description: "Double-breasted silhouette in Italian wool",
    longDescription: "A structured overcoat cut from Italian virgin wool with a soft cashmere blend. Timeless tailoring built to layer through every season.",
    materials: "80% wool, 20% cashmere",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    featured: true,
  },
  {
    id: "linen-shirt",
    name: "Relaxed Linen Shirt",
    slug: "relaxed-linen-shirt",
    collection: "fashion",
    price: 145,
    description: "Breathable Belgian linen, garment-washed",
    longDescription: "An easy button-down in stonewashed Belgian linen with a relaxed cut and mother-of-pearl buttons. Wears softer with every wash.",
    materials: "100% Belgian linen",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
    ],
  },
  // Sepatu
  {
    id: "leather-derby",
    name: "Classic Leather Derby",
    slug: "classic-leather-derby",
    collection: "sepatu",
    price: 385,
    description: "Hand-finished full-grain leather",
    longDescription: "Goodyear-welted derbies in Italian full-grain leather, hand-finished with a subtle patina and stacked leather sole.",
    materials: "Full-grain leather, leather sole",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80",
    ],
    featured: true,
  },
  {
    id: "runner-sneaker",
    name: "Everyday Runner Sneaker",
    slug: "everyday-runner-sneaker",
    collection: "sepatu",
    price: 165,
    description: "Lightweight knit with cushioned sole",
    longDescription: "A minimalist runner with a breathable knit upper and responsive foam midsole. Built for the commute and everything after.",
    materials: "Recycled knit upper, EVA sole",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    ],
    new: true,
  },
  // Aksesoris
  {
    id: "leather-belt",
    name: "Bridle Leather Belt",
    slug: "bridle-leather-belt",
    collection: "aksesoris",
    price: 145,
    description: "English bridle leather with brass buckle",
    longDescription: "Cut from English bridle leather and finished with a solid brass buckle. Ages into a rich, personal patina.",
    materials: "English bridle leather, brass hardware",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80",
    ],
  },
  {
    id: "silk-scarf",
    name: "Printed Silk Scarf",
    slug: "printed-silk-scarf",
    collection: "aksesoris",
    price: 95,
    description: "Hand-rolled edges on pure silk twill",
    longDescription: "A 90cm silk twill square printed with an original archive motif and finished with hand-rolled edges.",
    materials: "100% silk twill",
    images: [
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    ],
    featured: true,
  },
  // Elektronik
  {
    id: "wireless-headphones",
    name: "Studio Wireless Headphones",
    slug: "studio-wireless-headphones",
    collection: "elektronik",
    price: 349,
    description: "Active noise cancellation with 40h battery",
    longDescription: "Over-ear wireless headphones with hybrid active noise cancellation, spatial audio, and up to 40 hours of playback on a single charge.",
    materials: "Aluminum, memory foam, protein leather",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    ],
    featured: true,
  },
  {
    id: "smart-speaker",
    name: "Compact Smart Speaker",
    slug: "compact-smart-speaker",
    collection: "elektronik",
    price: 199,
    description: "Room-filling sound in a minimalist form",
    longDescription: "A compact wireless speaker with 360° sound, voice assistant support, and a fabric-wrapped enclosure that disappears into any room.",
    materials: "Recycled aluminum, woven fabric",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80",
    ],
    new: true,
  },
  // Tas
  {
    id: "leather-tote",
    name: "Structured Leather Tote",
    slug: "structured-leather-tote",
    collection: "tas",
    price: 495,
    description: "Everyday carry in vegetable-tanned leather",
    longDescription: "A clean-lined tote in vegetable-tanned Italian leather with a suede-lined interior and hand-stitched handles.",
    materials: "Vegetable-tanned leather, suede lining",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    featured: true,
  },
  // Jam Tangan
  {
    id: "automatic-watch",
    name: "Heritage Automatic Watch",
    slug: "heritage-automatic-watch",
    collection: "jam",
    price: 1250,
    description: "Swiss automatic movement, sapphire crystal",
    longDescription: "A 40mm automatic timepiece with a Swiss movement, sapphire crystal, and a hand-finished stainless steel case on an Italian leather strap.",
    materials: "Stainless steel, sapphire crystal, leather",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    ],
    new: true,
  },
  // Beauty
  {
    id: "botanical-serum",
    name: "Botanical Radiance Serum",
    slug: "botanical-radiance-serum",
    collection: "beauty",
    price: 85,
    description: "Vitamin C and hyaluronic acid",
    longDescription: "A lightweight daily serum blending stabilized vitamin C, hyaluronic acid, and botanical extracts for luminous, hydrated skin.",
    materials: "30ml, glass dropper bottle",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    ],
    featured: true,
  },
];

export const getProductsByCollection = (collectionSlug: string): Product[] => {
  return products.filter((product) => product.collection === collectionSlug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter((product) => product.new);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find((collection) => collection.slug === slug);
};

export const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];
  
  return products
    .filter((p) => p.collection === product.collection && p.id !== productId)
    .slice(0, limit);
};
