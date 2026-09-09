import React, { forwardRef, useState } from "react";
import {
  Pressable,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeContext";
import { spacing, type } from "@/theme/tokens";
import { Eyebrow, Caption } from "./Text";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  left?: keyof typeof Ionicons.glyphMap;
  /** show a trailing eye toggle for passwords */
  secure?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * Underline-only editorial field. The bottom hairline turns brass on focus
 * and danger on error — the web `.field-row` / `.field-luxe` behaviour.
 */
export const Field = forwardRef<TextInput, Props>(function Field(
  { label, error, left, secure, containerStyle, onFocus, onBlur, style, ...rest },
  ref
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  const borderColor = error ? colors.danger : focused ? colors.brass : colors.line;

  return (
    <View style={[{ width: "100%" }, containerStyle]}>
      {label ? <Eyebrow style={{ marginBottom: spacing.sm }}>{label}</Eyebrow> : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        {left ? <Ionicons name={left} size={18} color={colors.inkFaint} /> : null}

        <TextInput
          ref={ref}
          placeholderTextColor={colors.inkFaint}
          secureTextEntry={hidden}
          selectionColor={colors.brass}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            type.body,
            { flex: 1, color: colors.ink, paddingVertical: 12 },
            style,
          ]}
          {...rest}
        />

        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={colors.inkFaint}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Caption tone="danger" style={{ marginTop: spacing.xs }}>
          {error}
        </Caption>
      ) : null}
    </View>
  );
});
