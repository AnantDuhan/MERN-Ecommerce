import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AnimatedBackground from "@/components/layout/AnimatedBackground";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import AuthTextField from "@/components/auth/AuthTextField";
import PrimaryButton from "@/components/onboarding/PrimaryButton";
import AuthFooter from "@/components/auth/AuthFooter";

import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/features/auth/validation/auth.schema";

import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

export default function TokenResetPasswordScreen() {
  const { token } = useLocalSearchParams<{
    token: string;
  }>();

  const resetPasswordMutation =
    useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(
      resetPasswordSchema
    ),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (
    data: ResetPasswordFormData
  ) => {
    if (!token) return;

    resetPasswordMutation.mutate({
      token,
      password: data.password,
      confirmPassword:
        data.confirmPassword,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <AuthHeader
            title="Reset Password"
            subtitle="Create a strong new password."
          />

          <AuthCard>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <AuthTextField
                  label="New Password"
                  placeholder="Enter password"
                  value={field.value}
                  onChangeText={
                    field.onChange
                  }
                  error={
                    errors.password
                      ?.message
                  }
                  secureTextEntry
                  returnKeyType="next"
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={22}
                      color="#64748B"
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <AuthTextField
                  label="Confirm Password"
                  placeholder="Confirm password"
                  value={field.value}
                  onChangeText={
                    field.onChange
                  }
                  error={
                    errors
                      .confirmPassword
                      ?.message
                  }
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(
                    onSubmit
                  )}
                  leftIcon={
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={22}
                      color="#64748B"
                    />
                  }
                />
              )}
            />

            <PrimaryButton
              title="Reset Password"
              loading={
                resetPasswordMutation.isPending
              }
              disabled={
                resetPasswordMutation.isPending
              }
              onPress={handleSubmit(
                onSubmit
              )}
            />

            {resetPasswordMutation.isError && (
              <Text style={styles.error}>
                {
                  resetPasswordMutation
                    .error.message
                }
              </Text>
            )}
          </AuthCard>

          <Animated.View
            entering={FadeInDown.delay(
              400
            )}
          >
            <AuthFooter
              text="Back to login?"
              actionText="Sign In"
              disabled={
                resetPasswordMutation.isPending
              }
              onPress={() =>
                router.replace("/login")
              }
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

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
    color: "#EF4444",
    textAlign: "center",
    fontSize: 14,
  },
});