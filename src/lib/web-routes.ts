/**
 * Browser-compatible Web Routes for Voila Framework
 * @file src/lib/web-routes.ts
 * 
 * Dynamic routing system that maps URL segments to file paths and extracts parameters
 * Pattern: /app/feature/path → apps/app/features/feature/pages/path.tsx
 * Supports dynamic routes: [name].tsx, [id].tsx, [slug].tsx with parameter extraction
 */

import { useMemo } from 'react';

/**
 * Generate possible file paths for a URL with fallback hierarchy
 * 
 * Examples:
 * "/" -> [
 *   "apps/main/features/home/pages/root.tsx"
 * ]
 * 
 * "/greeting" -> [
 *   "apps/greeting/features/home/pages/root.tsx",  // Option 1: greeting app, home feature
 *   "apps/main/features/greeting/pages/root.tsx",  // Option 2: main app, greeting feature  
 *   "apps/main/features/home/pages/greeting.tsx"   // Option 3: main app, home feature, greeting page
 * ]
 * 
 * "/greeting/hello/new/sample" -> [
 *   "apps/greeting/features/hello/pages/new-sample.tsx",           // Option 1: greeting app, hello feature
 *   "apps/greeting/features/home/pages/hello-new-sample.tsx",      // Option 2: greeting app, home feature
 *   "apps/main/features/home/pages/greeting-hello-new-sample.tsx"  // Option 3: main app, home feature
 * ]
 */
