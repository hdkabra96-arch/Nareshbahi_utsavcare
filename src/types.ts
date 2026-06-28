/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CompanySettings {
  logoText: string;
  phone: string;
  phoneAlt: string;
  email: string;
  address: string;
  companyProfileUrl: string;
  whatsappNumber: string;
}

export interface HeroSlide {
  id: string;
  titlePart1: string;
  titleGold: string;
  subtitle: string;
  bgImage: string;
}

export interface HeroData {
  ctaProjectsText: string;
  ctaContactText: string;
  slides: HeroSlide[];
}

export interface StatItem {
  id: string;
  numberText: string;
  label: string;
}

export interface AboutData {
  title: string;
  legacyHeading: string;
  legacyText1: string;
  legacyText2: string;
  legacyText3: string;
  stats: StatItem[];
  imageUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Key of LucideIcons
}

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

export interface WebsiteData {
  settings: CompanySettings;
  hero: HeroData;
  about: AboutData;
  services: ServiceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  gallery?: GalleryItem[];
}
