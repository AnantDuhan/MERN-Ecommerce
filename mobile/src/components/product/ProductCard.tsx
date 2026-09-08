import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";

import { useTheme } from "@/theme/ThemeContext";
import { BodySm, Caption, Txt } from "@/components/ui/Text";
import { radii, type } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ProductCardVariant = "grid" | "horizontal" | "compact";

interface Props {
  id: string;
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
  onFavourite,
  onAddToCart,
}: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle]}
      onPress={() =>
        router.push({ pathname: "/(product)/[id]", params: { id } })
      }
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <View
        style={[
          styles.container,
          { borderColor: colors.line, backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Pressable onPress={onFavourite} hitSlop={8}>
            <Ionicons
              name={favourite ? "heart" : "heart-outline"}
              size={20}
              color={favourite ? colors.danger : colors.inkFaint}
            />
          </Pressable>

          {!!discount && (
            <View style={[styles.badge, { backgroundColor: colors.ink }]}>
              <Txt tone="onInk" style={{ ...type.eyebrow, fontSize: 10 }}>
                {`-${discount}%`}
              </Txt>
            </View>
          )}
        </View>

        <Image source={image} resizeMode="contain" style={styles.image} />

        <BodySm numberOfLines={1} style={{ fontFamily: type.h3.fontFamily }}>
          {name}
        </BodySm>
        <Caption numberOfLines={1} style={{ marginTop: 2 }}>
          {category}
        </Caption>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={colors.brass} />
          <Caption tone="soft" style={{ marginLeft: 4 }}>{`${rating}`}</Caption>
          <Caption tone="faint" style={{ marginLeft: 4 }}>{`(${reviews})`}</Caption>
        </View>

        <View style={styles.footer}>
          <Txt style={{ ...type.h3 }}>{`\u20B9${price.toLocaleString()}`}</Txt>
          <Pressable
            style={[styles.cart, { backgroundColor: colors.ink }]}
            onPress={onAddToCart}
          >
            <Ionicons name="bag-add-outline" size={16} color={colors.onInk} />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 180, marginRight: 16 },
  container: { borderWidth: 1, borderRadius: radii.xs, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.xs },
  image: { width: "100%", height: 120, marginVertical: 12 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cart: {
    width: 38,
    height: 38,
    borderRadius: radii.xs,
    justifyContent: "center",
    alignItems: "center",
  },
});
