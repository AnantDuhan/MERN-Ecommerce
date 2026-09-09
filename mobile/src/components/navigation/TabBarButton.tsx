import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { TabItem } from "./TabConfig";
import { useTheme } from "@/theme/ThemeContext";
import { Txt } from "@/components/ui/Text";
import { type } from "@/theme/tokens";

interface Props {
  route: TabItem;
  focused: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabBarButton({ route, focused, onPress }: Props) {
  const { colors } = useTheme();
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 16,
      stiffness: 180,
    });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.1]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [4, 0]) }],
  }));

  return (
    <AnimatedPressable style={styles.container} onPress={onPress}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? route.activeIcon : route.inactiveIcon}
          size={22}
          color={focused ? colors.brass : colors.inkFaint}
        />
      </Animated.View>

      {focused && (
        <Animated.View style={labelStyle}>
          <Txt tone="brass" style={{ ...type.eyebrow, fontSize: 9, marginTop: 4 }}>
            {route.label}
          </Txt>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 6,
    zIndex: 10,
  },
});
