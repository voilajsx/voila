/**
 * Kia Theme - Nature-inspired seagreen and yellow
 * @file src/themes/kia.js
 */

export const kiaTheme = {
  id: 'kia',
  name: 'Kia Theme - Enhanced',
  description: 'Nature-inspired theme with blue/green/pink gradient primary',
  light: {
    // Core colors
    background: 'oklch(99% .002 180)',
    foreground: 'oklch(12% .015 180)',
    card: 'oklch(98% .003 180)',
    cardForeground: 'oklch(12% .015 180)',
    popover: 'oklch(98% .003 180)',
    popoverForeground: 'oklch(12% .015 180)',
    
    // Primary - Deep seagreen
    primary: 'oklch(45% .15 180)',
    primaryForeground: 'oklch(98% .002 180)',
    
    // Secondary - Light seagreen
    secondary: 'oklch(85% .08 180)',
    secondaryForeground: 'oklch(20% .12 180)',
    
    // Muted - Neutral greens
    muted: 'oklch(94% .01 180)',
    mutedForeground: 'oklch(35% .08 180)',
    
    // Accent - Bright yellow
    accent: 'oklch(75% .18 85)',
    accentForeground: 'oklch(15% .05 85)',
    
    // Destructive
    destructive: 'oklch(55% .18 20)',
    destructiveForeground: 'oklch(98% .002 180)',
    
    // UI elements
    border: 'oklch(88% .04 180)',
    input: 'oklch(88% .04 180)',
    ring: 'oklch(45% .15 180)',
    
    // Charts
    chart1: 'oklch(45% .15 180)',
    chart2: 'oklch(75% .18 85)',
    chart3: 'oklch(55% .12 160)',
    chart4: 'oklch(65% .14 200)',
    chart5: 'oklch(50% .16 120)',
    
    // Enhanced Design System - Blue/Green/Pink gradient for primary
    'gradient-primary': 'linear-gradient(135deg, #2E86AB 0%, #2DB474 50%, #E91E63 100%)',
    'gradient-accent': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    'gradient-background': 'linear-gradient(135deg, #F0FFF0 0%, #F5FFFA 50%, #F0F8FF 100%)',
    
    // Override system fonts and radius
    'font-sans': 'Inter, system-ui, sans-serif',
    'font-mono': 'JetBrains Mono, Consolas, monospace',
    'radius-lg': '1rem',
    'radius-xl': '1.25rem',
    'radius-2xl': '1.5rem',
  },
  dark: {
    // Core colors
    background: 'oklch(8% .01 180)',
    foreground: 'oklch(92% .008 180)',
    card: 'oklch(12% .015 180)',
    cardForeground: 'oklch(92% .008 180)',
    popover: 'oklch(12% .015 180)',
    popoverForeground: 'oklch(92% .008 180)',
    
    // Primary - Brighter seagreen for dark mode
    primary: 'oklch(55% .12 180)',
    primaryForeground: 'oklch(95% .005 180)',
    
    // Secondary - Dark seagreen
    secondary: 'oklch(20% .08 180)',
    secondaryForeground: 'oklch(85% .06 180)',
    
    // Muted - Dark neutral greens
    muted: 'oklch(16% .02 180)',
    mutedForeground: 'oklch(70% .08 180)',
    
    // Accent - Softer yellow for dark mode
    accent: 'oklch(80% .15 85)',
    accentForeground: 'oklch(10% .08 85)',
    
    // Destructive
    destructive: 'oklch(65% .18 20)',
    destructiveForeground: 'oklch(92% .008 180)',
    
    // UI elements
    border: 'oklch(24% .04 180)',
    input: 'oklch(24% .04 180)',
    ring: 'oklch(55% .12 180)',
    
    // Charts
    chart1: 'oklch(55% .12 180)',
    chart2: 'oklch(80% .15 85)',
    chart3: 'oklch(70% .15 160)',
    chart4: 'oklch(75% .16 200)',
    chart5: 'oklch(65% .18 120)',
    
    // Enhanced Design System - Dark mode gradients
    'gradient-primary': 'linear-gradient(135deg, #1E5F8B 0%, #1E8B5A 50%, #C2185B 100%)',
    'gradient-accent': 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #FFD700 100%)',
    'gradient-background': 'linear-gradient(135deg, #0D2818 0%, #1A2F1A 50%, #0F1419 100%)',
    
    // Same system overrides for dark mode
    'font-sans': 'Inter, system-ui, sans-serif',
    'font-mono': 'JetBrains Mono, Consolas, monospace',
    'radius-lg': '1rem',
    'radius-xl': '1.25rem',
    'radius-2xl': '1.5rem',
  }
};

export default kiaTheme;