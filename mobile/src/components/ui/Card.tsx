import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { luxeShadow, radii, spacing } from "@/theme/tokens";

interface Props extends ViewProps {
  padded?: boolean;
  elevated?: boolean; // apply the soft luxe shadow
  style?: ViewStyle | ViewStyle[];
}

/** Bordered, sharp-cornered surface (web .card-luxe). */
export function Card({ padded = true, elevated = false, style, children, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: radii.xs,
          overflow: "hidden",
        },
        padded && { padding: spacing.lg },
        elevated && luxeShadow(colors),
        style as ViewStyle,
      ]}
    >
      {children}
    </View>
  );
}
