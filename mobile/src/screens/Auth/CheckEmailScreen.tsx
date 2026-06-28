import React, { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
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

import AnimatedBackground from "@/components/layout/AnimatedBackground";
import PrimaryButton from "@/components/onboarding/PrimaryButton";
import AuthFooter from "@/components/auth/AuthFooter";

export default function CheckEmailScreen() {

  const RESEND_DELAY_SECONDS = 30;
  const [countdown, setCountdown] = useState(RESEND_DELAY_SECONDS);

  const { email } =
    useLocalSearchParams<{
      email?: string;
    }>();

  const openMailApp = async () => {
    await Linking.openURL("message://");
  };

//   const resendEmail = () => {
//     router.replace({
//       pathname: "/forgot-password",
//       params: {
//         email,
//       },
//     });
//   };

  const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
            withTiming(-8, {
                duration: 2200,
            }),
            withTiming(8, {
                duration: 2200,
            })
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
        transform: [
            {
            translateY: translateY.value,
            },
        ],
    }));

    const resendEmail = () => {
        console.log("Resend email");

        setCountdown(RESEND_DELAY_SECONDS);
    };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(700)}
        >
          <Animated.View
            entering={FadeInDown.duration(700)}
            style={[
                styles.illustrationContainer,
                illustrationStyle
            ]}
          >
            <CheckEmailIllustration
                width={280}
                height={280}
            />
          </Animated.View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(150)}
          style={styles.title}
        >
          Check Your Email
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(250)}
          style={styles.subtitle}
        >
          We've sent a password reset link to
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(350)}
          style={styles.email}
        >
          {email}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(450)}
          style={styles.description}
        >
          Please check your inbox and follow the
          instructions to reset your password.
        </Animated.Text>

        <View style={{ height: 40 }} />

        <PrimaryButton
          title="Open Mail App"
          onPress={openMailApp}
        />

        <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
                Didn't receive an email?
            </Text>

            <Animated.View entering={FadeInDown.duration(300)}>
                {countdown > 0 ? (
                    <Text style={styles.countdown}>
                        Resend in {countdown}s
                    </Text>
                ) : (
                    <Pressable onPress={resendEmail}>
                        <Text style={styles.resendButton}>
                            Resend Email
                        </Text>
                    </Pressable>
                )}
            </Animated.View>
        </View>

        <AuthFooter
          text="Remember your password?"
          actionText="Sign In"
          onPress={() =>
            router.replace("/login")
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    marginTop: 28,

    fontSize: 30,
    fontWeight: "800",

    textAlign: "center",

    color: "#0F172A",
  },

  subtitle: {
    marginTop: 16,

    fontSize: 16,

    textAlign: "center",

    color: "#64748B",
  },

  email: {
    marginTop: 10,

    textAlign: "center",

    fontSize: 17,
    fontWeight: "700",

    color: "#2F80ED",
  },

  description: {
    marginTop: 16,

    textAlign: "center",

    fontSize: 15,
    lineHeight: 24,

    color: "#64748B",
  },

  resend: {
    marginTop: 28,

    textAlign: "center",

    fontSize: 16,
    fontWeight: "700",

    color: "#2F80ED",
  },

  resendContainer: {
    marginTop: 28,
    alignItems: "center",
  },

  resendText: {
    fontSize: 15,
    color: "#64748B",
  },

  countdown: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#94A3B8",
  },

  resendButton: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#2F80ED",
  }
});