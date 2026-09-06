import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function AuthTextField({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  onFocus,
  onBlur,
  autoCapitalize,
  ...props
}: Props) {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const focused = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focused.value,
      [0, 1],
      ["rgba(255,255,255,0.35)", "#2F80ED"],
    ),
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <AnimatedBlurView
        intensity={45}
        tint="light"
        style={[styles.container, animatedStyle]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          placeholderTextColor="#94A3B8"
          secureTextEntry={hidePassword}
          autoCorrect={!secureTextEntry}
          autoCapitalize={secureTextEntry ? "none" : autoCapitalize}
          onFocus={(e) => {
            focused.value = withTiming(1, {
              duration: 180,
            });

            scale.value = withTiming(1.015, {
              duration: 180,
            });

            onFocus?.(e);
          }}
          onBlur={(e) => {
            focused.value = withTiming(0, {
              duration: 180,
            });

            scale.value = withTiming(1, {
              duration: 180,
            });

            onBlur?.(e);
          }}
          {...props}
        />

        <View style={styles.rightIcon}>
          {secureTextEntry ? (
            <Pressable
              hitSlop={10}
              onPress={() => setHidePassword(!hidePassword)}
              accessibilityRole="button"
              accessibilityLabel={
                hidePassword ? "Show password" : "Hide password"
              }
            >
              <Ionicons
                name={hidePassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#64748B"
              />
            </Pressable>
          ) : (
            rightIcon
          )}
        </View>
      </AnimatedBlurView>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },

  label: {
    marginLeft: 4,
    marginBottom: 10,

    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },

  container: {
    height: 52,
    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 18,
    borderWidth: 1,

    backgroundColor: "rgba(255,255,255,0.18)",
  },

  leftIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 17,
    color: "#0F172A",
    paddingVertical: 0,
    paddingRight: 8,
  },

  rightIcon: {
    width: 28,
    marginLeft: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    marginTop: 8,
    marginLeft: 4,

    fontSize: 13,
    color: "#EF4444",
  },
});
