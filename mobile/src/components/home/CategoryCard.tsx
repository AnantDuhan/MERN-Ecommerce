import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";
import { BodySm } from "@/components/ui/Text";
import { radii } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export default function CategoryCard({ title, icon, onPress }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.94);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View
        style={[
          styles.tile,
          { borderColor: colors.line, backgroundColor: colors.surface },
        ]}
      >
        <Ionicons name={icon} size={26} color={colors.ink} />
      </Animated.View>

      <BodySm tone="soft" center style={styles.title}>
        {title}
      </BodySm>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: { width: 84, alignItems: "center", marginRight: 16 },
  tile: {
    width: 68,
    height: 68,
    borderRadius: radii.xs,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  title: { marginTop: 10 },
});
