import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, { FadeInUp } from "react-native-reanimated";

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
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      <BlurView intensity={80} tint="light" style={styles.container}>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>₹{price.toLocaleString()}</Text>

            {!!originalPrice && (
              <Text style={styles.originalPrice}>
                ₹{originalPrice.toLocaleString()}
              </Text>
            )}
          </View>

          {!!originalPrice && (
            <Text style={styles.discount}>
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </Text>
          )}
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.cartButton} onPress={onAddToCart}>
            <Ionicons name="bag-add-outline" size={22} color="#2F80ED" />
          </Pressable>

          <Pressable style={styles.buyButton} onPress={onBuyNow}>
            <Text style={styles.buyText}>Buy Now</Text>
          </Pressable>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    overflow: "hidden",

    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",

    backgroundColor: "rgba(255,255,255,0.08)",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: -4,
    },

    elevation: 12,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },

  originalPrice: {
    marginTop: 2,
    fontSize: 14,
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },

  discount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16A34A",
  },

  cartButton: {
    width: 58,
    height: 52,

    borderRadius: 16,

    borderWidth: 1.5,
    borderColor: "#2F80ED",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  cartText: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "700",
    color: "#2F80ED",
  },

  buyButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2F80ED",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonRow: {
    flexDirection: "row",
  },

  buyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
