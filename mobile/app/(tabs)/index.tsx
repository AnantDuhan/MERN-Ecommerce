import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import PromoCard from "@/components/home/PromoCard";
import SectionHeader from "@/components/common/SectionHeader";
import CategoryList from "@/components/home/CategoryList";
import { categories } from "@/components/home/data/categories";
import ProductCard from "@/components/product/ProductCard";
import { Body } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { data, isLoading, isError } = useProducts();
  const products = data?.products ?? [];

  const goToSearch = (q?: string) =>
    router.push({ pathname: "/(tabs)/search", params: q ? { q } : {} });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          userName="Anant"
          location="Coimbatore, Tamil Nadu"
          onNotificationPress={() => {}}
        />

        <SearchBar
          onPress={() => goToSearch()}
          onVoicePress={() => goToSearch()}
          onCameraPress={() => goToSearch()}
        />

        <PromoCard
          title="Summer Sale"
          subtitle="Up to 50% Off"
          description="Discover the latest arrivals."
          button="Shop Now"
          image={require("@/assets/banners/shoe.png")}
          onPress={() => goToSearch()}
        />

        <SectionHeader title="Categories" onPress={() => goToSearch()} />
        <CategoryList
          categories={categories}
          onCategoryPress={(category) => goToSearch(category.title)}
        />

        <SectionHeader title="Featured" onPress={() => goToSearch()} />

        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={colors.brass} />
          </View>
        ) : isError ? (
          <View style={styles.stateBox}>
            <Body tone="soft">Couldn't load products. Pull to retry.</Body>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.stateBox}>
            <Body tone="soft">No products yet.</Body>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                image={product.images[0]}
                price={product.price}
                rating={product.rating}
                reviews={product.reviews}
                favourite={product.favourite}
                discount={product.discount}
              />
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8, paddingBottom: 140 },
  stateBox: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
