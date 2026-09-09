import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Eyebrow, Display, Body } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/product/ProductCard";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useAuthStore } from "@/store/auth.store";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

export default function WishlistScreen() {
  const { colors, isDark } = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: products = [], isLoading, isError, refetch, isFetching } =
    useWishlist();

  const Header = (
    <View style={styles.header}>
      <Eyebrow tone="soft">Saved</Eyebrow>
      <Display style={{ marginTop: spacing.xs }}>Wishlist</Display>
    </View>
  );

  const shell = (children: React.ReactNode) => (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </SafeAreaView>
  );

  if (!isAuthenticated) {
    return shell(
      <View style={styles.stateBox}>
        <Ionicons name="heart-outline" size={40} color={colors.inkFaint} />
        <Body tone="soft" center style={{ marginTop: spacing.md }}>
          Sign in to see your saved items.
        </Body>
        <Button
          label="Sign In"
          onPress={() => router.replace("/login")}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    );
  }

  return shell(
    <>
      {Header}
      {isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.brass} />
        </View>
      ) : isError ? (
        <View style={styles.stateBox}>
          <Body tone="soft">Couldn't load your wishlist.</Body>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.stateBox}>
          <Ionicons name="heart-outline" size={40} color={colors.inkFaint} />
          <Body tone="soft" center style={{ marginTop: spacing.md }}>
            Your wishlist is empty.
          </Body>
          <Button
            label="Browse Products"
            variant="outline"
            onPress={() => router.push("/(tabs)/search")}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
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
              favourite
              discount={item.discount}
            />
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  column: { paddingHorizontal: 18, gap: 12 },
  list: { paddingBottom: 140, gap: 12 },
  stateBox: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
