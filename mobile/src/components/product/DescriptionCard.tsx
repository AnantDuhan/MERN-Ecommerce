import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  description: string;
}

export default function DescriptionCard({
  description,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setExpanded(!expanded);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      style={styles.wrapper}
    >
      <BlurView
        intensity={55}
        tint="light"
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Description
          </Text>

          <Ionicons
            name="document-text-outline"
            size={20}
            color="#2F80ED"
          />
        </View>

        <Text
          numberOfLines={
            expanded ? undefined : 3
          }
          style={styles.description}
        >
          {description}
        </Text>

        <Pressable
          style={styles.button}
          onPress={toggle}
        >
          <Text style={styles.buttonText}>
            {expanded
              ? "Show Less"
              : "Show More"}
          </Text>

          <Ionicons
            name={
              expanded
                ? "chevron-up"
                : "chevron-down"
            }
            size={18}
            color="#2F80ED"
          />
        </Pressable>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    marginTop: 30,
  },

  card: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 22,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.45)",
    backgroundColor:
      "rgba(255,255,255,0.18)",
    shadowColor: "#5EA8FF",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  description: {
    fontSize: 16,
    lineHeight: 28,
    color: "#64748B",
  },

  button: {
    marginTop: 18,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2F80ED",
    marginRight: 4,
  },
});