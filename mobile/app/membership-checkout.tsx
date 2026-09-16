import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { WebView, WebViewNavigation } from "react-native-webview";

import TopBar from "@/components/common/TopBar";
import { Body, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { useMembershipStatus } from "@/features/membership/hooks/useMembershipStatus";

const CASHFREE_MODE = process.env.EXPO_PUBLIC_CASHFREE_MODE || "sandbox";

/**
 * Same technique as checkout/cashfree.tsx: load Cashfree's own JS SDK in a
 * WebView (Expo-Go compatible, no native module) and open its hosted
 * checkout — here for a recurring subscription rather than a one-time
 * order, via `subscriptionsCheckout` instead of `checkout`.
 */
function buildSubscriptionHtml(subsSessionId: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>html,body{margin:0;padding:0;background:#F7F4EF;height:100%;}</style>
</head>
<body>
  <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
  <script>
    try {
      var cashfree = Cashfree({ mode: "${CASHFREE_MODE}" });
      cashfree.subscriptionsCheckout({
        subsSessionId: "${subsSessionId}",
        redirectTarget: "_self"
      });
    } catch (e) {
      document.body.innerText = "Could not start checkout: " + e.message;
    }
  </script>
</body>
</html>`;
}

type Phase = "loading" | "verifying" | "done" | "failed";

export default function MembershipCheckoutScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{
    subscriptionId: string;
    subsSessionId: string;
  }>();

  const [phase, setPhase] = useState<Phase>("loading");
  const handledRef = useRef(false);
  const checkStatus = useMembershipStatus();

  const html = useMemo(
    () => buildSubscriptionHtml(params.subsSessionId),
    [params.subsSessionId]
  );

  const handleCompletion = async () => {
    if (handledRef.current) return;
    handledRef.current = true;
    setPhase("verifying");

    try {
      await checkStatus.mutateAsync(params.subscriptionId);
      setPhase("done");
      router.replace("/membership");
    } catch {
      setPhase("failed");
    }
  };

  const onNavChange = (nav: WebViewNavigation) => {
    // Cashfree redirects to our subscription's return_url once
    // authorization finishes — detect it rather than let it actually load.
    if (nav.url.includes("subscription_id=")) {
      handleCompletion();
    }
  };

  const retry = () => {
    handledRef.current = false;
    setPhase("loading");
    router.replace("/membership");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Membership" onBack={() => router.replace("/membership")} />

      {phase === "failed" ? (
        <View style={styles.center}>
          <Txt tone="danger" center style={{ ...type.h3 }}>
            Authorization was not completed
          </Txt>
          <Body tone="soft" center style={{ marginTop: spacing.sm }}>
            You can try again from the membership page.
          </Body>
          <Txt tone="brass" center style={{ ...type.eyebrow, marginTop: spacing.lg }} onPress={retry}>
            Back to Membership
          </Txt>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            source={{ html }}
            onNavigationStateChange={onNavChange}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.center}>
                <ActivityIndicator color={colors.brass} />
              </View>
            )}
          />
          {phase === "verifying" && (
            <View style={[styles.overlay, { backgroundColor: colors.canvas }]}>
              <ActivityIndicator color={colors.brass} />
              <Caption tone="soft" style={{ marginTop: spacing.md }}>
                Confirming your membership…
              </Caption>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