export function generateRoutePaths(urlPath: string): string[] {
  // Handle root route specially
  if (urlPath === '/' || urlPath === '') {
    return ['apps/main/features/home/pages/root.tsx'];
  }

  // Remove leading slash and split path
  const segments = urlPath.replace(/^\//, '').split('/').filter(s => s.length > 0);
  
  if (segments.length === 0) {
    return ['apps/main/features/home/pages/root.tsx'];
  }

  const paths: string[] = [];
  const [firstSegment, ...restSegments] = segments;

  if (segments.length === 1) {
    // Single segment: /greeting
    paths.push(
      // Option 1: greeting app, home feature, root page
      `apps/${firstSegment}/features/home/pages/root.tsx`,
      // Option 2: main app, greeting feature, root page  
      `apps/main/features/${firstSegment}/pages/root.tsx`,
      // Option 3: main app, home feature, greeting.tsx page
      `apps/main/features/home/pages/${firstSegment}.tsx`
    );
  } else {
    // Multiple segments: /greeting/hello/new/sample
    const [secondSegment, ...pathSegments] = restSegments;
    const fileName = pathSegments.length > 0 ? pathSegments.join('-') : 'root';
    const totalSegments = segments.length; // Total URL segments

    paths.push(
      // Option 1: app=first, feature=second, remaining=filename
      `apps/${firstSegment}/features/${secondSegment}/pages/${fileName}.tsx`
    );

    // Add dynamic routes based on segment count
    if (totalSegments === 3) {
      // 3 segments: /greeting/hello/name -> single parameter routes
      paths.push(
        `apps/${firstSegment}/features/${secondSegment}/pages/[name].tsx`,
        `apps/${firstSegment}/features/${secondSegment}/pages/[id].tsx`,
        `apps/${firstSegment}/features/${secondSegment}/pages/[slug].tsx`
      );
    } else if (totalSegments === 4) {
      // 4 segments: /greeting/hello/name/new -> multi parameter routes
      paths.push(
        `apps/${firstSegment}/features/${secondSegment}/pages/[name]-[new].tsx`
      );
    } else if (totalSegments > 4) {
      // 5+ segments: try multi-parameter first, then fallback to single
      paths.push(
        `apps/${firstSegment}/features/${secondSegment}/pages/[name]-[new].tsx`,
        `apps/${firstSegment}/features/${secondSegment}/pages/[name].tsx`,
        `apps/${firstSegment}/features/${secondSegment}/pages/[id].tsx`,
        `apps/${firstSegment}/features/${secondSegment}/pages/[slug].tsx`
      );
    }

    // Option 2 & 3: Fallbacks
    paths.push(
      `apps/${firstSegment}/features/home/pages/${[secondSegment, ...pathSegments].join('-')}.tsx`,
      `apps/main/features/home/pages/${segments.join('-')}.tsx`
    );
  }

  return paths;
}

/**
 * Try to load component with fallback hierarchy
 */
export async function loadComponentFromPath(urlPath: string): Promise<React.ComponentType | null> {
  const possiblePaths = generateRoutePaths(urlPath);
  
  console.log(`🔍 Trying to load component for: ${urlPath}`);
  console.log(`📂 Possible paths:`, possiblePaths);

  // Use glob import pattern that Vite can analyze at build time
  const modules = import.meta.glob('../web/apps/**/features/**/pages/*.tsx', { eager: false });
  
  console.log(`🔧 Available modules:`, Object.keys(modules));

  // Try each path in order of preference
  for (const filePath of possiblePaths) {
    try {
      console.log(`  🔄 Trying: ${filePath}`);
      const moduleKey = `../web/${filePath}`;
      
      if (modules[moduleKey]) {
        const componentModule = await modules[moduleKey]();
        const Component = (componentModule as any).default;
        
        if (Component) {
          console.log(`  ✅ Success: ${urlPath} → ${filePath}`);
          return Component;
        }
      }
    } catch (error) {
      console.log(`  ❌ Failed: ${filePath} (${error instanceof Error ? error.message : 'Unknown error'})`);
      // Continue to next option
    }
  }


  console.log(`  ❌ All options exhausted for: ${urlPath}`);
  return null;
}

/**
 * Check if a component exists for the given path
 */
export async function componentExists(urlPath: string): Promise<boolean> {
  try {
    const component = await loadComponentFromPath(urlPath);
    return component !== null;
  } catch {
    return false;
  }
}

// ================================
// Route Parameter Extraction
// ================================

/**
 * Extract multiple route parameters using pattern matching (non-hook version)
 * Works with complex dynamic routes with multiple parameters
 * 
 * @param routePattern - The route pattern (e.g., '/greeting/hello/:name/:new')
 * @returns Object with all extracted parameters
 * 
 * @example
 * // For URL /greeting/hello/Developer/sample
 * const params = extractRouteParams('/greeting/hello/:name/:new');
 * // Returns { name: "Developer", new: "sample" }
 */
export function extractRouteParams(routePattern: string): Record<string, string> {
  const pathname = window.location.pathname;
  const pathSegments = pathname.split('/').filter(s => s.length > 0);
  const patternSegments = routePattern.split('/').filter(s => s.length > 0);
  
  const params: Record<string, string> = {};
  
  // Match each segment against the pattern
  for (let i = 0; i < patternSegments.length && i < pathSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];
    
    // Check if this segment is a parameter (starts with :)
    if (patternSegment.startsWith(':')) {
      const paramName = patternSegment.slice(1); // Remove the ':'
      params[paramName] = decodeURIComponent(pathSegment);
    }
  }
  
  return params;
}

/**
 * Extract single route parameter (non-hook version)
 * 
 * @param paramName - The parameter name (e.g., 'name', 'id', 'slug')
 * @param routePattern - Optional route pattern for complex routes
 * @param defaultValue - Default value if parameter not found
 * @returns The extracted parameter value
 */
export function extractRouteParam(
  paramName: string, 
  routePattern?: string, 
  defaultValue: string = ''
): string {
  if (routePattern) {
    // Use pattern matching for complex routes
    const params = extractRouteParams(routePattern);
    return params[paramName] || defaultValue;
  }
  
  // Legacy behavior: extract last segment
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(s => s.length > 0);
  const lastSegment = segments[segments.length - 1];
  
  if (!lastSegment) {
    return defaultValue;
  }
  
  return decodeURIComponent(lastSegment);
}

/**
 * Hook versions for React components
 */
export function useRouteParams(routePattern: string): Record<string, string> {
  return useMemo(() => extractRouteParams(routePattern), [routePattern]);
}

export function useRouteParam(
  paramName: string, 
  routePattern?: string, 
  defaultValue: string = ''
): string {
  return useMemo(() => extractRouteParam(paramName, routePattern, defaultValue), [paramName, routePattern, defaultValue]);
}

// Backward compatibility - these are now hook versions
export const getRouteParams = useRouteParams;
export const getRouteParam = useRouteParam;