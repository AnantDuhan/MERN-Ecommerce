import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AnimatedBackground from "@/components/layout/AnimatedBackground";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import AuthTextField from "@/components/auth/AuthTextField";
import AvatarPicker from "@/components/auth/AvatarPicker";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthFooter from "@/components/auth/AuthFooter";

import PrimaryButton from "@/components/onboarding/PrimaryButton";

import { registerSchema, RegisterForm } from "@/validation/register.schema";

export default function RegisterScreen() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterForm) => {
    console.log({
      ...data,
      avatar,
    });

    router.replace("/login");
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
        >
          <AuthHeader
            title="Create Account"
            subtitle="Join us and start shopping smarter."
          />

          <AvatarPicker onImageSelected={setAvatar} />

          <AuthCard>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <AuthTextField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                  autoCapitalize="words"
                  leftIcon={
                    <Ionicons name="person-outline" size={22} color="#64748B" />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <AuthTextField
                  label="Email"
                  placeholder="Enter your email"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={
                    <Ionicons name="mail-outline" size={22} color="#64748B" />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <AuthTextField
                  label="Password"
                  placeholder="Create a password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
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
              render={({ field, fieldState }) => (
                <AuthTextField
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
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
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
            />

            <AuthDivider />

            <GoogleButton
              onPress={() => {
                console.log("Google Register");
              }}
            />
          </AuthCard>

          <Animated.View entering={FadeInDown.delay(500)}>
            <AuthFooter
              text="Already have an account?"
              actionText="Sign In"
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
});
