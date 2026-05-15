export interface Denomination {
  value: string;
  label: string;
}

export interface SubCategory {
  id: string;
  region: string;
  currency: string;
  denominations: Denomination[];
}


export interface Category {
  id: string;
  name: string;
  nameEn: string;
  gradient: string;
  icon: string;
  logoUrl: string;
  productImageUrl: string;
  bgUrl: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "xbox",
    name: "اكس بوكس",
    nameEn: "XBOX",
    gradient: "from-green-600 via-emerald-600 to-green-500",
    icon: "🎮",
    logoUrl: "/images/products/xbox.png",
    productImageUrl: "/images/products/xbox-product.jpg",
    bgUrl: "/images/products/xbox-bg.jpg",
    subCategories: [
      {
        id: "xbox-try",
        region: "تركي",
        currency: "TRY",
        denominations: [
          { value: "25", label: "25 TRY" },
          { value: "50", label: "50 TRY" },
          { value: "100", label: "100 TRY" },
          { value: "300", label: "300 TRY" },
        ],
      },
      {
        id: "xbox-sar",
        region: "سعودي",
        currency: "SAR",
        denominations: [
          { value: "50", label: "50 SAR" },
          { value: "100", label: "100 SAR" },
          { value: "200", label: "200 SAR" },
          { value: "300", label: "300 SAR" },
        ],
      },
      {
        id: "xbox-usd",
        region: "أمريكي",
        currency: "USD",
        denominations: [
          { value: "5", label: "5 USD" },
          { value: "10", label: "10 USD" },
          { value: "15", label: "15 USD" },
          { value: "20", label: "20 USD" },
          { value: "25", label: "25 USD" },
          { value: "50", label: "50 USD" },
        ],
      },
      {
        id: "xbox-uae",
        region: "إماراتي",
        currency: "AED",
        denominations: [
          { value: "59", label: "59 AED" },
          { value: "99", label: "99 AED" },
          { value: "199", label: "199 AED" },
        ],
      },
    ],
  },
  {
    id: "playstation",
    name: "بلايستيشن",
    nameEn: "PLAYSTATION",
    gradient: "from-blue-700 via-blue-600 to-blue-500",
    icon: "🎯",
    logoUrl: "/images/products/playstation.png",
    productImageUrl: "/images/products/playstation-product.jpg",
    bgUrl: "/images/products/playstation-bg.jpg",
    subCategories: [
      {
        id: "ps-usd",
        region: "أمريكي",
        currency: "USD",
        denominations: [
          { value: "1", label: "1 USD" },
          { value: "2", label: "2 USD" },
          { value: "3", label: "3 USD" },
          { value: "4", label: "4 USD" },
          { value: "5", label: "5 USD" },
          { value: "10", label: "10 USD" },
          { value: "15", label: "15 USD" },
          { value: "20", label: "20 USD" },
          { value: "25", label: "25 USD" },
          { value: "35", label: "35 USD" },
          { value: "45", label: "45 USD" },
          { value: "50", label: "50 USD" },
        ],
      },
      {
        id: "ps-try",
        region: "تركي",
        currency: "TRY",
        denominations: [
          { value: "250", label: "250 TRY" },
          { value: "500", label: "500 TRY" },
          { value: "750", label: "750 TRY" },
          { value: "1000", label: "1000 TRY" },
        ],
      },
      {
        id: "ps-ksa",
        region: "سعودي",
        currency: "SAR",
        denominations: [
          { value: "10", label: "10 SAR" },
          { value: "20", label: "20 SAR" },
          { value: "30", label: "30 SAR" },
          { value: "50", label: "50 SAR" },
        ],
      },
      {
        id: "ps-uae",
        region: "إماراتي",
        currency: "AED",
        denominations: [
          { value: "10", label: "10 AED" },
          { value: "15", label: "15 AED" },
          { value: "20", label: "20 AED" },
          { value: "25", label: "25 AED" },
          { value: "30", label: "30 AED" },
          { value: "50", label: "50 AED" },
        ],
      },
    ],
  },
  {
    id: "apple",
    name: "بطاقات ابل",
    nameEn: "APPLE / iTunes",
    gradient: "from-gray-600 via-gray-500 to-gray-400",
    icon: "🍎",
    logoUrl: "/images/products/apple.png",
    productImageUrl: "/images/products/apple-product.jpg",
    bgUrl: "/images/products/apple-bg.jpg",
    subCategories: [
      {
        id: "apple-usd",
        region: "أمريكي",
        currency: "USD",
        denominations: [
          { value: "50", label: "50 USD" },
        ],
      },
      {
        id: "apple-try",
        region: "تركي",
        currency: "TRY",
        denominations: [
          { value: "10", label: "10 TRY" },
          { value: "25", label: "25 TRY" },
          { value: "50", label: "50 TRY" },
          { value: "100", label: "100 TRY" },
          { value: "250", label: "250 TRY" },
          { value: "500", label: "500 TRY" },
          { value: "750", label: "750 TRY" },
          { value: "1000", label: "1000 TRY" },
          { value: "1500", label: "1500 TRY" },
        ],
      },
      {
        id: "apple-sar",
        region: "سعودي",
        currency: "SAR",
        denominations: [
          { value: "50", label: "50 SAR" },
          { value: "100", label: "100 SAR" },
        ],
      },
      {
        id: "apple-uae",
        region: "إماراتي",
        currency: "AED",
        denominations: [
          { value: "50", label: "50 AED" },
          { value: "100", label: "100 AED" },
        ],
      },
    ],
  },
  {
    id: "steam",
    name: "ستيم",
    nameEn: "STEAM",
    gradient: "from-blue-800 via-blue-700 to-indigo-600",
    icon: "🎮",
    logoUrl: "/images/products/steam.png",
    productImageUrl: "/images/products/steam-product.jpg",
    bgUrl: "/images/products/steam-bg.jpg",
    subCategories: [
      {
        id: "steam-usd",
        region: "أمريكي",
        currency: "USD",
        denominations: [
          { value: "5", label: "5 USD" },
          { value: "10", label: "10 USD" },
          { value: "15", label: "15 USD" },
          { value: "20", label: "20 USD" },
          { value: "25", label: "25 USD" },
          { value: "30", label: "30 USD" },
          { value: "50", label: "50 USD" },
        ],
      },
    ],
  },
  {
    id: "pubg",
    name: "شدات ببجي",
    nameEn: "PUBG",
    gradient: "from-yellow-600 via-amber-600 to-orange-500",
    icon: "🔫",
    logoUrl: "/images/products/pubg.png",
    productImageUrl: "/images/products/pubg-product.jpg",
    bgUrl: "",
    subCategories: [
      {
        id: "pubg-uc",
        region: "شدات",
        currency: "UC",
        denominations: [
          { value: "60", label: "60 UC" },
          { value: "325", label: "325 UC" },
          { value: "660", label: "660 UC" },
          { value: "1800", label: "1800 UC" },
        ],
      },
    ],
  },
  {
    id: "gamepass",
    name: "قيم باس",
    nameEn: "GAME PASS",
    gradient: "from-green-700 via-emerald-700 to-teal-600",
    icon: "🏆",
    logoUrl: "/images/products/gamepass.png",
    productImageUrl: "/images/products/gamepass-product.jpg",
    bgUrl: "/images/products/gamepass-bg.jpg",
    subCategories: [
      {
        id: "gamepass-ultimate",
        region: "التمت",
        currency: "",
        denominations: [
          { value: "2-months", label: "شهرين التمت - حساب كامل" },
        ],
      },
    ],
  },
  {
    id: "shahid",
    name: "شاهد",
    nameEn: "SHAHID",
    gradient: "from-green-600 via-emerald-600 to-teal-500",
    icon: "📺",
    logoUrl: "/images/products/shahid.png",
    productImageUrl: "/images/products/shahid-product.jpg",
    bgUrl: "/images/products/shahid-bg.jpg",
    subCategories: [
      {
        id: "shahid-sub",
        region: "اشتراك",
        currency: "",
        denominations: [
          { value: "3-months", label: "اشتراك 3 أشهر" },
        ],
      },
    ],
  },
  {
    id: "razer",
    name: "ريزر جولد",
    nameEn: "RAZER GOLD",
    gradient: "from-green-500 via-lime-500 to-emerald-500",
    icon: "💳",
    logoUrl: "/images/products/razer.png",
    productImageUrl: "/images/products/razer-product.jpg",
    bgUrl: "/images/products/razer-bg.jpg",
    subCategories: [
      {
        id: "razer-usd",
        region: "أمريكي",
        currency: "USD",
        denominations: [
          { value: "1", label: "1 USD" },
          { value: "2", label: "2 USD" },
          { value: "3", label: "3 USD" },
          { value: "4", label: "4 USD" },
          { value: "5", label: "5 USD" },
          { value: "10", label: "10 USD" },
        ],
      },
    ],
  },
  {
    id: "netflix",
    name: "نتفلكس",
    nameEn: "NETFLIX",
    gradient: "from-red-700 via-red-600 to-red-500",
    icon: "🎬",
    logoUrl: "/images/products/netflix.png",
    productImageUrl: "/images/products/netflix-product.jpg",
    bgUrl: "/images/products/netflix-bg.jpg",
    subCategories: [
      {
        id: "netflix-4k",
        region: "4K",
        currency: "",
        denominations: [
          { value: "4k", label: "اشتراك نتفلكس 4K" },
        ],
      },
    ],
  },
  {
    id: "shein",
    name: "شي إن",
    nameEn: "SHEIN",
    gradient: "from-gray-800 via-gray-700 to-gray-600",
    icon: "🛍️",
    logoUrl: "/images/products/shein.png",
    productImageUrl: "/images/products/shein-product.jpg",
    bgUrl: "/images/products/shein-bg.jpg",
    subCategories: [
      {
        id: "shein-sar",
        region: "سعودي",
        currency: "SAR",
        denominations: [
          { value: "200", label: "200 SAR" },
          { value: "300", label: "300 SAR" },
          { value: "400", label: "400 SAR" },
        ],
      },
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
