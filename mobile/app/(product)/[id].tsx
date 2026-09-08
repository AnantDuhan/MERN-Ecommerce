import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SizeSelector from "@/components/product/SizeSelector";
import { flashSaleProducts } from "@/components/home/data/product";
import QuantitySelector from "@/components/product/QuantitySelector";
import DescriptionCard from "@/components/product/DescriptionCard";
import SpecificationCard from "@/components/product/SpecificationCard";
import ReviewsPreview from "@/components/product/ReviewsPreview";
import SimilarProducts from "@/components/product/SimilarProducts";
import StickyBottomBar from "@/components/product/StickyBottomBar";
import { Body } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";

export default function ProductDetailsScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = flashSaleProducts.find((p) => p.id === String(id));

  if (!product) {
    return (
      <SafeAreaView
        style={[styles.container, styles.center, { backgroundColor: colors.canvas }]}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <Body tone="soft">Product not found</Body>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProductGallery product={product} onBack={() => router.back()} />

        <ProductInfo product={product} />

        {product.sizes && (
          <SizeSelector sizes={product.sizes} defaultSize={product.sizes[0]} />
        )}

        <QuantitySelector initialValue={1} onChange={() => {}} />

        <DescriptionCard description={product.description} />

        <SpecificationCard specifications={product.specifications} />

        <ReviewsPreview
          rating={product.rating}
          reviewsCount={product.reviews}
          reviews={[
            {
              id: "1",
              user: "Sarah Johnson",
              rating: 5,
              comment:
                "Amazing quality and super comfortable. Definitely worth the price.",
              date: "2 days ago",
            },
            {
              id: "2",
              user: "Michael Lee",
              rating: 4,
              comment: "Looks great and fits perfectly. Delivery was fast too.",
              date: "1 week ago",
            },
          ]}
          onSeeAll={() => {}}
        />

        <SimilarProducts
          products={flashSaleProducts.filter((item) => item.id !== product.id)}
          onSeeAll={() => {}}
        />
      </ScrollView>

      <StickyBottomBar
        price={product.price}
        originalPrice={product.originalPrice}
        onAddToCart={() => {}}
        onBuyNow={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
});
