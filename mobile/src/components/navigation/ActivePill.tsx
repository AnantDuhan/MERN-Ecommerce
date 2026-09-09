import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";

interface Props {
  index: number;
  tabWidth: number;
}

/** A slim brass indicator that slides to sit above the active tab. */
export default function ActivePill({ index, tabWidth }: Props) {
  const { colors } = useTheme();
  const translateX = useSharedValue(index * tabWidth);

  useEffect(() => {
    translateX.value = withSpring(index * tabWidth, {
      damping: 18,
      stiffness: 190,
      mass: 0.8,
    });
  }, [index, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.track, { width: tabWidth }, animatedStyle]}>
      <View style={{ width: 28, height: 2, backgroundColor: colors.brass }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
  },
});
