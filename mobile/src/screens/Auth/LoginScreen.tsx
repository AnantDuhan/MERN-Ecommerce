import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFooter from "@/components/auth/AuthFooter";
import GoogleButton from "@/components/auth/GoogleButton";
import PrimaryButton from "@/components/onboarding/PrimaryButton";
import { Txt } from "@/components/ui/Text";

import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";

import { useLogin } from "@/features/auth/hooks/useLogin";
import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/validation/auth.schema";

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "position" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <AuthHeader
            title="Welcome back"
            subtitle="Sign in to continue your shopping."
          />

          <AuthCard>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <AuthTextField
                  label="Email"
                  placeholder="Enter your email"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  icon="mail-outline"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <AuthTextField
                  label="Password"
                  placeholder="Enter password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.password?.message}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  icon="lock-closed-outline"
                />
              )}
            />

            <Animated.View entering={FadeInDown.delay(400)}>
              <Pressable
                disabled={loginMutation.isPending}
                onPress={() => router.push("/forgot-password")}
                hitSlop={8}
                style={{ alignSelf: "flex-end" }}
              >
                <Txt tone="brass" style={{ ...type.eyebrow }}>
                  Forgot Password
                </Txt>
              </Pressable>
            </Animated.View>

            <View style={{ height: spacing.lg }} />

            <PrimaryButton
              title="Sign In"
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            />

            {loginMutation.isError && (
              <Txt tone="danger" center style={{ marginTop: spacing.md }}>
                {loginMutation.error.message}
              </Txt>
            )}

            <AuthDivider />

            <GoogleButton
              disabled={loginMutation.isPending}
              onPress={() => {}}
            />
          </AuthCard>

          <Animated.View entering={FadeInDown.delay(500)}>
            <AuthFooter
              text="Don't have an account?"
              actionText="Create Account"
              onPress={() => router.push("/register")}
              disabled={loginMutation.isPending}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 24,
  },
});
