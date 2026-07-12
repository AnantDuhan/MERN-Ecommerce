import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Animated, { FadeInDown } from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import AnimatedBackground from "@/components/layout/AnimatedBackground";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import PrimaryButton from "@/components/onboarding/PrimaryButton";
import AuthFooter from "@/components/auth/AuthFooter";

import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/features/auth/validation/auth.schema";

import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    Keyboard.dismiss();
    forgotPasswordMutation.mutate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={!forgotPasswordMutation.isPending}
        >
          <AuthHeader
            title="Forgot Password?"
            subtitle="Enter your email address and we'll send you a password reset link."
          />

          <AuthCard>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <AuthTextField
                  autoFocus
                  label="Email"
                  placeholder="Enter your email"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  leftIcon={
                    <Ionicons name="mail-outline" size={22} color="#64748B" />
                  }
                />
              )}
            />

            <PrimaryButton
              title="Send Reset Link"
              loading={forgotPasswordMutation.isPending}
              disabled={forgotPasswordMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            />

            {forgotPasswordMutation.isError && (
              <Text style={styles.error}>
                {forgotPasswordMutation.error.message}
              </Text>
            )}
          </AuthCard>

          <Animated.View entering={FadeInDown.delay(400)}>
            <AuthFooter
              text="Remember your password?"
              actionText="Sign In"
              disabled={forgotPasswordMutation.isPending}
              onPress={() => router.replace("/login")}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 24,
  },

  error: {
    marginTop: 12,
    textAlign: "center",
    color: "#EF4444",
    fontSize: 14,
  },
});
