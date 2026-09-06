import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AnimatedBackground from "@/components/layout/AnimatedBackground";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import PromoCard from "@/components/home/PromoCard";
import SectionHeader from "@/components/common/SectionHeader";
import CategoryList from "@/components/home/CategoryList";
import { categories } from "@/components/home/data/categories";
import ProductCard from "@/components/product/ProductCard";
import { flashSaleProducts } from "@/components/home/data/product";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AnimatedBackground />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          onPress={() => console.log("Search")}
          onVoicePress={() => console.log("Voice")}
          onCameraPress={() => console.log("Camera")}
        />

        <HomeHeader
          userName="Anant"
          location="Coimbatore, Tamil Nadu"
          onNotificationPress={() => {
            console.log("Notifications");
          }}
        />

        <PromoCard
          title="Summer Sale"
          subtitle="Up to 50% OFF"
          description="Discover the latest arrivals."
          button="Shop Now"
          colors={["#5EA8FF", "#2F80ED"]}
          image={require("@/assets/banners/shoe.png")}
        />

        {/* CategoryList goes here */}

        {/* <SectionHeader
          title="Flash Sale"
          onPress={() => {}}
        />

        {/* FlashSaleList goes here */}

        {/* <SectionHeader
          title="Featured Products"
          onPress={() => {}}
        /> */}

        <CategoryList
          categories={categories}
          onCategoryPress={(category) => {
            console.log(category.title);
          }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}
        >
          {flashSaleProducts.map((product) => (
            <ProductCard
              id={product.id}
              key={product.id}
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
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    paddingTop: 12,
    paddingBottom: 120,
  },
});
