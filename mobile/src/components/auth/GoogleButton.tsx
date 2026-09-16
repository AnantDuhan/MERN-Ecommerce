import React from "react";
import { Image, Pressable } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { Txt } from "@/components/ui/Text";
import { radii, spacing, type } from "@/theme/tokens";

interface Props {
  onPress: () => void;
  disabled?: boolean;
}

/** Editorial outline button carrying the Google mark. */
export default function GoogleButton({ onPress, disabled = false }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: 15,
        paddingHorizontal: spacing.xl,
        borderWidth: 1,
        borderRadius: radii.none,
        borderColor: pressed ? colors.brass : colors.line,
        opacity: disabled ? 0.5 : 1,
      })}
    >
      <Image
        source={require("@/assets/icons/Google.png")}
        style={{ width: 18, height: 18, resizeMode: "contain" }}
      />
      <Txt tone="ink" style={{ ...type.eyebrow, fontSize: 12 }}>
        Continue with Google
      </Txt>
    </Pressable>
  );
}
