// Centralized font configuration using Poppins
export const FONTS = {
  // Font families
  POPPINS: 'Poppins',
  POPPINS_BOLD: 'Poppins-Bold',
  POPPINS_SEMI_BOLD: 'Poppins-SemiBold',
  POPPINS_MEDIUM: 'Poppins-Medium',
  POPPINS_LIGHT: 'Poppins-Light',
  POPPINS_REGULAR: 'Poppins-Regular',
  
  // Font sizes
  XS: 10,
  SM: 12,
  BASE: 14,
  LG: 16,
  XL: 18,
  XXL: 20,
  XXXL: 24,
  XXXXL: 32,
  
  // Font weights
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMI_BOLD: '600',
  BOLD: '700',
  EXTRA_BOLD: '800',
};

// Default font configuration
export const DEFAULT_FONT = {
  fontFamily: FONTS.POPPINS_REGULAR,
};

// Text style presets
export const TEXT_STYLES = {
  tiny: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: FONTS.XS,
  },
  small: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: FONTS.SM,
  },
  smallMedium: {
    fontFamily: FONTS.POPPINS_MEDIUM,
    fontSize: FONTS.SM,
  },
  smallSemiBold: {
    fontFamily: FONTS.POPPINS_SEMI_BOLD,
    fontSize: FONTS.SM,
  },
  base: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: FONTS.BASE,
  },
  baseMedium: {
    fontFamily: FONTS.POPPINS_MEDIUM,
    fontSize: FONTS.BASE,
  },
  baseSemiBold: {
    fontFamily: FONTS.POPPINS_SEMI_BOLD,
    fontSize: FONTS.BASE,
  },
  baseBold: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: FONTS.BASE,
  },
  large: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: FONTS.LG,
  },
  largeMedium: {
    fontFamily: FONTS.POPPINS_MEDIUM,
    fontSize: FONTS.LG,
  },
  largeSemiBold: {
    fontFamily: FONTS.POPPINS_SEMI_BOLD,
    fontSize: FONTS.LG,
  },
  largeBold: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: FONTS.LG,
  },
  extraLarge: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: FONTS.XL,
  },
  extraLargeSemiBold: {
    fontFamily: FONTS.POPPINS_SEMI_BOLD,
    fontSize: FONTS.XL,
  },
  extraLargeBold: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: FONTS.XL,
  },
  extraExtraLarge: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: FONTS.XXL,
  },
  extraExtraLargeSemiBold: {
    fontFamily: FONTS.POPPINS_SEMI_BOLD,
    fontSize: FONTS.XXL,
  },
  extraExtraLargeBold: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: FONTS.XXL,
  },
  huge: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: FONTS.XXXL,
  },
  massive: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: FONTS.XXXXL,
  },
};
