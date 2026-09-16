import React from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import TopBar from "@/components/common/TopBar";
import AdminProductForm from "@/components/admin/AdminProductForm";
import { Display, Eyebrow, Body, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useAdminProducts } from "@/features/admin/products/hooks/useAdminProducts";
import { useUpdateAdminProduct } from "@/features/admin/products/hooks/useUpdateAdminProduct";
import { useDeleteAdminProduct } from "@/features/admin/products/hooks/useDeleteAdminProduct";

export default function EditProductScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // The admin list is already fetched on the products screen; reuse its
  // cache rather than adding a separate admin-product-detail endpoint.
  const { data: products = [], isLoading } = useAdminProducts();
  const product = products.find((p) => p._id === id);

  const updateProduct = useUpdateAdminProduct();
  const deleteProduct = useDeleteAdminProduct();

  const shell = (children: React.ReactNode, center?: boolean) => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Products" />
      {center ? <View style={styles.center}>{children}</View> : children}
    </SafeAreaView>
  );

  if (isLoading) return shell(<ActivityIndicator color={colors.brass} />, true);
  if (!product) return shell(<Body tone="soft">Product not found.</Body>, true);

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      `Delete "${product.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProduct.mutate(product._id, { onSuccess: () => router.back() }),
        },
      ]
    );
  };

  return shell(
    <>
      <View style={styles.header}>
        <Eyebrow tone="soft">Editing</Eyebrow>
        <Display style={{ marginTop: spacing.xs }} numberOfLines={1}>{product.name}</Display>
      </View>

      <AdminProductForm
        initialValues={{
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category,
          Stock: String(product.Stock),
        }}
        existingImages={product.images}
        submitLabel={updateProduct.isPending ? "Saving…" : "Save Changes"}
        isSubmitting={updateProduct.isPending}
        errorMessage={
          updateProduct.isError
            ? (updateProduct.error as any)?.response?.data?.message ?? "Couldn't save changes."
            : null
        }
        onSubmit={(values, images) => {
          updateProduct.mutate({
            id: product._id,
            values,
            images: images.length > 0 ? images : undefined,
          });
        }}
      />

      <View style={styles.deleteZone}>
        {deleteProduct.isError && (
          <Txt tone="danger" center style={{ marginBottom: spacing.sm }}>
            Couldn't delete product.
          </Txt>
        )}
        <Button
          label={deleteProduct.isPending ? "Deleting…" : "Delete Product"}
          variant="outline"
          loading={deleteProduct.isPending}
          onPress={handleDelete}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  deleteZone: { paddingHorizontal: 24, paddingBottom: 40 },
});
