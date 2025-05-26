/**
 * Utility classes for responsive headings
 */

export const responsiveHeadingClasses = {
  // Extra Large headings (h1)
  xl: 'text-2xl md:text-4xl lg:text-5xl xl:text-6xl',
  
  // Large headings (h2)
  lg: 'text-xl md:text-2xl lg:text-3xl xl:text-4xl',
  
  // Medium headings (h3)
  md: 'text-lg md:text-xl lg:text-2xl xl:text-3xl',
  
  // Small headings (h4, h5, h6)
  sm: 'text-base md:text-lg lg:text-xl xl:text-2xl',
  
  // Responsive icons
  iconLg: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
  iconMd: 'text-xl md:text-2xl lg:text-3xl xl:text-4xl',
  iconSm: 'text-lg md:text-xl lg:text-2xl xl:text-3xl',
} as const;

export type ResponsiveHeadingSize = keyof typeof responsiveHeadingClasses;

/**
 * Get responsive heading class by size
 */
export const getResponsiveHeadingClass = (size: ResponsiveHeadingSize): string => {
  return responsiveHeadingClasses[size];
};

/**
 * Combine responsive heading class with additional classes
 */
export const combineResponsiveHeadingClass = (
  size: ResponsiveHeadingSize, 
  additionalClasses: string = ''
): string => {
  return `${responsiveHeadingClasses[size]} ${additionalClasses}`.trim();
};
