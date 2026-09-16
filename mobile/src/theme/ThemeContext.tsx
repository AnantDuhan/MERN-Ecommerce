import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";

import { ColorScheme, Palette, palettes } from "./tokens";

const STORAGE_KEY = "theme.override";

type Override = ColorScheme | "system";

interface ThemeContextValue {
  scheme: ColorScheme; // the resolved scheme actually in use
  colors: Palette; // resolved palette for `scheme`
  isDark: boolean;
  override: Override; // user preference: forced light/dark or follow system
  setOverride: (o: Override) => void;
  toggle: () => void; // flip between light/dark (sets an explicit override)
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme() ?? "light";
  const [override, setOverrideState] = useState<Override>("system");

  // Restore persisted preference once on mount.
  useEffect(() => {
    let alive = true;
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((v) => {
        if (alive && (v === "light" || v === "dark" || v === "system")) {
          setOverrideState(v);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback((o: Override) => {
    SecureStore.setItemAsync(STORAGE_KEY, o).catch(() => {});
  }, []);

  const setOverride = useCallback(
    (o: Override) => {
      setOverrideState(o);
      persist(o);
    },
    [persist]
  );

  const scheme: ColorScheme = override === "system" ? (system as ColorScheme) : override;

  const toggle = useCallback(() => {
    setOverride(scheme === "dark" ? "light" : "dark");
  }, [scheme, setOverride]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors: palettes[scheme],
      isDark: scheme === "dark",
      override,
      setOverride,
      toggle,
    }),
    [scheme, override, setOverride, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
