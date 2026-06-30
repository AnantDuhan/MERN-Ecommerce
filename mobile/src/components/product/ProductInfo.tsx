import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductInfo({
  product
}: Props) {
  return (
    <View style={styles.container}>

      <Text style={styles.brand}>
        {product.brand}
      </Text>

      <Text style={styles.name}>
        {product.name}
      </Text>

      <View style={styles.ratingRow}>
        <Ionicons
          name="star"
          size={18}
          color="#FBBF24"
        />

        <Text style={styles.rating}>
          {product.rating}
        </Text>

        <Text style={styles.review}>
          • {product.reviews.toLocaleString()} Reviews
        </Text>
      </View>

      <View style={styles.priceRow}>

        <Text style={styles.price}>
          ₹{product.price.toLocaleString()}
        </Text>

        {!!product.originalPrice && (
          <Text style={styles.originalPrice}>
            ₹{product.originalPrice.toLocaleString()}
          </Text>
        )}

        {!!product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {product.discount}% OFF
            </Text>
          </View>
        )}

      </View>

      <Text style={styles.category}>
        {product.category}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },

  brand: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2F80ED",
    marginBottom: 6,
  },

  name: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  rating: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  review: {
    marginLeft: 8,
    fontSize: 15,
    color: "#64748B",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  price: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2F80ED",
  },

  originalPrice: {
    marginLeft: 12,
    fontSize: 18,
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },

  discountBadge: {
    marginLeft: 12,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  discountText: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 13,
  },

  category: {
    marginTop: 18,
    fontSize: 16,
    color: "#64748B",
  },

});