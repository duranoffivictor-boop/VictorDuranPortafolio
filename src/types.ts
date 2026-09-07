export interface SiteConfig {
  name: string;
  title: string;
  headline: string;
  subheadline: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  location: string;
  aboutBio: string;
  avatarUrl: string;
  yearsOfExperience: string;
  completedProjects: string;
  satisfiedClients: string;
  availableForFreelance: boolean;
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'html' | 'css' | 'javascript' | 'tools';
  proficiency: number;
  description: string;
  highlights: string[];
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'all' | 'html-css' | 'javascript' | 'landing-page';
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
  features: string[];
}

export interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorAvatar: string;
  rating: number; // 1 - 5
  comment: string;
  date: string;
  verified: boolean;
  status: 'approved' | 'pending';
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PrivacyPolicy {
  lastUpdated: string;
  title: string;
  introduction: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export interface PortfolioData {
  config: SiteConfig;
  skills: SkillItem[];
  projects: Project[];
  reviews: Review[];
  privacyPolicy: PrivacyPolicy;
}
