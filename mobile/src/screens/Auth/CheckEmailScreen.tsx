import React, { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import CheckEmailIllustration from "@/assets/illustrations/check-email.svg";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import PrimaryButton from "@/components/onboarding/PrimaryButton";
import AuthFooter from "@/components/auth/AuthFooter";
import { Eyebrow, Display, Body, Txt } from "@/components/ui/Text";
import { Rule } from "@/components/ui/Rule";

import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";

export default function CheckEmailScreen() {
  const { colors, isDark } = useTheme();

  const RESEND_DELAY_SECONDS = 30;
  const [countdown, setCountdown] = useState(RESEND_DELAY_SECONDS);

  const { email } = useLocalSearchParams<{ email?: string }>();

  const openMailApp = async () => {
    await Linking.openURL("message://");
  };

  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2200 }),
        withTiming(8, { duration: 2200 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const resendEmail = () => {
    setCountdown(RESEND_DELAY_SECONDS);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(700)}
          style={[styles.illustrationContainer, illustrationStyle]}
        >
          <CheckEmailIllustration width={240} height={240} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)}>
          <Eyebrow center style={{ marginTop: spacing.md }}>
            Almost there
          </Eyebrow>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Display center style={{ marginTop: spacing.sm }}>
            Check your email
          </Display>
        </Animated.View>

        <Rule style={{ width: 80, marginTop: spacing.md, alignSelf: "center" }} />

        <Animated.View entering={FadeInDown.delay(300)}>
          <Body tone="soft" center style={{ marginTop: spacing.lg }}>
            We've sent a password reset link to
          </Body>
        </Animated.View>

        {email ? (
          <Animated.View entering={FadeInDown.delay(350)}>
            <Txt tone="brass" center style={{ ...type.h3, marginTop: spacing.xs }}>
              {email}
            </Txt>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(450)}>
          <Body
            tone="soft"
            center
            style={{ marginTop: spacing.md, paddingHorizontal: spacing.md }}
          >
            Please check your inbox and follow the instructions to reset your
            password.
          </Body>
        </Animated.View>

        <View style={{ height: spacing.xl }} />

        <PrimaryButton title="Open Mail App" onPress={openMailApp} />

        <View style={styles.resendContainer}>
          <Body tone="soft">Didn't receive an email?</Body>
          <Animated.View entering={FadeInDown.duration(300)}>
            {countdown > 0 ? (
              <Txt tone="faint" style={{ ...type.eyebrow, marginTop: spacing.sm }}>
                {`Resend in ${countdown}s`}
              </Txt>
            ) : (
              <Pressable onPress={resendEmail} hitSlop={8}>
                <Txt tone="brass" style={{ ...type.eyebrow, marginTop: spacing.sm }}>
                  Resend Email
                </Txt>
              </Pressable>
            )}
          </Animated.View>
        </View>

        <AuthFooter
          text="Remember your password?"
          actionText="Sign In"
          onPress={() => router.replace("/login")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  resendContainer: {
    marginTop: 28,
    alignItems: "center",
  },
});
