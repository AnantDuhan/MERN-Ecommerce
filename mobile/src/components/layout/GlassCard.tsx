import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { Colors, Radius, Shadows } from "@/theme";

interface GlassCardProps {
  children: ReactNode;
}

export default function GlassCard({
  children,
}: GlassCardProps) {
  return (
    <BlurView
      intensity={35}
      tint="light"
      style={styles.blur}
    >
      <View style={styles.content}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: "hidden",
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glass,
    ...Shadows.card,
  },

  content: {
    padding: 24,
  },
});