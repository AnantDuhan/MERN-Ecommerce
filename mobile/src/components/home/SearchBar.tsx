import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { Body } from "@/components/ui/Text";

interface Props {
  onPress?: () => void;
  onVoicePress?: () => void;
}

export default function SearchBar({ onPress, onVoicePress }: Props) {
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

        <Pressable hitSlop={10} onPress={onVoicePress}>
          <Ionicons name="mic-outline" size={20} color={colors.inkFaint} />
        </Pressable>
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
});
