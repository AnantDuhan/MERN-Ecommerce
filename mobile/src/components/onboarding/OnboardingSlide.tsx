import React from "react";
import { StyleSheet, Text, View } from "react-native";

import HeroIllustration from "@/components/onboarding/HeroIllustration";
import { IllustrationType } from "@/types/onboarding";

interface Props {
  illustration: IllustrationType;
  title: string;
  description: string;
}

export default function OnboardingSlide({
  illustration,
  title,
  description,
}: Props) {
  return (
    <View style={styles.container}>
      <HeroIllustration type={illustration} />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  title: {
    marginTop: 24,
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
    lineHeight: 42,
    letterSpacing: -0.5,
  },

  description: {
    marginTop: 16,
    paddingHorizontal: 16,
    fontSize: 17,
    lineHeight: 28,
    maxWidth: 300,
    textAlign: "center",
    color: "#6B7280",
  },
});