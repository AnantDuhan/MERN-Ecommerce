import { TextStyle, ViewStyle } from "react-native";
import { fonts } from "./fonts";

/**
 * LUXURY / EDITORIAL DESIGN TOKENS
 * Ported 1:1 from the web app (frontend/src/styles/theme.css + tailwind.config.js)
 * so the mobile app mirrors the same warm-ivory / charcoal-salon look.
 */

export type ColorScheme = "light" | "dark";

export interface Palette {
  canvas: string; // page background
  surface: string; // cards / panels
  surface2: string; // raised / hover
  ink: string; // primary text
  inkSoft: string; // secondary text
  inkFaint: string; // captions / meta / placeholder
  line: string; // borders / hairlines
  brass: string; // accent (gold/brass)
  brassSoft: string;
  success: string;
  danger: string;
  onInk: string; // text/icon that sits on top of an ink-filled surface
  onBrass: string; // text/icon on a brass-filled surface
  shadow: string;
}

// Light — warm ivory gallery
export const lightColors: Palette = {
  canvas: "#F7F4EF",
  surface: "#FFFDFA",
  surface2: "#F0EBE3",
  ink: "#1A1816",
  inkSoft: "#4A453F",
  inkFaint: "#8A8278",
  line: "#E0D9CE",
  brass: "#A07C4B",
  brassSoft: "#C1A57A",
  success: "#4F6E54",
  danger: "#9C4237",
  onInk: "#F7F4EF",
  onBrass: "#FFFFFF",
  shadow: "#28221A",
};

// Dark — deep charcoal salon
export const darkColors: Palette = {
  canvas: "#0F0E0D",
  surface: "#191715",
  surface2: "#24211E",
  ink: "#F2EDE4",
  inkSoft: "#BEB6AA",
  inkFaint: "#8A8174",
  line: "#36312C",
  brass: "#C9A063",
  brassSoft: "#A88658",
  success: "#7A9C7E",
  danger: "#C56A5E",
  onInk: "#0F0E0D",
  onBrass: "#FFFFFF",
  shadow: "#000000",
};

export const palettes: Record<ColorScheme, Palette> = {
  light: lightColors,
  dark: darkColors,
};

/**
 * Editorial type scale. Display roles use the Cormorant Garamond serif;
 * everything else uses the Jost sans. Sizes are tuned for a ~380px phone
 * (down from the web's clamp() hero sizes).
 */
export const type = {
  displayLg: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 46,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  display: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  h1: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 28,
    lineHeight: 32,
  },
  h2: {
    fontFamily: fonts.displayMedium,
    fontSize: 22,
    lineHeight: 28,
  },
  h3: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  // Small-caps eyebrow: uppercase + wide tracking + brass (applied by <Eyebrow/>)
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2, // ~0.18em at 11px (web tracking-luxe)
    textTransform: "uppercase" as const,
  },
} satisfies Record<string, TextStyle>;

// Web tracking-luxe (0.18em) / wide2 (0.28em) as absolute points helper.
export const tracking = (fontSize: number, em = 0.18) => fontSize * em;

// Editorial = sharp corners with the barest softening.
export const radii = {
  none: 0,
  xs: 2,
  sm: 4,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Soft, long editorial shadow (web boxShadow.luxe / luxe-sm).
export const luxeShadow = (p: Palette, strong = false): ViewStyle => ({
  shadowColor: p.shadow,
  shadowOpacity: strong ? 0.22 : 0.14,
  shadowRadius: strong ? 30 : 18,
  shadowOffset: { width: 0, height: strong ? 24 : 12 },
  elevation: strong ? 12 : 6,
});

export const easeLuxe = "cubic-bezier(0.22, 1, 0.36, 1)"; // for reanimated Easing.bezier(0.22,1,0.36,1)
