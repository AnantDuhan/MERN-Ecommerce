import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { ImagePickerAsset } from "expo-image-picker";

import { useTheme } from "@/theme/ThemeContext";
import { Eyebrow } from "@/components/ui/Text";
import { radii, spacing } from "@/theme/tokens";

interface Props {
  onImageSelected: (image: ImagePickerAsset) => void;
}

const SIZE = 96;

export default function AvatarPicker({ onImageSelected }: Props) {
  const { colors } = useTheme();
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedImage(asset);
      onImageSelected(asset);
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
      }}
    >
      <Pressable onPress={pickImage}>
        <View>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage.uri }}
              style={{
                width: SIZE,
                height: SIZE,
                borderRadius: radii.xs,
                borderWidth: 1,
                borderColor: colors.line,
              }}
            />
          ) : (
            <View
              style={{
                width: SIZE,
                height: SIZE,
                borderRadius: radii.xs,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.surface2,
                borderWidth: 1,
                borderColor: colors.line,
              }}
            >
              <Ionicons name="person-outline" size={40} color={colors.inkFaint} />
            </View>
          )}

          <View
            style={{
              position: "absolute",
              right: -6,
              bottom: -6,
              width: 28,
              height: 28,
              borderRadius: radii.xs,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.brass,
              borderWidth: 2,
              borderColor: colors.canvas,
            }}
          >
            <Ionicons name="pencil" size={13} color={colors.onBrass} />
          </View>
        </View>
      </Pressable>

      <Eyebrow tone="soft" style={{ marginTop: spacing.md }}>
        {selectedImage ? "Change Photo" : "Add Photo"}
      </Eyebrow>
    </View>
  );
}
