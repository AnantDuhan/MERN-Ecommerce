import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthFooter from "@/components/auth/AuthFooter";
import PrimaryButton from "@/components/onboarding/PrimaryButton";
import { Txt } from "@/components/ui/Text";

import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/features/auth/validation/auth.schema";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

export default function ResetPasswordScreen() {
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();

  const token = typeof params.token === "string" ? params.token : "";

  const resetPasswordMutation = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }
    resetPasswordMutation.mutate({
      token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="New password"
            subtitle="Your new password must differ from the previous one."
          />

          <AuthCard>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <AuthTextField
                  label="New Password"
                  placeholder="Enter your new password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.password?.message}
                  secureTextEntry
                  returnKeyType="next"
                  icon="lock-closed-outline"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <AuthTextField
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  icon="shield-checkmark-outline"
                />
              )}
            />

            <PrimaryButton
              title="Reset Password"
              loading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending || !token}
              onPress={handleSubmit(onSubmit)}
            />

            {resetPasswordMutation.isError && (
              <Txt tone="danger" center style={{ marginTop: spacing.md }}>
                {resetPasswordMutation.error.message}
              </Txt>
            )}

            {!token && (
              <Txt tone="danger" center style={{ marginTop: spacing.md }}>
                Invalid or expired reset link.
              </Txt>
            )}
          </AuthCard>

          <Animated.View entering={FadeInDown.delay(400)}>
            <AuthFooter
              text="Remember your password?"
              actionText="Sign In"
              disabled={resetPasswordMutation.isPending}
              onPress={() => router.replace("/login")}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});
