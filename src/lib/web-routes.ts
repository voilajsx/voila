/**
 * Browser-compatible Web Routes for Voila Framework
 * @file src/lib/web-routes.ts
 * 
 * Dynamic routing system that maps URL segments to file paths
 * Pattern: /app/feature/path → apps/app/features/feature/pages/path.tsx
 */

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

    paths.push(
      // Option 1: app=first, feature=second, remaining=filename
      `apps/${firstSegment}/features/${secondSegment}/pages/${fileName}.tsx`,
      // Option 1b: Dynamic route fallbacks for feature  
      `apps/${firstSegment}/features/${secondSegment}/pages/[name].tsx`,
      `apps/${firstSegment}/features/${secondSegment}/pages/[id].tsx`,
      `apps/${firstSegment}/features/${secondSegment}/pages/[slug].tsx`,
      // Option 2: app=first, feature=home, all=filename
      `apps/${firstSegment}/features/home/pages/${[secondSegment, ...pathSegments].join('-')}.tsx`,
      // Option 3: app=main, feature=home, all=filename
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
  const modules = import.meta.glob('../web/apps/**/features/**/pages/*.tsx');

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