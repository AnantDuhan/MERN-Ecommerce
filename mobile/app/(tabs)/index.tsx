import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import PromoCard from "@/components/home/PromoCard";
import SectionHeader from "@/components/common/SectionHeader";
import CategoryList from "@/components/home/CategoryList";
import { categories } from "@/components/home/data/categories";
import ProductCard from "@/components/product/ProductCard";
import { flashSaleProducts } from "@/components/home/data/product";
import { useTheme } from "@/theme/ThemeContext";

export default function HomeScreen() {
  const { colors, isDark } = useTheme();

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
          onPress={() => {}}
          onVoicePress={() => {}}
          onCameraPress={() => {}}
        />

        <PromoCard
          title="Summer Sale"
          subtitle="Up to 50% Off"
          description="Discover the latest arrivals."
          button="Shop Now"
          image={require("@/assets/banners/shoe.png")}
        />

        <SectionHeader title="Categories" onPress={() => {}} />
        <CategoryList categories={categories} onCategoryPress={() => {}} />

        <SectionHeader title="Featured" onPress={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          {flashSaleProducts.map((product) => (
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
              onPress={() => {}}
              onFavourite={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 8, paddingBottom: 140 },
});
