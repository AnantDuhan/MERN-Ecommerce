import React from "react";
import { Pressable, View } from "react-native";

import { Body, Txt } from "@/components/ui/Text";
import { spacing, type } from "@/theme/tokens";

interface Props {
  text: string;
  actionText: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function AuthFooter({
  text,
  actionText,
  onPress,
  disabled = false,
}: Props) {
  return (
    <View
      style={{
        marginTop: spacing.xl,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.sm,
      }}
    >
      <Body tone="soft">{text}</Body>
      <Pressable onPress={onPress} disabled={disabled} hitSlop={8}>
        <Txt tone={disabled ? "faint" : "brass"} style={{ ...type.eyebrow }}>
          {actionText}
        </Txt>
      </Pressable>
    </View>
  );
}
