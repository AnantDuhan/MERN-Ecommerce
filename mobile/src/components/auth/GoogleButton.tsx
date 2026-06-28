import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

interface Props {
  onPress: () => void;
}

export default function GoogleButton({
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

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <BlurView
        intensity={60}
        tint="light"
        style={styles.container}
        >
        <View style={styles.logoContainer}>
            <Image
            source={require("../../assets/icons/Google.png")}
            style={styles.logo}
            />
        </View>

        <Text style={styles.text}>
            Continue with Google
        </Text>
      </BlurView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,

    borderRadius: 30,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.82)",

    borderWidth: 1,
    borderColor: "rgba(66,133,244,0.18)",

    shadowColor: "#4285F4",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 6,

    paddingHorizontal: 24,
  },

  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(66,133,244,0.08)",
  },

  logo: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  text: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#202124",
    letterSpacing: 0.2,
  },
});