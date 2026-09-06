import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import Animated, { FadeInDown } from "react-native-reanimated";

interface Specification {
  title: string;
  value: string;
}

interface Props {
  specifications?: Specification[];
}

export default function SpecificationCard({ specifications = [] }: Props) {
  if (specifications.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.wrapper}>
      <BlurView intensity={55} tint="light" style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Specifications</Text>

          <Ionicons name="grid-outline" size={20} color="#2F80ED" />
        </View>

        {specifications.map((item, index) => (
          <View
            key={`${item.title}-${index}`}
            style={[
              styles.row,
              index !== specifications.length - 1 && styles.border,
            ]}
          >
            <Text style={styles.label}>{item.title}</Text>

            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 28,
    paddingHorizontal: 24,
  },

  card: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.18)",
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
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },

  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  label: {
    flex: 1,
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },

  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "700",
  },
});
