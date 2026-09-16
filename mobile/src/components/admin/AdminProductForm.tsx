import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import AuthTextField from "@/components/auth/AuthTextField";
import { Button } from "@/components/ui/Button";
import { BodySm, Caption, Txt } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing } from "@/theme/tokens";
import { ProductFormData } from "@/features/admin/products/types/adminProduct";

export interface ExistingImage {
  url: string;
}

interface Props {
  initialValues?: ProductFormData;
  existingImages?: ExistingImage[];
  onSubmit: (values: ProductFormData, newImages: ImagePicker.ImagePickerAsset[]) => void;
  submitLabel: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export default function AdminProductForm({
  initialValues,
  existingImages = [],
  onSubmit,
  submitLabel,
  isSubmitting,
  errorMessage,
}: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [price, setPrice] = useState(initialValues?.price ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [stock, setStock] = useState(initialValues?.Stock ?? "");
  const [newImages, setNewImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });
    if (!result.canceled) {
      setNewImages(result.assets);
    }
  };

  const handleSubmit = () => {
    onSubmit({ name, description, price, category, Stock: stock }, newImages);
  };

  const previewImages = newImages.length > 0
    ? newImages.map((a) => ({ uri: a.uri }))
    : existingImages.map((i) => ({ uri: i.url }));

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Pressable onPress={pickImages} style={[styles.imagePicker, { borderColor: colors.line }]}>
        {previewImages.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {previewImages.map((img, i) => (
              <Image key={i} source={img} resizeMode="contain" style={styles.previewImage} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="images-outline" size={28} color={colors.inkFaint} />
            <Caption tone="faint" style={{ marginTop: spacing.xs }}>Tap to add photos</Caption>
          </View>
        )}
      </Pressable>
      {newImages.length > 0 && (
        <BodySm tone="soft" style={{ marginBottom: spacing.md }}>
          {`${newImages.length} new photo${newImages.length === 1 ? "" : "s"} selected — will replace existing images`}
        </BodySm>
      )}

      <AuthTextField label="Name" icon="pricetag-outline" value={name} onChangeText={setName} />
      <AuthTextField
        label="Description" icon="document-text-outline" value={description} onChangeText={setDescription}
        multiline numberOfLines={4} style={{ minHeight: 100, textAlignVertical: "top" }}
      />
      <AuthTextField label="Price (\u20B9)" icon="cash-outline" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
      <AuthTextField label="Category" icon="grid-outline" value={category} onChangeText={setCategory} />
      <AuthTextField label="Stock" icon="cube-outline" keyboardType="number-pad" value={stock} onChangeText={setStock} />

      {errorMessage && (
        <Txt tone="danger" center style={{ marginBottom: spacing.sm }}>
          {errorMessage}
        </Txt>
      )}

      <Button label={submitLabel} loading={isSubmitting} onPress={handleSubmit} style={{ marginTop: spacing.md }} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  imagePicker: {
    height: 140,
    borderWidth: 1,
    borderRadius: radii.xs,
    marginBottom: spacing.sm,
    justifyContent: "center",
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center", flex: 1 },
  previewImage: { width: 140, height: 138 },
});
