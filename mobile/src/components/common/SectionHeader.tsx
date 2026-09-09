import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { H2, Txt } from "@/components/ui/Text";
import { type } from "@/theme/tokens";

interface Props {
  title: string;
  actionText?: string;
  onPress?: () => void;
}

export default function SectionHeader({
  title,
  actionText = "See All",
  onPress,
}: Props) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(700)} style={styles.container}>
      <H2>{title}</H2>

      <Pressable style={styles.action} onPress={onPress} hitSlop={8}>
        <Txt tone="brass" style={{ ...type.eyebrow }}>
          {actionText}
        </Txt>
        <Ionicons
          name="arrow-forward"
          size={14}
          color={colors.brass}
          style={{ marginLeft: 6 }}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  action: { flexDirection: "row", alignItems: "center" },
});
