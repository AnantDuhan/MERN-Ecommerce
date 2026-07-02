import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthDivider from "@/components/auth/AuthDivider";
import Animated, { FadeInDown } from "react-native-reanimated";
import AuthCard from "@/components/auth/AuthCard";
import { Ionicons } from "@expo/vector-icons";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AnimatedBackground from "@/components/layout/AnimatedBackground";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import PrimaryButton from "@/components/onboarding/PrimaryButton";

import AuthFooter from "@/components/auth/AuthFooter";
import { useLogin } from "@/features/auth/hooks/useLogin";
import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/validation/login.schema";

export default function LoginScreen() {
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground />

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
            title="Welcome Back 👋"
            subtitle="Sign in to continue your shopping!"
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
                  leftIcon={
                    <Ionicons name="mail-outline" size={22} color="#64748B" />
                  }
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

            <Animated.View entering={FadeInDown.delay(400)}>
              <Pressable
                disabled={loginMutation.isPending}
                onPress={() => router.push("/forgot-password")}
              >
                <Text style={styles.forgot}>Forgot Password?</Text>
              </Pressable>
            </Animated.View>

            <View style={{ height: 16 }} />

            <PrimaryButton
              title="Sign In"
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              onPress={handleSubmit(onSubmit)}
            />

            {loginMutation.isError && (
              <Text style={styles.error}>{loginMutation.error.message}</Text>
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
  container: {
    flex: 1,
  },

  mainContent: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 24,
  },

  forgot: {
    alignSelf: "flex-end",
    color: "#2F80ED",
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    paddingBottom: 24,
    paddingTop: 12,
    alignItems: "center",
  },

  error: {
    marginTop: 12,
    textAlign: "center",
    color: "#EF4444",
    fontSize: 14,
  },
});
