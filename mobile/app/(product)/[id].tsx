import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SizeSelector from "@/components/product/SizeSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import DescriptionCard from "@/components/product/DescriptionCard";
import SpecificationCard from "@/components/product/SpecificationCard";
import ReviewsPreview from "@/components/product/ReviewsPreview";
import WriteReviewCard from "@/components/product/WriteReviewCard";
import SimilarProducts from "@/components/product/SimilarProducts";
import StickyBottomBar from "@/components/product/StickyBottomBar";
import { Body } from "@/components/ui/Text";

import { useTheme } from "@/theme/ThemeContext";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useToggleWishlist } from "@/features/wishlist/hooks/useToggleWishlist";
import { useProductReviews } from "@/features/reviews/hooks/useProductReviews";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";

export default function ProductDetailsScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: product, isLoading, isError } = useProduct(id);
  const { data: allProducts } = useProducts();
  const { data: wishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const { data: reviews = [] } = useProductReviews(id);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addToCart = useCartStore((s) => s.add);

  const [size, setSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  const inWishlist = !!wishlist?.some((p) => p.id === id);

  const stateShell = (children: React.ReactNode) => (
    <SafeAreaView
      style={[styles.container, styles.center, { backgroundColor: colors.canvas }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </SafeAreaView>
  );

  if (isLoading) return stateShell(<ActivityIndicator color={colors.brass} />);
  if (isError || !product)
    return stateShell(<Body tone="soft">Product not found</Body>);

  const similar = (allProducts?.products ?? []).filter((p) => p.id !== product.id);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
      },
      quantity
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProductGallery
          product={{ ...product, favourite: inWishlist }}
          onBack={() => router.back()}
          onFavourite={() =>
            toggleWishlist.mutate({ id: product.id, inWishlist })
          }
        />

        <ProductInfo product={product} />

        {product.sizes && (
          <SizeSelector
            sizes={product.sizes}
            defaultSize={product.sizes[0]}
            onChange={setSize}
          />
        )}

        <QuantitySelector initialValue={1} onChange={setQuantity} />

        <DescriptionCard description={product.description} />

        <SpecificationCard specifications={product.specifications} />

        <ReviewsPreview
          rating={product.rating}
          reviewsCount={product.reviews}
          reviews={reviews.map((r) => ({
            id: r._id,
            user: r.name,
            rating: r.rating,
            comment: r.comment,
          }))}
          onSeeAll={() => {}}
        />

        {isAuthenticated && <WriteReviewCard productId={product.id} />}

        {similar.length > 0 && (
          <SimilarProducts products={similar} onSeeAll={() => {}} />
        )}
      </ScrollView>

      <StickyBottomBar
        price={product.price}
        originalPrice={product.originalPrice}
        onAddToCart={handleAddToCart}
        onBuyNow={() => {
          handleAddToCart();
          router.push("/(tabs)/cart");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
});
