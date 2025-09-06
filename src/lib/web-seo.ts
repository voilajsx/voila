/**
 * Voila Web SEO Framework - Meta tags and page title management
 * @file src/lib/web-seo.ts
 * 
 * @llm-rule WHEN: Need to set page titles, meta descriptions, and Open Graph tags
 * @llm-rule AVOID: Direct document manipulation - use this centralized utility
 * @llm-rule PATTERN: Use useSeo hook in components, supports dynamic parameter replacement
 * @llm-rule NOTE: Framework-level SEO management for all Voila web applications
 */

import { useEffect } from 'react';

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export interface SeoParams {
  [key: string]: string;
}

/**
 * Replace parameter placeholders in SEO strings
 * @llm-rule PATTERN: Replaces {paramName} with actual values from params object
 */
export function replaceSeoParams(text: string, params: SeoParams = {}): string {
  return text.replace(/\{(\w+)\}/g, (match, paramName) => {
    return params[paramName] || match;
  });
}

/**
 * Set document title
 */
export function setDocumentTitle(title: string): void {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
}

/**
 * Set or update a meta tag
 */
export function setMetaTag(name: string, content: string, isProperty = false): void {
  if (typeof document === 'undefined') return;

  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector(selector) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    if (isProperty) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  
  meta.content = content;
}

/**
 * Set canonical URL
 */
export function setCanonicalUrl(url: string): void {
  if (typeof document === 'undefined') return;

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  
  canonical.href = url;
}

/**
 * Apply complete SEO configuration
 */
export function applySeoConfig(config: SeoConfig, params: SeoParams = {}): void {
  // Set document title
  setDocumentTitle(replaceSeoParams(config.title, params));
  
  // Set meta description
  setMetaTag('description', replaceSeoParams(config.description, params));
  
  // Set keywords
  if (config.keywords.length > 0) {
    const keywordsString = config.keywords
      .map(keyword => replaceSeoParams(keyword, params))
      .join(', ');
    setMetaTag('keywords', keywordsString);
  }
  
  // Set Open Graph tags
  if (config.ogTitle) {
    setMetaTag('og:title', replaceSeoParams(config.ogTitle, params), true);
  }
  
  if (config.ogDescription) {
    setMetaTag('og:description', replaceSeoParams(config.ogDescription, params), true);
  }
  
  if (config.ogImage) {
    setMetaTag('og:image', replaceSeoParams(config.ogImage, params), true);
  }
  
  // Set canonical URL
  if (config.canonical) {
    setCanonicalUrl(replaceSeoParams(config.canonical, params));
  }
  
  // Set basic Open Graph type
  setMetaTag('og:type', 'website', true);
}

/**
 * React hook for SEO management
 * @llm-rule WHEN: Component needs to set page SEO metadata
 * @llm-rule PATTERN: Call once at component mount, automatically cleans up
 */
export function useSeo(config: SeoConfig, params: SeoParams = {}): void {
  useEffect(() => {
    // Store original title for cleanup
    const originalTitle = typeof document !== 'undefined' ? document.title : '';
    
    // Apply SEO configuration
    applySeoConfig(config, params);
    
    // Cleanup function - restore original title on unmount
    return () => {
      if (originalTitle && typeof document !== 'undefined') {
        document.title = originalTitle;
      }
    };
  }, [config.title, config.description, JSON.stringify(config.keywords), config.ogTitle, config.ogDescription, config.ogImage, config.canonical, JSON.stringify(params)]);
}

/**
 * Automatically apply SEO based on current route and contracts
 * @llm-rule WHEN: Framework needs to auto-apply SEO from contracts without developer intervention
 * @llm-rule PATTERN: Called by framework routing system, reads SEO from contract definitions
 */
export function useAutoSeo(routePath: string, routeParams: SeoParams = {}): void {
  useEffect(() => {
    // Auto-apply SEO based on route path and contract definitions
    const seoConfig = getContractSeoForRoute(routePath);
    
    if (seoConfig) {
      applySeoConfig(seoConfig, routeParams);
    }
  }, [routePath, JSON.stringify(routeParams)]);
}

/**
 * Get SEO configuration from contracts for a specific route
 * This function should be populated by the web-discovery system
 */
let contractSeoRegistry: Record<string, SeoConfig> = {};

/**
 * Register SEO configuration from contracts
 * @llm-rule WHEN: Web discovery system loads contracts with SEO specifications
 * @llm-rule PATTERN: Called during app initialization to populate SEO registry
 */
export function registerContractSeo(routePath: string, seoConfig: SeoConfig): void {
  contractSeoRegistry[routePath] = seoConfig;
}

/**
 * Get SEO configuration for a route from the contract registry
 */
