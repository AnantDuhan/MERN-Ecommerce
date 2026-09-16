import React from "react";
import { View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { Eyebrow } from "@/components/ui/Text";
import { spacing } from "@/theme/tokens";

export default function AuthDivider() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: spacing.lg,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
      <Eyebrow tone="faint" style={{ marginHorizontal: spacing.md }}>
        or
      </Eyebrow>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
    </View>
  );
}
