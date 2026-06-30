import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  onPress?: () => void;
  onVoicePress?: () => void;
  onCameraPress?: () => void;
}

export default function SearchBar({
  onPress,
  onVoicePress,
  onCameraPress,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(150).duration(700)}
      style={styles.wrapper}
    >
      <Pressable onPress={onPress}>
        <BlurView intensity={70} tint="light" style={styles.container}>
          <View style={styles.left}>
            <Ionicons name="search" size={22} color="#64748B" />

            <Text style={styles.placeholder}>Search products...</Text>
          </View>

          <View style={styles.right}>
            <Pressable hitSlop={10} onPress={onVoicePress}>
              <Ionicons name="mic-outline" size={22} color="#64748B" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable hitSlop={10} onPress={onCameraPress}>
              <Ionicons name="camera-outline" size={22} color="#64748B" />
            </Pressable>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },

  container: {
    height: 60,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderRadius: 22,

    paddingHorizontal: 20,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",

    backgroundColor: "rgba(255,255,255,0.18)",

    shadowColor: "#5EA8FF",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 8,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  placeholder: {
    marginLeft: 12,
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  divider: {
    width: 1,
    height: 22,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 14,
  },
});
