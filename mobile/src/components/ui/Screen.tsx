import React from "react";
import { ScrollView, View, ViewStyle, StyleProp } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "@/theme/ThemeContext";
import { spacing } from "@/theme/tokens";

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean; // apply the editorial horizontal gutter
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

/** Page shell = web `.editorial-shell` on a canvas background. */
export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ["top", "bottom"],
  style,
  contentStyle,
}: Props) {
  const { colors, isDark } = useTheme();

  const gutter: ViewStyle = padded
    ? { paddingHorizontal: spacing.lg }
    : {};

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: colors.canvas }, style]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ flexGrow: 1, paddingVertical: spacing.lg }, gutter, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, gutter, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
