import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import TopBar from "@/components/common/TopBar";
import AdminProductForm from "@/components/admin/AdminProductForm";
import { Display, Eyebrow } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useCreateAdminProduct } from "@/features/admin/products/hooks/useCreateAdminProduct";

export default function NewProductScreen() {
  const { colors, isDark } = useTheme();
  const createProduct = useCreateAdminProduct();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Products" />
      <View style={styles.header}>
        <Eyebrow tone="soft">New</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>Add Product</Display>
      </View>

      <AdminProductForm
        submitLabel={createProduct.isPending ? "Creating…" : "Create Product"}
        isSubmitting={createProduct.isPending}
        errorMessage={
          createProduct.isError
            ? (createProduct.error as any)?.response?.data?.message ?? "Couldn't create product."
            : null
        }
        onSubmit={(values, images) => {
          createProduct.mutate(
            { values, images },
            { onSuccess: () => router.back() }
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
});
