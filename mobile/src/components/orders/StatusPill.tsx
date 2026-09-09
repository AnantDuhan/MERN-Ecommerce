import React from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";
import { Txt } from "@/components/ui/Text";
import { radii, type } from "@/theme/tokens";

export default function StatusPill({ status }: { status: string }) {
  const { colors } = useTheme();
  const s = status.toLowerCase();
  const color = s.includes("deliver")
    ? colors.success
    : s.includes("cancel") || s.includes("return")
    ? colors.danger
    : s.includes("ship")
    ? colors.ink
    : colors.brass;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color,
        borderRadius: radii.xs,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: "flex-start",
      }}
    >
      <Txt style={{ ...type.eyebrow, fontSize: 10, color }}>{status}</Txt>
    </View>
  );
}
