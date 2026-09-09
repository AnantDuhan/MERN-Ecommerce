import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";

import { Eyebrow, Display, Body } from "@/components/ui/Text";
import { Field } from "@/components/ui/Field";
import ProductCard from "@/components/product/ProductCard";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useProducts } from "@/features/products/hooks/useProducts";

export default function SearchScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{ q?: string }>();

  const [text, setText] = useState(params.q ?? "");
  const [keyword, setKeyword] = useState(params.q ?? "");

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(text.trim()), 350);
    return () => clearTimeout(timer);
  }, [text]);

  const { data, isLoading, isFetching, isError } = useProducts({
    keyword: keyword || undefined,
  });
  const products = data?.products ?? [];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.header}>
        <Eyebrow tone="soft">Browse</Eyebrow>
        <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
          Search
        </Display>
        <Field
          left="search-outline"
          placeholder="Search products"
          value={text}
          onChangeText={setText}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.brass} />
        </View>
      ) : isError ? (
        <View style={styles.stateBox}>
          <Body tone="soft">Couldn't load results.</Body>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.stateBox}>
          <Body tone="soft">
            {keyword ? `No results for "${keyword}".` : "No products found."}
          </Body>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              variant="grid"
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
          ListFooterComponent={
            isFetching ? (
              <ActivityIndicator
                color={colors.brass}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 12 },
  column: { paddingHorizontal: 18, gap: 12 },
  list: { paddingTop: 12, paddingBottom: 140, gap: 12 },
  stateBox: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: "center",
  },
});
