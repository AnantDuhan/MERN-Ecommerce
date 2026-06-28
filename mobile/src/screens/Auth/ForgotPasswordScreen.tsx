import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import AnimatedBackground from "@/components/layout/AnimatedBackground";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import PrimaryButton from "@/components/onboarding/PrimaryButton";
import AuthFooter from "@/components/auth/AuthFooter";

import {
  forgotPasswordSchema,
  ForgotPasswordForm,
} from "@/validation/forgotPassword.schema";

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(
      forgotPasswordSchema
    ),

    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (
    data: ForgotPasswordForm
  ) => {
    console.log(data);

    router.replace({
        pathname: "/check-email",
        params: {
            email: data.email,
        },
    });
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
            title="Forgot Password?"
            subtitle="Enter your email address and we'll send you a password reset link."
          />

          <AuthCard>
            <Controller
              control={control}
              name="email"
              render={({
                field,
                fieldState,
              }) => (
                <AuthTextField
                  label="Email"
                  placeholder="Enter your email"
                  value={field.value}
                  onChangeText={
                    field.onChange
                  }
                  error={
                    fieldState.error
                      ?.message
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={
                    <Ionicons
                      name="mail-outline"
                      size={22}
                      color="#64748B"
                    />
                  }
                />
              )}
            />

            <PrimaryButton
              title="Send Reset Link"
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
                router.back()
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