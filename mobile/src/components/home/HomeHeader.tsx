import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  userName: string;
  location?: string;
  onNotificationPress?: () => void;
}

export default function HomeHeader({
  userName,
  location = "Coimbatore, Tamil Nadu",
  onNotificationPress,
}: Props) {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        emoji: "🌅",
        text: "Good Morning",
      };
    }

    if (hour >= 12 && hour < 17) {
      return {
        emoji: "☀️",
        text: "Good Afternoon",
      };
    }

    if (hour >= 17 && hour < 21) {
      return {
        emoji: "🌇",
        text: "Good Evening",
      };
    }

    return {
      emoji: "🌙",
      text: "Good Night",
    };
  };

  const greeting = getGreeting();

  return (
    <Animated.View entering={FadeInDown.duration(700)} style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.greeting}>
            {greeting.emoji} {greeting.text}
          </Text>

          <Text style={styles.name}>{userName}</Text>
        </View>

        <Pressable onPress={onNotificationPress}>
          <BlurView
            intensity={70}
            tint="light"
            style={styles.notificationButton}
          >
            <Ionicons name="notifications-outline" size={24} color="#0F172A" />
          </BlurView>
        </Pressable>
      </View>

      <View style={styles.deliveryContainer}>
        <Text style={styles.deliveryLabel}>Deliver to</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="#2F80ED" />

          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 32,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  greeting: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },

  name: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
  },

  notificationButton: {
    width: 58,
    height: 58,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 20,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",

    backgroundColor: "rgba(255,255,255,0.18)",

    shadowColor: "#5EA8FF",
    shadowOpacity: 0.16,
    shadowRadius: 20,

    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 8,
  },

  deliveryContainer: {
    marginTop: 26,
  },

  deliveryLabel: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },

  locationRow: {
    marginTop: 6,

    flexDirection: "row",
    alignItems: "center",
  },

  location: {
    marginLeft: 6,

    fontSize: 16,
    fontWeight: "600",

    color: "#475569",
  },
});
