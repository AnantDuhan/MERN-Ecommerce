import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/query/queryClient";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/theme/ThemeContext";
import { fontMap } from "@/theme/fonts";
import { usePushRegistration } from "@/features/notifications/hooks/usePushRegistration";
import OfflineBanner from "@/components/common/OfflineBanner";

// Keep the native splash up until the editorial fonts are ready.
SplashScreen.preventAutoHideAsync();

function AppShell() {
  usePushRegistration();
  return (
    <>
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Hold render until fonts resolve so we never flash system type.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
