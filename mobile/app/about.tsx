import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import TopBar from "@/components/common/TopBar";
import { Rule } from "@/components/ui/Rule";
import { Display, Eyebrow, H3, Body } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";

export default function AboutScreen() {
  const { colors, isDark } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.canvas }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <TopBar title="About" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Eyebrow tone="soft">Our Story</Eyebrow>
        <Display style={{ marginTop: spacing.xs }}>Order Planning</Display>
        <Rule style={{ width: 80, marginTop: spacing.md, marginBottom: spacing.lg }} />

        <Body tone="soft">
          Order Planning brings a considered, editorial approach to everyday shopping —
          thoughtfully curated products, honest pricing, and a checkout experience
          designed to feel calm rather than chaotic.
        </Body>

        <View style={{ height: spacing.xl }} />
        <H3>What We Value</H3>
        <Body tone="soft" style={{ marginTop: spacing.sm }}>
          Quality over volume, transparent communication, and a shopping experience
          that respects your time.
        </Body>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },
});
