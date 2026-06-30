import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface Props {
  products: Product[];
  onSeeAll?: () => void;
}

export default function SimilarProducts({ products, onSeeAll }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(700)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Similar Products</Text>

        <Pressable onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            name={item.name}
            category={item.category}
            image={item.images[0]}
            price={item.price}
            rating={item.rating}
            reviews={item.reviews}
            favourite={item.favourite}
            discount={item.discount}
          />
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 120,
  },

  header: {
    paddingHorizontal: 24,
    marginBottom: 18,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  seeAll: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2F80ED",
  },

  list: {
    paddingHorizontal: 24,
  },
});
