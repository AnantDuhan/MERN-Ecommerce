import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { TabItem } from "./TabConfig";

interface Props {
  route: TabItem;
  focused: boolean;
  onPress: () => void;
}

const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

export default function TabBarButton({
  route,
  focused,
  onPress,
}: Props) {

  const progress = useSharedValue(
    focused ? 1 : 0
  );

  useEffect(() => {
    progress.value = withSpring(
      focused ? 1 : 0,
      {
        damping: 16,
        stiffness: 180,
      }
    );
  }, [focused]);

  const iconStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [1, 1.15]
          ),
        },
      ],
    }));

  const labelStyle =
    useAnimatedStyle(() => ({
      opacity: interpolate(
        progress.value,
        [0, 1],
        [0, 1]
      ),

      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [6, 0]
          ),
        },
      ],
    }));

  return (
    <AnimatedPressable
      style={styles.container}
      onPress={onPress}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={
            focused
              ? route.activeIcon
              : route.inactiveIcon
          }
          size={24}
          color={
            focused
              ? "#2F80ED"
              : "#94A3B8"
          }
        />
      </Animated.View>

      {focused && (
        <Animated.Text
          style={[
            styles.label,
            labelStyle,
          ]}
        >
          {route.label}
        </Animated.Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#2F80ED",
  },
});