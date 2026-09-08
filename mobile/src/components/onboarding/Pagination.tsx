import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeContext";

interface Props {
  dataLength: number;
  scrollX: SharedValue<number>;
  width: number;
}

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  active: string;
  inactive: string;
}

function Dot({ index, scrollX, width, active, inactive }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const barWidth = interpolate(scrollX.value, inputRange, [16, 40, 16], "clamp");
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], "clamp");
    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      inactive,
      active,
      inactive,
    ]);

    return { width: barWidth, opacity, backgroundColor };
  });

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}

export default function Pagination({ dataLength, scrollX, width }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {Array.from({ length: dataLength }).map((_, index) => (
        <Dot
          key={index}
          index={index}
          scrollX={scrollX}
          width={width}
          active={colors.brass}
          inactive={colors.line}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
  },
  bar: {
    height: 3,
    borderRadius: 2,
    marginHorizontal: 4,
  },
});
