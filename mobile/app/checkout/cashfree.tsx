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
import { useVerifyCashfreePayment } from "@/features/payment/hooks/useVerifyCashfreePayment";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import { useCartStore, selectCartSubtotal } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { computePricing } from "@/features/orders/pricing";
import { CreateOrderRequest } from "@/features/orders/types/order";

const CASHFREE_MODE = process.env.EXPO_PUBLIC_CASHFREE_MODE || "sandbox";

/**
 * A minimal page that loads Cashfree's own JS SDK and opens the hosted
 * checkout for the given session. This avoids the native Cashfree RN SDK
 * (which needs a custom dev client) while still using Cashfree's real,
 * secure hosted payment UI — the same one the web app's browser loads.
 */
function buildCheckoutHtml(paymentSessionId: string) {
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
      cashfree.checkout({
        paymentSessionId: "${paymentSessionId}",
        redirectTarget: "_self"
      });
    } catch (e) {
      document.body.innerText = "Could not start checkout: " + e.message;
    }
  </script>
</body>
</html>`;
}

type Phase = "loading" | "verifying" | "failed";

export default function CashfreeCheckoutScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{
    orderId: string;
    paymentSessionId: string;
  }>();

  const [phase, setPhase] = useState<Phase>("loading");
  const handledRef = useRef(false);

  const verify = useVerifyCashfreePayment();
  const createOrder = useCreateOrder();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = useCheckoutStore((s) => s.shipping);
  const couponCode = useCheckoutStore((s) => s.couponCode);

  const html = useMemo(
    () => buildCheckoutHtml(params.paymentSessionId),
    [params.paymentSessionId]
  );

  const finishOrder = (paymentId: string, status: string) => {
    if (!shipping) return;
    const { itemsPrice, shippingPrice, totalPrice } = computePricing(subtotal);
    const payload: CreateOrderRequest = {
      shippingInfo: {
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        country: shipping.country,
        pinCode: Number(shipping.pinCode),
        phoneNumber: Number(shipping.phoneNumber),
      },
      orderItems: items.map((i) => {
        const uri = (i.image as any)?.uri as string | undefined;
        return {
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          images: uri ? [{ url: uri }] : [],
          product: i.id,
        };
      }),
      paymentInfo: { id: params.orderId, status },
      itemsPrice,
      shippingPrice,
      totalPrice,
      couponCode: couponCode ?? undefined,
    };
    createOrder.mutate(payload);
  };

  const handleCompletion = async () => {
    if (handledRef.current) return;
    handledRef.current = true;
    setPhase("verifying");

    try {
      const result = await verify.mutateAsync(params.orderId);
      if (result.status === "PAID") {
        finishOrder(result.paymentId, "PAID");
      } else {
        setPhase("failed");
      }
    } catch {
      setPhase("failed");
    }
  };

  const onNavChange = (nav: WebViewNavigation) => {
    // Cashfree redirects to our order's return_url once checkout finishes.
    // We only need to detect it, not actually load that page.
    if (nav.url.includes(`cashfree_order_id=${params.orderId}`)) {
      handleCompletion();
    }
  };

  const retry = () => {
    handledRef.current = false;
    setPhase("loading");
    router.replace("/checkout/payment");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Secure Checkout" onBack={() => router.replace("/checkout/payment")} />

      {phase === "failed" ? (
        <View style={styles.center}>
          <Txt tone="danger" center style={{ ...type.h3 }}>
            Payment was not completed
          </Txt>
          <Body tone="soft" center style={{ marginTop: spacing.sm }}>
            You can try again from the payment screen.
          </Body>
          <Txt tone="brass" center style={{ ...type.eyebrow, marginTop: spacing.lg }} onPress={retry}>
            Back to Payment
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
                Confirming your payment…
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
