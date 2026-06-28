import { StyleSheet, Text, View } from "react-native";
import BrandLogo from "./BrandLogo";
import { Colors } from "@/theme";

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <BrandLogo size={110} />

      <Text style={styles.title}>
        Order Planning
      </Text>

      <Text style={styles.subtitle}>
        Discover Amazing Deals
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  title: {
    marginTop: 18,
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});