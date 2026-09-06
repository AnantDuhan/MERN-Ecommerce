import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AuthDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />

      <Text style={styles.text}>
        OR
      </Text>

      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D6E3F3",
  },

  text: {
    marginHorizontal: 16,
    color: "#64748B",
    fontWeight: "600",
    letterSpacing: 1,
  },
});