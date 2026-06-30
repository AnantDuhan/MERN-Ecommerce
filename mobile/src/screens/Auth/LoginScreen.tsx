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

import { loginSchema, LoginForm } from "@/validation/auth.schema";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);

    router.replace("/(tabs)/");
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
                onPress={() =>
                  router.push("/forgot-password")
              }>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </Pressable>
            </Animated.View>

            <View style={{ height: 16 }} />

            <PrimaryButton title="Sign In" onPress={handleSubmit(onSubmit)} />

            <AuthDivider />

            <GoogleButton
              onPress={() => {
                console.log("Google Login");
              }}
            />
          </AuthCard>
          <Animated.View entering={FadeInDown.delay(500)}>
            <AuthFooter
              text="Don't have an account?"
              actionText="Create Account"
              onPress={() => router.push("/register")}
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
});