export function getContractSeoForRoute(routePath: string): SeoConfig | null {
  // Try exact match first
  if (contractSeoRegistry[routePath]) {
    return contractSeoRegistry[routePath];
  }
  
  // Try to match dynamic routes (convert /greeting/hello/john to /greeting/hello/:name)
  for (const [registeredPath, config] of Object.entries(contractSeoRegistry)) {
    if (matchesRoutePattern(routePath, registeredPath)) {
      return config;
    }
  }
  
  return null;
}

/**
 * Check if a route path matches a route pattern with parameters
 */
function matchesRoutePattern(routePath: string, pattern: string): boolean {
  const routeSegments = routePath.split('/');
  const patternSegments = pattern.split('/');
  
  if (routeSegments.length !== patternSegments.length) {
    return false;
  }
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const routeSegment = routeSegments[i];
    
    // Skip parameter segments (starting with :)
    if (patternSegment.startsWith(':')) {
      continue;
    }
    
    // Must match exactly for non-parameter segments
    if (patternSegment !== routeSegment) {
      return false;
    }
  }
  
  return true;
}

/**
 * Extract route parameters from a path based on a pattern
 */
export function extractRouteParams(routePath: string, pattern: string): SeoParams {
  const params: SeoParams = {};
  const routeSegments = routePath.split('/');
  const patternSegments = pattern.split('/');
  
  if (routeSegments.length !== patternSegments.length) {
    return params;
  }
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const routeSegment = routeSegments[i];
    
    // Extract parameter values (starting with :)
    if (patternSegment.startsWith(':')) {
      const paramName = patternSegment.slice(1);
      params[paramName] = routeSegment;
    }
  }
  
  return params;
}

/**
 * Pre-defined SEO configurations for common patterns
 */
export const SeoTemplates = {
  /**
   * Default page template
   */
  default: (title: string, description: string): SeoConfig => ({
    title,
    description,
    keywords: ['voila', 'framework', 'web', 'application'],
    ogTitle: title,
    ogDescription: description
  }),
  
  /**
   * Feature page template
   */
  feature: (featureName: string, appName: string): SeoConfig => ({
    title: `${featureName} - ${appName} | Voila Framework`,
    description: `${featureName} feature in ${appName} application - powered by Voila Framework`,
    keywords: [featureName.toLowerCase(), appName.toLowerCase(), 'feature', 'voila'],
    ogTitle: `${featureName} - ${appName}`,
    ogDescription: `Explore ${featureName} in ${appName}`
  }),
  
  /**
   * Personalized page template
   */
  personalized: (action: string, name: string): SeoConfig => ({
    title: `${action} for {name} | Voila Framework`,
    description: `Personalized ${action.toLowerCase()} for {name} - interactive experience`,
    keywords: [action.toLowerCase(), 'personalized', 'interactive', '{name}'],
    ogTitle: `${action} for {name}`,
    ogDescription: `Get personalized ${action.toLowerCase()} for {name}`
  })
};

// ===== CONTRACT SEO REGISTRATION =====

/**
 * Initialize all SEO registrations from contracts
 * This function should be called during app initialization
 */
export async function initializeContractSeo(): Promise<void> {
  try {
    // Register greeting/hello feature SEO
    await registerGreetingHelloSeo();
    
    console.log('✅ [SEO] All contract SEO configurations registered');
  } catch (error) {
    console.warn('⚠️ [SEO] Failed to register some contract SEO:', error);
  }
}

/**
 * Register SEO for greeting/hello feature from its contract
 */
async function registerGreetingHelloSeo(): Promise<void> {
  try {
    // Try to import the hello contract directly (works in both browser and server)
    const helloContract = await import('../web/apps/greeting/features/hello/hello.index.ts');
    
    if (helloContract.default?.seo) {
      // Register each SEO configuration from the contract
      Object.entries(helloContract.default.seo).forEach(([routePath, seoConfig]) => {
        registerContractSeo(routePath, seoConfig as any);
      });
      console.log(`✅ [SEO] Loaded SEO from greeting/hello contract`);
    } else {
      console.warn('⚠️ [SEO] No SEO configuration found in greeting/hello contract');
    }
  } catch (error) {
    console.warn('⚠️ [SEO] Failed to register greeting/hello SEO:', error);
  }
}

/**
 * Auto-discovery and registration of all contract SEO
 * This could be expanded to automatically find and register all contracts
 */
export async function autoDiscoverAndRegisterSeo(): Promise<void> {
  // For now, we manually register known contracts
  // In the future, this could use the web-discovery system
  await initializeContractSeo();
}

// Auto-initialize SEO when this module is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  // Use setTimeout to avoid blocking module loading
  setTimeout(() => {
    autoDiscoverAndRegisterSeo().catch((error) => {
      console.warn('⚠️ [SEO] Failed to auto-initialize SEO registry:', error);
    });
  }, 0);
}