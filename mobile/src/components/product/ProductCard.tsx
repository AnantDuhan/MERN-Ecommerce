import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ProductCardVariant = "grid" | "horizontal" | "compact";

interface Props {
  id: string,
  name: string;
  category: string;
  image: ImageSourcePropType;
  price: number;
  rating: number;
  reviews: number;
  discount?: number;
  favourite?: boolean;
  variant?: ProductCardVariant;
  onPress?: () => void;
  onFavourite?: () => void;
  onAddToCart?: () => void;
}

export default function ProductCard({
  id,
  name,
  category,
  image,
  price,
  rating,
  reviews,
  discount,
  favourite = false,
  variant = "grid",
  onPress,
  onFavourite,
  onAddToCart,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle]}
      onPress={() => {
        router.push({
          pathname: "/(product)/[id]",
          params: {
            id
          }
        })
      }}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <BlurView intensity={65} tint="light" style={styles.container}>
        {/* Header */}

        <View style={styles.header}>
          <Pressable onPress={onFavourite}>
            <Ionicons
              name={favourite ? "heart" : "heart-outline"}
              size={22}
              color={favourite ? "#EF4444" : "#64748B"}
            />
          </Pressable>

          {!!discount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>-{discount}%</Text>
            </View>
          )}
        </View>

        {/* Image */}

        <Image source={image} resizeMode="contain" style={styles.image} />

        {/* Details */}

        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>

        <Text numberOfLines={1} style={styles.category}>
          {category}
        </Text>

        {/* Rating */}

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FBBF24" />

          <Text style={styles.rating}>{rating}</Text>

          <Text style={styles.reviews}>({reviews})</Text>
        </View>

        {/* Footer */}

        <View style={styles.footer}>
          <Text style={styles.price}>₹{price.toLocaleString()}</Text>

          <Pressable style={styles.cart} onPress={onAddToCart}>
            <Ionicons name="bag-add" size={18} color="#FFF" />
          </Pressable>
        </View>
      </BlurView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: 18,
  },

  container: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",

    shadowColor: "#5EA8FF",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  image: {
    width: "100%",
    height: 130,
    marginVertical: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  category: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  rating: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  reviews: {
    marginLeft: 4,
    fontSize: 13,
    color: "#94A3B8",
  },

  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2F80ED",
  },

  cart: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2F80ED",
  },
});
