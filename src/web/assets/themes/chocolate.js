/**
 * Chocolate Theme - Rich brown and warm orange
 * @file src/themes/chocolate.js
 */

export const chocolateTheme = {
  id: 'chocolate',
  name: 'Chocolate Theme - Enhanced',
  description: 'Rich chocolate theme with gradients, custom spacing, rounded corners, and elegant shadows',
  light: {
    // Core colors
    background: 'oklch(96% .01 50)',
    foreground: 'oklch(15% .02 50)', 
    card: 'oklch(98% .005 50)',
    cardForeground: 'oklch(15% .02 50)',
    popover: 'oklch(98% .005 50)',
    popoverForeground: 'oklch(15% .02 50)',
    
    // Primary - Rich chocolate brown
    primary: 'oklch(35% .08 50)',
    primaryForeground: 'oklch(96% .01 50)',
    
    // Secondary - Light brown
    secondary: 'oklch(80% .04 50)',
    secondaryForeground: 'oklch(25% .06 50)',
    
    // Muted - Neutral browns
    muted: 'oklch(90% .02 50)',
    mutedForeground: 'oklch(40% .05 50)',
    
    // Accent - Warm orange
    accent: 'oklch(70% .15 45)',
    accentForeground: 'oklch(15% .02 45)',
    
    // Destructive
    destructive: 'oklch(55% .18 20)',
    destructiveForeground: 'oklch(96% .01 50)',
    
    // UI elements
    border: 'oklch(85% .03 50)',
    input: 'oklch(85% .03 50)',
    ring: 'oklch(35% .08 50)',
    
    // Charts
    chart1: 'oklch(35% .08 50)',
    chart2: 'oklch(70% .15 45)',
    chart3: 'oklch(45% .1 30)',
    chart4: 'oklch(60% .12 60)',
    chart5: 'oklch(50% .14 40)',
    
    // Enhanced Design System - Override UIKit system properties
    'font-sans': 'Inter, system-ui, sans-serif',
    'font-mono': 'JetBrains Mono, Consolas, monospace',
    
    // Enhanced Design System - Override radius
    'radius-xs': '0.25rem',
    'radius-sm': '0.5rem', 
    'radius-md': '0.75rem',
    'radius-lg': '1rem',
    'radius-xl': '1.25rem',
    'radius-2xl': '1.5rem',
    'radius-3xl': '2rem',
    
    // Enhanced Design System - Shadows
    shadowSm: '0 2px 4px rgba(101, 67, 33, 0.1)',
    shadowMd: '0 4px 12px rgba(101, 67, 33, 0.15)',
    shadowLg: '0 8px 24px rgba(101, 67, 33, 0.2)',
    shadowXl: '0 16px 40px rgba(101, 67, 33, 0.25)',
    
    // Enhanced Design System - Spacing
    spacingXs: '0.375rem',
    spacingSm: '0.5rem', 
    spacingMd: '0.75rem',
    spacingLg: '1rem',
    spacingXl: '1.5rem',
    spacing2xl: '2rem',
    
    // Enhanced Design System - Gradients
    gradientPrimary: 'linear-gradient(135deg, oklch(35% .08 50) 0%, oklch(25% .06 45) 100%)',
    gradientAccent: 'linear-gradient(135deg, oklch(70% .15 45) 0%, oklch(65% .12 50) 100%)',
    gradientBackground: 'linear-gradient(135deg, oklch(96% .01 50) 0%, oklch(94% .015 48) 100%)',
  },
  dark: {
    // Core colors - darker chocolate theme
    background: 'oklch(12% .02 50)',
    foreground: 'oklch(90% .01 50)',
    card: 'oklch(16% .03 50)',
    cardForeground: 'oklch(90% .01 50)',
    popover: 'oklch(16% .03 50)',
    popoverForeground: 'oklch(90% .01 50)',
    
    // Primary - Lighter brown for dark mode
    primary: 'oklch(55% .06 50)',
    primaryForeground: 'oklch(95% .005 50)',
    
    // Secondary - Dark brown
    secondary: 'oklch(22% .04 50)',
    secondaryForeground: 'oklch(80% .03 50)',
    
    // Muted - Dark neutral browns
    muted: 'oklch(20% .03 50)',
    mutedForeground: 'oklch(65% .04 50)',
    
    // Accent - Brighter orange for dark mode
    accent: 'oklch(75% .12 45)',
    accentForeground: 'oklch(12% .02 45)',
    
    // Destructive
    destructive: 'oklch(65% .18 20)',
    destructiveForeground: 'oklch(90% .01 50)',
    
    // UI elements
    border: 'oklch(28% .04 50)',
    input: 'oklch(28% .04 50)',
    ring: 'oklch(55% .06 50)',
    
    // Charts
    chart1: 'oklch(55% .06 50)',
    chart2: 'oklch(75% .12 45)',
    chart3: 'oklch(65% .08 30)',
    chart4: 'oklch(70% .10 60)',
    chart5: 'oklch(60% .12 40)',
    
    // Enhanced Design System - Same fonts for consistency  
    'font-sans': 'Inter, system-ui, sans-serif',
    'font-mono': 'JetBrains Mono, Consolas, monospace',
    
    // Enhanced Design System - Same radius for consistency
    'radius-xs': '0.25rem',
    'radius-sm': '0.5rem',
    'radius-md': '0.75rem', 
    'radius-lg': '1rem',
    'radius-xl': '1.25rem',
    'radius-2xl': '1.5rem',
    'radius-3xl': '2rem',
    
    // Enhanced Design System - Dark shadows
    shadowSm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 12px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    shadowXl: '0 16px 40px rgba(0, 0, 0, 0.6)',
    
    // Enhanced Design System - Same spacing
    spacingXs: '0.375rem',
    spacingSm: '0.5rem', 
    spacingMd: '0.75rem',
    spacingLg: '1rem',
    spacingXl: '1.5rem',
    spacing2xl: '2rem',
    
    // Enhanced Design System - Dark gradients
    gradientPrimary: 'linear-gradient(135deg, oklch(55% .06 50) 0%, oklch(45% .08 52) 100%)',
    gradientAccent: 'linear-gradient(135deg, oklch(75% .12 45) 0%, oklch(70% .10 48) 100%)',
    gradientBackground: 'linear-gradient(135deg, oklch(12% .02 50) 0%, oklch(10% .025 48) 100%)',
  }
};

export default chocolateTheme;