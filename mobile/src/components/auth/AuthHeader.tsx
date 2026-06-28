import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import BrandLogo from "@/components/layout/BrandLogo";

interface Props {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: Props) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100).duration(700)}>
        <BrandLogo size={72} />
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(250).duration(700)}
        style={styles.title}
      >
        {title}
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(350).duration(700)}
        style={styles.subtitle}
      >
        {subtitle}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    marginTop: 22,
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    color: "#64748B",
    paddingHorizontal: 20,
  },
});