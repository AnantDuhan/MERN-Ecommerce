import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { View } from "react-native";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface Props {
  index: number;
  tabWidth: number;
}

export default function ActivePill({ index, tabWidth }: Props) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(index * tabWidth, {
      damping: 18,
      stiffness: 190,
      mass: 0.8,
    });
  }, [index, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={[
          styles.wrapper,
          {
            width: tabWidth - 12,
          },
        ]}
      >
        <BlurView intensity={70} tint="light" style={styles.blur}>
          <LinearGradient
            colors={[
              "rgba(47,128,237,0.22)",
              "rgba(94,168,255,0.16)",
              "rgba(255,255,255,0.10)",
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={StyleSheet.absoluteFill}
          />

          {/* Inner Highlight */}

          <LinearGradient
            colors={["rgba(255,255,255,0.28)", "transparent"]}
            style={styles.highlight}
          />
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 6,
    top: 8,
    height: 62,
    borderRadius: 24,
    shadowColor: "#2F80ED",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  blur: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  highlight: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 2,
    height: 16,
    borderRadius: 12,
  },
});
