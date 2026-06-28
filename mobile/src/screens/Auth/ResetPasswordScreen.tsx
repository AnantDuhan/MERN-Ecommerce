import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

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
  ResetPasswordForm,
} from "@/validation/resetPassword.schema";

export default function ResetPasswordScreen() {
  const { token } =
    useLocalSearchParams<{
      token?: string;
    }>();

  const {
    control,
    handleSubmit,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(
      resetPasswordSchema
    ),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (
    data: ResetPasswordForm
  ) => {
    console.log({
      token,
      ...data,
    });

    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
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
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Create New Password"
            subtitle="Choose a strong password to secure your account."
          />

          <AuthCard>
            <Controller
              control={control}
              name="password"
              render={({
                field,
                fieldState,
              }) => (
                <AuthTextField
                  label="New Password"
                  placeholder="Enter new password"
                  value={field.value}
                  onChangeText={
                    field.onChange
                  }
                  error={
                    fieldState.error
                      ?.message
                  }
                  secureTextEntry
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
              render={({
                field,
                fieldState,
              }) => (
                <AuthTextField
                  label="Confirm Password"
                  placeholder="Confirm password"
                  value={field.value}
                  onChangeText={
                    field.onChange
                  }
                  error={
                    fieldState.error
                      ?.message
                  }
                  secureTextEntry
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
              onPress={handleSubmit(
                onSubmit
              )}
            />
          </AuthCard>

          <Animated.View
            entering={FadeInDown.delay(
              400
            )}
          >
            <AuthFooter
              text="Remember your password?"
              actionText="Sign In"
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
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
});