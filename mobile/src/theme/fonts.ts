import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import {
  Jost_300Light,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";

/**
 * Family-name constants used throughout the theme. The string values must
 * match the keys registered in `fontMap` below (which is what expo-font's
 * useFonts() loads in app/_layout.tsx).
 */
export const fonts = {
  // Editorial serif (web font-display: "Cormorant Garamond")
  displayMedium: "CormorantGaramond_500Medium",
  displaySemiBold: "CormorantGaramond_600SemiBold",
  displayBold: "CormorantGaramond_700Bold",

  // Body sans (web font-sans: "Jost")
  sansLight: "Jost_300Light",
  sans: "Jost_400Regular",
  sansMedium: "Jost_500Medium",
  sansSemiBold: "Jost_600SemiBold",
} as const;

/**
 * Passed to useFonts(). @expo-google-fonts exports each weight as a module
 * whose key becomes the fontFamily name — so the keys here line up with the
 * `fonts` constants above.
 */
export const fontMap = {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
  Jost_300Light,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
};
