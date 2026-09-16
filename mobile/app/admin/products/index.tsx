import React, { useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopBar from "@/components/common/TopBar";
import { Field } from "@/components/ui/Field";
import { Display, Eyebrow, BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAdminProducts } from "@/features/admin/products/hooks/useAdminProducts";

export default function AdminProductsScreen() {
  const { colors, isDark } = useTheme();
  const { data: products = [], isLoading, refetch, isFetching } = useAdminProducts();
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Admin" />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Eyebrow tone="soft">Catalog</Eyebrow>
            <Display style={{ marginTop: spacing.xs }}>Products</Display>
          </View>
          <Pressable
            onPress={() => router.push("/admin/products/new")}
            style={[styles.addBtn, { borderColor: colors.line }]}
          >
            <Ionicons name="add" size={22} color={colors.ink} />
          </Pressable>
        </View>
        <Field
          left="search-outline"
          placeholder="Search products"
          value={query}
          onChangeText={setQuery}
          containerStyle={{ marginTop: spacing.lg }}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.brass} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: "/admin/products/[id]", params: { id: item._id } })}
              style={[styles.row, { borderColor: colors.line }]}
            >
              {item.images?.[0]?.url ? (
                <Image source={{ uri: item.images[0].url }} resizeMode="contain" style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, { backgroundColor: colors.surface2 }]} />
              )}
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <BodySm numberOfLines={1} style={{ fontFamily: type.h3.fontFamily }}>{item.name}</BodySm>
                <Caption tone="faint" style={{ marginTop: 2 }}>{item.category}</Caption>
                <Caption tone={item.Stock === 0 ? "danger" : "soft"} style={{ marginTop: 2 }}>
                  {item.Stock === 0 ? "Out of stock" : `${item.Stock} in stock`}
                </Caption>
              </View>
              <Txt style={{ ...type.h3 }}>{`\u20B9${item.price.toLocaleString()}`}</Txt>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  addBtn: { width: 44, height: 44, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1 },
  thumb: { width: 48, height: 48 },
});
