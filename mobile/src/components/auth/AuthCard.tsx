import React from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";

interface Props extends ViewProps {
  children: React.ReactNode;
}

export default function AuthCard({ children, style }: Props) {
  return (
    <BlurView intensity={60} tint="light" style={[styles.container, style]}>
      <View style={styles.inner}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",
    shadowColor: "#5EA8FF",
    shadowOpacity: 0.12,
    shadowRadius: 35,
    shadowOffset: {
      width: 0,
      height: 16,
    },

    elevation: Platform.OS === "android" ? 10 : 0,
  },

  inner: {
    paddingHorizontal: 20,
    paddingVertical: 18
  },
});
