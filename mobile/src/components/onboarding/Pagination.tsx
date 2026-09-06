import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
  dataLength: number;
  scrollX: SharedValue<number>;
  width: number;
}

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}

function Dot({ index, scrollX, width }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [10, 32, 10],
      "clamp",
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.35, 1, 0.35],
      "clamp",
    );

    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      "#CBD5E1",
      "#2F80ED",
      "#CBD5E1",
    ]);

    return {
      width: dotWidth,
      opacity,
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function Pagination({ dataLength, scrollX, width }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: dataLength }).map((_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} width={width} />
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

  dot: {
    height: 10,
    width: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
});
