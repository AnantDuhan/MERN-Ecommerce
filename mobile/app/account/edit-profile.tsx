import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";

import TopBar from "@/components/common/TopBar";
import AuthTextField from "@/components/auth/AuthTextField";
import { Display, Eyebrow, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { radii, spacing, type } from "@/theme/tokens";
import { useAuthStore } from "@/store/auth.store";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";

export default function EditProfileScreen() {
  const { colors, isDark } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState<ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0]);
    }
  };

  const onSave = () => {
    updateProfile.mutate(
      { name, email, avatar },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Account" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Eyebrow tone="soft">Update</Eyebrow>
          <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>Edit Profile</Display>

          <Pressable onPress={pickImage} style={{ alignSelf: "center", marginBottom: spacing.lg }}>
            {avatar?.uri || user?.avatar ? (
              <Image
                source={{ uri: avatar?.uri ?? user?.avatar }}
                style={[styles.avatar, { borderColor: colors.line }]}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.surface2, borderColor: colors.line }]}>
                <Txt style={{ ...type.h1 }}>{name.charAt(0).toUpperCase() || "?"}</Txt>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: colors.brass, borderColor: colors.canvas }]}>
              <Ionicons name="pencil" size={13} color={colors.onBrass} />
            </View>
          </Pressable>

          <AuthTextField label="Full Name" icon="person-outline" value={name} onChangeText={setName} autoCapitalize="words" />
          <AuthTextField label="Email" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          {updateProfile.isError && (
            <Txt tone="danger" center style={{ marginTop: spacing.sm }}>
              Couldn't update profile. Please try again.
            </Txt>
          )}

          <Button
            label={updateProfile.isPending ? "Saving…" : "Save Changes"}
            loading={updateProfile.isPending}
            onPress={onSave}
            style={{ marginTop: spacing.lg }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: radii.xs, borderWidth: 1 },
  avatarFallback: { justifyContent: "center", alignItems: "center" },
  badge: {
    position: "absolute", right: -6, bottom: -6, width: 28, height: 28,
    borderRadius: radii.xs, justifyContent: "center", alignItems: "center", borderWidth: 2,
  },
});
