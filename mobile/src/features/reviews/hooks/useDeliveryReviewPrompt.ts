import { useEffect } from "react";
import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "review-prompted:";

/**
 * Prompts for a native App Store / Play Store review once, the first time
 * an order is seen in the "Delivered" state — a natural, non-intrusive
 * moment per Apple/Google's own guidelines (never from a button tap).
 */
export function useDeliveryReviewPrompt(orderId: string, status: string) {
  useEffect(() => {
    if (status.toLowerCase() !== "delivered") return;

    let cancelled = false;
    const key = `${KEY_PREFIX}${orderId}`;

    (async () => {
      const already = await AsyncStorage.getItem(key).catch(() => null);
      if (already || cancelled) return;

      // Give the delivered-state UI a moment to settle before prompting.
      await new Promise((r) => setTimeout(r, 1500));
      if (cancelled) return;

      const canPrompt = await StoreReview.hasAction().catch(() => false);
      if (canPrompt) {
        await StoreReview.requestReview().catch(() => {});
      }
      await AsyncStorage.setItem(key, "1").catch(() => {});
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, status]);
}
