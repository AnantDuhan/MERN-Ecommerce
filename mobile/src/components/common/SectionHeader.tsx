import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  title: string;
  actionText?: string;
  onPress?: () => void;
}

export default function SectionHeader({
  title,
  actionText = "See All",
  onPress,
}: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(700)} style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Pressable style={styles.action} onPress={onPress}>
        <Text style={styles.actionText}>{actionText}</Text>

        <Ionicons name="chevron-forward" size={16} color="#2F80ED" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2F80ED",
    marginRight: 2,
  },
});
