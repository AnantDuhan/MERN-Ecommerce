import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Body } from "@/components/ui/Text";

interface Props {
  onPress?: () => void;
  onVoicePress?: () => void;
  onCameraPress?: () => void;
}

export default function SearchBar({
  onPress,
  onVoicePress,
  onCameraPress,
}: Props) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.delay(150).duration(700)}
      style={styles.wrapper}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.container,
          { borderColor: colors.line, backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.left}>
          <Ionicons name="search-outline" size={20} color={colors.inkFaint} />
          <Body tone="faint" style={{ marginLeft: 12 }}>
            Search products
          </Body>
        </View>

        <View style={styles.right}>
          <Pressable hitSlop={10} onPress={onVoicePress}>
            <Ionicons name="mic-outline" size={20} color={colors.inkFaint} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.line }]} />
          <Pressable hitSlop={10} onPress={onCameraPress}>
            <Ionicons name="camera-outline" size={20} color={colors.inkFaint} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 24, marginBottom: 24 },
  container: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 18,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  right: { flexDirection: "row", alignItems: "center" },
  divider: { width: 1, height: 20, marginHorizontal: 14 },
});
