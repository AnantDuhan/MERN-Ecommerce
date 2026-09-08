import React from "react";
import { View, ViewStyle } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

/** Thin hairline with a short brass tick on the left (web .rule-luxe). */
export function Rule({ tick = true, style }: { tick?: boolean; style?: ViewStyle }) {
  const { colors } = useTheme();
  return (
    <View style={[{ height: 1, width: "100%", backgroundColor: colors.line }, style]}>
      {tick && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 1,
            width: 64,
            backgroundColor: colors.brass,
          }}
        />
      )}
    </View>
  );
}
