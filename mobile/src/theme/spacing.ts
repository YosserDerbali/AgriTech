/**
 * Spacing System
 * 8-point grid-based spacing for consistency
 */

export const spacing = {
  // Base unit is 4pt (for fine-tuning)
  xs: 4,     // 4pt
  sm: 8,     // 8pt
  md: 12,    // 12pt
  lg: 16,    // 16pt
  xl: 20,    // 20pt
  '2xl': 24, // 24pt
  '3xl': 32, // 32pt
  '4xl': 40, // 40pt
  '5xl': 48, // 48pt
};

/**
 * Border Radius System
 * For consistent rounded corners
 */
export const radius = {
  none: 0,
  sm: 4,      // Subtle rounding
  md: 8,      // Default rounding
  lg: 12,     // Medium rounding
  xl: 14,     // Button rounding
  '2xl': 16,  // Card rounding
  '3xl': 20,  // Large component rounding
  '4xl': 24,  // Modal/large section rounding
  full: 9999, // Fully rounded (pill shape)
};

/**
 * Common padding presets
 */
export const padding = {
  page: spacing.lg,        // 16pt - Standard page padding
  section: spacing['2xl'], // 24pt - Between major sections
  component: spacing.lg,   // 16pt - Component internal padding
  tight: spacing.sm,       // 8pt - Tight components
};

/**
 * Common margin presets
 */
export const margin = {
  section: spacing['3xl'], // 32pt - Between major sections
  component: spacing.xl,   // 20pt - Between components
  element: spacing.md,     // 12pt - Between elements
  tight: spacing.xs,       // 4pt - Tight spacing
};

/**
 * Gap for flex layouts
 */
export const gap = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
};
