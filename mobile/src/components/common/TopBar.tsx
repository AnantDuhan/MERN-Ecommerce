import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useTheme } from "@/theme/ThemeContext";
import { Eyebrow } from "@/components/ui/Text";

interface Props {
  title?: string;
  onBack?: () => void;
}

export default function TopBar({ title, onBack }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        hitSlop={8}
        style={[styles.back, { borderColor: colors.line }]}
      >
        <Ionicons name="arrow-back" size={20} color={colors.ink} />
      </Pressable>
      {title ? (
        <Eyebrow tone="soft" style={{ marginLeft: 16 }}>
          {title}
        </Eyebrow>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  back: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
