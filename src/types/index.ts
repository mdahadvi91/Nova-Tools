export type ToolCategory =
  | 'popular'
  | 'image'
  | 'pdf'
  | 'qr'
  | 'career'
  | 'utilities'
  | 'design'
  | 'calculators'
  | 'ai';

export type Language = 'en' | 'bn' | 'ar';

export type Theme = 'light' | 'dark' | 'system';

export interface ToolDefinition {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descKey: string;
  category: ToolCategory;
  iconName: string;
  aliases: string[];
  keywords: string[];
  isPopular?: boolean;
  requiresCamera?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type ActiveView = 'home' | 'tool' | 'category' | 'legal' | '404';

export type LegalPageType = 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact';

export interface NavigationState {
  view: ActiveView;
  toolId?: string;
  category?: ToolCategory;
  legalPage?: LegalPageType;
}

export type QrOverlayPosition =
  | 'left-top'
  | 'left-middle'
  | 'left-bottom'
  | 'right-top'
  | 'right-middle'
  | 'right-bottom';

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    graduationYear: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link?: string;
  }>;
}

export interface BusinessCardData {
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  photoUrl?: string;
  qrData?: string;
  accentColor: string;
  layout: 'modern' | 'minimal' | 'corporate';
}
