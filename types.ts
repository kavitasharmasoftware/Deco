
export enum WebsiteTheme {
  MODERN = 'modern',
  ELEGANT = 'elegant',
  BOLD = 'bold',
  MINIMAL = 'minimal',
  CYBER = 'cyber'
}

export interface HeaderData {
  companyName: string;
  navLinks: string[];
  ctaText: string;
}

export interface HeroData {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImageKeyword: string;
  videoMood: string; 
  style3D: 'orb' | 'particles' | 'grid' | 'waves'; // New 3D option
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  imageKeyword?: string;
}

export interface FeaturesData {
  title: string;
  subtitle: string;
  items: FeatureItem[];
  layout: 'grid' | 'alternating';
}

export interface GalleryItem {
  alt: string;
  keyword: string;
}

export interface GalleryData {
  title: string;
  description: string;
  images: GalleryItem[];
}

export interface VideoSectionData {
  title: string;
  description: string;
  videoType: 'youtube' | 'ambient';
  videoKeyword: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export interface TestimonialsData {
  title: string;
  items: TestimonialItem[];
}

export interface FooterData {
  copyright: string;
  socialLinks: string[];
}

export interface GeneratedWebsite {
  theme: WebsiteTheme;
  fontPairing: {
    heading: string;
    body: string;
  };
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  header: HeaderData;
  hero: HeroData;
  features: FeaturesData;
  gallery?: GalleryData;
  videoSection?: VideoSectionData;
  testimonials: TestimonialsData;
  footer: FooterData;
}
