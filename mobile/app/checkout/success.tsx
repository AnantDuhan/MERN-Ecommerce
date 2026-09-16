import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

import { Display, Eyebrow, Body, Caption } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Rule } from "@/components/ui/Rule";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";

export default function OrderSuccessScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.content}>
        <Animated.View entering={ZoomIn.duration(500)}
          style={[styles.badge, { borderColor: colors.brass }]}>
          <Ionicons name="checkmark" size={44} color={colors.brass} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)}>
          <Eyebrow center style={{ marginTop: spacing.xl }}>Order Placed</Eyebrow>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(220)}>
          <Display center style={{ marginTop: spacing.sm }}>Thank you</Display>
        </Animated.View>

        <Rule style={{ width: 80, marginTop: spacing.md, alignSelf: "center" }} />

        <Animated.View entering={FadeInDown.delay(320)}>
          <Body tone="soft" center style={{ marginTop: spacing.lg }}>
            Your order has been placed successfully. A confirmation has been sent to your email.
          </Body>
        </Animated.View>

        {id ? (
          <Caption tone="faint" center style={{ marginTop: spacing.md }}>
            {`Order ID: ${String(id).slice(-10)}`}
          </Caption>
        ) : null}

        <View style={{ height: spacing.xxl }} />

        <Button label="View My Orders" onPress={() => router.replace("/orders")} />
        <Button label="Continue Shopping" variant="outline"
          onPress={() => router.replace("/(tabs)")} style={{ marginTop: spacing.md }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  badge: {
    width: 92, height: 92, borderRadius: 46, borderWidth: 1.5,
    justifyContent: "center", alignItems: "center", alignSelf: "center",
  },
});
