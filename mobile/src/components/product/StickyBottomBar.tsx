import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Txt, BodySm } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { type } from "@/theme/tokens";

interface Props {
  price: number;
  originalPrice?: number;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export default function StickyBottomBar({
  price,
  originalPrice,
  onAddToCart,
  onBuyNow,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom + 10,
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
        },
      ]}
    >
      <View style={styles.priceRow}>
        <View>
          <Txt style={{ ...type.h2 }}>{`\u20B9${price.toLocaleString()}`}</Txt>
          {!!originalPrice && (
            <BodySm
              tone="faint"
              style={{ textDecorationLine: "line-through", marginTop: 2 }}
            >
              {`\u20B9${originalPrice.toLocaleString()}`}
            </BodySm>
          )}
        </View>

        {!!originalPrice && (
          <Txt tone="success" style={{ ...type.eyebrow }}>
            {`${discount}% Off`}
          </Txt>
        )}
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.cartButton, { borderColor: colors.ink }]}
          onPress={onAddToCart}
        >
          <Ionicons name="bag-add-outline" size={20} color={colors.ink} />
        </Pressable>

        <Button label="Buy Now" onPress={onBuyNow ?? (() => {})} style={{ flex: 1 }} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cartButton: {
    width: 56,
    height: 54,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  buttonRow: { flexDirection: "row", alignItems: "center" },
});
