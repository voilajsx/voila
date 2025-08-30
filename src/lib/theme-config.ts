/**
 * Theme Configuration for Voila Framework
 * @file src/lib/theme-config.ts
 * 
 * External theme configuration via environment variables
 * Change themes without touching code - just update .env file
 */

// Available theme options from UIKit docs
export type ThemeName = 'default' | 'aurora' | 'metro' | 'neon' | 'ruby' | 'studio';
export type ThemeMode = 'light' | 'dark';
export type ThemeSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ThemeTone = 'clean' | 'subtle' | 'brand' | 'contrast';

export interface ThemeConfig {
  theme: ThemeName;
  mode: ThemeMode;
  size: ThemeSize;
  tone: ThemeTone;
}

/**
 * Get theme configuration from environment variables
 * Defaults to professional settings if env vars not set
 */
export function getThemeConfig(): ThemeConfig {
  const theme = (import.meta.env.VITE_THEME as ThemeName) || 'default';
  const mode = (import.meta.env.VITE_MODE as ThemeMode) || 'light';
  const size = (import.meta.env.VITE_SIZE as ThemeSize) || 'lg';
  let tone = (import.meta.env.VITE_TONE as ThemeTone) || 'subtle';

  // Fix common tone mapping
  if (tone === 'primary') {
    tone = 'brand';
    console.log('🔄 Mapped VITE_TONE=primary to brand');
  }

  return {
    theme,
    mode,
    size,
    tone
  };
}

/**
 * Validate theme configuration
 */
export function validateThemeConfig(config: Partial<ThemeConfig>): string[] {
  const errors: string[] = [];
  
  const validThemes: ThemeName[] = ['default', 'aurora', 'metro', 'neon', 'ruby', 'studio'];
  const validModes: ThemeMode[] = ['light', 'dark'];
  const validSizes: ThemeSize[] = ['sm', 'md', 'lg', 'xl', 'full'];
  const validTones: ThemeTone[] = ['clean', 'subtle', 'brand', 'contrast'];

  if (config.theme && !validThemes.includes(config.theme)) {
    errors.push(`Invalid theme: ${config.theme}. Valid options: ${validThemes.join(', ')}`);
  }

  if (config.mode && !validModes.includes(config.mode)) {
    errors.push(`Invalid mode: ${config.mode}. Valid options: ${validModes.join(', ')}`);
  }

  if (config.size && !validSizes.includes(config.size)) {
    errors.push(`Invalid size: ${config.size}. Valid options: ${validSizes.join(', ')}`);
  }

  if (config.tone && !validTones.includes(config.tone)) {
    errors.push(`Invalid tone: ${config.tone}. Valid options: ${validTones.join(', ')}`);
  }

  return errors;
}

/**
 * Theme descriptions for easy reference
 */
export const THEME_DESCRIPTIONS = {
  // Themes
  default: 'Professional blue - business apps',
  aurora: 'Purple/green - creative apps', 
  metro: 'Transit blue - admin dashboards',
  neon: 'Electric colors - gaming/tech',
  ruby: 'Red/gold - luxury brands',
  studio: 'Designer grays - creative tools',

  // Modes
  light: 'Light color scheme',
  dark: 'Dark color scheme',

  // Sizes
  sm: 'Sidebars: 192px, Content: max-w-2xl, Padding: 16px',
  md: 'Sidebars: 224px, Content: max-w-4xl, Padding: 20px',
  lg: 'Sidebars: 256px, Content: max-w-6xl, Padding: 24px (DEFAULT)',
  xl: 'Sidebars: 288px, Content: max-w-7xl, Padding: 28px',
  full: 'Sidebars: 320px, Content: max-w-full, Padding: 32px',

  // Tones
  clean: 'Pure white/light backgrounds (websites, auth)',
  subtle: 'Light gray backgrounds (admin panels, professional)',
  brand: 'Primary colored backgrounds (headers, CTAs, emphasis)',
  contrast: 'Dark/bold backgrounds (footers, high contrast areas)'
} as const;

/**
 * Get current theme configuration with validation
 */
export function getCurrentTheme(): ThemeConfig {
  // Debug: Log environment variables
  console.log('🔍 Environment Variables:', {
    VITE_THEME: import.meta.env.VITE_THEME,
    VITE_MODE: import.meta.env.VITE_MODE,
    VITE_SIZE: import.meta.env.VITE_SIZE,
    VITE_TONE: import.meta.env.VITE_TONE
  });

  const config = getThemeConfig();
  
  // Debug: Log parsed config
  console.log('📋 Parsed Config:', config);
  
  const errors = validateThemeConfig(config);
  
  if (errors.length > 0) {
    console.warn('❌ Invalid theme configuration:', errors);
    console.warn('🔄 Using default theme configuration');
    return {
      theme: 'default',
      mode: 'light', 
      size: 'lg',
      tone: 'subtle'
    };
  }

  console.log('✅ Theme configuration loaded:', {
    theme: `${config.theme} (${THEME_DESCRIPTIONS[config.theme]})`,
    mode: `${config.mode} (${THEME_DESCRIPTIONS[config.mode]})`,
    size: `${config.size} (${THEME_DESCRIPTIONS[config.size]})`,
    tone: `${config.tone} (${THEME_DESCRIPTIONS[config.tone]})`
  });

  // Debug: Log what's being passed to ThemeProvider
  console.log('🎨 Applying theme to ThemeProvider:', {
    theme: config.theme,
    mode: config.mode
  });

  return config;
}