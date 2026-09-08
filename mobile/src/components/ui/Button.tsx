import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/theme/ThemeContext";
import { Palette, radii, spacing, type } from "@/theme/tokens";
import { Txt } from "./Text";

type Variant = "solid" | "outline" | "ghost";

interface Props extends Omit<PressableProps, "style"> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  left?: React.ReactNode; // optional leading icon
  right?: React.ReactNode;
  style?: ViewStyle;
  haptic?: boolean;
}

function containerStyle(
  variant: Variant,
  pressed: boolean,
  disabled: boolean,
  c: Palette
): ViewStyle {
  const base: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radii.none,
    opacity: disabled ? 0.5 : 1,
  };
  if (variant === "solid") {
    return {
      ...base,
      paddingVertical: 16,
      paddingHorizontal: 32,
      backgroundColor: pressed ? c.brass : c.ink,
    };
  }
  if (variant === "outline") {
    return {
      ...base,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderWidth: 1,
      borderColor: pressed ? c.brass : c.ink,
      backgroundColor: "transparent",
    };
  }
  // ghost
  return {
    ...base,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
  };
}

function labelTone(variant: Variant, pressed: boolean) {
  if (variant === "solid") return pressed ? "onBrass" : "onInk";
  if (variant === "outline") return pressed ? "brass" : "ink";
  return pressed ? "brass" : "soft";
}

export function Button({
  label,
  variant = "solid",
  loading = false,
  disabled = false,
  fullWidth = false,
  left,
  right,
  style,
  haptic = true,
  onPress,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={({ pressed }) => [
        containerStyle(variant, pressed, isDisabled, colors),
        fullWidth && { alignSelf: "stretch" },
        style,
      ]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          {loading ? (
            <ActivityIndicator
              color={variant === "solid" ? colors.onInk : colors.ink}
              size="small"
            />
          ) : (
            <>
              {left}
              <Txt
                tone={labelTone(variant, pressed) as any}
                style={{
                  ...type.eyebrow,
                  // eyebrow already uppercases + tracks; nudge size up for buttons
                  fontSize: 12.5,
                }}
              >
                {label}
              </Txt>
              {right}
            </>
          )}
        </>
      )}
    </Pressable>
  );
}
