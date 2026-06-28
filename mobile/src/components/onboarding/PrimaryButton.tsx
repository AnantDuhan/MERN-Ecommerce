import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrimaryButton({ title, onPress, style }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <LinearGradient
        colors={["#4F8EF7", "#2F80ED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#2F80ED",
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.35,
    shadowRadius: 20,

    elevation: 10,
  },

  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
