import React, { useEffect } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface Props {
  title: string;
  subtitle: string;
  description: string;
  button: string;
  colors: readonly [string, string];
  image?: ImageSourcePropType;
  onPress?: () => void;
}

export default function PromoCard({
  title,
  subtitle,
  description,
  button,
  colors,
  image,
  onPress,
}: Props) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-9, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.value,
      },
      {
        rotate: "-8deg",
      },
    ],
  }));
  return (
    <Animated.View entering={FadeInDown.duration(700)} style={styles.wrapper}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Decorative Shapes */}

        <View style={styles.circleLarge} />

        <View style={styles.circleSmall} />

        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.title}>{title.toUpperCase()}</Text>

            <Text style={styles.subtitle}>{subtitle}</Text>

            <Text style={styles.description}>{description}</Text>

            <Pressable style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{button}</Text>

              <Ionicons name="arrow-forward" size={16} color="#2F80ED" />
            </Pressable>
          </View>

          <View style={styles.right}>
            {image && (
              <Animated.Image
                source={image}
                resizeMode="contain"
                style={[styles.image, animatedImageStyle]}
              />
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
  },

  container: {
    height: 215,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 10,
  },

  title: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.9)",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  description: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(255,255,255,0.9)",
    width: "80%",
  },

  button: {
    marginTop: 17,
    marginBottom: 11,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2F80ED",
    marginRight: 8,
  },

  circleLarge: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -120,
    right: -90,
  },

  circleSmall: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -35,
    right: 30,
  },

  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },

  left: {
    flex: 1,
    paddingTop: 6,
  },

  right: {
    width: 170,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 210,
    height: 210,
    marginRight: -30,
    marginTop: 10,
  },
});
