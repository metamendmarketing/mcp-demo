export type BrandId = 'marquis' | 'artesian' | 'nordic' | 'tropic-seas';

export interface BrandTheme {
  primary: string;
  secondary: string;
  accent: string;
  logoUrl: string;
  heroImage: string;
  fontFamily?: string;
}

export interface BrandConfig {
  id: BrandId;
  name: string;
  domain: string;
  theme: BrandTheme;
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  features: {
    hasSwimSpas: boolean;
    hasPlugAndPlay: boolean;
    primaryFocus: 'therapy' | 'value' | 'family' | 'luxury';
  };
}

export const BRANDS: Record<BrandId, BrandConfig> = {
  marquis: {
    id: 'marquis',
    name: 'Marquis Spas',
    domain: 'marquisspas.com',
    theme: {
      primary: '#1a365d', // Deep blue
      secondary: '#2d3748',
      accent: '#3182ce',
      logoUrl: '/mcp/demo/brands/marquis/logo.svg',
      heroImage: '/mcp/demo/brands/marquis/hero.jpg',
    },
    copy: {
      heroTitle: 'The Ultimate Hot Tub Experience',
      heroSubtitle: 'Find the perfect Marquis spa for your home and lifestyle.',
      ctaPrimary: 'Start Guided Journey',
      ctaSecondary: 'View All Models',
    },
    features: {
      hasSwimSpas: true,
      hasPlugAndPlay: true,
      primaryFocus: 'therapy',
    },
  },
  artesian: {
    id: 'artesian',
    name: 'Artesian Spas',
    domain: 'artesianspas.com',
    theme: {
      primary: '#2c5282',
      secondary: '#2b6cb0',
      accent: '#4299e1',
      logoUrl: '/mcp/demo/brands/artesian/logo.svg',
      heroImage: '/mcp/demo/brands/artesian/hero.jpg',
    },
    copy: {
      heroTitle: 'Experience the Artesian Difference',
      heroSubtitle: 'Discover our diverse portfolio of award-winning hot tubs.',
      ctaPrimary: 'Find Your Spa',
      ctaSecondary: 'Explore Collections',
    },
    features: {
      hasSwimSpas: true,
      hasPlugAndPlay: true,
      primaryFocus: 'luxury',
    },
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Hot Tubs',
    domain: 'nordichottubs.com',
    theme: {
      primary: '#2d3748',
      secondary: '#4a5568',
      accent: '#718096',
      logoUrl: '/mcp/demo/brands/nordic/logo.svg',
      heroImage: '/mcp/demo/brands/nordic/hero.jpg',
    },
    copy: {
      heroTitle: 'Simple, Reliable, Effective',
      heroSubtitle: 'High-quality hot tubs designed for every home.',
      ctaPrimary: 'Get Recommendations',
      ctaSecondary: 'Compare Series',
    },
    features: {
      hasSwimSpas: false,
      hasPlugAndPlay: true,
      primaryFocus: 'value',
    },
  },
  'tropic-seas': {
    id: 'tropic-seas',
    name: 'Tropic Seas Spas',
    domain: 'tropicseasspas.com',
    theme: {
      primary: '#2b6cb0',
      secondary: '#2c5282',
      accent: '#3182ce',
      logoUrl: '/mcp/demo/brands/tropic-seas/logo.svg',
      heroImage: '/mcp/demo/brands/tropic-seas/hero.jpg',
    },
    copy: {
      heroTitle: 'Paradise in Your Backyard',
      heroSubtitle: 'Bringing the island experience to your home.',
      ctaPrimary: 'Begin Search',
      ctaSecondary: 'Browse Tubs',
    },
    features: {
      hasSwimSpas: true,
      hasPlugAndPlay: true,
      primaryFocus: 'family',
    },
  },
};

export const getBrandConfig = (id: string): BrandConfig | undefined => {
  return BRANDS[id as BrandId];
};

export const getBrandByDomain = (domain: string): BrandConfig | undefined => {
  return Object.values(BRANDS).find((b) => b.domain === domain || domain.includes(b.id));
};
