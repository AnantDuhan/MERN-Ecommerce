import React, { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Field } from "@/components/ui/Field";
import { spacing } from "@/theme/tokens";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
}

/** Auth field = the editorial underline Field with a bottom gutter. */
const AuthTextField = forwardRef<TextInput, Props>(function AuthTextField(
  { label, error, icon, secureTextEntry, ...rest },
  ref
) {
  return (
    <Field
      ref={ref}
      label={label}
      error={error}
      left={icon}
      secure={secureTextEntry}
      containerStyle={{ marginBottom: spacing.lg }}
      {...rest}
    />
  );
});

export default AuthTextField;
