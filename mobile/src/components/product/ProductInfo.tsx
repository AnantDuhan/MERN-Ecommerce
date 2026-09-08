import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Product } from "@/types/product";
import { useTheme } from "@/theme/ThemeContext";
import { Eyebrow, Display, Body, BodySm, Caption, Txt } from "@/components/ui/Text";
import { spacing, type } from "@/theme/tokens";

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Eyebrow>{product.brand}</Eyebrow>
      <Display style={{ marginTop: spacing.xs }}>{product.name}</Display>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={16} color={colors.brass} />
        <BodySm style={{ marginLeft: 6, fontFamily: type.h3.fontFamily }}>
          {`${product.rating}`}
        </BodySm>
        <Caption tone="faint" style={{ marginLeft: 8 }}>
          {`${product.reviews.toLocaleString()} Reviews`}
        </Caption>
      </View>

      <View style={styles.priceRow}>
        <Txt style={{ ...type.h1 }}>{`\u20B9${product.price.toLocaleString()}`}</Txt>
        {!!product.originalPrice && (
          <Body
            tone="faint"
            style={{ marginLeft: 12, textDecorationLine: "line-through" }}
          >
            {`\u20B9${product.originalPrice.toLocaleString()}`}
          </Body>
        )}
        {!!product.discount && (
          <Txt tone="success" style={{ ...type.eyebrow, marginLeft: 12 }}>
            {`${product.discount}% Off`}
          </Txt>
        )}
      </View>

      <Body tone="soft" style={{ marginTop: spacing.md }}>
        {product.category}
      </Body>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingBottom: 28 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 18 },
});
