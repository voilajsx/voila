/**
 * Home Feature Types
 * @file src/web/main/features/home/home.types.ts
 */

export interface HomePageProps {
  className?: string;
}

export interface AppFeature {
  name: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  status: 'active' | 'coming-soon' | 'maintenance';
  features: FeatureLink[];
}

export interface FeatureLink {
  name: string;
  title: string;
  path: string;
  icon: string;
  enabled: boolean;
}

export interface FrameworkFeature {
  title: string;
  description: string;
  icon: string;
}

export interface NavigationState {
  currentApp?: string;
  currentFeature?: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  active: boolean;
}