import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export default function CategoryCard({
  title,
  icon,
  onPress,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = async () => {
    await Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <BlurView
        intensity={70}
        tint="light"
        style={styles.iconContainer}
      >
        <Ionicons
          name={icon}
          size={30}
          color="#2F80ED"
        />
      </BlurView>

      <Text style={styles.title}>
        {title}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 88,
    alignItems: "center",
    marginRight: 18,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",
    shadowColor: "#5EA8FF",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  title: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
});