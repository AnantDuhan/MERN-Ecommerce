import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import TopBar from "@/components/common/TopBar";
import AuthTextField from "@/components/auth/AuthTextField";
import { Display, Eyebrow, Txt } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import { useUpdatePassword } from "@/features/auth/hooks/useUpdatePassword";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ChangePasswordScreen() {
  const { colors, isDark } = useTheme();
  const updatePassword = useUpdatePassword();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: FormData) => {
    updatePassword.mutate(data, { onSuccess: () => router.back() });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="Account" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Eyebrow tone="soft">Security</Eyebrow>
          <Display style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>Change Password</Display>

          <Controller control={control} name="oldPassword" render={({ field }) => (
            <AuthTextField label="Current Password" icon="lock-closed-outline" secureTextEntry
              value={field.value} onChangeText={field.onChange} error={errors.oldPassword?.message} />
          )} />
          <Controller control={control} name="newPassword" render={({ field }) => (
            <AuthTextField label="New Password" icon="key-outline" secureTextEntry
              value={field.value} onChangeText={field.onChange} error={errors.newPassword?.message} />
          )} />
          <Controller control={control} name="confirmPassword" render={({ field }) => (
            <AuthTextField label="Confirm New Password" icon="shield-checkmark-outline" secureTextEntry
              value={field.value} onChangeText={field.onChange} error={errors.confirmPassword?.message}
              onSubmitEditing={handleSubmit(onSubmit)} returnKeyType="done" />
          )} />

          {updatePassword.isError && (
            <Txt tone="danger" center style={{ marginTop: spacing.sm }}>
              {(updatePassword.error as any)?.response?.data?.message ?? "Couldn't update password."}
            </Txt>
          )}

          <Button
            label={updatePassword.isPending ? "Updating…" : "Update Password"}
            loading={updatePassword.isPending}
            onPress={handleSubmit(onSubmit)}
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
});
